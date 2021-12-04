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
      patient_list: [],
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

    const primaryColor = getColor('primary');
    const secondaryColor = getColor('secondary'); 
    
    return (

      
      <Page
        className="DashboardPage"
        title="My Patients"
        // breadcrumbs={[{ name: 'Dashboard', active: false }]}
      >
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
          <table className="table table-hover">
              <thead>
                  <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Birthday</th>
                      <th>Email</th>
                      <th>Signup Time</th>
                      <th>Action</th>
                  </tr>
              </thead>
              <tbody>
                  {
                  Array.isArray(this.state.patient_list) && this.state.patient_list.map(friend => {
                      return <tr key={friend.ts}>
                          <td>{friend.User_ID}</td>
                          <td>{friend.User_Name}</td>
                          <td>{friend.Birth_Year + '-' + friend.Birth_Mon + '-' + friend.Birth_Day}</td>
                          <td>{friend.Email}</td>
                          <td>{this.Dateformat(friend.Signup_Time)}</td>
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
