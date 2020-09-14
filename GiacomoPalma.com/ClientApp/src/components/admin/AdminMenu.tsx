import * as React from "react";
import './AdminMenu.css';
import {useRouteMatch} from "react-router";
import {NavLink} from "reactstrap";
import {Link} from "react-router-dom";

export default (props: { baseUrl: string }) => {
    let matchPost = useRouteMatch(`${props.baseUrl}/posts`);
    let matchProject = useRouteMatch(`${props.baseUrl}/projects`);
    
    return (
        <React.Fragment>
            <div className="admin-menu-container">
                <h1>Admin panel</h1>
                <ul className="admin-menu">
                    <li className="admin-menu-item">
                        <NavLink tag={Link} className={matchPost ? "admin-menu-link active" : "admin-menu-link"} to={`${props.baseUrl}/posts`}>Posts</NavLink>
                    </li>
                    <li className="admin-menu-item">
                        <NavLink tag={Link} className={matchProject ? "admin-menu-link active" : "admin-menu-link"} to={`${props.baseUrl}/projects`}>Projects</NavLink>
                    </li>
                </ul>
            </div>
        </React.Fragment>
    )
}