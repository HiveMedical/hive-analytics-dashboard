import React from 'react';

import { getColor } from 'utils/colors';

import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap';

import { Line, Bar } from 'react-chartjs-2';

import Page from 'components/Page';
import authToken from 'utils/authToken';

class ChartPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      labels: [],
    };
  }

  genLineData = (labels, data, color) => {
    return {
      labels: labels,
      datasets: [
        {
          label: 'Connection Duration',
          backgroundColor: color ? getColor('primary') : getColor('secondary'),
          borderColor: color ? getColor('primary') : getColor('secondary'),
          borderWidth: 1,
          data: data,
        },
      ],
    };
  };

  Timeparse2sec(datestr) {
    if (!datestr) return;
    var time = datestr.split(' ')[0];
    var hr_min_sec = time.split(':');
    return (
      parseInt(hr_min_sec[3]) + hr_min_sec[2] * 60 + hr_min_sec[1] * 60 * 60
    );
  }

  componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);

    var self = this;
    var userinfo = authToken.getUserinfo();
    if (!userinfo) return;

    fetch(
      'https://cxlnioef6d.execute-api.us-west-1.amazonaws.com/521_getPatientData_stage/',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          User_ID: userinfo.User_ID,
        }),
      },
    )
      .then(response => response.json())

      .then(response => {
        console.log(response);

        if (response.statusCode === 200 && response.body.state === 1) {
          var labels = [];
          var data = [];
          response.body.patientdata.forEach(function (item) {
            labels.push(item.Connection_Start);
            data.push(
              self.Timeparse2sec(item.Disconnected_At) -
                self.Timeparse2sec(item.Connection_Start),
            );
          });
          self.setState({
            labels: labels,
            data: data,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <Page
        title="Last Connection"
        breadcrumbs={[{ name: 'Last Connection', active: true }]}
      >
        <Row>
          <Col xl={6} lg={12} md={12}>
            <Card>
              <CardHeader>Bar</CardHeader>
              <CardBody>
                <Bar
                  data={this.genLineData(this.state.labels, this.state.data, 1)}
                />
              </CardBody>
            </Card>
          </Col>

          <Col xl={6} lg={12} md={12}>
            <Card>
              <CardHeader>Line</CardHeader>
              <CardBody>
                <Line
                  data={this.genLineData(this.state.labels, this.state.data)}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}

export default ChartPage;
