var manifest = chrome.runtime.getManifest();
var appName = manifest.name;
var appVersion = manifest.version;

//running on app reload
chrome.runtime.onInstalled.addListener(function() {
    console.log(appName+appVersion+" is reloaded.");
    //console.log("Draken sends his regards.");
});

//checking for pagAction request
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    if(request.todo == "showPageAction")
    {
        chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
            chrome.pageAction.show(tabs[0].id);
        })
    }
});

/* background request sent to content.js whenever extension icon is clicked
   this is a pageAction listener for toggling the slider
*/
chrome.pageAction.onClicked.addListener(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id,{todo: "toggle"});
    })

});

//sendRequest to server
chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse)
{
    if(request.todo == "reqServer")
    {
        chrome.tabs.query({active: true, currentWindow:true}, function(tabs){

        });
    }
});

//function for server requqest
function requestServer(data)
{
    var xj = new XMLHttpRequest();
    xj.open("POST", "http://localhost:3000/log", true);
    xj.setRequestHeader("Content-Type", "application/json");
    xj.send(JSON.stringify({action: "data", data: data}));
    xj.onreadystatechange = function()
    {
        alert("doooone!");
    }
}