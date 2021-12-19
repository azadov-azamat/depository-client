import HttpClient from "../utils/HttpClient";
import {api} from "./api";

export const createUser =(data)=>{
    return HttpClient.doPost(api.userMethods, data)
}

export const getUsers = (data) => {
    return HttpClient.doGet(api.userMethods + (data && data.page && data.size ? "?page=" + (data.page - 1) + "&size=" + data.size : ""))
}

export const getFilterUser = (data) => {
    return HttpClient.doGet(api.userFilter + (data && data.value && data.field
        ?
        "?value=" + data.value + "&field=" + data.field
        : ""))
}

export const getUserSpecFilterApi = (data) => {
    return HttpClient.doPost(api.userSpecFilter + (data && data.page && data.size
        ? "?page=" + (data.page - 1) + "&size=" + data.size : ""), data.dataFilter)
}

export const getById =(data)=>{
    return HttpClient.doGet(api.userMethods + "/"+ data)
}

export const getUserSearchApi =(data)=>{
    return HttpClient.doGet(api.userSearch + (data && data ? "?searchValue=" + data.value :''))
}

export const editUserApi = (data)=>{
    return HttpClient.doPut(api.userMethods, data)
}
export const deleteUserApi = (data)=>{
    return HttpClient.doDelete(api.userMethods + "/" + data)
}
