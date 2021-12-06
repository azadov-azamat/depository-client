import HttpClient from "../utils/HttpClient";
import {api} from "./api";

export const getCompanyByIdApi = (data) => {
    return HttpClient.doGet(api.companyMethod + "/" + data)
}

export const getLogoCompanyByCompanyIDApi = (data) => {
    return HttpClient.doGet(api.getLogoByCompanyId + "/" + data)
}

export const createCompany = (data) => {
    return HttpClient.doPost(api.companyMethod, data)
}

export const updateCompanyApi = (param = {}) => {
    return HttpClient.doPut(api.companyMethod, param)
}

export const addLogo = (data) => {
    return HttpClient.doPost(api.addLogoCompany, data)
}

export const getCompanyBySorted = (data) => {
    return HttpClient.doGet(api.companyFilter +
        (data && data.value && data.field
            ?
            "?value=" + data.value + "&field=" + data.field
            : ""))
}

export const getCompanySpecFilterApi = (data) => {
    return HttpClient.doPost(api.companySpecFilter, data)
}

export const getCompanies = (data) => {
    return HttpClient.doGet(api.companyMethod + (data && data.page && data.size ? "?page=" + (data.page - 1) + "&size=" + data.size : ""))
}

export const deleteCompany = (data) => {
    return HttpClient.doDelete(api.companyMethod + "/" + data)
}

export const getCompanyByUserIdApi = (data) => {
    return HttpClient.doGet(api.companyUserById + (data && data ? '/' + data.currentUserId : ''))
}
