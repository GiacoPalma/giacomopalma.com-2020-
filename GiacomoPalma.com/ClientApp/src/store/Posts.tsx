import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";
import Requester from "../api";

export const REQUEST_POSTS = "REQUEST_POSTS";
export const REQUEST_POST = "REQUEST_POST";
export const CREATE_POST = "CREATE_POST";
export const CREATE_POST_ERROR = "CREATE_POST_ERROR";
export const UPDATE_POST = "UPDATE_POST";
export const RECEIVE_POSTS = "RECEIVE_POSTS";
export const SET_SELECTED_POST = "SET_SELECTED_POST";

export interface PostsState {
    isLoading: boolean,
    hasError: boolean,
    error: string,
    selectedPost?: Post,
    posts: Post[]
}

export interface Post {
    title: string,
    id: number,
    content: string,
    url: string
}

interface RequestPostsAction {
    type: typeof REQUEST_POSTS;
}

interface RequestPostAction {
    type: typeof REQUEST_POST;
    id: number;
}

interface CreatePostAction {
    type: typeof CREATE_POST;
    post: FormData;
}

interface CreatePostErrorAction {
    type: typeof CREATE_POST_ERROR;
    reason: string;
}

interface UpdatePostAction {
    type: typeof UPDATE_POST;
    post: Post;
}

interface ReceivePostsAction {
    type: typeof RECEIVE_POSTS;
    posts: Post[];
}

interface SetSelectedPostAction {
    type: typeof SET_SELECTED_POST;
    post: Post;
}

type KnownAction = RequestPostsAction |
                    RequestPostAction |
                    UpdatePostAction |
                    CreatePostAction |
                    CreatePostErrorAction |
                    ReceivePostsAction |
                    SetSelectedPostAction;

export const actionCreators = {
    requestPosts: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        Requester.getInstance().get("api/posts")
            .then(response => {
                console.log("got posts");
                console.log(response);
                dispatch({ type: RECEIVE_POSTS, posts: response.data });
            })
            .catch(reason => {
                console.error("Failed getting posts");
                console.error(reason);
            })

        dispatch({ type: REQUEST_POSTS });
    },
    updatePost: (post: FormData): AppThunkAction<KnownAction> => (dispatch, getState) => {
        Requester.getInstance().put("api/posts/" + post.get("id"), post, {headers: { "Content-Type": "multipart/form-data"}})
            .then(response => {
                console.log("update post");
                console.log(response);
                dispatch({ type: SET_SELECTED_POST, post: response.data });
            })
            .catch(reason => {
                console.error("Failed at updating post");
                dispatch({ type: CREATE_POST_ERROR, reason: reason.response.data });
            })
    },
    createPost: (post: FormData): AppThunkAction<KnownAction> => (dispatch, getState) => {
        Requester.getInstance().postForm("api/posts", post)
            .then(response => {
                console.log("created post");
                console.log(response);
                dispatch({ type: RECEIVE_POSTS, posts: [response.data] });
                dispatch({ type: SET_SELECTED_POST, post: response.data });
            })
            .catch(reason => {
                console.log("failed at creating post");
                console.error(reason);
                dispatch({ type: CREATE_POST_ERROR, reason: reason.response.data });
            })

        dispatch({ type: CREATE_POST, post: post });
    }
}

const unloadedState: PostsState = { isLoading: false, posts: [], selectedPost: undefined, hasError: false, error: "" }

export const reducer: Reducer<PostsState> = (state: PostsState | undefined, incomingAction: Action): PostsState => {
    if(state === undefined)
    {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type)
    {
        case REQUEST_POSTS:
            console.log("request post reducer");
            return Object.assign({}, state, {
                isLoading: true
            });
        case CREATE_POST:
            console.log("create post reducer");
            return Object.assign({}, state, {
                isLoading: true,
                selectedPost: action.post
            });
        case CREATE_POST_ERROR:
            console.log("create post error");
            return Object.assign({}, state, {
                hasError: true,
                error: action.reason
            });
        case SET_SELECTED_POST:
            console.log("set selected post reducer");
            return Object.assign({}, state, {
                hasError: false,
                isLoading: false,
                selectedPost: action.post
            });
        case RECEIVE_POSTS:
            console.log("receive posts reducer");
            return Object.assign({}, state, {
                isLoading: false,
                posts: action.posts
            });
        default:
            return state;
    }
}