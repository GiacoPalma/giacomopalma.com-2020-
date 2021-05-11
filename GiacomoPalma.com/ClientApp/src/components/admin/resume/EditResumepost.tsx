import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

type EditResumePostProps = RouteComponentProps;

class EditResumePost extends React.Component<EditResumePostProps, any> {
    public render() {
        return (
            <div>Hello Edit Post</div>
        )
    }
}

export default connect()(EditResumePost);