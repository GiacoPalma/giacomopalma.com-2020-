import * as React from "react";
import {connect} from "react-redux";
import './AdminProjects.css';
import CreateResumePost from "./CreateResumePost";
import ResumeList from "./ResumeList";
import {Route, RouteComponentProps} from "react-router";
import EditResumePost from "./EditResumePost";
import { NavLink } from "reactstrap";
import { Link } from "react-router-dom";

type AdminResumeProps = RouteComponentProps;

class AdminResume extends React.Component<AdminResumeProps, any>{
    public render(){
        return (
            <div className="admin-projects-container">
                <h1>Projects</h1>
                <NavLink tag={Link} className="admin-create-btn" to={`${this.props.location.pathname}/create`}>Create Resume Post</NavLink>
                <Route exact path={`${this.props.match.url}/`} component={ResumeList} key="adminresumelist"/>
                <Route exact path={`${this.props.match.url}/get/:postId?`} component={EditResumePost} key="admineditresumepost"/>
                <Route exact path={`${this.props.match.url}/create`} component={CreateResumePost} key="admincreateresumepost"/>
            </div>
        )
    }
}

export default connect()(AdminResume);