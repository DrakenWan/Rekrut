const devmode = false;

var user = {
    name: "",
    url: "",
    location: "",
    image: undefined,
    summary: "",
    experience_list: ["", ""],
    contact: {
        email: ""
    },
    education: [],
    experience: [],
    skills: [],
    certifications: []
}

// Click event to toggle the slider using inframe button
document.getElementById("closebtn").addEventListener("click", function () {
    //closing the slider request sent
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            todo: "toggle"
        });
    })
});

// auto extracted profile data onMessage receiver
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.todo == "auto_extraction") {
        user = msg.data;
        if (devmode) console.log("Extraction message received.");
        var uname = getById("uname");
        var url = getById("url");
        var proPic = getById("proPic");
        var loc = getById("location");
        var comp = getById("company");
        var edu = getById("education");
        var email = getById("email");
        var experience = getById("experience");
        var schoolinfo = getById("schoolinfo");
        var summary = getById("summary");
        var skills = getById("skills");
        var certs = getById("certs");

        uname.value = user.name.trim();
        url.value = user.url.trim();
        proPic.src = user.image;
        loc.value = user.location.trim();
        comp.value = user.experience_list[1].trim();
        edu.value = user.experience_list[0].trim();
        email.value = user.contact.email.trim();
        experience.value = JSON.stringify(user.experience);
        email.value = user.contact.email.trim();
        schoolinfo.value = JSON.stringify(user.education);
        summary.value = user.summary.trim();
        skills.value = JSON.stringify(user.skills);
        certs.value = JSON.stringify(user.certifications);
    }
    sendResponse({
        msg: "Success.EMR"
    });
})

// sendMessage for automatic extraction of the data from profile
chrome.tabs.query({
    active: true,
    currentWindow: true
}, function (tab) {
    if (devmode) console.log("Extraction Command Sent.");

    chrome.tabs.sendMessage(tab[0].id, {
        todo: "auto_extraction_notbutton"
    });
    chrome.tabs.onUpdated.addListener(function () {
        chrome.tabs.sendMessage(tab[0].id, {
            todo: "auto_extraction_notbutton"
        });
    });
});

function getById(id) {
    var element = document.getElementById(id);
    return element;
}

document.getElementById("submitDetails").addEventListener("click", function () {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tab) {
        chrome.tabs.sendMessage(tab[0].id, {
            todo: "send_data_to_server",
            data: user
        });
    });
});

function createElementManual(name, styleObj, href = "") {
    var ele = document.createElement(name);
    if (href != undefined || href != "")
        ele.setAttribute("href", href);
    return ele;
}

document.getElementById("author").addEventListener("click", function () {
    var goto = "https://www.github.com/drakenwan"
    chrome.tabs.create({
        url: goto
    })
})

setTimeout(function () {
    document.getElementById("loader-section").style = "display:none;";
    if (document.getElementById("extractdatapage"))
        document.getElementById("extractdatapage").style = "display:block;";
}, 100)

document.getElementById("logout-button").addEventListener("click", function () {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tab) {
        chrome.tabs.sendMessage(tab[0].id, {
            todo: "logout_extension",
            data: user
        });
    });
});