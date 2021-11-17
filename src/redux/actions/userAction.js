import {UPDATE_STATE} from "../types/userTypes";
import axios from "axios";
import {BASE_URL} from "../../utils/config";
import {toast} from "react-toastify";
import {SELECTED_ITEM} from "../actionTypes/UsersActionTypes";
import {useTranslation} from "react-i18next";

export function updateState(data) {
    return {
        type: UPDATE_STATE,
        payload: data,
    }
}

export function saveUser(event, error, values, history) {

    console.log(values);
    console.log("values");

    return function (dispatch) {
        axios.post(BASE_URL + "/moder/user", values)
            .then((res) => {
                const {t} = useTranslation();
                console.log("post zapros");
                console.log(res);
                dispatch(getUserList(1, 6));
                history.push("/admin/users");
                toast.success(localStorage.getItem("langSystem") === 'uz' ? "Foydalanuvchi yaratildi" : localStorage.getItem("langSystem") === 'ru' ? "Пользователь создан" : "User created");
                // toast.success(t("user.cretre"))
                // dispatch(updateState({selectedItem : {}}))
            })
            .catch((error) => {
                console.log(error.response);
                toast.error(error.response.data.title);
            });
    }
}

export function editUser(event, error, values, history) {
    console.log(values);
    return function (dispatch, getState) {
        axios.put('https://depositary.herokuapp.com/api/moder/user', values)
            .then((res) => {
                const {t} = useTranslation();
                console.log("put");
                console.log(res);
                dispatch(updateState({selectedItem: {}}));
                localStorage.setItem(SELECTED_ITEM, JSON.stringify({}));
                dispatch(getUserList(1, 6));
                // const {t} = useTranslation();
                toast.success(localStorage.getItem("langSystem") === 'uz' ? "Foydalanuvchi o'zgartirildi" : localStorage.getItem("langSystem") === 'ru' ? "Редактировать пользователя" : "Edit user");
                history.push("/admin/users");
            })
            .catch((error) => {
                console.log("error");
                console.log(error);
                if (error.response?.status && error.response.status === 500) {
                    toast.error("Foydalanuvchini o'zgartirib bo'lmaydi")
                } else {
                    toast.error(error.response?.data?.title)
                }
            })
    }
}


export const getUser = () => (dispatch) => {
    axios.get(BASE_URL + "/moder/user")
        .then((res) => {
            console.log(res);
            // dispatch(updateState({user: res.data}));
            console.log(res.headers["x-total-count"]);
            dispatch(updateState({totalCountUser: res.headers["x-total-count"]}))
        })
};

export const getUserList = (page, size) => (dispatch) => {
    axios.get(BASE_URL + "/moder/user" + (page && size ? "?page=" + (page - 1) + "&size=" + size : ""))
        .then((res) => {
            dispatch(updateState({user: res.data}));
//             console.log(res.headers["x-total-count"]);
            dispatch(updateState({totalCountUser: res.headers["x-total-count"]}))
        })
};


export const deleteUser = () => (dispatch, getState) => {
    console.log("get state");
    console.log(getState().user.selectedIndex);
    axios.delete(BASE_URL + "/moder/user/" + getState().user.selectedIndex)
        .then((res) => {
            dispatch(getUser());
            dispatch(getUserList(1, 6));
            toast.success(localStorage.getItem("langSystem") === 'uz' ? "Foydalanuvchi o'chirildi" : localStorage.getItem("langSystem") === 'ru' ? "Пользователь удален" : "The user has been deleted");
            dispatch(updateState({deleteModal: false}));
        })
        .catch((err) => {
            console.log(err.response);
            console.log("salom");
            if (err.response.status === 500) {
                console.log(true);
                toast.success(localStorage.getItem("langSystem") === 'uz' ? "Bu foydalanuvchi yig'ilishida yoki kompaniyada mavjud" : localStorage.getItem("langSystem") === 'ru' ? "Это доступно на собрании пользователей или в компании." : "This is available at a user meeting or company");
            } else {
                console.log(false);
                toast.error(err.response.message)
            }
        })
};


export function Filter(data) {
    console.log(data.value);
    if (data.value === 'ALL') {
        return function (dispatch) {
            dispatch(getUserList(1, 6));
        }
    } else {
        return function (dispatch, getstate) {
            console.log(data.value.length);
            if (data.value?.length >= 3) {
                console.log('hello');
                console.log(getstate().user.page);
                axios.get(BASE_URL + "/moder/user/filter?field=" + data.field + "&page" + getstate().user.page + "&size=6&value=" + data.value)
                    .then((res) => {
                        console.log(res);
                        data.value === "" ?
                            dispatch(getUserList(1, 6)) :
                            dispatch(updateState({user: res.data, totalCountUser: res.headers["x-total-count"]}));
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } else {
                console.log('salom');
                dispatch(getUserList(1, 6));
            }
        }
    }
}

