//attempting to make this all modular but failing miserably

//constants
const HOST = 'localhost'
const SERVER_URL = "https://"+HOST+":3000/"
/* *** Object Definition Starts *** */

//response object template
var resp = 
{
    todo: "", //action to be done 
    data: undefined //object to be sent
}

// Template for linkedin Profile
var templateIN = {
  name: "pv-top-card-v3--list",
  url: "",
  location: "pv-top-card-v3--list",
  image: "pv-top-card-section__photo",
  summary: "pv-about-section", // reducing data overhead
  company: "pv-top-card-v3--experience-list-item",
  experience_list: [],
  contact:
  {
    email: "pv-contact-info__header"
  }
//  resume: "pv-top-card-section__summary-treasury" // working on it
}

//job object
class Job {
  constructor() {
    this.company = "";
    this.location = [];
    this.doe = [];
    this.position = [];
    this.duration = [];
  }
}

//education object
class School {
  constructor(){
    this.institute = "";
    this.degree = "";
    this.field = "";
    this.grade = -1.0;
    this.duration = "";
    this.activities = "";
    this.summary = "";
  }
}


//methods to initialise the 
// Temporary pass object : mirrors the templateIN variable
// this object has functionalities to retrieve its data
var user = {
  name: "",
  url: "",
  location: "",
  summary: "",
  image: undefined,
  experience_list: ["", ""],
  contact:
  {
    email: ""
  },
  experience: [],
  education: [],
  init()
  {

  },
  //resume: ""
  getName: function()
  {
    if(document.getElementsByClassName(templateIN.name)[0])
    {
      var temp = document.getElementsByClassName(templateIN.name)[0];
      temp = temp.firstElementChild;
      this.name = temp.textContent.trim();
    }else {this.name = ""}
  },
  getUrl: function()
  {
    this.url = location.href;
  },
  getLocation: function()
  {
    if(document.getElementsByClassName(templateIN.location)[1])
    {
      var temp = document.getElementsByClassName(templateIN.location)[1];
      temp = temp.firstElementChild;
      this.location = temp.textContent.trim();
    } else { this.location = ""}
  },
  getImage: function()
  {
    if(document.getElementsByClassName(templateIN.image)[0])
    {
      user.image = document.getElementsByClassName(templateIN.image)[0].src;
    } else { user.image = "https://www.pinclipart.com/picdir/middle/8-82428_profile-clipart-generic-user-gender-neutral-head-icon.png";}
  },
  getLatestExperienceList: function()
  {
    user.experience_list = ["",""];
    if(document.getElementsByClassName(templateIN.company)) //current company if it exists
    {
      var temp = document.getElementsByClassName(templateIN.company);
      for(var i=0; i<temp.length; i++)
      {
        if(temp[i].getAttribute("data-control-name") == "education_see_more")
          {
            temp[i] = temp[i].lastElementChild;
            user.experience_list[0] = temp[i].textContent.trim();
            //console.log(user.experience_list[0]);
          }
          
        if(temp[i].getAttribute("data-control-name") == "position_see_more")
        {
          temp[i] = temp[i].lastElementChild;
          user.experience_list[1] = temp[i].textContent.trim();
          //console.log(user.experience_list[1]);
        }
      }
    }
  },
  getSummary: function()
  {
    if(document.getElementsByClassName(templateIN.summary)[0])
    {
      var temp = document.getElementsByClassName(templateIN.summary)[0];
      temp = temp.firstElementChild.nextElementSibling;
      if(temp)
        user.summary = purifyString(temp.textContent);
      else user.summary = "";
    } else {user.summary = ""}
  },
  getEmail: function()
  {
    //finding mail
    if(document.getElementsByClassName(templateIN.contact.email))
    {
      var x = document.getElementsByClassName(templateIN.contact.email);

      //loop to find email
      var flag = 0;
      for(var i=0; i<x.length; i++)
      {
        if(x[i].textContent.trim().toLowerCase() == "email")
          {
            console.log(x[i].textContent.trim().toLowerCase());
            user.contact.email = x[i].nextElementSibling.textContent;
            flag = 1;
            break;
          }//condition to check email
      }
      if(flag == 0) user.contact.email = "";
    }//contact set email
  }, //getEmail method ends here

  getExperience: function() 
  //gets the experience array filling 
  //works perfectly unless linkedin loses its mind and changes their document format
   {
     user.experience = []; //flush out old values from array
     var exp = document.getElementsByClassName("experience-section")[0];
     //console.log(exp);
     if(exp != undefined || exp != null) // if experience header is there or not
     {
      var itr = exp.firstElementChild.nextElementSibling;
      var jobs = itr.childNodes;
     
      for(i=0; i<jobs.length; i++)
      {
        var temp = jobs[i];
        var job = new Job();
        if(temp.nodeName.toLowerCase() != "#text")
        {
          if(temp.nodeName.toLowerCase() == "li")
            temp = temp.firstElementChild; //leveling the tree structure

          var data_div = temp.firstElementChild.firstElementChild; //
          var ul_ver = data_div.nextElementSibling; //ul verifier
          if(ul_ver && ul_ver.nodeName.toLowerCase() == "ul")
          {
            data_div = data_div.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.lastElementChild;
            job.company = data_div.textContent.trim();

            var ul_list = ul_ver.childNodes;
            for(k=0; k<ul_list.length; k++)
            {
              var node = ul_list[k];
              if(node.nodeName.toLowerCase() == "li")
              {
                node = node.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.firstElementChild.firstElementChild;
              
                /* don't try to make the below code lesser by
                  making subsequent variable dependent on previous one
                  keep them all dependent on 'node' variable.
                  similarly in the next else branching statement
                */
                var position = node.firstElementChild;
                var doe = node.firstElementChild.nextElementSibling.firstElementChild.lastElementChild;
                var duration = node.firstElementChild.nextElementSibling.lastElementChild.lastElementChild;
                var location = node.firstElementChild.nextElementSibling.nextElementSibling;

                if(position) job.position.push(position.lastElementChild.textContent.trim()); else job.position.push("");
                if(doe) job.doe.push(doe.textContent.trim()); else job.doe.push("");
                if(duration) job.duration.push(duration.textContent.trim()); else job.duration.push("");
                if(location) job.location.push(location.lastElementChild.textContent.trim()); else job.location.push("");
                this.experience.push(job);
              }
            }
          }
          /* the above and below branching statements of if-else
            look redundant in coding but they are not. totally different
            coding going on except extraction
          */
          else
          {
            data_div = data_div.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.firstElementChild;
            if(data_div) job.position.push(data_div.textContent.trim()); else job.position.push("");
            var companyName = data_div.nextElementSibling.lastElementChild; 
            var doe = data_div.nextElementSibling.nextElementSibling;
            var duration = data_div.nextElementSibling.nextElementSibling;
            var location = data_div.nextElementSibling.nextElementSibling;
            
            if(companyName) job.company = companyName.textContent.trim(); else job.company = "";
            if(doe) job.doe.push(doe.firstElementChild.lastElementChild.textContent.trim()); else job.doe.push("");
            if(duration) job.duration.push(duration.lastElementChild.lastElementChild.textContent.trim()); else job.duration.push("");
            if(location){
               if(location.nextElementSibling) job.location.push(location.nextElementSibling.lastElementChild.textContent.trim());
             } else job.location.push("");
            this.experience.push(job);
          }
        }// if condition to check if temp is #text
        
      } //for loop for iterating over the ul list
     }//if cond for exp != null
   },//getExperience method ends here


   // the below code needs to be changed
   getEducation: function()
   {
     user.education = [] //flush out old values from array

     if(document.getElementsByClassName("education-section")[0]) //if education-section exists
     {
       var iterator = document.getElementsByClassName("education-section")[0].firstElementChild.nextElementSibling;
       var nodes = iterator.childNodes;

       for(i=0; i<nodes.length; i++)
       {
        var school =  new School();
        var node = nodes[i];
        if(node.nodeName.toLowerCase() == "li")
        {
          node = node.firstElementChild.firstElementChild.firstElementChild; //the div right above above a & [div] elements
          if(node.nodeName.toLowerCase() == "div") var a = node.firstElementChild;
          if(node.nodeName.toLowerCase() == "a") var a = node;
          var summary = node.firstElementChild.nextElementSibling;
          if(summary)
          {
            school.summary = summary.firstElementChild.textContent.trim();
          } else {school.summary = "";}
          if(a)
          {
            a = a.firstElementChild.nextElementSibling;
            if(a)
            {
              var nameofinst = a.firstElementChild.firstElementChild;
              var degree = a.firstElementChild.firstElementChild.nextElementSibling;
              var field = a.firstElementChild.firstElementChild.nextElementSibling;
              var cgpa = a.firstElementChild.firstElementChild.nextElementSibling;
              if(nameofinst) school.institute = nameofinst.textContent.trim(); else school.institute = "";
              if(degree) school.degree = degree.lastElementChild.textContent.trim(); else school.degree = "";
              if(field) 
              {
                if(field.nextElementSibling) school.field = field.nextElementSibling.lastElementChild.textContent.trim(); else school.field = "";
              }
              if(cgpa) 
              {
               if(cgpa.nextElementSibling)
               {
                 if(cgpa.nextElementSibling.nextElementSibling)school.grade = parseFloat(cgpa.nextElementSibling.nextElementSibling.lastElementChild.textContent.trim()); else school.grade = -1.0;  
               }
              }
            }

            a = a.firstElementChild.nextElementSibling;
            if(a)
            {
              var time = a.lastElementChild;
              if(time) school.duration = time.textContent.trim(); 
              
              a = a.nextElementSibling;
              if(a)
              {
                var activities = a.lastElementChild;
                if(activities) school.activities = activities.textContent.trim();
              }
            } 
          }
          this.education.push(school);
        } //if the node is "li" or not
       }//for loop for iterating through the list of institutes
     }// if condn for education-section's existence
   }
}// userProfile mirror object ends here

var iframe = undefined;
/* ##### IFRAME IMPLEMENTATION ######### */
var xhr = new XMLHttpRequest();
//
var url = SERVER_URL + "tokenCheck";
xhr.open("POST", url, true);
//console.log(localStorage["token"]);
if(localStorage["token"])
  xhr.send(localStorage["token"]);
else
{
  console.log("Token does not exist in browser.");
  iframe = SetupIframe("./login.html");
  appendIframe(iframe);
}
xhr.onerror = function()
{
  iframe = SetupIframe("./login.html");
  appendIframe(iframe);
        var i = document.createElement("div");
        document.body.appendChild(i);
        i.style.transition = "0.5s";
        i.style.background = "#666";
        i.style.color = "#fff";
        i.style.height = "auto";
        i.style.width = "200px";
        i.style.position = "fixed";
        i.style.top = "0px";
        i.style.left = "0px";
        i.style.margin ="20px 50%";
        i.style.padding = "20px";
        i.style.zIndex = "9000000000000000000";
        i.style.fontStyle = "bold";
        i.style.fontSize = "16px";
        i.innerText = "Rekrut - Error: Server not responding. Loaded login page.";
        setTimeout(function() {
            i.style = "display: none; transition: 0.5s;";
        }, 10000);
}
xhr.onreadystatechange = function()
{
  if(xhr.status == 200)
  {
    console.log("Client token exists in database.");
    if(xhr.responseText == "tokenexists")
    {
      iframe = SetupIframe("./slider.html");
      appendIframe(iframe);
    }
    else
    {
      console.log("Client token does not exist in database.");
      iframe = SetupIframe("./login.html");
      appendIframe(iframe);
      
    }
  }
}


/*
testing purposes
var iframe = SetupIframe("./login.html");
appendIframe(iframe);
*/

//below are the functionalities for setting up our iframe
function SetupIframe(source)
{
  var iframe = document.createElement('iframe');
  iframe = createIframe(iframe, source, "slidermenuiframe")
  styleIframe(iframe)
  return iframe
}

function removeIframe(id, src)
{
  var newframe = SetupIframe(src);
  document.getElementById(id).replaceWith(newframe);
  var frame = document.getElementById(id);
  toggle();
  return frame;
}

/* creation of iframe on the webpage */
function createIframe(iframe, src, id)
{
  iframe.id = id;
  iframe.src = chrome.extension.getURL(src);
  return iframe
}

//iframe styling function
function styleIframe(iframe)
{
  /*
    can be modified by actually passing the iframe_template object as an argument
    as well so as to pass on values into the styles.
    
    Or

    we can also use iframe.style.cssText but it is not stable for animations
  */

  // adding css style below with animation
  iframe.style.background = "#f7f7f7";
  iframe.style.height = "100%";
  iframe.style.width = "0px";
  iframe.style.position = "fixed";
  iframe.style.top = "0px";
  iframe.style.right = "0px";
  iframe.style.zIndex = "9000000000000000000";
  //iframe.style.boxShadow = "10px 10px 8px #888888";
  //iframe.style.borderLeft = "5px solid #becde5";
  iframe.frameBorder = "none"; 
  iframe.style.transition = "0.5s";
}

//iframe append to document
function appendIframe(iframe)
{
  document.body.appendChild(iframe); //append to the current website
}
/* *** End of Data Definition Part */

//listen for msg from event
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse)
{
  if(msg.todo == "auto_extraction_notbutton")
  {
     extraction(); //to add some spice
     window.addEventListener("scroll", extraction);
     //extraction function to extract the details from linkedin profile
  }
});


// extraction method
function extraction()
{
  user.getName();
  user.getUrl();
  user.getSummary();
  user.getImage();
  user.getLocation();
  user.getLatestExperienceList();
  //user.getLatestEducation();
  user.getEmail();
  user.getExperience();
  user.getEducation();
  resp.todo = "auto_extraction";
  resp.data = user;
  
  chrome.runtime.sendMessage(resp,function(msg)
  {
    console.log("Auto extraction message sent."+msg);
  });
}
  /*
  chrome.runtime.sendMessage(resp, function()
    {
      console.info("Auto extraction message sent!");
    });*/

//request accepted from events.js page to toggle the slider
  chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse)
  {
    if(msg.todo == "toggle")
    {
      toggle();
    }

    if(msg.todo == "send_data_to_server")
    {
      var hr = new XMLHttpRequest();
      var url = SERVER_URL + "recruitUser";
      var data = JSON.stringify(user);
      hr.onerror = function () {
        if(hr.readyState == 4)
          alert("Failed to connect with server. Try again.");
      }
      hr.open("POST", url, true);
      hr.setRequestHeader("Content-type", "application/json");
      hr.send(data);
      hr.onreadystatechange = function () {
        if(hr.readyState == 4 && hr.status == 200)
        {
          //alert("");
          alert("Details successfully sent.");
        }
      }
    }
    
});
// nothing to bother about : just for testing purposes : run along
// just don't delete it
resp.todo = "showPageAction";
resp.data = undefined;
chrome.runtime.sendMessage(resp);

//toggle function invoked whenever extension icon clicked
function toggle()
{
    if(iframe.style.width == "0px")
    {
        iframe.style.width = "400px";
    } else {
        iframe.style.width = "0px";
    }
}


//server the server

/* Residual code that might come handy in future
   is below:- 

/* template object for iframe
    can be employed for future use
var iframe_template = {
  src: "",
  id: "",
  background: "",
  height: "",
  width: "",
  position: "",
  top: "",
  right: "",
  zIndex: "",
  border: "",
  borderLeft: "",
  borderRight: "",
  frameBorder: "",
  transition: ""
  //add more styles if you want to
} 

//assign a temporary iframe variable
var iframe_temp = iframe_template;
*/

//string purify
function purifyString(string)
{
  string = string.replace("...", "");
  string = string.replace("See More", "");
  string = string.replace("see more", "");
  string = string.replace("See more", "");
  string = string.replace(/\s+/g, " ");
  string = string.replace(/\r?\n|\r/, "");
  string = string.trim();
  string = string.replace("About", "");
  string = string.replace("about", "");
  return string;
}

/*
कार्तिकेय कौल
आकांक्षी डेटा वैज्ञानिक
*/

/* login.js content handling below this part */

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse)
{
  if(msg.todo == "loggingin")
  {
    console.log("Sending login details to server.");
    var logReq = new XMLHttpRequest();
    var URL = SERVER_URL + "authenticateRekruter";
    var data = JSON.stringify(msg.data);
    logReq.onerror = function(e){
      alert("The server probably did not respond. Try connecting to server again.")
      sendResponse("Error: The server probably did not respond.");
    };
    logReq.open("POST", URL, true);
    logReq.setRequestHeader("Content-type", "application/json");
    logReq.send(data);
    logReq.onreadystatechange = function()
    {
      if(logReq.status == 200 && logReq.readyState == 4)
      {
        //console.log("Things change!"); //debug statement
        var logReqData = logReq.responseText;
        if(logReqData == "-1")
        {
          console.log("Username does not exist.");
          alert("The username entered does not exist. Try again!");
        }
        else if(logReqData == "0")
        {
          console.log("Incorrect password!");
          alert("The password entered is incorrect. Talk to your admin if you have forgotten password.");
        }
        else
        {
          console.log("Token has been received!");
          localStorage["token"] = logReqData;
          
          iframe = removeIframe("slidermenuiframe", "./slider.html");
          appendIframe(iframe); toggle();
        }
      }
    }
  }
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse)
{
  if(msg.todo == "logout_extension")
  {
    console.log("Logging out from extension.");
    iframe = removeIframe("slidermenuiframe", "./login.html");
    //iframe = SetupIframe("./login.html");
    appendIframe(iframe); toggle();
    
    console.log("Deleting the token.");
    delete localStorage["token"];
    sendResponse("Token deleted. Logged out successfully.");
  }
});
/* login.js messages handling ends here */
