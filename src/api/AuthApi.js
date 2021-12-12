import HttpClient from "../utils/HttpClient";
import {api} from "./api";

export const loginUser = (data = {username: null, password: null, newUser: false}) => {
    return HttpClient.doPost(api.login, data);
}

export const me = (data) => {
    return HttpClient.doGet(api.userMe);
}
