# [React Reduction - Free Admin Template Built with React and Bootstrap4](https://reduction-admin.github.io/react-reduction/)


## Preview

You can check out [live preview of HIVE](https://obscure-forest-81707.herokuapp.com/).

## Quick Start

1.  Clone the repo `git clone https://github.com/hellboy95/react-reduction.git`
2.  Go to your project folder from your terminal
3.  Run: `npm install` or `yarn install`
4.  After install, run: `npm run start` or `yarn start`
5.  It will open your browser(http://localhost:3000)


## Branch zebo-521

Branch Name: zebo-521

### Important files:

1.  Dashboard Page: src/pages/DashboardPage.js
2.  Device Page: src/pages/CardPage.js
3.  Login: src/pages/AuthModalPage.js
4.  Sign-in/up: src/components/AuthForm.js
5.  Header: src/components/Layout/Header.js
6.  Sidebar: src/components/Layout/Sidebar.js
7.  Token API: src/utils/authToken.js

### AWS users/roles (IAM):

1.  database user: 521_ddb_user
2.  API role for accessing database: 521_token-role-keueolcf
3.  AWS IoT Rule role: 521_pd_ddb_role

### Structure:

react-reduction -> AWS API Gateway -> Lambda -> DynamoDB

### Small tutorial on adding database-related features

1.  Find the page file where the feature is going to be. (e.g., CardPage.js)
2.  Add UI (HTML) to the return content of the `render` function
3.  Add backend code to the `componentDidMount` function (data that is rendered on the webpage should be in `this.state` of the class)
4.  Setup Lamda function (Please see Lamda functions with `521_` prefix as examples)
    1.  Create DynamoDB table if no existing table is suitable (https://us-west-1.console.aws.amazon.com/dynamodbv2/home?region=us-west-1#tables)
    2.  Open AWS Lambda (https://us-west-1.console.aws.amazon.com/lambda/home?region=us-west-1#/discover)
    3.  Create function if no existing Lambda function is suitable (Select Author from scratch)
    4.  Go to Configuration -> Permissions -> Change the Execution role to `521_token-role-keueolcf` (or change it when creating function)
    5.  Go to Code -> Copy code from other Lambda function with `521_` prefix
    6.  Manipulate with database (Query/Scan/Insert/Update) and return response (Should comform to API format specified below)
    7.  Test until it works as you desire
    8.  Check database if it reflects what your code does
5.  Setup AWS API (Please see APIs with `521_` prefix as examples)
    1.  Open AWS API Gateway (https://us-west-1.console.aws.amazon.com/apigateway/main/apis?region=us-west-1)
    2.  Create API if no existing API is suitable (Select REST API with complete control. Select the Lambda function created from above)
    3.  Action -> Create Method -> ANY
    4.  This step is only for CORS (can skip if request from the same domain):
        1.  Method Response -> 200 -> Add header names: `Access-Control-Allow-Headers`, `Access-Control-Allow-Methods` and `Access-Control-Allow-Origin`
        2.  Integration Response -> 200 -> Header Mappings -> Add header values: `'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'`, `'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'` and `'*'`
        3.  Action -> Enable CORS
    5.  Deploy API
    6.  Create a stage or use an exsitin stage
    7.  The `Invoke URL` is your API entry
6.  Request to the API by the `fetch` function (e.g., the `fetch` statements inside `componentDidMount` of CardPage.js)
7.  Do whatever is needed in the `response` handler function (e.g., the `then(response => {` statements inside `componentDidMount` of CardPage.js)

### API format

    {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT"
        },
        "body": {
            "state": 1, # 1: manipulate database success, -1: fail
            "[[data]]": # [] or {}
        }
    }


### If user login verification is needed (for authorized pages)

1.  Import the below modules

    import authToken from 'utils/authToken';
    import { Redirect } from 'react-router';

2.  Add the below code to the very beginning of the `render` function

    var token = authToken.getToken();
    if(!token){
        return (<Redirect to="/login-modal" />);
    }


### Things needed to be taken care of before release

1.  API authentication
    
    Make a token verification function for API requests, so that only signed-in users with a token will have correct response.

2.  Password Hash in sign-up lambda

    hash(pw, salt)

3.  Doctor role verification for url access

    Now a patient with a doctor-view url actually can access a doctor-view page. Should add a doctor role verification to the doctor-view pages. Adding that is similar to adding login verification.
