import Page from 'components/Page';
import { NumberWidget } from 'components/Widget';
import React from 'react';
import { Col, Row } from 'reactstrap';
import AuthForm from '../components/AuthForm';
import _ from 'lodash';
import authToken from 'utils/authToken';
import { Redirect } from 'react-router';

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PatData: [],
      dur: '',
      concount: 0,
      Connection_Start: 0,
      Disconnected_At: 0,
      Device_ID: '',
      TreatLen: 0,
    };
  }

  Dsum(
    duration,
    connection_count,
    Connection_Start,
    Disconnected_At,
    Device_ID,
    len,
  ) {
    this.setState({
      dur: duration,
      concount: connection_count,
      Connection_Start: Connection_Start,
      Disconnected_At: Disconnected_At,
      Device_ID: Device_ID,
      TreatLen: len,
    });
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

    // const userName = AuthForm.defaultProps.usernameInputProps.inputvalue
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
          var latest_dis = 0;
          var first_dis = response.body.patientdata[0]
            ? self.Timeparse2sec(response.body.patientdata[0].Disconnected_At)
            : {};
          var latest_state = {};
          var first_state = {};
          response.body.patientdata.forEach(function (item) {
            if (self.Timeparse2sec(item.Disconnected_At) > latest_dis) {
              latest_dis = self.Timeparse2sec(item.Disconnected_At);
              latest_state = item;
            }
            if (self.Timeparse2sec(item.Disconnected_At) <= first_dis) {
              first_dis = self.Timeparse2sec(item.Disconnected_At);
              first_state = item;
            }
            item.duration =
              self.Timeparse2sec(item.Disconnected_At) -
              self.Timeparse2sec(item.Connection_Start);
          });
          if (response.body.patientdata.length > 0) {
            self.Dsum(
              self.Timeparse2sec(latest_state.Disconnected_At) -
                self.Timeparse2sec(latest_state.Connection_Start),
              response.body.patientdata.length,
              self.Timeparse2sec(latest_state.Connection_Start),
              self.Timeparse2sec(latest_state.Disconnected_At),
              latest_state.Device_ID,
              (
                (self.Timeparse2sec(latest_state.Disconnected_At) -
                  self.Timeparse2sec(first_state.Disconnected_At)) /
                60 /
                60 /
                24
              ).toFixed(2),
            );
            self.setState({ PatData: response.body.patientdata });
          }
        }
      })
      .catch(err => {
        console.log(err);
      });

    console.log('Scanning for Patient Data.');
  }
  render() {
    var token = authToken.getToken();
    if (!token) {
      return <Redirect to="/login-modal" />;
    }

    console.log('Dur', this.state.dur);
    const pd = this.state.PatData;
    let pd_sorted = _.orderBy(pd, ['Disconnected_At'], 'desc');
    console.log('Authform:', AuthForm.defaultProps);
    console.log('pd_sorted', pd_sorted);

    return (
      <Page
        className="DashboardPage"
        title="Patient Adherence"
        // breadcrumbs={[{ name: 'Dashboard', active: false }]}
      >
        <Row>
          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Total Duration Connected (sec)"
              subtitle={'Disconnected at ' + this.state.Disconnected_At}
              //number={Math.trunc(this.state.dur/60)}
              number={this.state.dur ? this.state.dur : 0}
              color="primary"
              progress={{
                value: this.state.dur ? (this.state.dur / 0.12).toFixed(2) : 0,
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
                value: (this.state.concount / 0.3).toFixed(2),
                // label: 'Last month',
              }}
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Estimated Drug Intake"
              subtitle="Total: 500 ml"
              number={this.state.dur ? this.state.dur * 20 : 0 + ' ml'}
              color="info"
              progress={{
                value: this.state.dur
                  ? ((this.state.dur * 20) / 5).toFixed(2)
                  : 0,
                // label: 'Last month',
              }}
            />
          </Col>

          <Col lg={3} md={6} sm={6} xs={12}>
            <NumberWidget
              title="Treatment Length"
              subtitle="Total: 60 days"
              number={this.state.TreatLen ? this.state.TreatLen : 0 + ' Days'}
              color="warning"
              progress={{
                value: this.state.TreatLen
                  ? (this.state.TreatLen / 0.6).toFixed(2)
                  : 0,
                // label: 'Last month',
              }}
            />
          </Col>
        </Row>
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
                {Array.isArray(pd_sorted) &&
                  pd_sorted.map(friend => {
                    return (
                      <tr key={friend.ts}>
                        <td>
                          {friend.Device_Name
                            ? friend.Device_Name
                            : friend.Device_ID}
                        </td>
                        <td>{friend.Connection_Start}</td>
                        <td>{friend.Disconnected_At}</td>
                        <td>{friend.duration}</td>
                        <td
                          className={
                            ((this.Timeparse2sec(friend.Disconnected_At) -
                              this.Timeparse2sec(friend.Connection_Start)) *
                              20) /
                              5 >
                            550
                              ? 'text-secondary'
                              : ''
                          }
                        >
                          {((this.Timeparse2sec(friend.Disconnected_At) -
                            this.Timeparse2sec(friend.Connection_Start)) *
                            20) /
                            5 >
                          550
                            ? 'Overdose'
                            : 'Normal'}
                        </td>
                      </tr>
                    );
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
