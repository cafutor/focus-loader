const nodeFs = require('fs');
const path = require('path');
const { NODE_ENV } = process.env;
const templatePath = path.join(__dirname, 'viewTemplate', 'View.jsx');
const { compileView, getView, getImport, checkView, setModuleUtils } = require('./utils');
module.exports = function focusBizLoader(fileString) {
    let compileViewResult
    try {
        compileViewResult = compileView(getView(fileString));
        checkView(fileString);
    } catch (e) {
        throw new Error(e.message);
    }
    let importStatement = getImport(fileString);

    const { rootId, dataFromServerKey, parseView, customModel, modelPropsSet, isUseRouter, isUseSwitch } = compileViewResult;
    // get import model
    importStatement = setModuleUtils.setModule(fileString).matchModel(customModel).matchRouter(isUseRouter).matchSwitch(isUseSwitch).matchHmr(NODE_ENV).importStatementArr.join(';\n');
    const templateFileString = nodeFs.readFileSync(templatePath).toString();
    const parseResult = templateFileString.replace('$focus_root', `"${rootId}"`)
        .replace('$focus_import_statement', importStatement)
        .replace('$focus_data_from_server', dataFromServerKey)
        .replace('$focus_view', parseView)
        .replace('$focus_save_root_model_props_set', modelPropsSet);
    return Buffer.from(parseResult);
};