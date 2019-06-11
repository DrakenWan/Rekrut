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

document.getElementById("userdetails").addEventListener("submit", function(event)
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
        //alert("The fields are empty. Fill them before pressing login.");
        var msg = document.getElementById("error-msg");
        if(uname.value == "" && pwd.value == "") msg.innerText = "Please fill the fields left blank."
        msg.style = "display: block;\
                    font-size: 12px;\
                    color: red;\
                    text-align: center;\
                    text-shadow: 0.5px 0.5px 2px red;\
                    border-left: 5px solid red;\
                    background-color:  #f3f1f1;\
                    transition: 0.4s;";
        event.preventDefault();
    }
});

setTimeout(function()
{
 document.getElementById("loader-section").style = "display: none;";
 if(document.getElementById("loginsect"))
    document.getElementById("loginsect").style = "display: block;";
}, 3000);