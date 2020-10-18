# SE Tools

This are range of tools which will facilitate the development and growth of any product.

---

## Requirements

For development, you will need Node.js ( a node global package ), Couchbase Server installed in your environement.

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

### Couchbase Server

  Just go on [official Couchbase website](https://www.couchbase.com/downloads) and download the installer.

- #### Couchbase installation on Windows

  1. Download the appropriate package from the Couchbase downloads page.

  2. In File Explorer, locate the downloaded Couchbase Server .msi file
      (typically located in the default \Downloads folder for the current user) and double-click it.
      This will open the Couchbase Server Setup Wizard.

  3. From the Welcome screen, click Next to start configuring the installation.

  4. On the License Agreement screen, make sure to read the entire End-User License Agreement.

  5. If you accept the license agreement, check the box next to I accept the terms in the License Agreement.

  6. Click Next to continue.

  7. On the Destination Folder screen, choose the folder where you want the Couchbase Server application to be installed.
  
      You can change the folder by clicking the Change…​ button, or click Next to use the default folder.

      The destination folder will only contain the Couchbase Server application.
      Couchbase Server stores database files and other persistent data in C:\Program Files\Couchbase.
      Enterprise Edition: On the IP Version Selection screen, you can choose to configure Couchbase Server to use IPv6.

  8. Unless you’re sure that you need to use IPv6, you should keep the default configuration (IPv4).
      Refer to the IPv6 documentation for more information.

  9. Click Next to continue.

  Once you’re ready, click Install to begin the installation.

- #### Couchbase installation on Ubuntu

    $ node --version
    v12.16.3

    $ npm --version
    6.14.5

    $ sudo apt-get update

    $ sudo dpkg -i ./package-name.deb

> If the installation was successful, you should be able to open the following URL : <http://127.0.0.1:8091/>
> Now visit doc for create a new cluster for [Couchbase Server](https://docs.couchbase.com/server/current/manage/manage-nodes/create-cluster.html)
> Once this is done, you should have window opened like
    ![alt](https://docs.couchbase.com/server/current/manage/_images/manage-nodes/dashboard01.png)

- #### [Create bucket](https://docs.couchbase.com/server/current/manage/manage-buckets/create-bucket.html) for our project

  1. Go to bucket option from Side Navigation Menu
  2. To create a new bucket, left-click on the Add Bucket button, at the upper-right
  3. This brings up the Add Data Bucket dialog, use **users** as the name of bucket
  4. Now, go to **Query** option from Side Navigation Menu. Run the below query.

      ``` CREATE PRIMARY INDEX index_primary_id ON `users` ```

---

## Installation of projects

`
git clone https://gitlab.com/se-tools/se-apps.git
`

- ## Configure backend

    $ cd se-apps/backend
    $ npm install

  - Configuring the Database

      1. Open the file `se-apps/backend/bin/db.js`
      2. Set the value for **username** and **password**

        module.exports.cluster = new couchbase.Cluster('couchbase://127.0.0.1', {
          username: 'application',
          password: 'password'
        })

  - Running Scripts

    - Compiles and hot-reloads for development

        ```npm run dev```

    - Compiles and minifies for production

        ```npm run build```

    - Lints and fixes files

        ```npm run lint```

- ## Configure frontend

      cd se-apps/frontend
      npm install

  - Running Scripts

    - Compiles and hot-reloads for frontend development

      ```npm run serve```

    - Compiles and minifies for frontend production

      ```npm run build```

    - Lints and fixes files for frontend

      ```npm run lint```

---

## Starting the projects

- Run the following commands to start frontend.

      cd se-apps/frontend
      npm run serve

- Run the following commands to start backend ( in separate terminal ).

      cd se-apps/backend
      npm run dev

- You should be able to open the following URL: <http://127.0.0.1:8080/>

- To login/sign-up go to this URL: <http://127.0.0.1:8080/login/>

- Go to **Sign Up** Tab to create new user:

    > 1. Enter the required details and click on SIGN UP button. This will login you but you will not able to access any thing.
    > 2. Open the database using url <http://127.0.0.1:8091/> and login it using the username & password.
    > 3. Go to your **users bucket** and click on doc <http://127.0.0.1:8091/> and login it using the username & password.
    > 4. Go to bucket option from Side Navigation Menu and then select **users bucket**, then click on the Document button
    > 5. Go to the New Document Created and click on edit button (Pencil Icon) and then just add the roles as needed

    **Note:** To check different Roles visit file 'se-tools/backend/apps/common/constants/roles.js'

        Example: Before the change

        {
          "localId": "...",
          "name": "Dhruv Agarwal",
          "email": "abc@gmai.in",
          "confidential": {
            "password": "..."
          }
        }
        
        Example: After the change

        {
          "localId": "...",
          "name": "Dhruv Agarwal",
          "email": "abc@gmail.in",
          "confidential": {
            "password": "..."
          },
          "roles": [
              "DEVELOPER", ...
            ]
        }

    Once this all is done just logout and login again to refresh the roles assigned

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
