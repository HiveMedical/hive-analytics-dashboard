import React from 'react';
import { Col, Row, Redirect } from 'reactstrap';
import Page from 'components/Page';
import { NumberWidget } from 'components/Widget';
import AuthForm from '../components/AuthForm';
import _ from 'lodash';
import authToken from 'utils/authToken';

class DashboardPage extends React.Component {
  state = {
    PatData: [],
    dur: 0, // Changed to 0 to ensure it's a number
    concount: 0,
    Connection_Start: 0,
    Disconnected_At: '',
    Device_ID: '',
    Connection_Duration_Sec: 0,
    TreatLen: 0,
  };

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
      body: JSON.stringify({ User_ID: userinfo.User_ID }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.statusCode === 200 && response.body.state === 1) {
          const sortedData = _.orderBy(response.body.patientdata, ['Disconnected_At'], 'desc');
          this.setState({
            PatData: sortedData,
            ...this.calculateSummary(sortedData),
          });
        }
      })
      .catch(err => console.log(err));
  }

  calculateSummary = (data) => {
    if (!data.length) return {};
    
    const latestSession = data[0];
    const totalSessions = data.length;
    const totalDurationSec = latestSession.Connection_Duration_Sec;
    const treatmentLength = (totalDurationSec / 60 / 60 / 24).toFixed(2);

    return {
      dur: totalDurationSec,
      concount: totalSessions,
      Connection_Start: this.Dateformat(latestSession.Connection_Start),
      Disconnected_At: this.Dateformat(latestSession.Disconnected_At),
      Device_ID: latestSession.Device_ID,
      Session_Status: latestSession.Session_Status,
      Connection_Duration_Sec: totalDurationSec,
      TreatLen: treatmentLength,
    };
  }

  Dateformat = (ts) => {
    const t = new Date(ts * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[t.getMonth()]} ${('0' + t.getDate()).slice(-2)}, ${('0' + t.getHours()).slice(-2)}:${('0' + t.getMinutes()).slice(-2)}`;
  }

  render() {
    if (!authToken.getToken()) {
      return <Redirect to="/login-modal" />;
    }

    const { PatData, dur, concount, Disconnected_At, TreatLen } = this.state;

    return (
      <Page className="DashboardPage" title="Patient Adherence">
        <Row>
          {/* Widgets here using state variables like dur, concount, etc. */}
        </Row>
        <Row>
          {/* Session table here */}
        </Row>
      </Page>
    );
  }
}

export default DashboardPage;
