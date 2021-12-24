import HttpClient from "../utils/HttpClient";
import {api} from "./api";

export const loginUser = (data = {username: null, password: null, newUser: false}) => {
    return HttpClient.doPost(api.login, data);
}

export const loginEdsApi = (data) => {
    return HttpClient.doGet(api.loginEds + (data ? "?serialNumber=" + data : ''))
}

export const postPks7FileApi = (data) => {
    return HttpClient.doPost(api.pks7File+ (data ? "?pkcs7=" + data : ''))
}

export const me = (data) => {
    return HttpClient.doGet(api.userMe);
}
