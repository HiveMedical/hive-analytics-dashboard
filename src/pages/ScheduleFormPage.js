import Page from 'components/Page';
import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from 'reactstrap';
import authToken from 'utils/authToken';
import { Redirect } from 'react-router';

function ScheduleFormPage() {
    var token = authToken.getToken();
    if(!token){
        return (<Redirect to="/login-modal" />);
      }
    var userinfo = authToken.getUserinfo();
    if(!userinfo) return;

    const [state, setState] = React.useState({
        User_ID : "",
        Prescription : "",
        Start_Date : "",
        Duration : "",
        Regimen_Week : {
            sunday : {
                startTime : "",
                endTime : ""
            },
            monday : {
                startTime : "",
                endTime : ""
            },
            tuesday : {
                startTime : "",
                endTime : ""
            },
            wednesday : {
                startTime : "",
                endTime : ""
            },
            thursday : {
                startTime : "",
                endTime : ""
            },
            friday : {
                startTime : "",
                endTime : ""
            },
            saturday : {
                startTime : "",
                endTime : ""
            }
        }
        

      });

    const handleChange = (event) => {
        
        const value = event.target.value;
        if (event.target.name == "time") {
            const index = event.target.id.indexOf("y") + 1
            const day = event.target.id.substring(0, index)
            if (event.target.id[index] == "S") {
                setState({
                    ...state,
                    Regimen_Week : {
                        ...state.Regimen_Week,
                        [day] : {
                            startTime : value,
                            endTime : (state.Regimen_Week[day].endTime) ? state.Regimen_Week[day].endTime : ""
                        }
                    }
                });
            }
            else if (event.target.id[index] == "E") {
                setState({
                    ...state,
                    Regimen_Week : {
                        ...state.Regimen_Week,
                        [day] : {
                            startTime : (state.Regimen_Week[day].startTime) ? state.Regimen_Week[day].startTime : "",
                            endTime : value
                        }
                    }
                });
            }
        }
        else {
            setState({
                ...state,
                [event.target.name]: value
            });
        }
        
        
        
      }
    

    const checkValidTime = (day) => {
        if (state.Regimen_Week[day].startTime == "" || state.Regimen_Week[day].endTime == "") {
            return false;
        }
        var start = state.Regimen_Week[day].startTime.replace(':','')
        var end = state.Regimen_Week[day].endTime.replace(':','')
        start = parseInt(start[0],10) * 600 + parseInt(start[1],10) * 60 + parseInt(start[2],10) * 10 + parseInt(start[3],10)
        end = parseInt(end[0],10) * 600 + parseInt(end[1],10) * 60 + parseInt(end[2],10) * 10 + parseInt(end[3],10)
        
        return end - start < 0;
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        var rw = []
        for (const day in state.Regimen_Week) {
            if (checkValidTime(day)) {
                return;
            }
            var start = (state.Regimen_Week[day].startTime == "") ? "" : state.Regimen_Week[day].startTime.replace(':','')
            var end = (state.Regimen_Week[day].endTime == "") ? "" : state.Regimen_Week[day].endTime.replace(':','')
            rw.push([start, end])
        }
        if (state.Duration < 0) {
            return;
        }
        
        fetch('https://surzqe7m06.execute-api.us-west-1.amazonaws.com/521_addSchedule_stage', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            User_ID : state.User_ID,
            Start_Date : (new Date((state.Start_Date+"T00:00:00").replace(/-/g, '\/').replace(/T.+/, '')).getTime()/1000)+"",
            Regimen_Week : rw,
            Duration : state.Duration,
            Prescription : state.Prescription
          })
        })
        .then(response => response.json())
        .then(response => {
            console.log(response)
            if (response.statusCode == 200) {
                setState({
                    
                        User_ID : "",
                        Prescription : "",
                        Start_Date : "",
                        Duration : "",
                        Regimen_Week : {
                            sunday : {
                                startTime : "",
                                endTime : ""
                            },
                            monday : {
                                startTime : "",
                                endTime : ""
                            },
                            tuesday : {
                                startTime : "",
                                endTime : ""
                            },
                            wednesday : {
                                startTime : "",
                                endTime : ""
                            },
                            thursday : {
                                startTime : "",
                                endTime : ""
                            },
                            friday : {
                                startTime : "",
                                endTime : ""
                            },
                            saturday : {
                                startTime : "",
                                endTime : ""
                            }
                        }
                      
                })
            }
        })
        .catch(e => {
            console.log(e)
        })
        
    }
    
    var token = authToken.getToken();
    console.log(state)
    return (
    <Page title="Forms" breadcrumbs={[{ name: 'Forms', active: true }]}>
        <Card>
        <CardHeader>New Patient Schedule</CardHeader>
        <CardBody>
            <Form onSubmit={handleSubmit}>
            <FormGroup row>
                <Label for="User_ID" md={2}>
                    Patient Name
                </Label>
                <Col md={4}>
                <Input 
                    name="User_ID" 
                    value={state.User_ID}
                    onChange={handleChange}
                />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="Prescription" md={2}>
                Prescribed Drug
                </Label>
                <Col md={4}>
                <Input 
                    name="Prescription" 
                    onChange={handleChange}
                    value={state.Prescription}
                />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="Start_Date" sm={2}>Treatment Start Date</Label>
                <Col md={2}>
                    <Input
                    type="date"
                    name="Start_Date"
                    id="Start_Date"
                    placeholder="date placeholder"
                    value={state.Start_Date}
                    onChange={handleChange}
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="Duration" sm={2}>Treatment Duration (in days)</Label>
                <Col md={2}>
                    <Input
                    type="number"
                    name="Duration"
                    id="Duration"
                    value={state.Duration}
                    onChange={handleChange}
                    invalid={state.Duration < 0}
                    />
                    <FormFeedback invalid>Invalid Duration</FormFeedback>
                </Col>
            </FormGroup>
            
            <FormGroup>
                <Label for="Regimen_Week" sm={2}>Treatment Schedule</Label>
                <Row>
                    <Col md={1}>
                        <Label for="exampleTime">Sunday</Label>
                    </Col>
                    <Col md={2}>
                        <Input
                            type="time"
                            name="time"
                            id="sundayStartTime"
                            placeholder="time placeholder"
                            value={state.Regimen_Week.sunday.startTime}
                            onChange={handleChange}
                            invalid={checkValidTime("sunday")}
                        />
                    </Col>
                    <Col md={2}>
                        <Input
                            type="time"
                            name="time"
                            id="sundayEndTime"
                            placeholder="time placeholder"
                            value={state.Regimen_Week.sunday.endTime}
                            onChange={handleChange}
                            invalid={checkValidTime("sunday")}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={1}>
                        <Label for="exampleTime">Monday</Label>
                    </Col>
                    <Col md={2}>
                        <Input
                            type="time"
                            name="time"
                            id="mondayStartTime"
                            placeholder="time placeholder"
                            value={state.Regimen_Week.monday.startTime}
                            onChange={handleChange}
                        />
                    </Col>
                    <Col md={2}>
                        <Input
                            type="time"
                            name="time"
                            id="mondayEndTime"
                            placeholder="time placeholder"
                            value={state.Regimen_Week.monday.endTime}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={1}>
                        <Label for="exampleTime">Tuesday</Label>
                    </Col>
                    <Col md={2}>
                        <Input
                            type="time"
                            name="time"
                            id="tuesdayStartTime"
                            placeholder="time placeholder"
                            value={state.Regimen_Week.tuesday.startTime}
                            onChange={handleChange}
                        />
                    </Col>
                    <Col md={2}>
                        <Input
                            type="time"
                            name="time"
                            id="tuesdayEndTime"
                            placeholder="time placeholder"
                            value={state.Regimen_Week.tuesday.endTime}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={1}>
                        <Label for="exampleTime">Wednesday</Label>
                    </Col>
                    <Col md={2}>
                        <Input
                            type="time"
                            name="time"
                            id="wednesdayStartTime"
                            placeholder="time placeholder"
                            value={state.Regimen_Week.wednesday.startTime}
                            onChange={handleChange}
                        />
                    </Col>
                    <Col md={2}>
                        <Input
                            type="time"
                            name="time"
                            id="wednesdayEndTime"
                            placeholder="time placeholder"
                            value={state.Regimen_Week.wednesday.endTime}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={1}>
                        <Label for="exampleTime">Thursday</Label>
                    </Col>
                    <Col md={2}>
                        <Input
                            type="time"
                            name="time"
                            id="thursdayStartTime"
                            placeholder="time placeholder"
                            value={state.Regimen_Week.thursday.startTime}
                            onChange={handleChange}
                        />
                    </Col>
                    <Col md={2}>
                        <Input
                            type="time"
                            name="time"
                            id="thursdayEndTime"
                            placeholder="time placeholder"
                            value={state.Regimen_Week.thursday.endTime}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={1}>
                        <Label for="exampleTime">Friday</Label>
                    </Col>
                    <Col md={2}>
                        <Input
                            type="time"
                            name="time"
                            id="fridayStartTime"
                            placeholder="time placeholder"
                            value={state.Regimen_Week.friday.startTime}
                            onChange={handleChange}
                        />
                    </Col>
                    <Col md={2}>
                        <Input
                            type="time"
                            name="time"
                            id="fridayEndTime"
                            placeholder="time placeholder"
                            value={state.Regimen_Week.friday.endTime}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={1}>
                        <Label for="exampleTime">Saturday</Label>
                    </Col>
                    <Col md={2}>
                        <Input
                            type="time"
                            name="time"
                            id="saturdayStartTime"
                            placeholder="time placeholder"
                            value={state.Regimen_Week.saturday.startTime}
                            onChange={handleChange}
                        />
                    </Col>
                    <Col md={2}>
                        <Input
                            type="time"
                            name="time"
                            id="saturdayEndTime"
                            placeholder="time placeholder"
                            value={state.Regimen_Week.saturday.endTime}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                
            </FormGroup>
            <FormGroup check row>
                <Col sm={{ size: 10, offset: 1 }}>
                <Button>Create New Treatment Schedule</Button>
                </Col>
            </FormGroup>
            <FormFeedback
      tooltip
      valid
    >
      Sweet! that name is available
    </FormFeedback>
            </Form>
        </CardBody>
        </Card>
    </Page>
    );
}


export default ScheduleFormPage;