### Group Name :
- Dynamo
### Group Members :
- Ipsit Sahoo, Sandipan De, Varad Vijay Deshmukh

This report contains the code for the Web-tier of the cloud applications.

### Member Contributions

- Ipsit has contributed to building the web-tier of the application and setting it up as an EC2 server instance.

- The Web-Tier is a NodeJS application built with Express.

### Installtion Steps

- Create an Ubuntu EC2 instance in AWS using your preferred authentication mechanism.
- Security Group: Allow-All-Traffic for version for ports 3000, 443, 80 for making ec2 act as a server.
- IAM instance profile: EC2-SQS-FullAccess
- Install NodeJS in the OS using the command (Install the latest NodeJS version)
    - sudo apt install nodejs
    - sudo apt install npm
    - node -v (check the version of node JS)
- You can directly extract the zip file in any location, preferably in the home.
- Navigate to the contents of the folder where you would see the server.js file, the entry point to our server.
- Run the command: npm install package.json to install the required packages for this application
- Use any text editor to open the file config.prod.env in config folder. Fill the following values.
    - PUSH_SQS_URI – Fill the SQS Uri to pushing image file.
    - PULL_SQS_URI – Fill in the SQS Uri for pulling the responses of classification.
    - SQS_API_VERSION – SQS API Version for AWS
    - AWS_REGION – Region in which you plan to create your resources.
- Once the details are filled run the command ‘export NODE_ENV=production’. You can save this command for the bashrc or profile for your user session on Ubuntu.
- ‘Run node server.js’ at the root of the code folder.


#### Request URL: http://0.0.0.0:3000/api/v1/files 

#### SQS Queue : 
- classify-image.fifo, classification-results.fifo 
#### S3 buckets:
- cse546-grp-dynamo-project1-image-backups,
- cse546-grp-dynamo-project1-image-filename-label