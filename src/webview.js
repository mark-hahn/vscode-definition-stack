// console.log('loading webview module');

const vscode = require('vscode');
const html   = require('./html.js');
const navi   = require('./navigate.js');
const comm   = require('./comm.js');
// const utils  = require('./utils.js');
// const log    = utils.getLog('WEBV');

let webviewPanel  = null;

function inactiveColumn() {
  const editor = vscode.window.activeTextEditor;
  const activeColumn =  
          editor ? editor.viewColumn : vscode.ViewColumn.One;
  if(activeColumn === vscode.ViewColumn.Two)
    return vscode.ViewColumn.One;
  return vscode.ViewColumn.Two;
}

async function initWebview(context) {
  if(webviewPanel) webviewPanel.dispose();
  webviewPanel = vscode.window.createWebviewPanel(
    'defstack-webview',   
    'Definition Stack',   
      inactiveColumn(),
    {
      enableFindWidget: true,
      retainContextWhenHidden: true,
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(context.extensionPath)]
    }  
  );
  context.subscriptions.push(webviewPanel);
  webviewPanel.onDidDispose(() => {webviewPanel = null});
  await comm.init(context, webviewPanel.webview);
  await html.init(context, webviewPanel.webview);
  navi.init();
}

module.exports = { initWebview };
