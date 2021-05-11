import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

type CreateResumePostProps = RouteComponentProps;

class CreateResumePost extends React.Component<CreateResumePostProps, any> {
    public render() {
        return (
            <div>Hello Create Post</div>
        )
    }
}

export default connect()(CreateResumePost);