import * as React from "react";
import * as ProjectStore from "../../store/Projects";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";
import {ApplicationState} from "../../store";
import './ProjectList.css';
import EditProject from "./EditProject";
import {NavLink} from "reactstrap";
import {Link} from "react-router-dom";

type ProjectListProps =
    ProjectStore.ProjectsState // ... state we've requested from the Redux store
    & typeof ProjectStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps;

type ProjectListState = {
    project: ProjectStore.Project | undefined
    isEditing: boolean
}

class ProjectList extends React.Component<ProjectListProps, ProjectListState> {
    public state: ProjectListState = {
        project: undefined,
        isEditing: false
    }
    
    public componentDidMount() {
        this.props.requestProjects();
    }

    public render(){
        return(
            <ul className="project-list-admin">
                {this.props.projects.map((project: ProjectStore.Project) =>
                    <li key={project.id} className="project-item-admin-li">
                        <NavLink className="project-item-admin" tag={Link} to={`${this.props.match.url}get/${project.id}`}>
                            <div className="project-thumbnail"><img src={process.env.PUBLIC_URL + project.thumbnail}/>
                            </div>
                            <div className="project-name">{project.name}</div>
                        </NavLink>
                    </li>
                )}
            </ul>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.projects,
    ProjectStore.actionCreators
)(ProjectList as any)