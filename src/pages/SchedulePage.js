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
import AuthForm from '../components/AuthForm';
import _ from 'lodash';
import authToken from 'utils/authToken';
import { Redirect } from 'react-router';

const today = new Date();
const lastWeek = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 7,
);

class SchedulePage extends React.Component {

  constructor(props) {
    var dur = '';
    super(props);
    this.state = {
      getscheduleStatus: '',
      getscheduleResponse:{},
      schedule: false,
      week_arr: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      schedule_dates: []
    };

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
    var userinfo = authToken.getUserinfo();
    if(!userinfo) return;

    fetch('https://jldroqqp8j.execute-api.us-west-1.amazonaws.com/521_GetSchedule_Stage', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          User_ID: userinfo.User_ID,
      })
    })
    .then(response => response.json())
    .then(response => {
      this.setState({
        getscheduleResponse: response
      })
      this.state.getscheduleStatus = this.state.getscheduleResponse.statusCode;
     
      if(this.state.getscheduleStatus==200 && this.state.getscheduleResponse.body.state == 1){
        console.log("inside 200 and got deivce");
        if(this.state.getscheduleResponse.body.schedule.length >= 1){
          var schedule_dates = [];
          var day_tmp = this.state.getscheduleResponse.body.schedule[0].Start_Date*1000;
          for (var i = 0; i < this.state.getscheduleResponse.body.schedule[0].Duration; i++){
            schedule_dates.push(day_tmp);
            day_tmp += 24*60*60*1000;
          }
        }
        this.setState({
          schedule: this.state.getscheduleResponse.body.schedule,
          schedule_dates: schedule_dates
        });
        console.log('schedule_dates', this.state.schedule_dates);
      }
      else{
      }
    })
    .catch(err => { console.log(err); 
    });
  }

  render() {

    var token = authToken.getToken();
    if(!token){
      return (<Redirect to="/login-modal" />);
    }

    const primaryColor = getColor('primary');
    const secondaryColor = getColor('secondary');
    
    return (

      
      <Page
        className="SchedulePage"
        title="Treatment Calendar"
      >
        <Row>
          <Col lg="4" md="12" sm="12" xs="12">
            <InfiniteCalendar
              disabledDates={this.state.schedule_dates}
              selected={today}
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
          <Col lg={8} md={12} sm={12} xs={12}>
            {
            Array.isArray(this.state.schedule) && this.state.schedule.map((bigfriend, bidx) => {
              return <div>
                <h3>T{bidx+1} - Regimen (week)</h3>
                  <table className="table table-hover">
                  <thead>
                      <tr>
                          <th>Weekday</th>
                          <th>Time</th>
                          <th>Drug Prescribed</th>
                          <th>Doctor</th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                      Array.isArray(bigfriend.Regimen_Week) && bigfriend.Regimen_Week.map((friend, idx) => {
                          return <tr>
                              <td>{this.state.week_arr[idx]}</td>
                              <td>{friend[0] + ' - ' + friend[1]}</td>
                              <td>{bigfriend.Prescription}</td>
                              <td>Doctor 1</td>
                          </tr>
                      })}
                  </tbody>
                </table>

                <Card>
                  <CardHeader><strong>T{bidx+1} - Schedule</strong></CardHeader>
                  <CardBody>
                    <p>Start Date: <span className="text-primary">{this.Dateformat(bigfriend.Start_Date)}</span></p>
                    <p>Duration: <span className="text-primary">{bigfriend.Duration} days</span></p>
                  </CardBody>
                </Card>
              </div>
            })}
          </Col>
        </Row>
      </Page>
    );
  }
}




export default SchedulePage;
