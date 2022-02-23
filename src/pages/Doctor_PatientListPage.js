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
  CardImg,
  CardHeader,
  CardTitle,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown
} from 'reactstrap';
import { getColor } from 'utils/colors';
import AuthForm from '../components/AuthForm';
import _ from 'lodash';
import authToken from 'utils/authToken';
import { Redirect } from 'react-router';
import { createBrowserHistory } from 'history';
import xImage from 'assets/img/table/xMark1.png';
import checkImage from 'assets/img/table/checkMark1.png';

const today = new Date();
const lastWeek = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 7,
);

var DuraSum='' ;
var count = 0;
class Doctor_PatientListPage extends React.Component {

  constructor(props) {
    var dur = '';
    super(props);
    this.state = {
      modal: false,
      modal_backdrop: false,
      modal_nested_parent: false,
      modal_nested: false,
      backdrop: true,
      getpatientStatus: '',
      getpatientResponse:{},
      getpatientmetricsresponse: {},
      patient_list: [],
      patient_metric_list: [],
      current_patient: {}
    };

  }

  Timeparse2sec(datestr){
    if(!datestr) return;
    var time = datestr.split(' ')[0];
    var hr_min_sec = time.split(':');
    return parseInt(hr_min_sec[3]) + hr_min_sec[2]*60 + hr_min_sec[1]*60*60;
  }

  Dateformat(ts){
    var t = new Date(ts * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var formatted = months[t.getMonth()] + ' ' + ('0' + t.getDate()).slice(-2) + ', ' + ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2);
    return formatted;
  }

  Timeformat(totalSeconds){
    var hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    
    var result = seconds + " s";
    if(minutes > 0){
      result = minutes + " mins " + result;
    }
    if(hours > 0) {
      result = hours + " hour " + result;
    }
    return result;
  }

  HistoryTruncate(sessionHistory){
    if(sessionHistory.length>0) {
      sessionHistory.length = 5
  }
    return sessionHistory;
  }

  toggle = (modalType, label, cp) => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });

    if(label === 0 || label === 1){
      this.setLabel(label);
    }

    if(cp){
      this.setState({
        current_patient: cp
      });
    }
  }

  setLabel(label){
    console.log('set label', label);
    fetch('https://9inazs7xog.execute-api.us-west-1.amazonaws.com/521_SetLabel_Stage', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          User_ID: this.state.current_patient.User_ID,
          Label: label,
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response.body.state == 1){
        console.log('set label success');
      }
      else{
      }
    })
    .catch(err => { console.log(err); 
    });
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

    fetch('https://wmqijpg48g.execute-api.us-west-1.amazonaws.com/521_GetPatient_Stage', {
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
        getpatientResponse: response
      })
      this.state.getpatientStatus = this.state.getpatientResponse.statusCode;
     
      if(this.state.getpatientStatus==200 && this.state.getpatientResponse.body.state == 1){
        this.setState({
          patient_list: this.state.getpatientResponse.body.patientinfo
        });
        console.log('patient_list', this.state.patient_list);
        authToken.storePatientlist(this.state.patient_list);
        authToken.storePatientlist_key(this.state.patient_list);
      }
      else{
      }
    })
    .catch(err => { console.log(err); 
    });

    fetch('https://wmqijpg48g.execute-api.us-west-1.amazonaws.com/521_GetPatient_Stage', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          User_ID: userinfo.User_ID,
          Metrics_Data: true
      })
    })
    .then(response => response.json())
    .then(response => {
      this.setState({
        getpatientmetricsresponse: response
      })
      this.state.getpatientStatus = this.state.getpatientmetricsresponse.statusCode;
     
      if(this.state.getpatientStatus==200 && this.state.getpatientmetricsresponse.body.state == 1){
        this.setState({
          patient_metric_list: this.state.getpatientmetricsresponse.body.patientinfo
        });
        console.log('patient_metric_list', this.state.patient_metric_list);
        // authToken.storePatientlist(this.state.patient_list);
        // authToken.storePatientlist_key(this.state.patient_list);
      }
      else{
      }
    })
    .catch(err => { console.log(err); 
    });
   
   
  }
  render() {

    var token = authToken.getToken();
    var userinfo = authToken.getUserinfo();
    if(!token){
      return (<Redirect to="/login-modal" />);
    }
    if(userinfo.Role == 0){
      return (<Redirect to="/dashboard" />);
    }

    // Get the session History array
    var sessionHistory = this.state.patient_metric_list.sessionHistory
    console.log("sessionHistory", sessionHistory)

    const primaryColor = getColor('primary');
    const secondaryColor = getColor('secondary'); 
    
    return (

      
      <Page
        className="DashboardPage"
        title="My Patients"
        // breadcrumbs={[{ name: 'Dashboard', active: false }]}
      >
        <Row>
        <Col lg={12} md={12} sm={12} xs={12}>
          <table className="table table-hover">
              <thead>
                  <tr className="align-middle text-center">
                      <th>User ID</th>
                      <th>User Name</th>
                      <th>Prescribed Drug</th>
                      <th>Total Duration</th>
                      <th>Valid / Total Session</th>
                      <th>Session History</th>
                      <th>Action</th>
                  </tr>
              </thead>
              <tbody>
                  {
                  Array.isArray(this.state.patient_metric_list) && this.state.patient_metric_list.map(friend => {
                      return <tr className="text-center" key={friend.ts}>
                          <td>{friend.User_ID}</td>
                          <td>{friend.User_Name}</td>
                          <td>{friend.Prescription_Drug}</td>
                          <td>{this.Timeformat(friend.Total_Duration_Connected)}</td>
                          <td>{friend.Number_Of_Valid_Session+'/'+friend.Number_Of_Total_Session}</td>
                          {/* <td>{this.HistoryVisualize(friend.Session_History)}</td> */}
                          <td><Card className="flex-row">
                                {this.HistoryTruncate(friend.Session_History).map(record => { 
                                  return <CardImg
                                      className="card-img-left"
                                      src={record?checkImage:xImage}
                                      style={{ width: 'auto', height: 20 }}
                                      />
                                })}
                              </Card>
                          </td>
                          <td>
                            <ButtonGroup>
                              <UncontrolledButtonDropdown>
                                <DropdownToggle color="primary" caret>Action</DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem onClick={this.toggle('backdrop', null, friend)}>Label</DropdownItem>
                                  <DropdownItem onClick={() => this.goredirect('doctor-patientdashboard', friend.User_ID)}>Dashboard</DropdownItem>
                                  <DropdownItem onClick={() => this.goredirect('doctor-devicelist', friend.User_ID)}>Device</DropdownItem>
                                  <DropdownItem>Edit</DropdownItem>
                                </DropdownMenu>
                              </UncontrolledButtonDropdown>
                            </ButtonGroup>
                          </td>
                      </tr>
                  })}
              </tbody>
            </table>
            <Modal
              isOpen={this.state.modal_backdrop}
              toggle={this.toggle('backdrop')}
              backdrop={this.state.backdrop}>
              <ModalHeader toggle={this.toggle('backdrop')}>
                Label Patient - <i>{this.state.current_patient.User_Name}</i>
              </ModalHeader>
              <ModalBody>
                <p className="text-primary"><MdBubbleChart size={25} color={primaryColor} /> Is this patient doing good with self-treatments?</p>
                <p>This is for future training on the automatic classification of "is a patient suitable for self-treatment?", which will affect the recommendation of OPAT for potential patients.</p>
                <p className="text-muted">The patient will not see the label.</p>
                <p>Current Label: {' '}
                  <Badge color={this.state.current_patient.Label==1?'success':'secondary'}>
                    {this.state.current_patient.Label==1?'Yes':'No'}
                  </Badge>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="success" onClick={this.toggle('backdrop', 1)}>
                  Yes
                </Button>{' '}
                <Button color="secondary" onClick={this.toggle('backdrop', 0)}>
                  No
                </Button>{' '}
                <Button color="link" onClick={this.toggle('backdrop')}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
      </Page>
    );
  }
}


export default Doctor_PatientListPage;