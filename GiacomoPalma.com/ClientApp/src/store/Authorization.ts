import {AppThunkAction} from "./";
import {Action, Reducer} from "redux";
import axios, {AxiosResponse} from 'axios';
import Requester from "../api";

export const REQUEST_AUTHORIZATION = "REQUEST_AUTHORIZATION";
export const RECEIVE_AUTHORIZATION = "RECEIVE_AUTHORIZATION";
export const FAILED_AUTHORIZATION = "FAILED_AUTHORIZATION";

export interface AuthorizationState {
    isAuthorized: boolean;
    authorizationData: AuthorizationData;
}

export interface AuthorizationData {
    token: string,
    tokenExpirationTime: number,
    refreshToken: string
}

// ACTIONS
interface RequestAuthorizationAction {
    type: typeof REQUEST_AUTHORIZATION;
    username: string;
    password: string;
}

interface ReceiveAuthorizationAction {
    type: typeof RECEIVE_AUTHORIZATION;
    authorizationData: AuthorizationData
}

interface FailedAuthorizationAction {
    type: typeof FAILED_AUTHORIZATION;
    reason: string
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestAuthorizationAction | ReceiveAuthorizationAction | FailedAuthorizationAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestAuthorization: (username: string, password: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        let authorized = appState.authorization ? appState.authorization.isAuthorized : false;
        if(!authorized)
        {
            Requester.getInstance().post('/api/auth/login', {
                username: username,
                password: password
            }).then(response => {
                    console.log(response);
                    if(response.status == 200)
                    {
                        let authData = response.data as AuthorizationData;
                        let expirationTime = new Date(authData.tokenExpirationTime * 1000)
                        // TODO handle expiration of token
                       dispatch({type: RECEIVE_AUTHORIZATION, authorizationData: authData});
                    }
                })
                .catch(reason => {
                    console.error(reason);
                    dispatch({type: FAILED_AUTHORIZATION, reason: reason });
                });
        }
        
        dispatch({type: REQUEST_AUTHORIZATION, username: username, password: password});
    },
    requestRefreshToken:(): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        let authorized = appState.authorization ? appState.authorization.isAuthorized : false;
        if (!authorized)
        {
            Requester.getInstance().get('/api/auth/refreshtoken')
                .then(response => {
                    console.log(response);
                    dispatch({type: RECEIVE_AUTHORIZATION, authorizationData: response.data});
                })
                .catch(reason => {
                    console.error(reason);
                    dispatch({ type: FAILED_AUTHORIZATION, reason: reason });
                })
        }
    }
}

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: AuthorizationState = { isAuthorized: false, authorizationData: {token: "", tokenExpirationTime: 0, refreshToken: ""}};

export const reducer: Reducer<AuthorizationState> = (state: AuthorizationState | undefined, incomingAction: Action): AuthorizationState => {
    if(state === undefined)
    {
        return unloadedState;
    }
    
    const action = incomingAction as KnownAction;
    switch (action.type) 
    {
        case RECEIVE_AUTHORIZATION:
             console.log("receive authorization");
             return Object.assign({}, state, {
                 authorizationData: action.authorizationData,
                 isAuthorized: action.authorizationData.token.length > 0
             });
        case REQUEST_AUTHORIZATION:
            console.log("request authorization");
            return Object.assign({}, state, 
                {
                    authorizationData: unloadedState.authorizationData,
                    isAuthorized: false
                });
        case FAILED_AUTHORIZATION:
            console.log("failed authorization");
            return Object.assign({}, state, 
                {
                    authorizationData: unloadedState.authorizationData,
                    isAuthorized: false
                })
        default:
            return state;
    }
};