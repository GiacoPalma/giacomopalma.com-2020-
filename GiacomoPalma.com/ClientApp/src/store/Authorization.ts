import {AppThunkAction} from "./";
import {Action, Reducer} from "redux";
import axios from 'axios';

export interface AuthorizationState {
    isAuthorized: boolean;
    authorization: Authorization;
}

export interface Authorization {
    token: string,
    tokenExpirationTime: number,
    id: number
}

// ACTIONS
interface RequestAuthorizationAction {
    type: 'REQUEST_AUTHORIZATION';
    username: string;
    password: string;
}

interface ReceiveAuthorizationAction {
    type: 'RECEIVE_AUTHORIZATION';
    authorization: Authorization
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestAuthorizationAction | ReceiveAuthorizationAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestAuthorization: (username: string, password: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        let authorized = appState.authorized ? appState.authorized.isAuthorized : false;
        if(!authorized)
        {
            axios.post('/api/auth/login',{
                username: username,
                password: password
            })
                .then(response => {
                    console.log(response);
                    if(response.status == 200)
                    {
                        dispatch({type: 'RECEIVE_AUTHORIZATION', authorization: response.data});
                    }
                });
        }
        
        dispatch({type: 'REQUEST_AUTHORIZATION', username: username, password: password});
    }
}

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: AuthorizationState = { isAuthorized: false, authorization: {token: "", tokenExpirationTime: 0, id: 0}};

export const reducer: Reducer<AuthorizationState> = (state: AuthorizationState | undefined, incomingAction: Action): AuthorizationState => {
    if(state === undefined)
    {
        return unloadedState;
    }
    
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case "RECEIVE_AUTHORIZATION":
             console.log("receive authorization reducer");
            return {
                authorization: action.authorization,
                isAuthorized: action.authorization.id > 0,
            };
        case "REQUEST_AUTHORIZATION":
            console.log("request authorization reducer");
            return {
                authorization: state.authorization,
                isAuthorized: state.isAuthorized
            }
    }
    
    return state;
};