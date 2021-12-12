import * as types from "../actionTypes/actionTypes";
import {createReducer} from "../../utils/StoreUtils";
import {TOKEN} from "../../utils/contants";
import {AUTH_GET_CURRENT_USER_REQUEST} from "../actionTypes/AuthActionTypes";

const initState = {
    token: null,
    login: false,
    isAdmin: false,
    isUser: false,
    isModer: false,
    loading: false,
    totalCount: [],
    networkState: true,
    currentUser: '',
    sentUserMe: false,
};

const reducers = {
    [types.TOTAL_COUNT_PAGE](state, action) {
        state.totalCount = action;
    },
    [types.REQUEST_START || AUTH_GET_CURRENT_USER_REQUEST](state) {
        state.loading = true;
        state.replay = false
    },
    [types.REQUEST_START](state) {
        state.loading = true;
    },
    [types.CHANGE_LOGIN](state, action) {
        state.login = action.payload;
    },
    [types.AUTH_LOGOUT](state) {
        localStorage.removeItem(TOKEN);
        localStorage.removeItem('role')
        state.currentUser = {};
    },
    [types.NETWORK_AUTHENTICATION](state, action) {
        state.networkState = action.data
    },
    [types.AUTH_GET_CURRENT_USER_REQUEST](state) {
        state.loading = true;
        state.sentUserMe = true;
    },
    [types.AUTH_GET_USER_TOKEN_SUCCESS](state, action) {
        state.currentUser = action.payload;
    },
    [types.AUTH_GET_CURRENT_USER_ERROR](state) {
        state.currentUser = {};
    },

    updateState(state, {payload}) {
        return {
            ...state,
            ...payload,
        };
    },
};

export default createReducer(initState, reducers);
