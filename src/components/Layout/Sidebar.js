import logo200Image from 'assets/img/logo/hive-logo-white.png';
import SourceLink from 'components/SourceLink';
import React from 'react';
import {
  MdDashboard,
  MdInsertChart,
  MdViewList,
  MdWeb,
  MdWidgets,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { Nav, Navbar, NavItem, NavLink as BSNavLink } from 'reactstrap';
import bn from 'utils/bemnames';
import authToken from 'utils/authToken';

var navItems = [
  { to: '/dashboard', name: 'dashboard', exact: true, Icon: MdDashboard },
  { to: '/cards', name: 'Device', exact: false, Icon: MdWeb },
  { to: '/charts', name: 'Treatment Plan', exact: false, Icon: MdInsertChart },
  //{ to: '/widgets', name: 'widgets', exact: false, Icon: MdWidgets },
];

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  state = {
    isOpenComponents: true,
    isOpenContents: true,
    isOpenPages: true,
  };

  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };

  decideSidebar() {
    var token = authToken.getToken();
    var userinfo = authToken.getUserinfo();
    if (!token) {
      navItems = [
        { to: '/login-modal', name: 'Login', exact: true, Icon: MdDashboard },
      ];
    } else {
      if (userinfo.Role === 1) {
        // doctor view
        navItems = [
          { to: '/', name: 'Patients', exact: true, Icon: MdWidgets },
          {
            to: '/doctor-patientdashboard/-1',
            name: 'dashboard',
            exact: false,
            Icon: MdDashboard,
          },
          // {
          //   to: '/doctor-devicelist/-1',
          //   name: 'All Devices',
          //   exact: false,
          //   Icon: MdWeb,
          // },
          {
            to: '/doctor-patientschedule/-1',
            name: 'Patient Schedule',
            exact: false,
            Icon: MdInsertChart,
          },
          {
            to: '/schedule-form',
            name: 'Modify Schedule',
            exact: false,
            Icon: MdInsertChart,
          },
          // {
          //   to: '/doctor-patientchart/-1',
          //   name: 'Charts',
          //   exact: false,
          //   Icon: MdInsertChart,
          // },
          //{ to: '/widgets', name: 'widgets', exact: false, Icon: MdWidgets },
        ];
      } else {
        navItems = [
          {
            to: '/dashboard',
            name: 'dashboard',
            exact: true,
            Icon: MdDashboard,
          },
          { to: '/cards', name: 'Device', exact: false, Icon: MdWeb },
          {
            to: '/schedule',
            name: 'Schedule',
            exact: false,
            Icon: MdInsertChart,
          },
          { to: '/charts', name: 'Charts', exact: false, Icon: MdViewList },
          //{ to: '/widgets', name: 'widgets', exact: false, Icon: MdWidgets },
        ];
      }
    }
  }

  componentDidMount() {
    this.decideSidebar();
  }

  render() {
    var userinfo = authToken.getUserinfo();
    var doctor_classname = '';
    var stitle = '';
    if (userinfo && userinfo.Role === 1) {
      doctor_classname = 'doctorview';
      stitle = 'Provider';
    }
    this.decideSidebar();
    return (
      <aside id={doctor_classname} className={bem.b()}>
        <div className={bem.e('background')} />
        <div className={bem.e('content')}>
          <Navbar>
            <SourceLink
              className="navbar-brand d-flex text-white"
              style={{ columnGap: '0.75rem' }}
            >
              <img src={logo200Image} width="40" height="30" alt="logo" />
              {stitle}
            </SourceLink>
          </Navbar>
          <Nav vertical>
            {navItems.map(({ to, name, exact, Icon }, index) => (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className="text-uppercase"
                  tag={NavLink}
                  to={to}
                  activeClassName="active"
                  exact={exact}
                >
                  <Icon className={bem.e('nav-item-icon')} />
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>
            ))}
            {/* 
            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('Components')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdExtension className={bem.e('nav-item-icon')} />
                  <span className=" align-self-start">Components</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenComponents
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenComponents}>
              {navComponents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse> */}

            {/* <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('Contents')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdSend className={bem.e('nav-item-icon')} />
                  <span className="">Contents</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenContents
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenContents}>
              {navContents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>

            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('Pages')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdPages className={bem.e('nav-item-icon')} />
                  <span className="">Pages</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenPages
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem> */}
            {/* <Collapse isOpen={this.state.isOpenPages}>
              {pageContents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse> */}
          </Nav>
        </div>
      </aside>
    );
  }
}

export default Sidebar;
