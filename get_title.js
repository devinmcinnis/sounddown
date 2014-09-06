var el = document.getElementsByClassName('soundTitle__title')[0];
var title = el.innerText;
chrome.extension.sendRequest(title);
