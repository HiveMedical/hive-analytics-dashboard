import logo200Image from 'assets/img/logo/hive-logo-white.png';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  UncontrolledAlert,
} from 'reactstrap';
import authToken from 'utils/authToken';

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      validateLoginStatus: '',
      validateLoginResponse: {},
      fullname: '',
      doctorname: '',
      doctorid: '',
      patientid: '',
      deviceid: '',
    };
  }
  get isLogin() {
    return this.props.authState === STATE_LOGIN;
  }

  get isSignup() {
    return this.props.authState === STATE_SIGNUP;
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  changeAuthState = authState => event => {
    event.preventDefault();
    // {console.log("uerma",this.state.username)}
    this.props.onChangeAuthState(authState);
  };

  handleSubmit = event => {
    event.preventDefault();

    if (this.props.authState === 'LOGIN') {
      console.log('The username:', this.props.username);
      console.log('Inside login function');
      //fetch('https://spc89vwj89.execute-api.us-west-1.amazonaws.com/Production', {
      fetch(
        'https://nwer0fflqd.execute-api.us-west-1.amazonaws.com/521_Token_Stage',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            User_ID: this.state.username,
            Password: this.state.password,
          }),
        },
      )
        .then(response => response.json())
        .then(validateLoginResponse => {
          const validateLoginStatus = validateLoginResponse.statusCode;
          this.setState({ validateLoginResponse, validateLoginStatus });
          console.log('response login', validateLoginResponse);

          if (
            validateLoginStatus === 200 &&
            validateLoginResponse.body.state === 1
          ) {
            console.log('inside 200 and got user');
            authToken.setToken(
              validateLoginResponse.body.token,
              validateLoginResponse.body.userinfo,
            );
            this.context.router.history.push('/');
          } else {
            alert(
              this.state.username +
                ' is not a valid username or incorrect password!',
            );
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else if (this.props.authState === 'SIGNUP') {
      if (this.state.birthday) var bday = this.state.birthday.split('/');
      if (!this.state.birthday || bday.length !== 3) {
        alert('Birthday format not correct: MM/DD/YYYY');
        return false;
      }

      console.log('Inside Registration function');
      // fetch('https://j982ampfu3.execute-api.us-west-1.amazonaws.com/Production/insert', {
      fetch(
        'https://rdu5hrg5aj.execute-api.us-west-1.amazonaws.com/521_Signup_Stage',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            User_ID: this.state.username,
            Email: this.state.email,
            Role: 0,
            Password: this.state.password,
            Birth_Year: bday[2],
            Birth_Mon: bday[0],
            Birth_Day: bday[1],
            Signup_Time: Math.floor(Date.now() / 1000),
            User_Name: this.state.fullname,
            Doctor_ID: this.state.doctorid,
          }),
        },
      )
        .then(response => response.json())
        .then(validateLoginResponse => {
          const validateLoginStatus = validateLoginResponse.statusCode;
          this.setState({ validateLoginResponse, validateLoginStatus });

          if (validateLoginStatus === 200) {
            console.log('inside 200');
            alert('You have been successfully signed up. Go login.');
            window.location.reload(false);
            //this.context.router.history.push('/login-modal');
          } else {
            // alert(this.state.username + 'is not a valid username!');
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  renderButtonText() {
    const { buttonText } = this.props;

    if (!buttonText && this.isLogin) {
      return 'Login';
    }

    if (!buttonText && this.isSignup) {
      return 'Signup';
    }

    return buttonText;
  }

  render() {
    const {
      showLogo,
      usernameLabel,
      usernameInputProps,
      passwordLabel,
      passwordInputProps,
      confirmPasswordLabel,
      confirmPasswordInputProps,
      children,
      onLogoClick,
      FullNameLabel,
      FullNameInputProps,
      EmailLabel,
      EmailInputProps,
      DoctorIdLabel,
      DoctorIdInputProps,
      BirthdayLabel,
      BirthdayInputProps,
    } = this.props;

    console.log('The props:', this.props);

    console.log('121The username:', this.props.username);

    return (
      <Form onSubmit={this.handleSubmit}>
        {showLogo && (
          <div className="text-center pb-4">
            <img
              src={logo200Image}
              style={{ width: 40, height: 30, cursor: 'pointer' }}
              alt="logo"
              onClick={onLogoClick}
            />
          </div>
        )}
        <FormGroup>
          <Label for={usernameLabel}>{usernameLabel}</Label>
          <Input
            onChange={e => {
              usernameInputProps.inputvalue = e.target.value;
              this.setState({ username: e.target.value });
            }}
            {...usernameInputProps}
          />
        </FormGroup>
        <FormGroup>
          <Label for={passwordLabel}>{passwordLabel}</Label>
          <Input
            onChange={e => {
              passwordInputProps.inputvalue = e.target.value;
              this.setState({ password: e.target.value });
            }}
            {...passwordInputProps}
          />
        </FormGroup>
        {this.isSignup && (
          <>
            <FormGroup>
              <Label for={confirmPasswordLabel}>{confirmPasswordLabel}</Label>
              <Input {...confirmPasswordInputProps} />
            </FormGroup>
            <FormGroup>
              <Label for={FullNameLabel}>{FullNameLabel}</Label>
              <Input
                onChange={e => {
                  FullNameInputProps.inputvalue = e.target.value;
                  this.setState({ fullname: e.target.value });
                }}
                {...FullNameInputProps}
              />
            </FormGroup>
            <FormGroup>
              <Label for={EmailLabel}>{EmailLabel}</Label>
              <Input
                onChange={e => {
                  EmailInputProps.inputvalue = e.target.value;
                  this.setState({ email: e.target.value });
                }}
                {...EmailInputProps}
              />
            </FormGroup>
            <FormGroup>
              <Label for={DoctorIdLabel}>{DoctorIdLabel}</Label>
              <Input
                onChange={e => {
                  DoctorIdInputProps.inputvalue = e.target.value;
                  this.setState({ doctorid: e.target.value });
                }}
                {...DoctorIdInputProps}
              />
            </FormGroup>
            <FormGroup>
              <Label for={BirthdayLabel}>{BirthdayLabel}</Label>
              <Input
                onChange={e => {
                  BirthdayInputProps.inputvalue = e.target.value;
                  this.setState({ birthday: e.target.value });
                }}
                {...BirthdayInputProps}
              />
            </FormGroup>
          </>
        )}
        <FormGroup check>
          <Label check>
            <Input type="checkbox" checked readOnly />{' '}
            {this.isSignup ? 'Agree the terms and policy' : 'Remember me'}
          </Label>
        </FormGroup>
        {this.state.validateLoginStatus === 500 ? (
          <UncontrolledAlert color="secondary">
            Invalid Login! User is not registered!{' '}
          </UncontrolledAlert>
        ) : null}
        <hr />
        <Button
          size="lg"
          className="bg-gradient-theme-left border-0"
          block
          onClick={this.handleSubmit}
        >
          {this.renderButtonText()}
        </Button>

        <div className="text-center pt-1">
          <h6>or</h6>
          <h6>
            {this.isSignup ? (
              <a href="#login" onClick={this.changeAuthState(STATE_LOGIN)}>
                Login
              </a>
            ) : (
              <a href="#signup" onClick={this.changeAuthState(STATE_SIGNUP)}>
                Signup
              </a>
            )}
          </h6>
        </div>

        {children}
      </Form>
    );
  }
}

// export const validationStatus = this.props.validateLoginStatus;
export const STATE_LOGIN = 'LOGIN';
export const STATE_SIGNUP = 'SIGNUP';

AuthForm.propTypes = {
  authState: PropTypes.oneOf([STATE_LOGIN, STATE_SIGNUP]).isRequired,
  showLogo: PropTypes.bool,
  usernameLabel: PropTypes.string,
  usernameInputProps: PropTypes.object,
  passwordLabel: PropTypes.string,
  passwordInputProps: PropTypes.object,
  confirmPasswordLabel: PropTypes.string,
  confirmPasswordInputProps: PropTypes.object,
  onLogoClick: PropTypes.func,
  FullNameLabel: PropTypes.string,
  FullNameInputProps: PropTypes.object,
  EmailLabel: PropTypes.string,
  EmailInputProps: PropTypes.object,
  DoctorIdLabel: PropTypes.string,
  DoctorIdInputProps: PropTypes.object,
  BirthdayLabel: PropTypes.string,
  BirthdayInputProps: PropTypes.object,
};

AuthForm.defaultProps = {
  authState: 'LOGIN',
  showLogo: true,
  usernameLabel: 'Username',
  usernameInputProps: {
    type: 'string',
    placeholder: 'your username',
    inputvalue: '',
  },
  passwordLabel: 'Password',
  passwordInputProps: {
    type: 'password',
    placeholder: 'your password',
    inputvalue: '',
  },
  confirmPasswordLabel: 'Confirm Password',
  confirmPasswordInputProps: {
    type: 'password',
    placeholder: 'confirm your password',
    inputvalue: '',
  },
  FullNameLabel: 'Patient Full Name',
  FullNameInputProps: {
    type: 'string',
    placeholder: 'Your full name',
    inputvalue: '',
  },
  EmailLabel: 'Email',
  EmailInputProps: {
    type: 'string',
    placeholder: 'hive@hive.com',
    inputvalue: '',
  },
  DoctorIdLabel: 'Provider ID',
  DoctorIdInputProps: {
    type: 'string',
    placeholder: 'Doctors ID',
    inputvalue: '',
  },
  BirthdayLabel: 'Birthday',
  BirthdayInputProps: {
    type: 'string',
    placeholder: 'MM/DD/YYYY',
    inputvalue: '',
  },

  onLogoClick: () => {},
};

export default AuthForm;
