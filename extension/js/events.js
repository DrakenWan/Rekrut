const devmode = false;
var manifest = chrome.runtime.getManifest();
var appName = manifest.name;
var appVersion = manifest.version;

//running on app reload
chrome.runtime.onInstalled.addListener(function () {
    if (devmode) {
        console.log(appName + appVersion + " is reloaded.");
        console.log("Draken sends his regards.");
    }
});

//checking for pagAction request
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.todo == "showPageAction") {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.pageAction.show(tabs[0].id);
        });
    }
});

/* request to toggle slider whenever extension icon clicked
 */
chrome.pageAction.onClicked.addListener(function () {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            todo: "toggle"
        });
    })
});

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    if (req.method == "getLS")
        sendResponse({
            ls: localStorage['token']
        })
    else
        sendResponse({
            ls: undefined
        });
})