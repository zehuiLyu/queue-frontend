#Welcome! This is the Customer Service Queue System's frontend-side document
########### Description
The customer service queuing system of this project can solve the problem of the imbalance between customer service resources and demands and improve the efficiency of the customer service system and the user experience.

This project designed a web application for the API to demonstrate the specific invoking and application of the queuing system API. The realization of Web application is divided into index page, customer module and service provider module. The main page of the customer service queuing system provides the role of the user: customer or service provider. Users will be directed to their login interface after selecting based on their identity, and they can proceed with the next operation after authentication.

For the service provider, after the authentication or registration is completed on the login page, the service provider will be redirected to the main page of the service window corresponding to the service provider’s id. The service window page can display the number of customers currently waiting for the service and provide three options for service providers to receive the next customer for service, close the service and log out, and refresh the status of the waiting queue. After the service provider chooses to host the next customer, a pop-up window simulates the ongoing state of the service.

This web application also implements the process of obtaining service for customers. First, the system redirects the user to the customer's home page after authentication. On the customer home page, users could check the overview of available services and select a service to be obtained. Then, after selection, the customer enters a waiting queue for the service. This system employs the waiting interface web page to simulate the state of customer waiting. In the waiting page, the service name selected by the customer and the customer's position in the waiting queue of the service are displayed. In addition, the page also provides the options of refreshing the location information and quitting the queue to give up the service for the customers. When the customer completes the queuing process and starts the service, the system simulates the state of customer service with a pop-up window.
########### Project setup and configuration process

1. First, make sure you have NodeJS installed on your computer and can use the npm package manager to install the environment. The download address is https://nodejs.org/en/
2. Check whether the installation is successful: If the version number is displayed, the Node environment is successfully installed

       node -v
       npm -v
3. Configure the path of npm when installing global modules and the path of cache.

   Environment variables: Create a new variable named "NODE_PATH" in the system variables.

   Edit the Path in the user variable and change the Path of the corresponding npm to path, e.g. C: Program Files\nodejs\node_global
      
   For example:
               
       npm config set prefix "C:\Program Files\nodejs\node_global"
       npm config set cache "C:\Program Files\nodejs\node_cache"
4. Run the following command in CMD:
   
       npm install webpack -g
       npm webpack -v
5. Import the VUE project in IDEA (or other IDE) and run it
   
Run pre and serve in package.json in the project root directory

In default, App running at:
- Local:   http://localhost:3000/

*Notice*

The front-end Web Application can run properly only when it is run together with the back-end part. The default back-end address of this project is http://localhost:8080/queue/
  
