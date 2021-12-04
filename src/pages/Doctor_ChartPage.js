import React from 'react';

import { getColor } from 'utils/colors';
import { randomNum } from 'utils/demos';

import { Row, Col, Card, CardHeader, CardBody,
  UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { Line, Pie, Doughnut, Bar, Radar, Polar } from 'react-chartjs-2';

import Page from 'components/Page';
import authToken from 'utils/authToken';
import { Redirect } from 'react-router';
import { createBrowserHistory } from 'history';


class ChartPage extends React.Component {
  constructor(props) {
    var dur = '';
    super(props);
    this.state = {
      data: [],
      labels: [],
      patient_list: authToken.getPatientlist(),
      patient_list_key: authToken.getPatientlist_key(),
      pid: 0
    };
  }

  genLineData = (labels, data, color) => {
    return {
      labels: labels,
      datasets: [
        {
          label: 'Connection Duration',
          backgroundColor: color?getColor('primary'):getColor('secondary'),
          borderColor: color?getColor('primary'):getColor('secondary'),
          borderWidth: 1,
          data: data
        }
      ],
    };
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
        var labels = [];
        var data = [];
        response.body.patientdata.forEach(function(item) {
          labels.push(item.Connection_Start);
          data.push(self.Timeparse2sec(item.Disconnected_At) - self.Timeparse2sec(item.Connection_Start));
        });
        self.setState({
          labels: labels,
          data: data
        });
      }
      
      
    })
    .catch(err => { 
      console.log(err); 
    });
  }

  render() {
    return (
      <Page title={this.state.patient_list_key && this.state.patient_list_key[this.state.pid] && this.state.patient_list_key[this.state.pid].User_Name  + "'s last connection"}>
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
                      return <DropdownItem disabled={this.state.pid == friend.User_ID?true:false} onClick={() => this.goredirect('doctor-patientchart', friend.User_ID)}>{friend.User_Name}</DropdownItem>
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
          <Col xl={6} lg={12} md={12}>
            <Card>
              <CardHeader>Bar</CardHeader>
              <CardBody>
                <Bar data={this.genLineData(this.state.labels, this.state.data, 1)} />
              </CardBody>
            </Card>
          </Col>

          <Col xl={6} lg={12} md={12}>
            <Card>
              <CardHeader>Line</CardHeader>
              <CardBody>
                <Line data={this.genLineData(this.state.labels, this.state.data)} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
};

export default ChartPage;
