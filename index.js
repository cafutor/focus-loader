const nodeFs = require('fs');
const path = require('path');
const templatePath = path.join(__dirname, 'viewTemplate', 'view.jsx');
const { compileView, getView, getImport, matchModel, checkView } = require('./utils');
module.exports = function focusBizLoader(fileString) {
    let compileViewResult
    try {
        // 检测view是否有其他的代码
        checkView(fileString);
        compileViewResult = compileView(getView(fileString));
    } catch (e) {
        throw new Error(e.message);
    }
    let importStatement = getImport(fileString);

    const { rootId, dataFromServerKey, parseView, customModel, modelPropsSet } = compileViewResult;
    // 对接view中的model
    importStatement = matchModel(fileString, customModel);
    const templateFileString = nodeFs.readFileSync(templatePath).toString();
    const parseResult = templateFileString.replace('$focus_root', `"${rootId}"`)
        .replace('$focus_import_statement', importStatement)
        .replace('$focus_data_from_server', dataFromServerKey)
        .replace('$focus_view', parseView)
        .replace('$focus_save_root_model_props_set', modelPropsSet);
    return Buffer.from(parseResult);
};