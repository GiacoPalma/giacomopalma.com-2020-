import * as React from 'react';
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ChangeEvent, FormEvent } from "react";
import { ApplicationState } from "../../store";
import * as AuthorizationStore from "../../store/Authorization";

interface LoginFormState {
    username: string,
    password: string
}

// At runtime, Redux will merge together...
type LoginFormProps =
    AuthorizationStore.AuthorizationState // ... state we've requested from the Redux store
    & typeof AuthorizationStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{}>

class LoginForm extends React.PureComponent<LoginFormProps, LoginFormState> {
    
    public state: LoginFormState = {
        username: "",
        password: ""
    }
    
    public submitForm = (e:FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        console.log("submitting form");
        console.log(`Username ${this.state.username} and Password ${this.state.password}`);
        this.props.requestAuthorization(this.state.username, this.state.password);
    }
    
    public onUsernameChange = (e:ChangeEvent) => {
        let target = e.target as HTMLInputElement;
        this.setState({username: target.value});
    }
    
    public onPasswordChange = (e:ChangeEvent) => {
        let target = e.target as HTMLInputElement;
        this.setState({password: target.value});
    }
    
    public render(){
        return (
            <form onSubmit={this.submitForm}>
                <label>Is authorized: {this.props.isAuthorized ? "logged in!" : "not logged in"}</label>
                <br/>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" onChange={this.onUsernameChange} placeholder="username" value={this.state.username}/>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" onChange={this.onPasswordChange} placeholder="password" value={this.state.password}/>
                <button type="submit">Log in</button>
            </form>
        )
    }
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        isAuthorized: state.authorized ? state.authorized.isAuthorized : false,
        authorization: state.authorized? state.authorized.authorization : {}
    }
}

export default connect(
    mapStateToProps,
    AuthorizationStore.actionCreators
)(LoginForm as any);