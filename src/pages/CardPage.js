import bg11Image from 'assets/img/bg/background_1920-11.jpg';
import bg18Image from 'assets/img/bg/background_1920-18.jpg';
// import bg1Image from 'assets/img/bg/background_640-1.jpg';
// import bg3Image from 'assets/img/bg/background_640-3.jpg';
import bg1Image from 'assets/img/device/1.png';
import bg3Image from 'assets/img/device/2.png';
import user1Image from 'assets/img/users/100_1.jpg';
import { UserCard } from 'components/Card';
import Page from 'components/Page';
import { bgCards, gradientCards, overlayCards } from 'demos/cardPage';
import { getStackLineChart, stackLineChartOptions } from 'demos/chartjs';
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardImgOverlay,
  CardLink,
  CardText,
  CardTitle,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from 'reactstrap';
import authToken from 'utils/authToken';
import { Redirect } from 'react-router';

class CardPage extends React.Component {

  constructor(props) {
    var dur = '';
    super(props);
    this.state = {
      getdeviceStatus: '',
      getdeviceResponse:{},
      device: []
    };

  }

  componentDidMount() {
    var token = authToken.getToken();
    var userinfo = authToken.getUserinfo();
    if(!token){
      return (<Redirect to="/login-modal" />);
    }

    fetch('https://lwhm2qel08.execute-api.us-west-1.amazonaws.com/521_GetDevice_Stage', {
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
        getdeviceResponse: response
      })
      this.state.getdeviceStatus = this.state.getdeviceResponse.statusCode;
     
      if(this.state.getdeviceStatus==200 && this.state.getdeviceResponse.body.state == 1){
        console.log("inside 200 and got deivce");
        this.setState({
          device: this.state.getdeviceResponse.body.deviceinfo
        });
        console.log('device', this.state.device);
      }
      else{
      }
    })
    .catch(err => { console.log(err); 
    });
  }

  render() {
    return (
      <Page title="Devices" breadcrumbs={[{ name: 'devices', active: true }]}>
        <Row> 
        {Array.isArray(this.state.device) && this.state.device.map(friend => {
          return <Col md={6} sm={6} xs={12} className="mb-3">
              <Card className="flex-row">
                <CardImg
                  className="card-img-left"
                  src={friend.Type==0?bg3Image:bg1Image}
                  style={{ width: 'auto', height: 150 }}
                />
                <CardBody>
                  <CardTitle style={{ 'font-weight': 'bold' }}>{friend.Device_Name} ({friend.Type==0?'Sensor':'Gateway'})</CardTitle>
                  <CardText>
                    {friend.Device_Desc}
                  </CardText>
                </CardBody>
              </Card>
            </Col>

        })}
        </Row>

  {/* 
        <Row>
          <Col md={6} sm={6} xs={12} className="mb-3">
            <Card>
              <CardImg top src={bg11Image} />
              <CardBody>
                <CardTitle>Card with image</CardTitle>
                <CardText>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </CardText>
              </CardBody>
            </Card>
          </Col>

          <Col md={6} sm={6} xs={12} className="mb-3">
            <Card>
              <CardImg top src={bg18Image} />
              <CardBody>
                <CardTitle>Card with list group</CardTitle>
                <CardText>
                  This example shows how to use card with list group{' '}
                </CardText>
              </CardBody>
              <ListGroup flush>
                <ListGroupItem>Cras justo odio</ListGroupItem>
                <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
                <ListGroupItem>Morbi leo risus</ListGroupItem>
              </ListGroup>
              <CardBody>
                <CardLink tag="a" href="#">
                  Go to details
                </CardLink>
                <CardLink tag="a" href="#">
                  More
                </CardLink>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          {['', 'top', 'left', 'right'].map((color, index) => (
            <Col key={index} md={6} sm={6} xs={12} className="mb-3">
              <Card
                inverse
                className={`border-0 bg-gradient-theme${
                  !!color ? '-' : ''
                }${color}`}
                style={{
                  height: 200,
                }}
              >
                <CardBody className="d-flex flex-column justify-content-start align-items-start">
                  <CardTitle>Card title</CardTitle>
                  <CardText>card text</CardText>
                </CardBody>

                <CardBody className="d-flex justify-content-between align-items-center">
                  <CardText>Karl David</CardText>
                  <Button outline color="light">
                    Click
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        <Row>
          {overlayCards.map(({ imgUrl }, index) => {
            return (
              <Col key={index} md={6} sm={6} xs={12}>
                <Card inverse className="text-center">
                  <CardImg width="100%" src={imgUrl} alt="Card image cap" />
                  <CardImgOverlay>
                    <CardTitle>Card Title</CardTitle>
                    <CardText>inversed card</CardText>
                    <CardText>
                      <small className="text-muted">
                        Last updated 3 mins ago
                      </small>
                    </CardText>
                  </CardImgOverlay>
                </Card>
              </Col>
            );
          })}
        </Row>

        <Row>
          <Col md={5}>
            <UserCard
              avatar={user1Image}
              title="Chris"
              subtitle="Project Lead"
              text="Give me a star!"
              style={{
                height: 300,
              }}
            />
          </Col>

          <Col md={7}>
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
              <CardBody className="text-primary" style={{ position: 'absolute' }}>
                <CardTitle>Chart Card</CardTitle>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          {bgCards.map(({ color }, index) => (
            <Col key={index} lg={4} md={6} sm={6} xs={12} className="mb-3">
              <Card inverse color={color}>
                <CardBody>
                  <CardTitle className="text-capitalize">
                    {color} card title
                  </CardTitle>
                  <CardText>
                    Some quick example text to build on the card title and make up
                    the bulk of the card's content.
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        <Row>
          {gradientCards.map(({ color }, index) => (
            <Col key={index} lg={4} md={6} sm={6} xs={12} className="mb-3">
              <Card
                inverse
                className={`bg-gradient-${color} text-center`}
                style={{ height: 200 }}
              >
                <CardBody className="d-flex flex-column flex-wrap justify-content-center align-items-center">
                  <CardTitle>Gradient {color} title</CardTitle>
                  <CardText>card text</CardText>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
  */}
      </Page>
    );
      }
};

export default CardPage;
