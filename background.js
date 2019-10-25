const version = "1.3";

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.debugger.attach({tabId:tab.id}, version, onAttach.bind(null, tab.id));
});

function onAttach(tabId) {
  if (chrome.runtime.lastError) {
    alert(chrome.runtime.lastError.message);
    return;
  }

  chrome.windows.create({
    url: "voters.html?" + tabId, 
    type: "popup", 
    width: 600, 
    height: 600
  });
}
