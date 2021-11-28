import * as types from "../actionTypes/UsersActionTypes";
import {createReducer} from "../../utils/StoreUtils";

const initialState = {
    loading: false,
    currentForUser: [],
    users: []
}

const reducers = {
    [types.TOTAL_COUNT_USERS](state, action) {
        state.totalCount = action;
    },
    [types.REQUEST_API_START_USERS](state) {
        state.loading = true;
    },
    [types.REQUEST_API_SUCCESS_USERS](state, action) {
        state.users = action.payload;
    },
    [types.REQUEST_API_ERROR_USERS](state) {
        state.loading = true;
    },

    [types.REQUEST_GET_USERS_LIST_START](state) {
        state.loading = true;
    },
    [types.REQUEST_GET_USERS_LIST_SUCCESS](state, payload) {
        state.users = payload.payload;
    },
    [types.REQUEST_GET_USERS_LIST_ERROR](state) {
        state.loading = true;
    },

    [types.REQUEST_GET_LIST_FILTER_USERS_START](state) {
        state.searchLoading = true;
    },
    [types.REQUEST_GET_LIST_FILTER_USERS_SUCCESS](state, payload) {
        state.filterUsers = payload.payload
    },
    [types.REQUEST_GET_LIST_FILTER_USERS_ERROR](state) {
        state.searchLoading = true
    },

    [types.REQUEST_CREATE_USERS](state, action) {
        state.users = action.payload;
        return state;
    },
    [types.REQUEST_UPDATE_BY_ID](state, payload){

    },

    [types.REQUEST_GET_USER_SUCCESS](state, action){
        state.currentForUser = action.payload
    },
    // [types.REQUEST_DELETE_BY_ID](state, payload) {
    //     const filterMeeting = state.filter(meeting => meeting.id !== payload.payload && meeting)
    //     state = filterMeeting;
    // },
    updateState(state, {payload}) {
        return {
            ...state,
            ...payload
        }
    }
}

export default createReducer(initialState, reducers)
// const userReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case types.GET_USER :
//             return state;
//
//         case types.ADD_USER :
//             state = [...state, action.payload];
//             return state;
//
//         case types.ADD_USER_LIST :
//             state = action.payload;
//             return state;
//
//         case types.SEARCH_USER :
//             const searchUser = state.filter(user => user.name.includes(action.payload.name.trim()))
//             return searchUser;
//
//         case types.UPDATE_USER :
//             const updateState = state.map(user => user.id === action.payload.id ? action.payload : user);
//             state = updateState;
//             return state;
//
//         case types.DELETE_USER :
//             const filterUser = state.filter(user => user.id !== action.payload && user)
//             state = filterUser;
//             return state;
//
//         default:
//             return state;
//     }
// }

// export default userReducer;
