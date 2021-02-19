const server = 'servernamethere';
function deviceCommand(device, command) {
  const result = UrlFetchApp.fetch(`${server}/device=${device}${command}`).getContentText();
  console.log(`device: ${device}, ${command} => ${result}`);
  if (result === 'undefined' || result.length > 40) return '';
  return result;
}
var mySheet = SpreadsheetApp.getActiveSheet();
