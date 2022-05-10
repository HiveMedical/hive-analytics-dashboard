import bg1Image from 'assets/img/device/1.png';
import bg3Image from 'assets/img/device/2.png';
import Page from 'components/Page';
import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import authToken from 'utils/authToken';
import { Redirect } from 'react-router';
import { createBrowserHistory } from 'history';

class CardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      getdeviceStatus: '',
      getdeviceResponse: {},
      device: [],
      patient_list: authToken.getPatientlist(),
      patient_list_key: authToken.getPatientlist_key(),
      pid: 0,
    };
  }

  goredirect(path, patient_id) {
    console.log(path);
    const history = createBrowserHistory();
    history.push('/' + path + '/' + patient_id);
    window.location.reload(false);
  }

  componentDidMount() {
    var token = authToken.getToken();
    if (!token) {
      return <Redirect to="/login-modal" />;
    }

    const pid =
      this.props.match.params.pid !== -1
        ? this.props.match.params.pid
        : this.state.patient_list[0]['User_ID'];
    console.log('pid:', pid);
    this.setState({ pid });

    fetch(
      'https://lwhm2qel08.execute-api.us-west-1.amazonaws.com/521_GetDevice_Stage',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          User_ID: pid,
        }),
      },
    )
      .then(response => response.json())
      .then(getdeviceResponse => {
        this.setState({ getdeviceResponse });
        const getdeviceStatus = getdeviceResponse.statusCode;

        if (getdeviceStatus === 200 && getdeviceResponse.body.state === 1) {
          console.log('inside 200 and got deivce');
          this.setState({
            device: this.state.getdeviceResponse.body.deviceinfo,
          });
          console.log('device', this.state.device);
        } else {
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <Page
        title={
          this.state.patient_list_key &&
          this.state.patient_list_key[this.state.pid] &&
          this.state.patient_list_key[this.state.pid].User_Name + "'s devices"
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
                                'doctor-devicelist',
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
          {Array.isArray(this.state.device) &&
            this.state.device.map(friend => {
              return (
                <Col md={6} sm={6} xs={12} className="mb-3">
                  <Card className="flex-row">
                    <CardImg
                      className="card-img-left"
                      src={friend.Type === 0 ? bg3Image : bg1Image}
                      style={{ width: 'auto', height: 150 }}
                    />
                    <CardBody>
                      <CardTitle style={{ 'font-weight': 'bold' }}>
                        {friend.Device_Name} (
                        {friend.Type === 0 ? 'Sensor' : 'Gateway'})
                      </CardTitle>
                      <CardText>{friend.Device_Desc}</CardText>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </Page>
    );
  }
}

export default CardPage;
