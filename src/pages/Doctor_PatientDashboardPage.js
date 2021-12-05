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
  UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import { getColor } from 'utils/colors';
import AuthForm from '../components/AuthForm';
import _ from 'lodash';
import authToken from 'utils/authToken';
import { Redirect } from 'react-router';
import { createBrowserHistory } from 'history';


const today = new Date();
const lastWeek = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 7,
);

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
      TreatLen: 0,
      patient_list: authToken.getPatientlist(),
      patient_list_key: authToken.getPatientlist_key(),
      pid: 0
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

  Timeparse2sec(datestr){
    if(!datestr) return;
    var time = datestr.split(' ')[0];
    var hr_min_sec = time.split(':');
    return parseInt(hr_min_sec[3]) + hr_min_sec[2]*60 + hr_min_sec[1]*60*60;
  }

  goredirect(path, patient_id){
    console.log(path);
    const history = createBrowserHistory();
    history.push("/" + path + "/" + patient_id);
    window.location.reload(false);
  }

  componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);

    var self = this;
    var userinfo = authToken.getUserinfo();
    if(!userinfo) return;

    const pid = this.props.match.params.pid != -1?this.props.match.params.pid:this.state.patient_list[0]['User_ID'];
    console.log("pid:", pid);
    this.setState({
      pid: pid
    });
    console.log('this patient_list_key', this.state.patient_list_key);

    fetch('https://cxlnioef6d.execute-api.us-west-1.amazonaws.com/521_getPatientData_stage/', {
      method : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          User_ID: pid,
      })
    })
    .then(response => response.json())
    
    .then(response => {
      console.log(response)

      if (response.statusCode == 200 && response.body.state == 1) {
        var latest_dis = 0;
        var first_dis = response.body.patientdata[0]?self.Timeparse2sec(response.body.patientdata[0].Disconnected_At):{};
        var latest_state = {};
        var first_state = {};
        response.body.patientdata.forEach(function(item) {
          if(self.Timeparse2sec(item.Disconnected_At) > latest_dis){
            latest_dis = self.Timeparse2sec(item.Disconnected_At);
            latest_state = item;
          }
          if(self.Timeparse2sec(item.Disconnected_At) <= first_dis){
            first_dis = self.Timeparse2sec(item.Disconnected_At);
            first_state = item;
          }
          item.duration = self.Timeparse2sec(item.Disconnected_At) - self.Timeparse2sec(item.Connection_Start);
          if(((self.Timeparse2sec(item.Disconnected_At) - self.Timeparse2sec(item.Connection_Start))*20/5)>60*60){
            item.status = 'Overdose';
          }else if(((self.Timeparse2sec(item.Disconnected_At) - self.Timeparse2sec(item.Connection_Start))*20/5)<30*60){
            item.status = 'Duration too short';
          }else{
            item.status = 'Normal';
          }
        });
        if(response.body.patientdata.length > 0){
          self.Dsum(self.Timeparse2sec(latest_state.Disconnected_At) - self.Timeparse2sec(latest_state.Connection_Start),
            response.body.patientdata.length,
            self.Timeparse2sec(latest_state.Connection_Start),
            self.Timeparse2sec(latest_state.Disconnected_At),
            latest_state.Device_ID,
            ((self.Timeparse2sec(latest_state.Disconnected_At) - self.Timeparse2sec(first_state.Disconnected_At))/60/60/24).toFixed(2)
          );
          self.setState({PatData: response.body.patientdata});
        }
      }
      
      
    })
    .catch(err => { 
      console.log(err); 
    });

    console.log("Scanning for Patient Data.");

    
   
  }
  render() {

    var token = authToken.getToken();
    if(!token){
      return (<Redirect to="/login-modal" />);
    }

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
        title={this.state.patient_list_key && this.state.patient_list_key[this.state.pid] && this.state.patient_list_key[this.state.pid].User_Name  + "'s dashboard"}
        // breadcrumbs={[{ name: 'Dashboard', active: false }]}
      >
        
        <Row>
          <Col md={12}>
            <Card>
              <CardHeader>Actions</CardHeader>
              <CardBody>
                <UncontrolledButtonDropdown className="m-1">
                  <DropdownToggle color="primary" caret>
                    Select another patient
                  </DropdownToggle>
                  <DropdownMenu>
                    {
                    Array.isArray(this.state.patient_list) && this.state.patient_list.map(friend => {
                      return <DropdownItem disabled={this.state.pid == friend.User_ID?true:false} onClick={() => this.goredirect('doctor-patientdashboard', friend.User_ID)}>{friend.User_Name}</DropdownItem>
                    })}
                    <DropdownItem divider />
                    <DropdownItem>Close</DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
          <h3>Last Connection</h3>
          </Col>
          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Total Duration Connected (sec)"
              subtitle={"Disconnected at "+this.state.Disconnected_At}
              //number={Math.trunc(this.state.dur/60)}
              number={this.state.dur?this.state.dur:0}
              color="primary"
              progress=
              {{
                value: this.state.dur?(this.state.dur/0.12).toFixed(2):0,
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
              number={this.state.dur?this.state.dur*20:0+" ml"}
              color="info"
              progress={{
                value: this.state.dur?(this.state.dur*20/5).toFixed(2):0,
                // label: 'Last month',
              }}
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Treatment Length"
              subtitle="Total: 60 days"
              number={this.state.TreatLen?this.state.TreatLen:0+" Days"}
              color="warning"
              progress={{
                value: this.state.TreatLen?(this.state.TreatLen/0.6).toFixed(2):0,
                // label: 'Last month',
              }}
            />
          </Col>
        </Row>

        <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <h3>Patient's sessions</h3>
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
                          <td>{friend.Connection_Start}</td>
                          <td>{friend.Disconnected_At}</td>
                          <td>{friend.duration}</td>
                          <td className={friend.status == 'Normal'?"":"text-secondary"}>{friend.status}</td>
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
