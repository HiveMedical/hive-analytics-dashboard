import bg1Image from 'assets/img/device/1.png';
import bg3Image from 'assets/img/device/2.png';
import Page from 'components/Page';
import React from 'react';
import {
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import authToken from 'utils/authToken';
import { Redirect } from 'react-router';

class CardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      getdeviceStatus: '',
      getdeviceResponse: {},
      device: [],
    };
  }

  componentDidMount() {
    var token = authToken.getToken();
    var userinfo = authToken.getUserinfo();
    if (!token) {
      return <Redirect to="/login-modal" />;
    }

    fetch(
      'https://lwhm2qel08.execute-api.us-west-1.amazonaws.com/521_GetDevice_Stage',
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
      .then(getdeviceResponse => {
        this.setState({ getdeviceResponse });
        const getdeviceStatus = getdeviceResponse.statusCode;

        if (getdeviceStatus === 200 && getdeviceResponse.body.state === 1) {
          console.log('inside 200 and got deivce');
          const device = getdeviceResponse.body.deviceinfo;
          this.setState({ device });
          console.log('device', device);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <Page title="Devices" breadcrumbs={[{ name: 'devices', active: true }]}>
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
