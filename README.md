# Rekrut

Rekrut is a chrome extension that automatically scraps a [linkedin](www.linkedin.com) profile and can be used by recruiters of companies
to extract important details from a profile and store it in their recruitment database.  
Current version is 3.0

## Installation or Setting Up

**_Before you do anything, please take out the testing folder out of the root folder into some safe space. This is where your server code is. It contains sensitive files such as certificate key, models, etc._**

You need to ensure that you have the following dependencies installed within your system:
* [node.js](https://nodejs.org/en/download/) : Ensure this is in path.  
* [mongodb](https://www.mongodb.com/download-center) : Ensure the mongodb is properly installed and it is accessible through shell.  

1. [Clone](https://github.com/DrakenWan/Rekrut/archive/master.zip) this git folder into a suitable place in your system. Extract the folder out. Go to the [testing](./testing/test) folder (It is recommended that you separate this folder from its root and place it somewhere else. It will cause overhead when you load the extension into google chrome. This is why I recommend it.).
2. Enter: <code>npm init</code>  
  To install all the internal dependencies run:  
  <code>npm install</code> (Keep pressing enter until it reaches the end of the description of the installation)  
  After the package has installed itself in the [test](./testing/test) folder, type:  
  <code>node test.js</code>  
  >If there are some errors while running node.js please inform me promptly. They are most likely dependency error. If possible, you can see the name of missing module and type **<code>npm install _modulename_</code>**  
3. Now that your server is running, ensure that your mongodb server is running in the background. It must be running by default (it runs on startup of PC).  
4. Open chrome browser. Type <code>chrome://extensions</code>. Turn on `developer mode`. Click on the button `Load unpacked extension`. Browse the Rekrut-master folder and select it. The extension is installed within your system.

> The extension will only work on [linkedin.com](https://www.linkedin.com) and only extract viable information from [linkedin.com/in/{profileurl}](https://www.linkedin.com/feed) pages. You will also need to login first.  

### Registering your own details of authentication
You can register yourself using the <code>signup_user.js</code> file. This will check if the username already exists in the database or not. If it doesn't then you can successfully login. Say you want to signup with username "drakenwan" and password "ilikecupcakes". Then type:  
<code>node signup_user.js drakenwan ilikecupcakes</code>.  
There should not be any spaces in username or password. Your details will store in database but your unique `token` won't be generated.  
Go back to chrome. Login with your registered details. The browser will check if you have the unique `token` if not then it will authenticate ur details if they are authenticated then your unique token will be stored in browser and you will stay logged in until you erase browser memory or cookies.

> The extension will only authenticate your login details if the server file <code> test.js </code> is running in the background. If you have your own server then I suggest you change certain parameters within <code> testing </code> folder files as well as <code> extension folder </code>. You can find the constant variable like <code> SERVER_URL </code> or just <code> SERVER </code> in the files and change the link to your own server's. Transfer the express code from the testing folder files or create your own to serve the middleware of your serve if you are using a different framework.

## 3.1
Rekrut3.1 has new features added to it. Now it has a login feature and if the rekruter's (recruiter's) name is within the database only then they
are able to access the extension's main feature. The details are stored in the database without any failure.  
Small bugs were removed.  
* _3.1.2_  
  Feature to logout the user has been added. _3.1.2_

* _3.1.3_  
  Security issues resolved.

* _3.1.4_
  OpenSSL certificate added into the server. The extension will work over https now. (It will not work on any other IP host other than 'localhost' possibly due to my invalidated certificate on browser.)
  > **Note:** The certificate will be invalidated by browser because I, as an issuer, am not valid.
  If you have certificates from appropriate authorities such as comodo, symantec, etc. then you can deploy the certificate into the server folder with its key. Just little changes needed to be made to the <code> test.js </code> file for certification. Add the object <code> {key: fs.readFileSync('yourkeyfilename'), cert: fs.readFileSync('yourcertificatefilename'), passphrase: yourpassphrase} </code> at <code> **|1|** </code> in the code: <code> https.createServer( |1|, app).listen(3000) </code>. This will work if you have the valid certificate. 
  Then you can change the HOST name in the content.js file of extension and reload the extension it will work fine.

### UI
The UI generated by me sucks big time. Although aesthetically it looks okay but UX is still lacking. If anyone can help me with such please do feel free to [contact](mailto:kartikaykaul13@gmail.com). I have implemented some features of material design and my own CSS customizations.


## Future
I am thinking of merging the loginform and extaction form together into one page and mediate between them to reduce the 'communication' overhead and certain possible security issues. Don't fret. The security issues that are possible are quite minor and they have low chances to occur but can't take risks.
