import * as types from '../actionTypes/actionTypes'
import {loginUser, me} from "../../api/AuthApi";
import jwt from "jwt-decode";
import {BEARER, DEPOSITORY_ROLE, DEPOSITORY_USER, TOKEN} from "../../utils/contants";
import {toast} from "react-toastify";

export const login = (payload) => async (dispatch) => {
    try {
        const res = await dispatch({
            api: loginUser,
            types: [types.REQUEST_START, "", types.REQUEST_API_ERROR],
            data: payload.v,
        });
        if (res.success) {
            let token = res.payload;
            let parsedToken = jwt(token.id_token);
            let app = parsedToken.auth;
            const sentence = app.replace(/\s+/g, ' ').trim()
            let arr = sentence.split(',');
            setTimeout(() => {
                setStateRole(arr, dispatch);
                // pushHisPage(app, payload.history);
            }, 1000);
            localStorage.setItem(TOKEN, BEARER + token.id_token);
            payload.history.push('/')
        }
        return true;
    } catch (err) {
        if (err.response) {
            let code = err.response.data.status;
            if (code === 401) {
                toast.error(code + ": Login yoki parol xato");
            } else if (code === 400) {
                toast.error(code + ": Bazada bunday USER mavjud emas")
            } else if (code === 500) {
                toast.dark(code + ": Tizimda xatolik bo`ldi")
            }
        }
        return false;
    }

};

export const userMe = (payload, minusNine) => async (dispatch, getState) => {

    const {
        auth: {currentUser, sentUserMe},
    } = getState();
    if (!minusNine && (sentUserMe || currentUser || !localStorage.getItem(TOKEN))) return;

    try {
        const response = await dispatch({
            api: me,
            types: types.AUTH_GET_USER_TOKEN_SUCCESS,
        });
        if (response.success) {
            dispatch({
                type: "updateState",
                payload: {
                    currentUser: response.payload,
                },
            });
            localStorage.setItem(DEPOSITORY_USER, response.payload.id)
            localStorage.getItem(DEPOSITORY_USER)
            setStateRole(response.payload.authorities, dispatch);
        } else {
            dispatch(logout());
        }
    } catch (e) {
        dispatch(logout());
    }
};

export const logout = () => (dispatch) => {
    dispatch({
        type: types.AUTH_LOGOUT,
    });
};

export const networkAction =(payload)=> async (dispatch)=>{
    dispatch({
        type: types.NETWORK_AUTHENTICATION,
        data: payload.success
    })
}
const setStateRole = (roles, dispatch) => {
    let roleAdmin = false;
    let roleModer = false;
    let roleUser = false;

    roles.forEach(element => {
            if (element === "ROLE_ADMIN") {
                dispatch({type: "updateState", payload: {isAdmin: true}});
                roleAdmin = true;
            } else if (element === "ROLE_MODERATOR") {
                dispatch({type: "updateState", payload: {isModer: true}});
                roleModer = true
            } else if (element === "ROLE_USER") {
                dispatch({type: "updateState", payload: {isUser: true}});
                roleUser = true
            }
        }
    )
    localStorage.setItem(DEPOSITORY_ROLE, roleAdmin === true || roleModer === true ? 'admin' : 'user');
    dispatch({type: "updateState", payload: {login: true}})
};

const pushHisPage = (roles, history) => {

    const {push} = history;

    if (roles === "ROLE_ADMIN") {
        push('/admin')
    } else if (roles === "ROLE_MODERATOR") {
        push('/admin')
    } else {
        push("/issuerLegal");
    }
}



