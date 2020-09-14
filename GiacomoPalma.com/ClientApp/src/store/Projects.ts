import {AppThunkAction} from "./index";
import Requester from "../api";
import {Action, Reducer} from "redux";

export const REQUEST_PROJECTS = "REQUEST_PROJECTS";
export const REQUEST_PROJECT = "REQUEST_PROJECT";
export const CREATE_PROJECT = "CREATE_PROJECT";
export const CREATE_PROJECT_ERROR = "CREATE_PROJECT_ERROR";
export const UPDATE_PROJECT = "UPDATE_PROJECT";
export const RECEIVE_PROJECTS = "RECEIVE_PROJECTS";
export const SET_SELECTED_PROJECT = "SET_SELECTED_PROJECT";

export interface ProjectsState {
    isLoading: boolean,
    hasError: boolean,
    error: string,
    selectedProject?: Project,
    projects: Project[]
}

export interface Project {
    name: string,
    id: number,
    thumbnail: string,
    url: string,
    description: string
}

// ACTIONS
interface RequestProjectsAction {
    type: typeof REQUEST_PROJECTS;
}

interface RequestProjectAction {
    type: typeof REQUEST_PROJECT;
    id: number;
}

interface CreateProjectAction {
    type: typeof CREATE_PROJECT;
    project: FormData;
}

interface CreateProjectErrorAction {
    type: typeof CREATE_PROJECT_ERROR;
    reason: string;
}

interface UpdateProjectAction {
    type: typeof UPDATE_PROJECT;
    project: Project
}

interface ReceiveProjectsAction {
    type: typeof RECEIVE_PROJECTS;
    projects: Project[]
}

interface SetSelectedProjectAction {
    type: typeof SET_SELECTED_PROJECT;
    project: Project;
}

type KnownAction = RequestProjectAction | RequestProjectsAction | UpdateProjectAction | ReceiveProjectsAction | CreateProjectAction | CreateProjectErrorAction | SetSelectedProjectAction;

export const actionCreators = {
    requestProjects: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        Requester.getInstance().get("api/projects")
            .then(response => {
                console.log("got projects");
                console.log(response);
                dispatch({type: RECEIVE_PROJECTS, projects: response.data});
            })
            .catch(reason => {
                console.log("failed at getting projects");
                console.error(reason);
            })
        
        dispatch({ type: REQUEST_PROJECTS });
    },
    createProject: (project: FormData): AppThunkAction<KnownAction> => (dispatch, getState) => {
        Requester.getInstance().postForm("api/projects", project)
            .then(response => {
                console.log("created project");
                console.log(response);
                dispatch({ type: RECEIVE_PROJECTS, projects: [response.data]});
                dispatch({type: SET_SELECTED_PROJECT, project: response.data});
            })
            .catch(reason => {
                console.log("failed at creating project");
                console.error(reason);
                dispatch({ type: CREATE_PROJECT_ERROR, reason: reason.response.data });
            })
        
        dispatch({ type: CREATE_PROJECT, project: project});
    }
}

const unloadedState: ProjectsState = { isLoading: false, projects: [], selectedProject: undefined, hasError: false, error: "" }

export const reducer: Reducer<ProjectsState> = (state: ProjectsState | undefined, incomingAction: Action): ProjectsState => {
    if (state === undefined)
    {
        return unloadedState;
    }
    
    const action = incomingAction as KnownAction;
    switch (action.type)
    {
        case REQUEST_PROJECTS:
            console.log("request projects reducer");
            return Object.assign({}, state, {
                isLoading: true,
            });
        case CREATE_PROJECT:
            console.log("create project reducer");
            return Object.assign({}, state, {
                isLoading: true,
                selectedProject: action.project
            });
        case CREATE_PROJECT_ERROR:
            console.log("create project error");
            return Object.assign({}, state, {
                hasError: true,
                error: action.reason
            });
        case SET_SELECTED_PROJECT:
            console.log("set selected project");
            return Object.assign({}, state, {
                hasError: false,
                isLoading: false,
                selectedProject: action.project
            });
        case RECEIVE_PROJECTS:
            console.log("receive projects reducer");
            return Object.assign({}, state, {
                isLoading: false,
                projects: action.projects
            });
        default:
            return state;
    }
};