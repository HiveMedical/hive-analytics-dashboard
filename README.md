# [React Reduction - Free Admin Template Built with React and Bootstrap4](https://reduction-admin.github.io/react-reduction/)


## Preview

You can check out [live preview of Hive](https://obscure-forest-81707.herokuapp.com/).

## Quick Start

1.  Clone the repo `git clone https://github.com/hellboy95/react-reduction.git`
2.  Go to your project folder from your terminal
3.  Run: `npm install` or `yarn install`
4.  After install, run: `npm run start` or `yarn start`
5.  It will open your browser(http://localhost:3000)


## Branch zebo-521

Branch Name: zebo-521

### Important files:

Dashboard Page: src/pages/DashboardPage.js
Device Page:    src/pages/CardPage.js
Login:          src/pages/AuthModalPage.js
Sign-in/up:     src/components/AuthForm.js
Header:         src/components/Layout/Header.js
Sidebar:        src/components/Layout/Sidebar.js
Token API:      src/utils/authToken.js

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
	a) Create DynamoDB table if no existing table is suitable (https://us-west-1.console.aws.amazon.com/dynamodbv2/home?region=us-west-1#tables)
	b) Open AWS Lambda (https://us-west-1.console.aws.amazon.com/lambda/home?region=us-west-1#/discover)
	c) Create function if no existing Lambda function is suitable (Select Author from scratch)
	d) Go to Configuration -> Permissions -> Change the Execution role to `521_token-role-keueolcf` (or change it when creating function)
	e) Go to Code -> Copy code from other Lambda function with `521_` prefix
	f) Manipulate with database (Query/Scan/Insert/Update) and return response (Should comform to API format specified below)
	g) Test until it works as you desire
	h) Check database if it reflects what your code does
5.  Setup AWS API (Please see APIs with `521_` prefix as examples)
	a) Open AWS API Gateway (https://us-west-1.console.aws.amazon.com/apigateway/main/apis?region=us-west-1)
	b) Create API if no existing API is suitable (Select REST API with complete control. Select the Lambda function created from above)
	c) Action -> Create Method -> ANY
	d) This step is only for CORS (can skip if request from the same domain):
		d.i)   Method Response -> 200 -> Add header names: `Access-Control-Allow-Headers`, `Access-Control-Allow-Methods` and `Access-Control-Allow-Origin`
		d.ii)  Integration Response -> 200 -> Header Mappings -> Add header values: `'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'`, `'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'` and `'*'`
		d.iii) Action -> Enable CORS
	e) Deploy API
	f) Create a stage or use an exsitin stage
	g) The `Invoke URL` is your API entry
6.  Request to the API by the `fetch` function (e.g., the `fetch` statements inside `componentDidMount` of CardPage.js)
7.  Do whatever is needed in the `response` handler function (e.g., the `then(response => {` statements inside `componentDidMount` of CardPage.js)

### API format
`
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
`

### If user login verification is needed (for authorized pages)

1.  Import the below modules
`
import authToken from 'utils/authToken';
import { Redirect } from 'react-router';
`

2.  Add the below code to the very beginning of the `render` function
`
var token = authToken.getToken();
if(!token){
  return (<Redirect to="/login-modal" />);
}
`