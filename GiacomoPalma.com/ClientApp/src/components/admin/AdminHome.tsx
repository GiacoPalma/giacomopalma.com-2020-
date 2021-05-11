import * as React from 'react';
import LoginForm from "./LoginForm";
import {connect} from "react-redux";
import * as AuthorizationStore from "../../store/Authorization";
import {Route, RouteComponentProps} from "react-router";
import {ApplicationState} from "../../store";
import AdminPosts from "./posts/AdminPosts";
import AdminProjects from "./projects/AdminProjects";
import AdminMenu from "./AdminMenu";

type AdminHomeProps =
    AuthorizationStore.AuthorizationState // ... state we've requested from the Redux store
    & typeof AuthorizationStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps

class AdminHome extends React.Component<AdminHomeProps, {}> {
    
    public componentDidMount() {
        console.log(this.props);
        // if we are not authorized, we should try to refresh token in case we already logged in recently.
        if(!this.props.isAuthorized)
        {
            this.props.requestRefreshToken();
        }
    }

    public renderLogin = () => {
        return (<React.Fragment>
            <h1>Please log in below</h1>
            <LoginForm/>
        </React.Fragment>)
    }
    
    public renderAdmin = () => {
        return (
            <React.Fragment>
                <AdminMenu baseUrl={this.props.match.url}/>

                <Route path={`${this.props.match.url}/posts`} component={AdminPosts} key="adminposts"/>
                <Route path={`${this.props.match.url}/projects`} component={AdminProjects} key="adminprojects"/>
            </React.Fragment>
        )
    }

    public render() {
        let isAuthorized = this.props.isAuthorized;
        return isAuthorized ? this.renderAdmin() : this.renderLogin();
    }
}

export default connect(
    (state: ApplicationState) => state.authorization,
    AuthorizationStore.actionCreators
)(AdminHome as any);