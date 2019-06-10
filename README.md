# Rekrut

Rekrut is a chrome extension that automatically scraps a [linkedin](www.linkedin.com) profile and can be used by recruiters of companies
to extract important details from a profile and store it in their recruitment database.  
Current version is 3.0

## Installation or Setting Up

You need to ensure that you have the following dependencies installed within your system:
* [node.js](https://nodejs.org/en/download/) : Ensure this is in path.  
* [mongodb](https://www.mongodb.com/download-center) : Ensure the mongodb is properly installed and it is accessible through shell.  

[Clone](https://github.com/DrakenWan/Rekrut/archive/master.zip) this git folder into a suitable place in your system. Extract the folder out. Go to the [testing](./testing/test) folder (It is recommended that you separate this folder from its root and place it somewhere else. It will cause overhead when you load the extension into google chrome. This is why I recommend it.).
Enter: <code>npm init</code>    
To install all the internal dependencies run:  
<code>npm install</code> (Keep pressing enter until it reaches the end of the description of the installation)  
After the package has installed itself in the [test](./testing/test) folder, type:  
<code>node test.js</code>  
>If there are some errors while running node.js please inform me promptly. They are most likely dependency error. If possible, you can see the name of missing module and type **<code>npm install _modulename_</code>**

## 3.0
Rekrut3.0 has new features added to it. Now it has a login feature and if the rekruter's (recruiter's) name is within the database then they
are able to access the extension's main feature.

### UI
The UI sucks big time. I have really
