import * as React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faHome, faAddressCard, faPhone, faNewspaper} from "@fortawesome/free-solid-svg-icons";
import './NavMenu.css';

export default class NavMenu extends React.PureComponent<{}, { isOpen: boolean }> {
    public state = {
        isOpen: false
    };

    public render() {
        return (
            <header>
                <Navbar className="navbar-toggleable-sm mb-3" light>
                    <div className="navbar-container">
                        <button onClick={this.toggle} className={this.state.isOpen ? "hamburger-button open" : "hamburger-button"}>
                            <div className={this.state.isOpen ? "hamburger-bar open" : "hamburger-bar"}/>
                        </button>
                        <div className="navbar-collapse" aria-expanded={this.state.isOpen} >
                            <ul className="navbar-nav flex-grow">
                                <li className="navbar-nav flex-grow">
                                    <NavLink tag={Link} className="text-primary-color home-link" to="/">
                                        <FontAwesomeIcon className="menu-icon" icon={faHome}/>
                                        <span className="menu-text">Home</span>
                                    </NavLink>
                                </li>
                                <li className="navbar-nav flex-grow">
                                    <NavLink tag={Link} className="text-primary-color about-link" to="/about">
                                        <FontAwesomeIcon className="menu-icon" icon={faAddressCard}/>
                                        <span className="menu-text">About</span>
                                    </NavLink>
                                </li>
                                <li className="navbar-nav flex-grow">
                                    <NavLink tag={Link} className="text-primary-color projects-link" to="/projects">
                                        <FontAwesomeIcon className="menu-icon" icon={faBriefcase}/>
                                        <span className="menu-text">Projects</span>
                                    </NavLink>
                                </li>
                                <li className="navbar-nav flex-grow">
                                    <NavLink tag={Link} className="text-primary-color blog-link" to="/blog">
                                        <FontAwesomeIcon className="menu-icon" icon={faNewspaper}/>
                                        <span className="menu-text">Blog</span>
                                    </NavLink>
                                </li>
                                <li className="navbar-nav flex-grow">
                                    <NavLink tag={Link} className="text-primary-color contact-link" to="/contact">
                                        <FontAwesomeIcon className="menu-icon" icon={faPhone}/>
                                        <span className="menu-text">Contact</span>
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Navbar>
            </header>
        );
    }

    private toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
}
