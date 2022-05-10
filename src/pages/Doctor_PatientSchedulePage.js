import Page from 'components/Page';
import React from 'react';
import InfiniteCalendar from 'react-infinite-calendar';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { getColor } from 'utils/colors';
import authToken from 'utils/authToken';
import { Redirect } from 'react-router';
import { createBrowserHistory } from 'history';

const today = new Date();

class PatientSchedulePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      getscheduleStatus: '',
      getscheduleResponse: {},
      schedule: false,
      week_arr: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      schedule_dates: [],
      patient_list: authToken.getPatientlist(),
      patient_list_key: authToken.getPatientlist_key(),
      pid: 0,
    };
  }

  Dateformat(ts) {
    var t = new Date(ts * 1000);
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    var formatted =
      months[t.getMonth()] +
      ' ' +
      ('0' + t.getDate()).slice(-2) +
      ', ' +
      ('0' + t.getHours()).slice(-2) +
      ':' +
      ('0' + t.getMinutes()).slice(-2);
    return formatted;
  }

  goredirect(path, patient_id) {
    console.log(path);
    const history = createBrowserHistory();
    history.push('/' + path + '/' + patient_id);
    window.location.reload(false);
  }

  componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);

    var userinfo = authToken.getUserinfo();
    if (!userinfo) return;

    const pid =
      this.props.match.params.pid !== '-1'
        ? this.props.match.params.pid
        : this.state.patient_list[0]['User_ID'];
    console.log('pid:', pid);
    this.setState({
      pid: pid,
    });
    console.log('this patient_list_key', this.state.patient_list_key);

    fetch(
      'https://jldroqqp8j.execute-api.us-west-1.amazonaws.com/521_GetSchedule_Stage',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          User_ID: pid,
          All_Data: false,
        }),
      },
    )
      .then(response => response.json())
      .then(getscheduleResponse => {
        this.setState({ getscheduleResponse });
        const getscheduleStatus = getscheduleResponse.statusCode;
        if (getscheduleStatus === 200 && getscheduleResponse.body.state === 1) {
          console.log('inside 200 and got deivce');
          if (this.state.getscheduleResponse.body.schedule.length >= 1) {
            var schedule_dates = [];
            var day_tmp =
              this.state.getscheduleResponse.body.schedule[0].Start_Date * 1000;
            for (
              var i = 0;
              i < this.state.getscheduleResponse.body.schedule[0].Duration;
              i++
            ) {
              schedule_dates.push(day_tmp);
              day_tmp += 24 * 60 * 60 * 1000;
            }
          }
          this.setState({
            schedule: this.state.getscheduleResponse.body.schedule,
            schedule_dates: schedule_dates,
          });
          console.log('schedule_dates', this.state.schedule_dates);
        } else {
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    var token = authToken.getToken();
    if (!token) {
      return <Redirect to="/login-modal" />;
    }

    const primaryColor = getColor('primary');
    const secondaryColor = getColor('secondary');

    return (
      <Page
        className="SchedulePage"
        title={
          this.state.patient_list_key &&
          this.state.patient_list_key[this.state.pid] &&
          this.state.patient_list_key[this.state.pid].User_Name +
            "'s treatment calendar"
        }
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
                    {Array.isArray(this.state.patient_list) &&
                      this.state.patient_list.map(friend => {
                        return (
                          <DropdownItem
                            disabled={
                              this.state.pid === friend.User_ID ? true : false
                            }
                            onClick={() =>
                              this.goredirect(
                                'doctor-patientschedule',
                                friend.User_ID,
                              )
                            }
                          >
                            {friend.User_Name}
                          </DropdownItem>
                        );
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
            {Array.isArray(this.state.schedule) &&
              this.state.schedule.map((bigfriend, bidx) => {
                return (
                  <div className="marginbt">
                    <h3>T{bidx + 1} - Regimen (week)</h3>
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Weekday</th>
                          <th>Time</th>
                          <th>Drug Prescribed</th>
                          <th>Provider</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(bigfriend.Regimen_Week) &&
                          bigfriend.Regimen_Week.map((friend, idx) => {
                            return (
                              <tr>
                                <td>{this.state.week_arr[idx]}</td>
                                <td>{friend[0] + ' - ' + friend[1]}</td>
                                <td>{bigfriend.Prescription}</td>
                                <td>Provider 1</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>

                    <Card>
                      <CardHeader>
                        <strong>T{bidx + 1} - Schedule</strong>
                      </CardHeader>
                      <CardBody>
                        <p>
                          Start Date:{' '}
                          <span className="text-primary">
                            {this.Dateformat(bigfriend.Start_Date)}
                          </span>
                        </p>
                        <p>
                          Duration:{' '}
                          <span className="text-primary">
                            {bigfriend.Duration} days
                          </span>
                        </p>
                      </CardBody>
                    </Card>
                  </div>
                );
              })}
          </Col>
        </Row>
      </Page>
    );
  }
}

export default PatientSchedulePage;
