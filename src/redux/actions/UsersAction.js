import {createUser, deleteUserApi, editUserApi, getById, getFilterUser, getUsers} from "../../api/UsersApi";
import * as types from "../actionTypes/UsersActionTypes";
import {
    REQUEST_API_ERROR_USERS,
    REQUEST_API_START_USERS,
    REQUEST_GET_USERS_LIST_SUCCESS
} from "../actionTypes/UsersActionTypes";
import {dark} from "@material-ui/core/styles/createPalette";
import {toast} from "react-toastify";
import {DEPOSITORY_USER} from "../../utils/contants";


export const createUserForAdmin = (payload) => async (dispatch) => {
    const lang = localStorage.getItem('i18nextLng')
    dispatch({
        api: createUser,
        types: ["REQUEST_START_CREATE_USER", types.REQUEST_CREATE_USER, types.REQUEST_API_ERROR_USERS],
        data: payload.data,
    }).then(res => {
        payload.history.push('/admin/users')
    }).catch(err => {
        if (err.response.data.status === 400) {
            if (err.response.data.title === 'Passport already used!') {
                if (lang === "ru") {
                    payload.toast.error("Паспорт уже использовался!")
                }
                if (lang === "uz") {
                    payload.toast.error("Pasport allaqachon ishlatilgan!")
                }
                if (lang === "en") {
                    payload.toast.error(err.response.data.title)
                }
            }
            if (err.response.data.errorKey === 'phonenumberexists') {
                if (lang === "ru") {
                    payload.toast.error("Телефонный номер уже используется!")
                }
                if (lang === "uz") {
                    payload.toast.error("Telefon raqami allaqachon ishlatilmoqda!")
                }
                if (lang === "en") {
                    payload.toast.error(err.response.data.title)
                }
            }
            if (err.response.data.errorKey === 'emailexists') {
                if (lang === "ru") {
                    payload.toast.error("Email уже используется!")
                }
                if (lang === "uz") {
                    payload.toast.error("Email allaqachon ishlatilmoqda!")
                }
                if (lang === "en") {
                    payload.toast.error(err.response.data.title)
                }
            }
            if (err.response.data.errorKey === 'innexists'){
                if (lang === "ru") {
                    payload.toast.error("ИНН уже используется!")
                }
                if (lang === "uz") {
                    payload.toast.error("INN allaqachon ishlatilmoqda!")
                }
                if (lang === "en") {
                    payload.toast.error(err.response.data.title)
                }
            }
        }
        console.log(err.response)
    })
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
        types: ["",types.REQUEST_GET_USER_SUCCESS,""],
        data: payload.userId
    }).then(res => {
        localStorage.setItem("currentEditUser", payload.userId)
    }).catch(err => {
        console.log(err.response)
    })
}

export const editUserAction = (payload) => async (dispatch) => {
    dispatch({
        api: editUserApi,
        types: [REQUEST_API_START_USERS, '', REQUEST_API_ERROR_USERS],
        data: payload.data
    }).then(res => {
        toast.success("keldi")
    }).catch(err => {
        console.log(err.response)
    })
}

export const deleteUserAction = (payload) => async (dispatch) => {
    dispatch({
        api: deleteUserApi,
        types: [REQUEST_API_START_USERS, 'REQUEST_SUCCESS_DELETE_USER', REQUEST_API_ERROR_USERS],
        data: payload.userId
    }).then(res => {
        dispatch(getUsersList({page: payload.page, size: 6}))
    }).catch(err => {
        console.log(err.response)
    })
}
