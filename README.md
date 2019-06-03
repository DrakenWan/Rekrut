# Rekrut
<p> Rekrut is a chrome extension that will help a person scrape a linkedin profile by visiting. It works automatically. You just have to visit the profile page. 
</p>
<p>
The extension makes use of material design as well as my own css customizations.
This currenly a work in progress. So far I have scraped the profile headline area, experience and education section. These three are major information of extraction besides skillset. I will attempt to retrieve an array of skillsets soon.</p>
<p>The code strives to not rely much on css but rather the DOM content of the page. I am actually traversing through the DOM nodes rather than directly retrieving through 'css' classes or ids.
 I am scraping content by accessing sections that are supposedly going to stay with their designated class names for a long time. I feel confident that linkedin would take one or two years to change the model of their DOM content. But I will be on the lookout to change the scraping code if there is any change soon. Certain scraping functionalitites can be easily disabled by just removing their method calls if the code changes.</p>
<p>
By the way the code stats state that there 67.2% CSS involved. That is true and it sucks. Suck why? because I am still learning a lot about chrome extensions and so far I have not been able to set permissions for external urls or links to import stylesheets or scripts. I don't know yet how to work around that so I had to download the stylesheet libraries directly into the dirctory.
I hate it honestly but I had to. I will soon find a workaround though.
</p>
<p>
I keep updating the javascript files regularly since the information shared by profiles keeps varying. Some people tend to keep certain data to themselves or not fill at all. There is no absolute ideal linkedin profile that can exist as far as I've seen. I have tried to make my code as generalised as possible. Atleast till the experience section. I am still working on removing the code to extract education section and make it better.
</p>
## Using the extension
<p>
This is an unpacked extension. So you will have to go to chrome and enable developer options and select the option "Load Unpacked extension" and browse for the cloned github repo in your system.
The extension will only work on "linkedin.com/in/" links i.e. the profile pages. It will not deploy on linkedin feed.
On clicking the extension icon, a slider slides in from the right of the page and automatically extracts the information. Some of the features and sections of page do not load unless you scroll to them. So try to scroll down a bit until every information loads up.
</p>

## Existing Issues and Future Stuff
<p>
The "submit" button does not do anything right now. I am planning to link it with node.js API for sending the scraped profile data. But that will never be published on github. I can make an alternate code for the submit button to store a JSON object file or something like that
</p>
<p>
I have been unable to implement a modular system in my chrome extension. That is, I am trying to create multiple js files and share variables and functionalities between them. I have tried every possible solution (both of which I've thought and given on the internet). One last solution, I tried was to include scripts in background.html page. However, the chrome APIs stop working once I import the scripts into my content-script pages. I removed and mapped-down the entire code and reduced the number of main js files down to only three. There are three major communicating files: content.js (content script file), events.js (the file working in background. handlign all API calls) and slider.js (the js file associated with slider.html. Sending API calls to content script back and forth).
I have tried a brave attempt at making UI satisfactory but I am a bit flambuoyant and unnecessary colours might have crept in so I would love to receive some words of the wise.
</p>

## RekrutServer testing the submit code
<p>
The code has been changed a bit. When the user clicks on submit. The details will be sent to the node server with an XMLHttpRequest and the node server will process the object received and save it to the mongodb collection. </p>
<p>
You can find the <a href="./testing/RekrutServer/rekrut.js">server</a> file in the RekrutServer folder that is itself within testing folder. The file can be directly run into your cmd system. Just ensure you have node.js installed in your system and node executable is within the path. then type <code>node rekrut.js</code> within the same directory.</p>

## Sucky UI
<p>
According to me the UI sucks big time. Over time I have shifted the theme to the linkedin website. There might be some shoddy UI workmanship that would've crept in. I try my best a developer to make things better at frontend but I suck big time.
Any suggestions are welcome. I have made use of material design lite (not web components) as well as my own css customisation.
</p>