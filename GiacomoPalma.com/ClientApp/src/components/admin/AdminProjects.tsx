import * as React from "react";
import {connect} from "react-redux";
import './AdminProjects.css';
import CreateProject from "./CreateProject";
import ProjectList from "./ProjectList";
import {Route, RouteComponentProps} from "react-router";
import AdminPosts from "./AdminPosts";
import EditProject from "./EditProject";

type AdminProjectsProps = RouteComponentProps;

class AdminProjects extends React.Component<AdminProjectsProps, any>{
    public render(){
        return (
            <div className="admin-projects-container">
                <h1>Projects</h1>
                <Route exact path={`${this.props.match.url}/`} component={ProjectList} key="adminprojectlist"/>
                <Route exact path={`${this.props.match.url}/get/:projectId?`} component={EditProject} key="admineditproject"/>
                <Route exact path={`${this.props.match.url}/create`} component={CreateProject} key="admincreateproject"/>
            </div>
        )
    }
}

export default connect()(AdminProjects);