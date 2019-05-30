# Rekrut
<p> Rekrut is a chrome extension that will help a person scrape a linkedin profile by visiting. Works automatically. Just visit the profile page.
</p>
<p>
The extension makes use of material design as well as my own css customizations.
This currenly a work in progress. I have so far been able to scrape headline and experience section of linkedin.</p>
<p>The code strives to not rely much on css but rather the DOM content of the page. I am scraping content by accessing sections that are supposedly going to stay with class names for a long time so if linkedin decides to change their website drastically only then will the DOM content change and that will not happen in a year or two. </p> But I will be on the lookout to change the code if circumstances call for it 

This is an unpacked extension. So you will have to go to chrome and enable developer options and select the option "Load Unpacked extension" and browse for the cloned github repo in your system.
The extension will only work on linkedin.com/in/ links i.e. the profile pages. It will not deploy on linkedin feed.
On clicking the extension icon, a slider slides in from the right of the page and automatically extracts the information. Some of the fratures and sections of page do not load unless you scroll to them. So you gotta scroll till bottom until everything loads up.

The "submit" button does not do anything right now. I am planning to link it with node.js API for sending the scraped profile data. But that will never be published here. I can make an alternate code for the submit button to store a JSON object file or something like that.
