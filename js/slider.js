//user profile details object
var user = {
    name: "",
    url: "",
    location: "",
    image: undefined,
    summary: "",
    company: {
      name: "",
      designation: "",
      duration: undefined
    },
    current_education:
    {
        name: "",
        duration: ""
    },
    contact:
    {
        email: ""
    },
    education: [],
    experience: []
    //resume: ""
}

// Click event to toggle the slider using inframe button
document.getElementById("closebtn").addEventListener("click", function()
{
    //closing the slider request sent
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id,{todo: "toggle"});
    })
});


// auto extracted profile data onMessage receiver
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse)
{
    if(msg.todo == "auto_extraction")
    {
        user = msg.data;
        console.log("Auto-extraction message received.");
        var uname = getById("uname");
        var url = getById("url");
        //var summary = getById("summary"); Reducing data overhead
        var proPic = getById("proPic");
        var loc = getById("location");
        var comp = getById("company");
        var edu = getById("education");
        var email = getById("email");
        var experience = getById("experience");
        var schoolinfo = getById("schoolinfo");

        uname.value = user.name.trim();
        url.value = user.url.trim();
        //summary.value = user.summary.trim(); //reducing data overhead
        proPic.src = user.image;
        loc.value = user.location.trim();
        comp.value = user.company.name.trim();
        edu.value = user.current_education.name.trim();
        email.value = user.contact.email.trim();
        experience.value = JSON.stringify(user.experience);
        email.value = user.contact.email.trim();
        schoolinfo.value = JSON.stringify(user.education);
        //anchor_ele.replaceWith(createElementManual("a","",user.resume.trim()))   //code for resume retrieval
    }
    sendResponse("yes i got it!");  
})

// sendMessage for automatic extraction of the data from profile
chrome.tabs.query({active: true, currentWindow: true}, function(tab)
{
    console.log("Sending auto-extraction command for data.");
        chrome.tabs.onUpdated.addListener(function()
        {
            chrome.tabs.sendMessage(tab[0].id, {todo: "auto_extraction_notbutton"});
        });
});

// form submisson code simple testing
document.getElementById("submitDetails").addEventListener("click", function()
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tab)
    {
        chrome.tabs.sendMessage(tab[0].id, {todo:"send_data_to_server"},function()
        {
            console.log("Sending data to content-script");
        });
    });
});

// the code is itself descriptive
function getById(id)
{
    var element = document.getElementById(id);
    return element;
}

//sendMessage to background/events.js
document.getElementById("submitDetails").addEventListener("click", function()
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tab)
    {
        chrome.tabs.sendMessage(tab[0].id, {todo: "reqServer", data: user});
    });
});

//creatElement
function createElementManual(name, styleObj, href="")
{
    var ele = document.createElement(name);
    if(href!= undefined || href != "")
        ele.setAttribute("href", href);
    return ele;
}

document.getElementById("author").addEventListener("click", function()
{
    var goto = "https://www.github.com/drakenwan"
    chrome.tabs.create({url:goto})
})