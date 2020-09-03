import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as AboutStore from '../store/About';

type AboutProps =
    AboutStore.AboutState &
    typeof AboutStore.actionCreators &
    RouteComponentProps<{}>;

class About extends React.PureComponent<AboutProps> {
    public render() {
        return (
            <React.Fragment>
                <h1>About</h1>

                <p>This is a simple example of a React component.</p>

                <p aria-live="polite">Current count: <strong>{this.props.count}</strong></p>

                <button type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => { this.props.increment(); }}>
                    Increment
                </button>
            </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.counter,
    AboutStore.actionCreators
)(About);
