import * as React from 'react';
import LoginForm from "./LoginForm";
import {connect} from "react-redux";

class AdminLogin extends React.Component<{},{}> {
    public render(){
        return (
            <React.Fragment>
                <h1>Please log in below</h1>
                <LoginForm/>
            </React.Fragment>
        )
    }
}

export default connect()(AdminLogin);