import * as React from "react";
import {connect} from "react-redux";

class AdminPosts extends React.Component<any, any> {
    public render() {
        return (
            <h1>Admin Posts!</h1>
        )
    }
}

export default connect()(AdminPosts);