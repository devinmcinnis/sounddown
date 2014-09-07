var titleEl = document.getElementsByClassName('soundTitle__title')[0];
var artistEl = document.getElementsByClassName('soundTitle__username')[0];
var title = artistEl.innerText + ' - ' + titleEl.innerText;
chrome.extension.sendRequest(title);
