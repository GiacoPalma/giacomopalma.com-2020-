import * as React from "react";
import * as ProjectsStore from "../store/Projects";
import {ApplicationState} from "../store";
import {connect} from "react-redux";
import './Projects.css';

type ProjectsProps = 
    ProjectsStore.ProjectsState
    & typeof ProjectsStore.actionCreators;

class Projects extends React.PureComponent<ProjectsProps, {}> {
    
    componentDidMount() {
        this.props.requestProjects();
    }

    public render() {
        return (
            <React.Fragment>
                <h1>Projects</h1>
                <div className="projects-container">
                    <ul className="projects-list">
                        {this.props.projects.map(project => 
                        <li key={project.id} className="project-item">
                            <div className="project-name">{project.name}</div>
                            <div className="project-thumbnail-wrapper">
                                <div className="project-thumbnail"><img src={project.thumbnail}/></div>
                                <div className="project-reflection" style={{backgroundImage: `url(${project.thumbnail})`}}/></div>
                        </li>
                        )}
                    </ul>
                </div>
            </React.Fragment>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.projects,
    ProjectsStore.actionCreators
)(Projects as any)