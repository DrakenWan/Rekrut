// coding with restrictions on creativity will never bring the best for anyone
const HOST = 'localhost'
const isSecure = false;
const devmode = false; // if set to true will start developer mode on extension reload
const SERVER_URL = ((isSecure && !devmode) ? "https://" : "http://") + HOST + ":3000/"

var resp = { //response object
  todo: "",
  data: undefined
}

if(devmode) 
{
  console.log("%c Welcome To Rekrut Dev Mode!", 'background: #222; color: #bada55; font-size: 30px; padding: 20px; text-align: center;');
}

/* ### Profile ruleset ### */
//usually set as time followed by date:
//say if time is 1:35 pm and date is 7/4/2019 then token equals 13357419
const rulesChangedToken = 13437419;
var templateIN = {
  name: "pv-top-card-v3--list",
  location: "pv-top-card-v3--list",
  image: "pv-top-card-section__photo",
  summary: "pv-about-section", // reducing data overhead
  company: "pv-top-card-v3--experience-list-item", //data retrieved will be filled in experience_list
  experience_list: [],
  contact: {
    email: "pv-contact-info__header"
  },
  skills: [],
  certifications: [],
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
  constructor() {
    this.institute = "";
    this.degree = "";
    this.field = "";
    this.grade = -1.0;
    this.duration = "";
    this.activities = "";
    this.summary = "";
  }
}

//certifications object
class certificate {
  constructor() {
    this.credentialURL = "";
    this.title = "";
    this.issuer = "";
  }
}

// this object has methods to retrieve its data
var user = {
  name: "",
  url: "", //linkedin profile URL
  location: "", //current location
  summary: "", //about section
  image: undefined, // takes image else a dummy images
  experience_list: ["", ""], //takes company and school list
  contact: {
    email: "" //email if it exists
  },
  experience: [], // experience section : object
  education: [], //education section : object
  skills: [], //skills : string
  certifications: [], //certifications : object
  init() {

  },
  getName: function () {
    if (document.getElementsByClassName(templateIN.name)[0]) {
      var temp = document.getElementsByClassName(templateIN.name)[0];
      temp = temp.firstElementChild;
      this.name = temp.textContent.trim();
    } else {
      this.name = ""
    }
  },
  getUrl: function () {
    this.url = location.href;
  },
  getLocation: function () {
    if (document.getElementsByClassName(templateIN.location)[1]) {
      var temp = document.getElementsByClassName(templateIN.location)[1];
      temp = temp.firstElementChild;
      this.location = temp.textContent.trim();
    } else {
      this.location = ""
    }
  },
  getImage: function () {
    if (document.getElementsByClassName(templateIN.image)[0]) {
      user.image = document.getElementsByClassName(templateIN.image)[0].src;
    } else {
      user.image = "https://www.pinclipart.com/picdir/middle/8-82428_profile-clipart-generic-user-gender-neutral-head-icon.png";
    }
  },
  getLatestExperienceList: function () {
    user.experience_list = ["", ""];
    if (document.getElementsByClassName(templateIN.company)) {
      var temp = document.getElementsByClassName(templateIN.company);

      for (var i = 0; i < temp.length; i++) {
        if (temp[i].getAttribute("data-control-name") == "education_see_more") {
          temp[i] = temp[i].lastElementChild;
          user.experience_list[0] = temp[i].textContent.trim();
        }

        if (temp[i].getAttribute("data-control-name") == "position_see_more") {
          temp[i] = temp[i].lastElementChild;
          user.experience_list[1] = temp[i].textContent.trim();
        }
      }
    }
  },
  getSummary: function () {
    if (document.getElementsByClassName(templateIN.summary)[0]) {
      var temp = document.getElementsByClassName(templateIN.summary)[0];
      temp = temp.firstElementChild.nextElementSibling;
      if (temp)
        user.summary = purifyString(temp.textContent);
      else user.summary = "";
    } else {
      user.summary = ""
    }
  },
  getEmail: function () {
    if (document.getElementsByClassName(templateIN.contact.email)) {
      var x = document.getElementsByClassName(templateIN.contact.email);

      var flag = 0;
      for (var i = 0; i < x.length; i++) {
        if (x[i].textContent.trim().toLowerCase() == "email") {
          console.log(x[i].textContent.trim().toLowerCase());
          user.contact.email = x[i].nextElementSibling.textContent;
          flag = 1;
          break;
        }
      }
      if (flag == 0) user.contact.email = "";
    }
  }, //getEmail method ends here

  getExperience: function ()
  //works perfectly unless linkedin loses its mind and changes their document format
  {
    user.experience = []; //flush out old values
    var exp = document.getElementsByClassName("experience-section")[0];
    if (exp != undefined || exp != null) // if experience header exists
    {
      var itr = exp.firstElementChild.nextElementSibling;
      var jobs = itr.childNodes;

      for (i = 0; i < jobs.length; i++) {
        var temp = jobs[i];
        var job = new Job();
        if (temp.nodeName.toLowerCase() != "#text") {
          if (temp.nodeName.toLowerCase() == "li")
            temp = temp.firstElementChild; //leveling the tree structure

          var data_div = temp.firstElementChild.firstElementChild;
          var ul_ver = data_div.nextElementSibling; //ul verifier
          if (ul_ver && ul_ver.nodeName.toLowerCase() == "ul") {
            data_div = data_div.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.lastElementChild;
            job.company = data_div.textContent.trim();

            var ul_list = ul_ver.childNodes;
            for (k = 0; k < ul_list.length; k++) {
              var node = ul_list[k];
              if (node.nodeName.toLowerCase() == "li") {
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

                if (position) job.position.push(position.lastElementChild.textContent.trim());
                else job.position.push("");
                if (doe) job.doe.push(doe.textContent.trim());
                else job.doe.push("");
                if (duration) job.duration.push(duration.textContent.trim());
                else job.duration.push("");
                if (location) job.location.push(location.lastElementChild.textContent.trim());
                else job.location.push("");
                this.experience.push(job);
              }
            }
          }
          /* the above and below branching statements of if-else
            look redundant in coding but they are not. totally different
            coding going on except extraction
          */
          else {
            data_div = data_div.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.firstElementChild;
            if (data_div) job.position.push(data_div.textContent.trim());
            else job.position.push("");
            data_div = data_div.nextElementSibling.nextElementSibling;
            var companyName = data_div;
            var doe = data_div.nextElementSibling;
            var duration = data_div.nextElementSibling.lastElementChild;
            var location = data_div.nextElementSibling.nextElementSibling;

            if (companyName) job.company = companyName.textContent.trim();
            else job.company = "";
            if (doe) job.doe.push(doe.firstElementChild.lastElementChild.textContent.trim());
            else job.doe.push("");
            if (duration) job.duration.push(duration.lastElementChild.textContent.trim());
            else job.duration.push("");
            if (location) {
              if (location.lastElementChild) job.location.push(location.lastElementChild.textContent.trim());
            } else job.location.push("");
            this.experience.push(job);
          }
        } // if condition to check if temp is #text

      } //for loop for iterating over the ul list
    } //if cond for exp != null
  }, //getExperience method ends here

  getEducation: function () {
    // this code can be improved
    user.education = [] //flush out old values from array

    if (document.getElementsByClassName("education-section")[0]) //if education-section exists
    {
      var iterator = document.getElementsByClassName("education-section")[0].firstElementChild.nextElementSibling;
      var nodes = iterator.childNodes;

      for (i = 0; i < nodes.length; i++) {
        var school = new School();
        var node = nodes[i];
        if (node.nodeName.toLowerCase() == "li") {
          node = node.firstElementChild.firstElementChild.firstElementChild; //the div right above above a & [div] elements
          if (node.nodeName.toLowerCase() == "div") var a = node.firstElementChild;
          if (node.nodeName.toLowerCase() == "a") var a = node;
          var summary = node.firstElementChild.nextElementSibling;
          if (summary) {
            school.summary = summary.firstElementChild.textContent.trim();
          } else {
            school.summary = "";
          }
          if (a) {
            a = a.firstElementChild.nextElementSibling;
            if (a) {
              var nameofinst = a.firstElementChild.firstElementChild;
              var degree = a.firstElementChild.firstElementChild.nextElementSibling;
              var field = a.firstElementChild.firstElementChild.nextElementSibling;
              var cgpa = a.firstElementChild.firstElementChild.nextElementSibling;
              if (nameofinst) school.institute = nameofinst.textContent.trim();
              else school.institute = "";
              if (degree) school.degree = degree.lastElementChild.textContent.trim();
              else school.degree = "";
              if (field) {
                if (field.nextElementSibling) school.field = field.nextElementSibling.lastElementChild.textContent.trim();
                else school.field = "";
              }
              if (cgpa) {
                if (cgpa.nextElementSibling) {
                  if (cgpa.nextElementSibling.nextElementSibling) school.grade = parseFloat(cgpa.nextElementSibling.nextElementSibling.lastElementChild.textContent.trim());
                  else school.grade = -1.0;
                }
              }
            }

            a = a.firstElementChild.nextElementSibling;
            if (a) {
              var time = a.lastElementChild;
              if (time) school.duration = time.textContent.trim();

              a = a.nextElementSibling;
              if (a) {
                var activities = a.lastElementChild;
                if (activities) school.activities = activities.textContent.trim();
              }
            }
          }
          this.education.push(school);
        } //if the node is "li" or not
      } //for loop for iterating through the list of institutes
    } // if condn for education-section's existence
  }, //getEducation method ends here
  getSkill: function () {
    user.skills = []; //flush them stoopid skills
    if (document.getElementsByClassName("pv-skill-categories-section")) {
      var itr = document.getElementsByClassName("pv-skill-categories-section")[0];

      if (itr) {
        itr = itr.firstElementChild;
        //extraction of top skills
        if (itr.nextElementSibling.nodeName.toLowerCase() === "button") itr = itr.nextElementSibling;
        if (itr.nextElementSibling) //check if "ol" exists or not
        {

          var _itr = itr.nextElementSibling; //establish inner iterator
          if (_itr.className.split(" ")[0] === "mt3")
            _itr = itr.nextElementSibling.nextElementSibling;
          var nodes = _itr.childNodes; // get the node elements
          for (var i = 2; i < nodes.length; i += 3) {
            _itr = nodes[i].firstElementChild.firstElementChild;
            if (_itr.className === "relative" || _itr.className === "mr3" || _itr.className === "relative mr3") //check if div.relative || div.mr3 exists or not and adjust accordingly
              _itr = _itr.nextElementSibling;

            _itr = _itr.firstElementChild; // traversal path : div --> p

            // push the element into the skills array
            this.skills.push(purifyString(_itr.textContent))
          }
        } //end of extraction of top skills

        itr = itr.nextElementSibling;
        //extraction of other skills
        if (itr.nextElementSibling) //check if "div" exists or not
        {
          _itr = itr.nextElementSibling
          var nodes = _itr.childNodes;
          for (var i = 1; i < nodes.length - 1; i++) {
            _itr = nodes[i].firstElementChild.nextElementSibling;
            var li_nodes = _itr.childNodes;
            for (var j = 0; j < li_nodes.length; j++) {
              if (li_nodes[j].className) {
                if (li_nodes[j].className.split(" ")[0] === "pv-skill-category-entity") {
                  _itr = li_nodes[j].firstElementChild.firstElementChild;

                  //check if div.relative || div.mr3 exists or not and adjust accordingly
                  if (_itr.className === "relative" || _itr.className === "mr3" || _itr.className === "relative mr3")
                    _itr = _itr.nextElementSibling;
                  _itr = _itr.firstElementChild.firstElementChild;
                  this.skills.push(purifyString(_itr.textContent));
                } //check the li_nodes class condn.
              } // if li_nodes[j] is not a text
            } //the for condition on li_nodes
          } // outer for loop
        }
      } // "if" condn to check if section exists
    }
  }, //getSkill method ends here

  getCertifications: function () {
    user.certifications = []; //flush the array

    //check if the section exists
    if (document.getElementById("certifications-section")) {
      var itr = document.getElementById("certifications-section");
      if (itr.firstElementChild) {
        itr = itr.firstElementChild;
        if (itr.nextElementSibling) {
          itr = itr.nextElementSibling;
          var nodes = itr.childNodes;

          //iterating over the "li" nodes in the nodeList
          for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeName.toLowerCase() == 'li') {
              var cert = new certificate();
              //each list node in iteration
              var _itr = nodes[i].firstElementChild; //top-level <div> node

              if (_itr.firstElementChild.className.toLowerCase() == "pv-entity__actions") {
                _itr = _itr.firstElementChild.nextElementSibling;
              } else {
                _itr = _itr.firstElementChild;
              }

              if (_itr.className.toLowerCase() == "pv-entity__logo") {
                _itr = _itr.nextElementSibling;
                if (_itr.firstElementChild) {
                  cert.title = purifyString(_itr.firstElementChild.textContent);
                  if (_itr.firstElementChild.nextElementSibling)
                    cert.issuer = purifyString(_itr.firstElementChild.nextElementSibling.lastElementChild.textContent);
                }
              } else {
                if (_itr.firstElementChild) //<div> summary
                {
                  var k = _itr.firstElementChild;
                  k = k.nextElementSibling;

                  if (k.firstElementChild) { //title
                    k = k.firstElementChild;
                    cert.title = purifyString(k.textContent);

                    if (k.nextElementSibling) { //issuer
                      k = k.nextElementSibling;
                      cert.issuer = purifyString(k.textContent);
                    } //issuer end
                  } //title end

                } // <div> summary end
              } // else for no <a> anchor existing

              if (_itr.nextElementSibling) { //credential link
                k = _itr.nextElementSibling;
                cert.credentialURL = k.firstElementChild.getAttribute("href").toString();
              }
              this.certifications.push(cert);
            } //if nodeName == "li" ends here
          } // our beloved for-loop
        }
      }
    }
  }
} // userProfile mirror object ends here


//below are the functionalities for setting up our iframe
function SetupIframe(source) {
  var iframe = document.createElement('iframe');
  iframe = createIframe(iframe, source, "slidermenuiframe")
  styleIframe(iframe)
  return iframe
}

function removeIframe(id, src) {
  var newframe = SetupIframe(src);
  document.getElementById(id).replaceWith(newframe);
  var frame = document.getElementById(id);
  toggle();
  return frame;
}

function createIframe(iframe, src, id) {
  iframe.id = id;
  iframe.src = chrome.extension.getURL(src);
  return iframe
}

function styleIframe(iframe) {
  iframe.style.background = "#f7f7f7";
  iframe.style.height = "100%";
  iframe.style.width = "0px";
  iframe.style.position = "fixed";
  iframe.style.top = "0px";
  iframe.style.right = "0px";
  iframe.style.zIndex = "9000000000000000000";
  //iframe.style.borderLeft = "5px solid #becde5";
  iframe.frameBorder = "none";
  iframe.style.transition = "0.5s";
}

function appendIframe(iframe) {
  document.body.appendChild(iframe); //append to the current website
}

var iframe = undefined;
////////////////////////////////////////====== Definitions End Here ======/////////////////////////////////////////////

/* ##### IFRAME IMPLEMENTATION ######### */
var xhr = new XMLHttpRequest();
var url = SERVER_URL + "tokenCheck";

xhr.open("POST", url, true);
if (localStorage["token"])
  xhr.send(localStorage["token"]);
else {
  console.log("Token does not exist in browser.");
  iframe = SetupIframe("./login.html");
  appendIframe(iframe);
}
xhr.onerror = function () {
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
  i.style.margin = "20px 50%";
  i.style.padding = "20px";
  i.style.zIndex = "9000000000000000000";
  i.style.fontStyle = "bold";
  i.style.fontSize = "16px";
  i.innerText = "Rekrut - Error: Server not responding. Loaded login page.";
  setTimeout(function () {
    i.style = "display: none; transition: 0.5s;";
  }, 10000);
}
xhr.onreadystatechange = function () {
  if (xhr.status == 200) {
    console.log("Client token exists in database.");
    if (xhr.responseText == "tokenexists") {
      iframe = SetupIframe("./slider.html");
      appendIframe(iframe);
    } else {
      console.log("Client token does not exist in database.");
      iframe = SetupIframe("./login.html");
      appendIframe(iframe);

    }
  }
}


// Message listener for "Extraction"
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.todo == "auto_extraction_notbutton") {
    var isReached = false;
    var count = 5;
    while (!isReached) {
      if (count == 0) isReached = true;
      if (!isReached) {
        window.scrollTo(0, document.body.scrollHeight / count);
        setTimeout(() => {}, 3000);
        count--;
      }
    }
    window.scrollTo(0, 0);
    extraction(); //to add some spice
    window.addEventListener("scroll", extraction);
    //extraction function to extract the details from linkedin profile
  }
});

function extraction() {
  /* testing code */

  var mtsname = document.getElementsByClassName("pv-top-card-v3--list")[0];
  var mtslocation = document.getElementsByClassName("pv-top-card-v3--list")[1];
  var mtscompany = document.getElementsByClassName("pv-top-card-v3--experience-list-item")[0];
  var mtsschool = document.getElementsByClassName("pv-top-card-v3--experience-list-item")[1];
  var mtsabout = document.getElementsByClassName("pv-about-section")[0];
  var mtsexperience = document.getElementsByClassName("experience-section")[0];
  var mtseducation = document.getElementsByClassName("education-section")[0];
  var mtsskills = document.getElementsByClassName("pv-skill-categories-section")[0];
  var mtscertifications = document.getElementById("certifications-section");
  var mtsimg = document.getElementsByClassName("pv-top-card-section__photo")[0];
  var nodesList = [mtsname, mtslocation, mtscompany, mtsschool, mtsimg, mtsabout, mtsexperience, mtseducation, mtsskills, mtscertifications];
  var nodeNames = ["name", "location", "company", "school", "propic", "about", "exp", "edu", "skills", "certs"];
  var classNames = [];

  if (devmode) {
    console.log("%c Extraction Warnings:-", 'background: #222; color: #bada55; font-size: 16px; padding: 20px; text-align: center;');
    if (mtsabout) mtsabout.style = "background-color: #70FF72";
    if (mtsexperience) mtsexperience.style = "background-color: #70FF72";
    if (mtseducation) mtseducation.style = "background-color: #70FF72";
    if (mtsskills) mtsskills.style = "background-color: #70FF72";
    if (mtscertifications) mtscertifications.style = "background-color: #70FF72";
    if (mtsname) mtsname.style = "background-color: #70FF72";
    if (mtslocation) mtslocation.style = "background-color: #70FF72";
    if (mtscompany) mtscompany.style = "background-color: #70FF72";
    if (mtsschool) mtsschool.style = "background-color: #70FF72";
  }
  for (i = 0; i < nodesList.length; i++) {
    if (nodesList[i])
      classNames.push(nodesList[i].className);

    if (!nodesList[i] && devmode) {
      console.error(nodeNames[i] + "A node has either been removed from the document or not loaded yet.", );
      var tempX = document.getElementsByClassName("pv-content")[0];
      tempX.style = "background-color: #FF0F0F;"
    }
    if ((!localStorage[nodeNames[i]] || localStorage["rulesChangedToken"] != rulesChangedToken) && nodesList[i] ) {
      localStorage["rulesChangedToken"] = rulesChangedToken;
      console.log(nodeNames[i]);
      localStorage[nodeNames[i]] = nodesList[i].className.trim(); 
    } else if (localStorage[nodeNames[i]] && nodesList[i]) {
      if (localStorage[nodeNames[i]].trim() !== nodesList[i].className.trim() && devmode) {
        console.warn("\n\nClass name for " + nodeNames[i] + " has been changed form \"" + localStorage[nodeNames[i]] + "\" to  \"" + nodesList[i].className + "\"\n\n")
      }
    }

  }

  /* testing code */

  user.getName();
  user.getUrl();
  user.getSummary();
  user.getImage();
  user.getLocation();
  user.getLatestExperienceList();
  user.getEmail();
  user.getExperience();
  user.getEducation();
  user.getSkill();
  user.getCertifications();
  resp.todo = "auto_extraction";
  resp.data = user;

  chrome.runtime.sendMessage(resp);
}


// Message Listener: listen to toggle or send data to server
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.todo == "toggle") {
    toggle();
  }

  if (msg.todo == "send_data_to_server") {
    var hr = new XMLHttpRequest();
    var url = SERVER_URL + "recruitUser";
    var data = JSON.stringify(user);
    hr.onerror = function () {
      if (hr.readyState == 4)
        alert("Failed to connect with server. Try again.");
    }
    hr.open("POST", url, true);
    hr.setRequestHeader("Content-type", "application/json");
    hr.send(data);
    hr.onreadystatechange = function () {
      if (hr.readyState == 4 && hr.status == 200) {
        alert("");
        alert("Details successfully sent.");
      }
    }
  }
});


resp.todo = "showPageAction";
resp.data = undefined;
chrome.runtime.sendMessage(resp);

function toggle() {
  if (iframe.style.width == "0px") {
    iframe.style.width = "400px";
  } else {
    iframe.style.width = "0px";
  }
}

//string purify
function purifyString(string) {
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


/* communications with login.js file below */

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.todo == "loggingin") {
    console.log("Sending login details to server.");
    var logReq = new XMLHttpRequest();
    var URL = SERVER_URL + "authenticateRekruter";
    var data = JSON.stringify(msg.data);
    logReq.onerror = function (e) {
      alert("The server probably did not respond. Try connecting to server again.")
      sendResponse("Error: The server probably did not respond.");
    };
    logReq.open("POST", URL, true);
    logReq.setRequestHeader("Content-type", "application/json");
    logReq.send(data);
    logReq.onreadystatechange = function () {
      if (logReq.status == 200 && logReq.readyState == 4) {
        //console.log("Things change!"); //debug statement
        var logReqData = logReq.responseText;
        if (logReqData == "-1") {
          console.log("Username does not exist.");
          alert("The username entered does not exist. Try again!");
        } else if (logReqData == "0") {
          console.log("Incorrect password!");
          alert("The password entered is incorrect. Talk to your admin if you have forgotten password.");
        } else {
          console.log("Token has been received!");
          localStorage["token"] = logReqData;

          iframe = removeIframe("slidermenuiframe", "./slider.html");
          appendIframe(iframe);
          toggle();
        }
      }
    }
  }
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.todo == "logout_extension") {
    console.log("Logging out from extension.");
    iframe = removeIframe("slidermenuiframe", "./login.html");
    appendIframe(iframe);
    toggle();

    console.log("Deleting the token.");
    delete localStorage["token"];
    sendResponse("Token deleted. Logged out successfully.");
  }
});
/* login.js messages handling ends here */