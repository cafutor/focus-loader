/* eslint-disable quotes */
const htmlparser = require('htmlparser2');
const isHtml = require('is-html');
/**
 * 
 * <view modelFromServerKey="configModel" root="myRoot">
            <h1>this is my name</h1>
            <scope>
            <text value="@model.info" a={@modele.info} />
            <BizTable id="bizTable" dataSource="@model.dataSource" />
            </scope>
        </view>
 * 
 * ***/
module.exports = {
    compileView: function (view) {
        view = view || `<div>
            <h1 style={{textAlign:'center'}}>
                no view found,please check your index.view file
            </h1>
        </div>`;
        const randomKey = Math.random().toString(36).slice(2);
        const internalInstanceKey = '__focusInternalInstance$' + randomKey;
        let index = 0;
        let parseView = '';
        let htmlTag = '';
        let rootId = '';
        let isUseRouter = !1;
        let isUseSwitch = !1;
        let dataFromServerKey = '';
        // 如果组件更新的props在model有引用则，直接更新model
        let modelPropsSet = [];
        const parser = new htmlparser.Parser({
            onopentag: function (name, attribs) {
                htmlTag = name;
                if (htmlTag === 'Router') {
                    isUseRouter = !0;
                };
                if (htmlTag === 'Switch') {
                    isUseSwitch = !0;
                }
                if (name === 'View') {
                    rootId = attribs.root;
                    dataFromServerKey = attribs.modelFromServerKey || `$${internalInstanceKey}_focus_model_business`;
                    customModel = attribs.customModel || '';
                };
                if (!isHtml(`<${name}>`)) {
                    let attrString = '';
                    let __focusInternalInstanceForJson = '';
                    // if props is marked by @model
                    if (Object.keys(attribs).some((attrKey) => {
                        return (!attribs[attrKey].match(/(this.state)/) && !attribs[attrKey].match(/(\{@model){1}/) && attribs[attrKey].match(/^(@model){1}/))
                    })) {
                        index++;
                        __focusInternalInstanceForJson = `${internalInstanceKey}-${index}`;
                        attrString += `__focusInternalInstanceId="${internalInstanceKey}-${index}"  `;
                    }
                    for (var i in attribs) {
                        // if is business component,its props must be marked by @model except exact
                        if (!attribs[i].match(/(this.state)/) && !attribs[i].match(/(\{@model){1}/)) {
                            if (i !== 'exact') {
                                attrString += `${i}=${attribs[i].match(/^(@model){1}/) ? `{${attribs[i].replace(/(@model){1}/g, 'this.state')}}  ` : `"${attribs[i]}"`}  `;
                            } else {
                                if (attribs[i] === '') {
                                    attrString += 'exact={true}  '
                                } else {
                                    attrString += `exact=${attribs[i]}  `;
                                };
                            };
                            if ((!attribs[i].match(/(this.state)/) && !attribs[i].match(/(\{@model){1}/) && attribs[i].match(/^(@model){1}/)) && __focusInternalInstanceForJson) {
                                modelPropsSet.push({
                                    __focusInternalInstance: __focusInternalInstanceForJson,
                                    componentType: name,
                                    modelRefrence: attribs[i],
                                    prop: i,
                                });
                            }
                        };
                    }
                    parseView += `<${name} ${attrString} >\n`
                }
            },
            ontext: function (text) {
                if (!isHtml(`<${htmlTag}>`) && text.trim()) {
                    //no text
                    // parseView += `${text}\n`;
                }
            },
            onclosetag: function (tagname) {
                if (!isHtml(`<${tagname}>`)) parseView += `</${tagname}>\n`;
            }
        }, { decodeEntities: true, lowerCaseTags: false, lowerCaseAttributeNames: false, recognizeSelfClosing: true });
        parser.write(view);
        parser.end();
        if (!rootId || !rootId.trim()) throw new Error('view need a root id,please check your index.view');
        if (!customModel) console.warn('there is no model exits in this page');
        return {
            isUseSwitch,
            isUseRouter,
            parseView,
            rootId,
            dataFromServerKey,
            customModel,
            modelPropsSet: JSON.stringify(modelPropsSet),
        };
    },
    // check the view is pure or not
    checkView: function (viewFile) {
        const parseCheck = viewFile
            .replace(/<(\s)*View{1}(\s)?([a-zA-Z0-9]+(="){1}((.(.)?\/)*[a-zA-Z0-9](_|.)*)+\"{1}(\s)*)*(\/)*>(.|\n)*?<(\s)*\/(\s)*View{1}(\s)*>/g, '')
            .replace(/import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*(([@\w/_-]+(.[a-zA-Z0-9]*))|(((.){1}.?\/)([a-zA-Z0-9]+\/)*[a-zA-Z0-9]+(.[a-zA-Z0-9]*)))["'(\s)*(\;)?\s]*/g, '');
        if (parseCheck.trim() !== '')
            // eslint-disable-next-line quotes
            throw new Error(`please keep your *.view clean,don't write anything else but 
            impor ** from **;
            <View>***</View>
            `);
    },
    getView: function (viewFile) {
        const checkMultiple = viewFile.match(/<(\s)*View(\s)*/g);
        if (!checkMultiple) {
            throw new Error('no <View></View> found please check your *.view file');
        };
        if (checkMultiple && checkMultiple.length > 1)
            throw new Error('multiple <View> found,only one is allowed,please check your .view file');

        /***
         * 
         * 检测view文件是否有多个分离的tag
         * 或者View是否是root element
         * <div>
         * </div>
         * <div></div>
         * <div />
         * 
         * **/
        const allTag = viewFile.match(/<(\s)*(\/)?(\s)*[a-zA-Z0-9]+/g);
        if (allTag && allTag[0] !== '<View') {
            throw new Error('View should be the root element or you should not write any else tag that outside the <View>');
        };
        for (let i = 0, len = allTag.length; i < len; i++) {
            if (allTag[i].match(/<(\s)*(\/)(\s)*View/)) {
                if (i !== len - 1) throw new Error('View should be the root element or you should not write any else tag that outside the <View>');
            }
        }

        // match view
        const viewHtml = viewFile.match(/<(\s)*View(\s)+([a-zA-Z0-9]+(="){1}((.(.)?\/)*[a-zA-Z0-9](_|.)*)+\"{1}(\s)*)*>(.|\n)*?<(\s)*\/(\s)*View(\s)*>/g);
        if (!viewHtml) throw new Error('no <View>****</View> found please check your .view file');
        if (viewHtml) {
            return viewHtml[0];
        };
    },
    getImport: function (viewFile) {
        const importStatementArr = viewFile.match(/import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*(([@\w/_-]+(.[a-zA-Z0-9]*))|(((.){1}.?\/)([a-zA-Z0-9]+\/)*[a-zA-Z0-9]+(.[a-zA-Z0-9]*)))["'\s]*/g);
        // 检测是否在.view文件import View
        if (importStatementArr && importStatementArr.some((importState) => {
            return importState.match(/(\s)*import(\s)+View/);
        })) {
            throw new Error('dont import any View Component,please check your .view file');
        };
        if (importStatementArr)
            return importStatementArr.join(';\n');
    },
    setModuleUtils: {
        setModule: function (viewFile) {
            const importStatementArr = viewFile.match(/import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*(([@\w/_-]+(.[a-zA-Z0-9]*))|(((.){1}.?\/)([a-zA-Z0-9]+\/)*[a-zA-Z0-9]+(.[a-zA-Z0-9]*)))["'\s]*/g);
            this.importStatementArr = importStatementArr || [];
            return this;
        },
        // if there is model
        matchModel: function (model) {
            if (!model || (model && !model.trim())) {
                model = 'focus-center/utils';
            };
            this.importStatementArr.push(`import model from '${model}'`);
            return this;
        },
        // if there is router
        matchRouter: function (isUseRouter) {
            if (isUseRouter) this.importStatementArr.push(`import { HashRouter as Router } from 'react-router-dom'`);
            return this;
        },
        // if there is switch
        matchSwitch: function (isUseSwitch) {
            if (isUseSwitch) {
                if (this.importStatementArr.some((importStatement) => {
                    return !!importStatement.match(/('react-router-dom')$/);
                })) {
                    this.importStatementArr.pop();
                    this.importStatementArr.push(`import { HashRouter as Router,Switch } from 'react-router-dom'`);
                }

            };
            return this;
        }
    }
}