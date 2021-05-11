import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";

type ResumeListProps = RouteComponentProps;

class ResumeList extends React.Component<ResumeListProps, any> {
    public render() {
        return (
            <div>Hello Create Post</div>
        )
    }
}

export default connect()(ResumeList);