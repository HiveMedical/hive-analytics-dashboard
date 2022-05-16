import logo200Image from 'assets/img/logo/hive-logo-color.png';
import Avatar from 'components/Avatar';
import { UserCard } from 'components/Card';
import Notifications from 'components/Notifications';
import SearchInput from 'components/SearchInput';
import { notificationsData } from 'demos/header';
import withBadge from 'hocs/withBadge';
import React from 'react';
import {
  MdClearAll,
  MdExitToApp,
  MdHelp,
  MdInsertChart,
  MdMessage,
  MdNotificationsActive,
  MdNotificationsNone,
  MdPersonPin,
  MdSettingsApplications,
  MdPrint,
} from 'react-icons/md';
import {
  Button,
  ListGroup,
  ListGroupItem,
  // NavbarToggler,
  Nav,
  Navbar,
  NavItem,
  NavLink,
  Popover,
  PopoverBody,
} from 'reactstrap';
import bn from 'utils/bemnames';
import PropTypes from 'prop-types';
import authToken from 'utils/authToken';

const bem = bn.create('header');

const MdNotificationsActiveWithBadge = withBadge({
  size: 'md',
  color: 'primary',
  style: {
    top: -10,
    right: -10,
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  children: <small>2</small>,
})(MdNotificationsActive);

class Header extends React.Component {
  state = {
    isOpenNotificationPopover: false,
    isNotificationConfirmed: false,
    isOpenUserCardPopover: false,
    token: null,
    userinfo: null,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  signout = () => {
    authToken.clearToken();
    this.toggleUserCardPopover();
    this.context.router.history.push('/login-modal');
  };

  toggleNotificationPopover = () => {
    this.setState({
      isOpenNotificationPopover: !this.state.isOpenNotificationPopover,
    });

    if (!this.state.isNotificationConfirmed) {
      this.setState({ isNotificationConfirmed: true });
    }
  };

  toggleUserCardPopover = () => {
    this.setState({
      isOpenUserCardPopover: !this.state.isOpenUserCardPopover,
    });
  };

  handleSidebarControlButton = event => {
    event.preventDefault();
    event.stopPropagation();

    document.querySelector('.cr-sidebar').classList.toggle('cr-sidebar--open');
  };

  render() {
    const { isNotificationConfirmed } = this.state;
    this.token = authToken.getToken();
    this.userinfo = authToken.getUserinfo();
    var stitle = '';
    if (this.userinfo && this.userinfo.Role === 1) {
      stitle = 'Provider';
    }

    return (
      <Navbar light expand className={bem.b('bg-white')}>
        <Nav navbar className="mr-2 only-print">
          <div
            className="d-flex align-items-center"
            style={{ columnGap: '0.75rem' }}
          >
            <img src={logo200Image} width="40" height="30" alt="logo" />
            {stitle}
          </div>
        </Nav>
        <Nav navbar className="mr-2 no-print">
          <Button outline onClick={this.handleSidebarControlButton}>
            <MdClearAll size={25} />
          </Button>
        </Nav>
        <Nav navbar className="no-print">
          {!!this.token && <SearchInput />}
        </Nav>

        {!!this.token && (
          <Nav navbar className={`${bem.e('nav-right')} no-print`}>
            <NavItem className="d-inline-flex">
              <NavLink className="position-relative">
                <MdPrint
                  size={25}
                  className="text-primary can-click"
                  onClick={() => window.print()}
                />
              </NavLink>
            </NavItem>

            <NavItem className="d-inline-flex">
              <NavLink id="Popover1" className="position-relative">
                {isNotificationConfirmed ? (
                  <MdNotificationsNone
                    size={25}
                    className="text-primary can-click"
                    onClick={this.toggleNotificationPopover}
                  />
                ) : (
                  <MdNotificationsActiveWithBadge
                    size={25}
                    className="text-primary can-click animated swing infinite"
                    onClick={this.toggleNotificationPopover}
                  />
                )}
              </NavLink>
              <Popover
                placement="bottom"
                isOpen={this.state.isOpenNotificationPopover}
                toggle={this.toggleNotificationPopover}
                target="Popover1"
              >
                <PopoverBody>
                  <Notifications notificationsData={notificationsData} />
                </PopoverBody>
              </Popover>
            </NavItem>

            <NavItem>
              <NavLink id="Popover2">
                <Avatar
                  onClick={this.toggleUserCardPopover}
                  className="can-click"
                />
              </NavLink>
              <Popover
                placement="bottom-end"
                isOpen={this.state.isOpenUserCardPopover}
                toggle={this.toggleUserCardPopover}
                target="Popover2"
                className="p-0 border-0"
                style={{ minWidth: 250 }}
              >
                <PopoverBody className="p-0 border-light">
                  <UserCard
                    title={this.userinfo.User_Name}
                    subtitle={this.userinfo.Email}
                    text="Last updated 3 mins ago"
                    className="border-light"
                  >
                    <ListGroup flush>
                      <ListGroupItem
                        tag="button"
                        action
                        className="border-light"
                      >
                        <MdPersonPin /> Profile
                      </ListGroupItem>
                      <ListGroupItem
                        tag="button"
                        action
                        className="border-light"
                      >
                        <MdInsertChart /> Stats
                      </ListGroupItem>
                      <ListGroupItem
                        tag="button"
                        action
                        className="border-light"
                      >
                        <MdMessage /> Messages
                      </ListGroupItem>
                      <ListGroupItem
                        tag="button"
                        action
                        className="border-light"
                      >
                        <MdSettingsApplications /> Settings
                      </ListGroupItem>
                      <ListGroupItem
                        tag="button"
                        action
                        className="border-light"
                      >
                        <MdHelp /> Help
                      </ListGroupItem>
                      <ListGroupItem
                        tag="button"
                        action
                        className="border-light"
                        onClick={this.signout}
                      >
                        <MdExitToApp /> Signout
                      </ListGroupItem>
                    </ListGroup>
                  </UserCard>
                </PopoverBody>
              </Popover>
            </NavItem>
          </Nav>
        )}
      </Navbar>
    );
  }
}

export default Header;
