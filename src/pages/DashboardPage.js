import Page from 'components/Page';
import React from 'react';
import { Col, Row } from 'reactstrap';
import NumberWidget from 'components/Widget/NumberWidget';
import authToken from 'utils/authToken';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PatData: [],
      totalDuration: 0,
      sessionCount: 0,
      deviceInfo: '',
      estimatedDrugIntake: 0,
      treatmentLength: 0,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    const userinfo = authToken.getUserinfo();
    if (!userinfo) return;

    fetch('https://cxlnioef6d.execute-api.us-west-1.amazonaws.com/521_getPatientData_stage/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        User_ID: userinfo.User_ID,
      }),
    })
    .then(response => response.json())
    .then(response => {
      if (response.statusCode === 200 && response.body.state === 1) {
        this.processData(response.body.patientdata);
      }
    })
    .catch(err => {
      console.error(err);
    });

    console.log('Scanning for Patient Data.');
  }

  processData(patientData) {
    const sortedData = _.orderBy(patientData, (data) => {
      return new Date(data.Disconnected_At);
    }, ['desc']);

    this.setState({ PatData: sortedData });

    const totalDuration = sortedData.reduce((total, session) => total + parseInt(session.Connection_Duration_Sec, 10), 0);
    const estimatedDrugIntake = totalDuration * 20; // Assuming 20ml per second as an example
    const treatmentLength = (totalDuration / 60 / 60 / 24).toFixed(2); // Convert seconds to days

    this.setState({
      totalDuration,
      sessionCount: sortedData.length,
      estimatedDrugIntake,
      treatmentLength,
    });
  }

  render() {
    if (!authToken.getToken()) {
      return <Redirect to="/login-modal" />;
    }

    return (
      <Page className="DashboardPage" title="Patient Adherence">
        <Row>
          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Total Duration Connected (sec)"
              number={this.state.totalDuration}
              color="primary"
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Number of Medication Sessions"
              number={this.state.sessionCount}
              color="secondary"
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Estimated Drug Intake"
              number={`${this.state.estimatedDrugIntake} ml`}
              color="info"
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Treatment Length"
              number={`${this.state.treatmentLength} Days`}
              color="warning"
            />
          </Col>
        </Row>
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
                {this.state.PatData.map((session, index) => (
                  <tr key={index}>
                    <td>{session.Device_ID}</td>
                    <td>{session.Connection_Start}</td>
                    <td>{session.Disconnected_At}</td>
                    <td>{session.Connection_Duration_Sec}</td>
                    <td>{session.Session_Status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Col>
        </Row>
      </Page>
    );
  }
}

export default DashboardPage;
