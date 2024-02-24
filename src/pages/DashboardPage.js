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
      maxDuration: 3600, // Example maximum duration in seconds
      maxSessions: 30, // Example maximum number of sessions
      maxIntake: 50000, // Example maximum drug intake in ml
      maxTreatmentDays: 30, // Example maximum treatment length in days
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

    const totalDuration = sortedData.reduce((total, session) => total + parseInt(session.Connection_Duration_Sec, 10), 0);
    const estimatedDrugIntake = totalDuration * 20; // Assuming 20ml per second as an example
    const treatmentLength = (totalDuration / 60 / 60 / 24).toFixed(2); // Convert seconds to days

    this.setState({
      PatData: sortedData,
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

    const { totalDuration, sessionCount, estimatedDrugIntake, treatmentLength, maxDuration, maxSessions, maxIntake, maxTreatmentDays } = this.state;

    return (
      <Page className="DashboardPage" title="Patient Adherence">
        <Row>
          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Total Duration Connected (sec)"
              number={totalDuration}
              color="primary"
              progress={{
                value: (totalDuration / maxDuration) * 100,
                label: `${(totalDuration / maxDuration) * 100}%`,
              }}
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Number of Medication Sessions"
              number={sessionCount}
              color="secondary"
              progress={{
                value: (sessionCount / maxSessions) * 100,
                label: `${(sessionCount / maxSessions) * 100}%`,
              }}
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Estimated Drug Intake"
              number={`${estimatedDrugIntake} ml`}
              color="info"
              progress={{
                value: (estimatedDrugIntake / maxIntake) * 100,
                label: `${(estimatedDrugIntake / maxIntake) * 100}%`,
              }}
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Treatment Length"
              number={`${treatmentLength} Days`}
              color="warning"
              progress={{
                value: (treatmentLength / maxTreatmentDays) * 100,
                label: `${(treatmentLength / maxTreatmentDays) * 100}%`,
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <h3>Sessions</h3>
            <table
