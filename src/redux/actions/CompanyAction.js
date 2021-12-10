import * as types from "../actionTypes/CompanyActionTypes";
import {
    addLogo,
    createCompany,
    deleteCompany,
    getCompanies,
    getCompanyByIdApi,
    getCompanyBySorted,
    getCompanyByUserIdApi, getCompanySearchNameApi, getCompanySpecFilterApi,
    getLogoCompanyByCompanyIDApi,
    updateCompanyApi
} from "../../api/CompanyApi";
import {toast} from "react-toastify";
import React from "react";

export const getCompanyByIdAction = (payload) => async (dispatch) => {
    console.log("keldi action")
    dispatch({
        api: getCompanyByIdApi,
        types: ["REQUEST_GET_COMPANY_START", "REQUEST_GET_COMPANY_BY_ID", "REQUEST_ERROR"],
        data: payload.companyId
    }).then(res => {
        console.log(res)
        if (res.payload.imageUrl !== "no") {
            dispatch(getLogoCompanyByCompanyIDAction({companyId: payload.companyId}))
        }
    }).catch(err => {
        if (err.response.status === 404) {
            payload.history.push('/notFound')
        }
    })
}

export const createCompanyForAdmin = (payload) => async (dispatch) => {
    dispatch({
        api: createCompany,
        types: ["REQUEST_CREATE_NEW_COMPANY_START",types.REQUEST_CREATE_COMPANY, "REQUEST_CREATE_NEW_COMPANY_ERROR"],
        data: payload.data,
    }).then(res => {
        const payloadDto = payload.data;
        const history = payload.history;
        if (payloadDto.image) {
            const data = new FormData();
            data.append('file', payloadDto.image);
            data.append('companyId', res.payload.id);
            dispatch(addLogoCompany({data, history}))
        } else {
            history.push('/admin/company')
        }
    }).catch(err => {
        if (err.response) {
            let keyMessage = err.response.data
            if (keyMessage.errorKey === 'phonenumberexists') {
                toast.error('Telefon raqam oldin ro`yxatdan o`tgan')
            } else if (keyMessage.errorKey === 'emailExists') {
                toast.error('Email oldin ro`yxatdan o`tgan')
            } else if (keyMessage.errorKey === 'innExists') {
                toast.error('INN oldin ro`yxatdan o`tgan')
            } else if (keyMessage.errorKey === 'nameExists') {
                toast.error('Kompanya nomi oldin oldin ro`yxatdan o`tgan')
            } else if (err.response.status === 500) {
                toast.dark('Kechirasiz serverda xatolik')
            }
        }
        dispatch({
            type: 'updateState',
            payload: {
                loading: false,
                createCompanyLoading: false
            }
        });
    });

}

export const updateCompany = (payload) => async (dispatch) => {
    try {
        const res = await dispatch({
            api: updateCompanyApi,
            types: ['REQUEST_UPDATE_COMPANY_START', types.REQUEST_UPDATE_BY_ID, 'REQUEST_UPDATE_COMPANY_ERROR'],
            data: payload.data
        });
        if (res.success) {
            const history = payload.history;
            const payloadDto = payload.data;
            if (payloadDto.image) {
                const data = new FormData();
                data.append('file', payloadDto.image);
                data.append('companyId', res.payload.id);
                dispatch(addLogoCompany({data, history}))
            } else {
                history.push('/admin/company')
            }
        }
        return true;
    } catch (err) {
        if (err.response) {
        }
    }
}

export const getCompanyListBySorted = (payload) => async (dispatch) => {
    try {
        const res = await dispatch({
            api: getCompanyBySorted,
            types: [types.REQUEST_API_START, types.REQUEST_GET_ADMIN_LIST_SUCCESS, types.REQUEST_API_ERROR],
            data: payload
        });
        if (res.success) {
            // dispatch({type: actionTypes.ADD_COMPANY_LIST, payload: res.payload})
        }
        return true;
    } catch (err) {
        if (err.response) {
        }
    }
}

export const getCompanyFilter = (payload) => async (dispatch) => {
    try {
        const res = await dispatch({
            api: getCompanyBySorted,
            types: [types.REQUEST_API_START, types.REQUEST_GET_ADMIN_LIST_SUCCESS, types.REQUEST_API_ERROR],
            data: payload
        });
        if (res.success) {
        }
        return true;
    } catch (err) {
        if (err.response) {
        }
    }
}

export const getCompanySpecFilterAction = (payload) => async (dispatch) => {
    try {
        const res = await dispatch({
            api: getCompanySpecFilterApi,
            types: [types.REQUEST_API_START, types.REQUEST_GET_ADMIN_LIST_SUCCESS, types.REQUEST_API_ERROR],
            data: payload
        });
        if (res.success) {
            console.log(res.success)
        }
    } catch (err) {
        if (err.response) {
            console.log(err.response)
        }
    }
}

export const getCompanySearchNameAction = (payload) => async (dispatch) => {
    try {
        const res = await dispatch({
            api: getCompanySearchNameApi,
            types: [types.REQUEST_API_START, "REQUEST_SUCCESS_COMPANY_SEARCH_NAME", types.REQUEST_API_ERROR],
            data: payload
        });
    } catch (err) {
        if (err.response) {
            console.log(err.response)
        }
    }
}

export const getCompanyList = (payload) => async (dispatch) => {
    dispatch({
        api: getCompanies,
        types: [
            types.REQUEST_GET_ADMIN_LIST_START,
            types.REQUEST_GET_ADMIN_LIST_SUCCESS,
            types.REQUEST_GET_ADMIN_LIST_ERROR
        ],
        data: payload
    })
} // success 80%

export const deleteByIdCompany = (payload) => async (dispatch) => {
    dispatch({
        api: deleteCompany,
        types: types.REQUEST_DELETE_BY_ID,
        data: payload
    }).then(res => {
        dispatch(getCompanyList({page: 1, size: 6}))
    }).catch(err => {
        if (err.response.data.detail === 'By this company already has created meeting!') {
            toast.error('Bu kompaniya allaqachon uchrashuv tashkil qilgan!')
        }
    })
} // success 95%

export const getCompanyByUserId = (payload) => async (dispatch) => {
    dispatch({
        api: getCompanyByUserIdApi,
        types: ['REQUEST_GET_COMPANY_START', 'REQUEST_GET_COMPANY_SUCCESS', "REQUEST_GET_COMPANY_ERROR"],
        data: payload
    })
}

export const getLogoCompanyByCompanyIDAction = (payload) => async (dispatch) => {
    dispatch({
        api: getLogoCompanyByCompanyIDApi,
        types: ['REQUEST_GET_COMPANY_LOGO_START', "REQUEST_GET_COMPANY_LOGO_SUCCESS", "REQUEST_GET_COMPANY_LOGO_ERROR"],
        data: payload.companyId
    }).then(res => {
        // payload.history.push('/admin/company')
    }).catch(err => {
    })
}

export const addLogoCompany = (payload) => async (dispatch) => {
    dispatch({
        api: addLogo,
        types: [
            types.REQUEST_CREATE_LOGO_START,
            types.REQUEST_CREATE_LOGO_SUCCESS,
            types.REQUEST_CREATE_LOGO_ERROR,
        ],
        data: payload.data
    }).then(res => {
        payload.history.push('/admin/company')
    }).catch(err => {
    })
}
