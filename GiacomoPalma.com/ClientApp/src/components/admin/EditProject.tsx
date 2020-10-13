import * as React from "react";
import * as ProjectsStore from "../../store/Projects";
import {ChangeEvent, FormEvent} from "react";
import {ApplicationState} from "../../store";
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";

type EditProjectProps = 
    ProjectsStore.ProjectsState 
    & typeof ProjectsStore.actionCreators
    & RouteComponentProps<{projectId: string}>

type EditProjectState = {
    name: string,
    description: string,
    url: string,
    file?: File,
}

class EditProject extends React.Component<EditProjectProps, EditProjectState>{

    public state: EditProjectState = {
        name: "",
        description: "",
        url: "",
        file: undefined
    }
    
    public componentDidMount() {
        let project = this.props.projects.find(p => p.id == parseInt(this.props.match.params.projectId));
        console.log(project);
        if(project != undefined)
        {
            this.setState({
                name: project.name,
                description: project.description,
                url: project.url,
                file: undefined
            })
        }
    }

    public onUpdateProject = (e: FormEvent) => {
        console.log(this.state);
        e.preventDefault();
        let formData = new FormData();
        formData.set("name", this.state.name);
        formData.set("description", this.state.description);
        formData.set("url", this.state.url);
        if (this.state.file) {
            formData.set("thumbnail", this.state.file, this.state.file.name);
        }

        this.props.createProject(formData);
    }
    
    public onInputChange = (e:ChangeEvent) => {
        let target = e.target as HTMLInputElement;
        switch (target.id) {
            case "project-name":
                this.setState({name: target.value});
                break;
            case "project-description":
                this.setState({description: target.value});
                break;
            case "project-url":
                this.setState({url: target.value});
                break;
            default:
                console.log("not valid id", target.id);
                break;
        }
    }
    
    public onFileChange = (e:ChangeEvent) => {
        let target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            console.log(target.files[0]);
            let file = target.files[0];
            this.setState({file: file});
        }
    }
    
    public render(){
        return (
            <div className="create-project-container">
                <form onSubmit={this.onUpdateProject} className="create-project-form">
                    <label htmlFor="project-name">Name:</label>
                    <input id="project-name" name="project-name" onChange={this.onInputChange} type="text"
                           value={this.state.name}/>

                    <label htmlFor="project-description">Description:</label>
                    <textarea id="project-description" name="project-description" onChange={this.onInputChange} rows={4}
                              value={this.state.description}/>

                    <label htmlFor="project-url">URL:</label>
                    <input id="project-url" name="project-url" onChange={this.onInputChange} type="text"
                           value={this.state.url}/>

                    <label htmlFor="project-thumbnail">Thumbnail:</label>
                    <input id="project-thumbnail" name="project-thumbnail" accept="image/*" onChange={this.onFileChange}
                           type="file"/>
                    <div className="error-message">
                        {this.props.hasError ? this.props.error : ""}
                    </div>
                    <div className="success-message">
                        {this.props.selectedProject != undefined ? "Project updated successfully!" : ""}
                    </div>
                    <button type="submit" className="btn btn-primary">Save</button>
                </form>
            </div>
        )
    }
}



export default connect(
    (state: ApplicationState) => state.projects,
    ProjectsStore.actionCreators
)(EditProject as any)