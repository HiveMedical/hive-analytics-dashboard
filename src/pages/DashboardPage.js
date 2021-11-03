import { AnnouncementCard, TodosCard } from 'components/Card';
import HorizontalAvatarList from 'components/HorizontalAvatarList';
import MapWithBubbles from 'components/MapWithBubbles';
import Page from 'components/Page';
import ProductMedia from 'components/ProductMedia';
import SupportTicket from 'components/SupportTicket';
import UserProgressTable from 'components/UserProgressTable';
import { IconWidget, NumberWidget } from 'components/Widget';
import { getStackLineChart, stackLineChartOptions } from 'demos/chartjs';
import {
  avatarsData,
  chartjs,
  productsData,
  supportTicketsData,
  todosData,
  userProgressTableData,
} from 'demos/dashboardPage';
import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  MdBubbleChart,
  MdInsertChart,
  MdPersonPin,
  MdPieChart,
  MdRateReview,
  MdShare,
  MdShowChart,
  MdThumbUp,
} from 'react-icons/md';
import InfiniteCalendar from 'react-infinite-calendar';
import axios from 'axios'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardDeck,
  CardGroup,
  CardHeader,
  CardTitle,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from 'reactstrap';
import { getColor } from 'utils/colors';
import AuthForm from '../components/AuthForm'
import _ from 'lodash'

const today = new Date();
const lastWeek = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 7,
);

var AWS = require("aws-sdk");
AWS.config.update({
  // zebo's account
  // region: "us-west-2",
  // accessKeyId: 'AKIAU7TKSDNZY5WWCJPE',
  // secretAccessKey: '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',
  // endpoint: "https://dynamodb.us-west-2.amazonaws.com"

  // hive account [[***** MAKE SURE THE GIT REPO IS PRIVATE or THIS INFO IS IN A FILE IN .gitignore *****]]
  region: "us-west-1",
  // accessKeyId: 'AKIA6IXMBXH5J6CFK6PS',
  // secretAccessKey: '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',
  accessKeyId: 'AKIA6IXMBXH5IXXZ53UC',
  secretAccessKey: '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',
  endpoint: "https://dynamodb.us-west-1.amazonaws.com"
});

var DuraSum='' ;
var count = 0;
class DashboardPage extends React.Component {

  constructor(props) {
    var dur = '';
    super(props);
    this.state = {
      PatData: [],
      dur: '',
      concount: 0,
      Connection_Start: 0,
      Disconnected_At: 0,
      Device_ID: '',
      TreatLen: 0
    };

  }

  Dsum(duration,connection_count,Connection_Start,Disconnected_At,Device_ID,len){
    this.setState({
      dur: duration,
      concount: connection_count,
      Connection_Start: Connection_Start,
      Disconnected_At: Disconnected_At,
      Device_ID: Device_ID,
      TreatLen: len
    });
  }

  Dateformat(ts){
    var t = new Date(ts * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var formatted = months[t.getMonth()] + ' ' + ('0' + t.getDate()).slice(-2) + ', ' + ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2);
    return formatted;
  }

  componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);

    var self = this;

    // let userDataURL = "https://pv9z9cd9b0.execute-api.us-west-1.amazonaws.com/Prod/getdata"
    // const userName = AuthForm.defaultProps.usernameInputProps.inputvalue
    // fetch(userDataURL += '?' + 'userName='+ userName.toString(), {
    //   "method": "GET"
    // })
    // .then(response => response.json())
    // .then(response => {
    //   this.setState({
    //     PatData: response
    //   })
    //   this.state.PatData.map(object => {
    //     DuraSum = +DuraSum + +object.Duration;
    //     count++;
    //   })
    //   this.Dsum(DuraSum,count);

    // })
    // .catch(err => { console.log(err); 
    // });

    var docClient = new AWS.DynamoDB.DocumentClient();

    console.log("Scanning for Patient Data.");

    var params = {
        TableName : "521_Patient_Data",
        ProjectionExpression: "#user, Connection_Start, Device_ID, Device_Name, Disconnected_At",
        FilterExpression: "#user = :userid",
        ExpressionAttributeNames:{
            "#user": "User_ID"
        },
        ExpressionAttributeValues: {
            ":userid": "1",
        }
    };

    var onScan = function(err, data) {
      if (err) {
          console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("Scan succeeded.");
          var latest_dis = 0;
          var first_dis = data.Items[0]?data.Items[0].Disconnected_At:{};
          var latest_state = {};
          var first_state = {};
          data.Items.forEach(function(item) {
            if(item.Disconnected_At > latest_dis){
              latest_dis = item.Disconnected_At;
              latest_state = item;
            }
            if(item.Disconnected_At <= first_dis){
              first_dis = item.Disconnected_At;
              first_state = item;
            }
            item.duration = item.Disconnected_At - item.Connection_Start;
          });
          self.Dsum(latest_state.Disconnected_At - latest_state.Connection_Start,
            data.Items.length,
            latest_state.Connection_Start,
            latest_state.Disconnected_At,
            latest_state.Device_ID,
            ((Date.now()/1000 - first_state.Disconnected_At)/60/60/24).toFixed(2)
          );
          self.setState({PatData: data.Items});

          // continue scanning if we have more items
          // scan can retrieve a maximum of 1MB of data
          if (typeof data.LastEvaluatedKey != "undefined") {
              console.log("Scanning for more...");
              params.ExclusiveStartKey = data.LastEvaluatedKey;
              docClient.scan(params, onScan);
          }
      }
    };

    docClient.scan(params, onScan);
   
  }
  render() {
    const primaryColor = getColor('primary');
    const secondaryColor = getColor('secondary'); 
    console.log("Dur", this.state.dur);
    const pd = this.state.PatData;
    let pd_sorted = _.orderBy(pd, ['Disconnected_At'],'desc');
    console.log("Authform:",AuthForm.defaultProps)
    console.log('pd_sorted',pd_sorted)
    
    return (

      
      <Page
        className="DashboardPage"
        title="Last Connection"
        // breadcrumbs={[{ name: 'Dashboard', active: false }]}
      >
        <Row>

        
          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Total Duration Connected (sec)"
              subtitle={"Disconnected at "+this.Dateformat(this.state.Disconnected_At)}
              //number={Math.trunc(this.state.dur/60)}
              number={this.state.dur}
              color="primary"
              progress=
              {{
                value: (this.state.dur/0.12).toFixed(2),
                // label: 'Last month',
              }}
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Number of Medication Sessions"
              subtitle="Total: 30"
              number={this.state.concount}
              color="secondary"
              progress={{
                value: (this.state.concount/0.3).toFixed(2),
                // label: 'Last month',
              }}
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Estimated Drug Intake"
              subtitle="Total: 500 ml"
              number={this.state.dur*20+" ml"}
              color="info"
              progress={{
                value: (this.state.dur*20/5).toFixed(2),
                // label: 'Last month',
              }}
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Treatment Length"
              subtitle="Total: 60 days"
              number={this.state.TreatLen+" Days"}
              color="warning"
              progress={{
                value: (this.state.TreatLen/0.6).toFixed(2),
                // label: 'Last month',
              }}
            />
          </Col>
        </Row>
{/* 
        <Row>
          <Col lg="8" md="12" sm="12" xs="12">
            <Card>
              <CardHeader>
                Drug Adherence Chart{' '}
                <small className="text-muted text-capitalize">This year</small>
              </CardHeader>
              <CardBody>
                <Line data={chartjs.line.data} options={chartjs.line.options} />
              </CardBody>
            </Card>
          </Col>

          <Col lg="4" md="12" sm="12" xs="12">
            <Card>
              <CardHeader>Total Expense</CardHeader>
              <CardBody>
                <Bar data={chartjs.bar.data} options={chartjs.bar.options} />
              </CardBody>
              <ListGroup flush>
                <ListGroupItem>
                  <MdInsertChart size={25} color={primaryColor} /> Cost of sales{' '}
                  <Badge color="secondary">$3000</Badge>
                </ListGroupItem>
                <ListGroupItem>
                  <MdBubbleChart size={25} color={primaryColor} /> Management
                  costs <Badge color="secondary">$1200</Badge>
                </ListGroupItem>
                <ListGroupItem>
                  <MdShowChart size={25} color={primaryColor} /> Financial costs{' '}
                  <Badge color="secondary">$800</Badge>
                </ListGroupItem>
                <ListGroupItem>
                  <MdPieChart size={25} color={primaryColor} /> Other operating
                  costs <Badge color="secondary">$2400</Badge>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row> */}

        {/* <CardGroup style={{ marginBottom: '1rem' }}>
          <IconWidget
            bgColor="white"
            inverse={false}
            icon={MdThumbUp}
            title="50+ Likes"
            subtitle="People you like"
          />
          <IconWidget
            bgColor="white"
            inverse={false}
            icon={MdRateReview}
            title="10+ Reviews"
            subtitle="New Reviews"
          />
          <IconWidget
            bgColor="white"
            inverse={false}
            icon={MdShare}
            title="30+ Shares"
            subtitle="New Shares"
          />
        </CardGroup> */}

        {/* <Row>
          <Col md="6" sm="12" xs="12">
            <Card>
              <CardHeader>New Products</CardHeader>
              <CardBody>
                {productsData.map(
                  ({ id, image, title, description, right }) => (
                    <ProductMedia
                      key={id}
                      image={image}
                      title={title}
                      description={description}
                      right={right}
                    />
                  ),
                )}
              </CardBody>
            </Card>
          </Col>

          <Col md="6" sm="12" xs="12">
            <Card>
              <CardHeader>New Users</CardHeader>
              <CardBody>
                <UserProgressTable
                  headers={[
                    <MdPersonPin size={25} />,
                    'name',
                    'date',
                    'participation',
                    '%',
                  ]}
                  usersData={userProgressTableData}
                />
              </CardBody>
            </Card>
          </Col>
        </Row> */}

        {/* <Row>
          <Col lg={4} md={4} sm={12} xs={12}>
            <Card>
              <Line
                data={getStackLineChart({
                  labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                  ],
                  data: [0, 13000, 5000, 24000, 16000, 25000, 10000],
                })}
                options={stackLineChartOptions}
              />
              <CardBody
                className="text-primary"
                style={{ position: 'absolute' }}
              >
                <CardTitle>
                  <MdInsertChart /> Sales
                </CardTitle>
              </CardBody>
            </Card>
          </Col>

          <Col lg={4} md={4} sm={12} xs={12}>
            <Card>
              <Line
                data={getStackLineChart({
                  labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                  ],
                  data: [10000, 15000, 5000, 10000, 5000, 10000, 10000],
                })}
                options={stackLineChartOptions}
              />
              <CardBody
                className="text-primary"
                style={{ position: 'absolute' }}
              >
                <CardTitle>
                  <MdInsertChart /> Revenue
                </CardTitle>
              </CardBody>
            </Card>
          </Col>
          <Col lg={4} md={4} sm={12} xs={12}>
            <Card>
              <Line
                data={getStackLineChart({
                  labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                  ],
                  data: [0, 13000, 5000, 24000, 16000, 25000, 10000].reverse(),
                })}
                options={stackLineChartOptions}
              />
              <CardBody
                className="text-primary"
                style={{ position: 'absolute', right: 0 }}
              >
                <CardTitle>
                  <MdInsertChart /> Profit
                </CardTitle>
              </CardBody>
            </Card>
          </Col>
        </Row> */}

        {/* <Row>
          <Col lg="4" md="12" sm="12" xs="12">
            <InfiniteCalendar
              selected={today}
              minDate={lastWeek}
              width="100%"
              theme={{
                accentColor: primaryColor,
                floatingNav: {
                  background: secondaryColor,
                  chevron: primaryColor,
                  color: '#FFF',
                },
                headerColor: primaryColor,
                selectionColor: secondaryColor,
                textColor: {
                  active: '#FFF',
                  default: '#333',
                },
                todayColor: secondaryColor,
                weekdayColor: primaryColor,
              }}
            />
          </Col>

          <Col lg="8" md="12" sm="12" xs="12">
            <Card inverse className="bg-gradient-primary">
              <CardHeader className="bg-gradient-primary">
                Map with bubbles
              </CardHeader>
              <CardBody>
                <MapWithBubbles />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <CardDeck style={{ marginBottom: '1rem' }}>
          <Card body style={{ overflowX: 'auto','paddingBottom':'15px','height': 'fit-content','paddingTop': 'inherit'}}>
            <HorizontalAvatarList
              avatars={avatarsData}
              avatarProps={{ size: 50 }}
            />
          </Card>

          <Card body style={{ overflowX: 'auto','paddingBottom':'15px','height': 'fit-content','paddingTop': 'inherit'}}>
            <HorizontalAvatarList
              avatars={avatarsData}
              avatarProps={{ size: 50 }}
              reversed
            />
          </Card>
        </CardDeck>

        <Row>
          <Col lg="4" md="12" sm="12" xs="12">
            <AnnouncementCard
              color="gradient-secondary"
              header="Announcement"
              avatarSize={60}
              name="Jamy"
              date="1 hour ago"
              text="Lorem ipsum dolor sit amet,consectetuer edipiscing elit,sed diam nonummy euismod tinciduntut laoreet doloremagna"
              buttonProps={{
                children: 'show',
              }}
              style={{ height: 500 }}
            />
          </Col>

          <Col lg="4" md="12" sm="12" xs="12">
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Support Tickets</span>
                  <Button>
                    <small>View All</small>
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {supportTicketsData.map(supportTicket => (
                  <SupportTicket key={supportTicket.id} {...supportTicket} />
                ))}
              </CardBody>
            </Card>
          </Col>

          <Col lg="4" md="12" sm="12" xs="12">
            <TodosCard todos={todosData} />
          </Col> */}
        <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <h3>Sessions</h3>
          <table className="table table-hover">
              <thead>
                  <tr>
                      <th>Device</th>
                      <th>Connection Start</th>
                      <th>Connection Stop</th>
                      <th>Duration (s)</th>
                      <th>Status</th>
                  </tr>
              </thead>
              <tbody>
                  {
                  Array.isArray(pd_sorted) && pd_sorted.map(friend => {
                      return <tr key={friend.ts}>
                          <td>{friend.Device_Name?friend.Device_Name:friend.Device_ID}</td>
                          <td>{this.Dateformat(friend.Connection_Start)}</td>
                          <td>{this.Dateformat(friend.Disconnected_At)}</td>
                          <td>{friend.duration}</td>
                          <td className={(this.state.dur*20/5)>550?"text-secondary":""}>{(this.state.dur*20/5)>550?"Overdose":"Normal"}</td>
                      </tr>
                  })}
              </tbody>
            </table>
          </Col>
        </Row>
      </Page>
    );
  }
}




export default DashboardPage;
