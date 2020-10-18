# APPOINTMENT BOOKING APPLICATION

This is the part of High-Level Technical Challenge.

---

FireStore Model Design: I kept it just very simple with just two fields, `slot: TimeStamp format` and `duration: number format`

Example:

    {
      events: {
        "slot": "2020-10-16T01:30:00+11:00", 
        "duration": 30
      }
    }

## Requirements

For development, you will need Node.js ( a node global package )

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      sudo apt install nodejs
      sudo apt install npm

- #### Other Operating Systems

  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v12.16.3

    $ npm --version
    6.14.5

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    npm install npm -g

---

## Installation of projects

`git clone https://github.com/Dhruv-Aga/highLevelChallenge.git`

- ## Configure Firstore

    Follow this article to start firestore instance [link](https://firebase.google.com/docs/firestore/quickstart)

- ## Configure backend

      cd highLevelChallenge/function
      npm install

  - Configuring the Database

      1. Copy the `secret.json` from the firestore in directory `highLevelChallenge/function`
      2. Copy the URL of your Database from the firestore setting into the file  `highLevelChallenge/function/index.js` at place of `databaseURL`
      ```
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://gothic-space-174111.firebaseio.com"
        });
      ```

  - Running Scripts

    - Compiles and hot-reloads for local development

        ```npm run serve```

- ## Configure frontend

      cd highLevelChallenge/frontend
      npm install
  
  - Base URL
    - Open file `frontend\src\plugins\http-common.js`
    - Change variable `firestoreInstancePart` value according to your own Firestore Instance like `PROJECT_ID/us-central1`

  - Running Scripts

    - Compiles and hot-reloads for frontend development

      ```npm run serve```

---

## Starting the projects

- Run the following commands to start frontend.

      cd highLevelChallenge/frontend
      npm run serve

- Run the following commands to start backend ( in separate terminal ).

      cd highLevelChallenge/function
      npm run serve

- You should be able to open the following URL: <http://127.0.0.1:8080/>

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
