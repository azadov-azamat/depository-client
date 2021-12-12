import {createBrowserHistory} from "history";

import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import apiMiddleware from "./ApiMiddleware";
import {routerMiddleware} from "react-router-redux";
import userReducer from "./reducers/userReducer";
import companyReducer from "./reducers/companyReducer";
import authReducer from "./reducers/authReducer";
import FileReducer from "./reducers/FileReducer";
import meetingReducer from "./reducers/meetingReducer";
import meetingStartedReducer from "./reducers/meetingStartedReduser";
import {usersReducer} from "./reducers/usersReducer";
import socketReducer from './reducers/socketReducer';

const history = createBrowserHistory();
const routeMiddleware = routerMiddleware(history);

const middleWares = [thunkMiddleware, apiMiddleware, routeMiddleware].filter(
    Boolean
);

const store = createStore(
    combineReducers({
        user: usersReducer,
        users: userReducer,
        company: companyReducer,
        file: FileReducer,
        auth: authReducer,
        meeting: meetingReducer,
        meetingStarted: meetingStartedReducer,
        socket: socketReducer,
    }),
    compose(
        applyMiddleware(...middleWares)
    )
);
export default store;
