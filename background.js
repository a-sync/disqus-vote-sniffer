const version = '1.3';
const ALLOWED_URL = 'https://disqus.com/home/discussion/';

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.get(tab.id, function (tab) {
        if (tab.url.indexOf(ALLOWED_URL) === 0) {
            chrome.debugger.attach({ tabId: tab.id }, version, onAttach.bind(null, tab.id));
        } else {
            alert('URL must match ' + ALLOWED_URL + '*');
        }
    });
});

function onAttach(tabId) {
    if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
    }

    chrome.windows.create({
        url: 'voters.html?' + tabId,
        type: 'popup',
        width: 600,
        height: 600
    });
}
