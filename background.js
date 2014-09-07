/* Keep track of the active tab in each window */
var activeTabs = {};
var link = '';
var sd;

chrome.tabs.onActivated.addListener(function(details) {
  activeTabs[details.windowId] = details.tabId;
});

/* Clear the corresponding entry, whenever a window is closed */
chrome.windows.onRemoved.addListener(function(winId) {
  delete(activeTabs[winId]);
});

/* Listen for web-requests and filter them */
chrome.webRequest.onBeforeRequest.addListener(function(details) {
  Object.keys(activeTabs).every(function(key) {
    if (activeTabs[key] == details.tabId) {
      /* We are interested in this request */
      var match = details.url.match('streams');
      if (match && match.length > 0) {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function(resp) {
          var json;
          if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            json = JSON.parse(resp.currentTarget.response);
            link = json.http_mp3_128_url;
          }
        };

        xmlhttp.open("GET",details.url,true);
        xmlhttp.send();

        return false;
      }
    } else {
      return true;
    }
  });
}, { urls: ["<all_urls>"] });

/* Get the active tabs in all currently open windows */
chrome.tabs.query({ active: true }, function(tabs) {
  tabs.forEach(function(tab) {
      activeTabs[tab.windowId] = tab.id;
  });
});

chrome.extension.onConnect.addListener(function(port) {
  console.log('Connected..');
  sd = port;
  port.onMessage.addListener(function(msg) {
    console.log('Message: ', msg);
    port.postMessage(link);
  });
});
