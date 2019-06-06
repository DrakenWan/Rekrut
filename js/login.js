var rekrut = {
    username: "",
    password: "",
    token: ""
}

document.getElementById("author").addEventListener("click", function()
{
    var goto = "https://www.github.com/drakenwan"
    chrome.tabs.create({url:goto})
})

// Click event to toggle the slider using inframe button
document.getElementById("closebtn").addEventListener("click", function()
{
    //closing the slider request sent
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id,{todo: "toggle"});
    })
});

// the code is itself descriptive
function getById(id)
{
    var element = document.getElementById(id);
    return element;
}

document.getElementById("login").addEventListener("click", function()
{
    var uname = getById("uname");
    var pwd = getById("pwd");
    if(uname.value && pwd.value)
    {
        rekrut.username = uname.value;
        rekrut.password = pwd.value;

        chrome.tabs.query({active: true, currentWindow: true}, function(tab)
        {
            chrome.tabs.sendMessage(tab[0].id, {todo: "loggingin", data: rekrut});
        });
    }
    else
    {
        //javascript events are skipping unless they request a user input
        //probably because this is an async function
        alert("The fields are empty. Fill them before pressing login.");
    }
});