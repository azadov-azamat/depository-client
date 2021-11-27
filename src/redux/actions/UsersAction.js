import {createUser, editUserApi, getById, getFilterUser, getUsers} from "../../api/UsersApi";
import * as types from "../actionTypes/UsersActionTypes";
import {
    REQUEST_API_ERROR_USERS,
    REQUEST_API_START_USERS,
    REQUEST_GET_USERS_LIST_SUCCESS
} from "../actionTypes/UsersActionTypes";
import {dark} from "@material-ui/core/styles/createPalette";


export const createUserForAdmin = (payload) => async (dispatch) => {
    try {
        const res = await dispatch({
            api: createUser,
            types: ["", types.REQUEST_CREATE_USER, types.REQUEST_API_ERROR_USERS],
            data: payload.data,
        });
        if (res.success) {
            payload.history.push('/admin/users')
        }
        return true;
    } catch (err) {
        if (err.response){
            console.log(err.response)
        }
    }
}

export const getUsersList = (payload) => async (dispatch) => {
    dispatch({
        api: getUsers,
        types: [
            types.REQUEST_GET_USERS_LIST_START,
            types.REQUEST_GET_USERS_LIST_SUCCESS,
            types.REQUEST_GET_USERS_LIST_ERROR
        ],
        data: payload
    }).then(res => {
    }).catch(err => {
    })
}

export const getUserFilter = (payload) => async (dispatch) => {
    try {
        const res = await dispatch({
            api: getFilterUser,
            types: [types.REQUEST_API_START_USERS, types.REQUEST_API_SUCCESS_USERS, types.REQUEST_API_ERROR_USERS],
            data: payload
        });
        if (res.success) {
            console.log(res)
            dispatch({
                type: REQUEST_GET_USERS_LIST_SUCCESS,
                payload: res.payload
            })
        }
        return true;
    } catch (err) {
        if (err.response) {
        }
    }
}

export const getUserById = (payload) => async (dispatch) => {

    dispatch({
        api: getById,
        types: types.REQUEST_GET_USER_SUCCESS,
        data: payload.ID
    }).then(res => {
    }).catch(err => {
    })
}

export const editUserAction = (payload) => async (dispatch) => {
    dispatch({
        api: editUserApi,
        types: [REQUEST_API_START_USERS, '', REQUEST_API_ERROR_USERS],
        data: payload.data
    }).then(res => {
    }).catch(err => {
    })
}
