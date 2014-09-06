var port = chrome.extension.connect({ name: 'Giraffe' });
var link = '';
var title = '';

function showLinks() {
  port.postMessage(title, link);
  if (!title || !link) { return false; }
  var p = document.getElementById('links');
  var a = document.createElement('a');
  a.href = link;
  a.innerText = title;
  a.target = '_blank';

  // Extension closes when opening a new link
  // a.download = title + '.mp3';

  if (p.childNodes.length !== 1) {
    p.appendChild(a);
  }
}

chrome.browserAction.onClicked.addListener(showLinks);

port.onMessage.addListener(function(msg) {
  if (msg === '') { return false; }
  link = msg;
  showLinks();
});

chrome.extension.onRequest.addListener(function(msg) {
  if (msg === '') { return false; }
  title = msg;
  showLinks();
});

// Set up event handlers and inject get_title.js into all frames in the active tab
window.onload = function() {
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id}, function(activeTabs) {
      chrome.tabs.executeScript(activeTabs[0].id, {file: 'get_title.js', allFrames: true});
    });
  });
};
