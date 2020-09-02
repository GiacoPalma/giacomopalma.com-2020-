import * as React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export default class NavMenu extends React.PureComponent<{}, { isOpen: boolean }> {
    public state = {
        isOpen: false
    };

    public render() {
        return (
            <header>
                <Navbar className="navbar-toggleable-sm mb-3" light>
                    <Container>
                        <NavbarToggler onClick={this.toggle} className="hamburger-button"/>
                        <Collapse className="menu-collapse" isOpen={this.state.isOpen} navbar>
                            <ul className="navbar-nav flex-grow">
                                <NavItem>
                                    <NavLink tag={Link} className="text-primary-color btn-primary navmenu-item" to="/">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-primary-color btn-primary navmenu-item" to="/counter">About</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-primary-color btn-primary navmenu-item" to="/fetch-data">Projects</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-primary-color btn-primary navmenu-item" to="/fetch-data">Blog</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-primary-color btn-primary navmenu-item" to="/fetch-data">Contact</NavLink>
                                </NavItem>
                            </ul>
                        </Collapse>
                    </Container>
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
