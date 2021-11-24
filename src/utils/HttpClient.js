import {TOKEN} from "./contants";
import axios from 'axios'
import {BASE_URL} from "./config";

export default class HttpClient {

    static headers = {
        'Access-Control-Allow-Origin': '*',
    };

    static doRequest() {
        const token = localStorage.getItem(TOKEN);
        if (token) {
            HttpClient.headers = {
                ...HttpClient.headers,
                Authorization: token
            };
        }
        return axios.create({
            baseURL: BASE_URL,
            headers: {...HttpClient.headers}
        });
    }

    static doGet(url, params = {}) {
        console.log("Http clientga keldi " + url)
        console.log("Http clientga keldi " + params)
        return HttpClient.doRequest().get(url, params)
    }

    static doPost(url, data) {
        return HttpClient.doRequest().post(url, data)
    }

    static doPut(url, data) {
        return HttpClient.doRequest().put(url, data)
    }

    static doPatch(url, data) {
        return HttpClient.doRequest().patch(url, data)
    }

    static doDelete(url, data = {}) {
        return HttpClient.doRequest().delete(url, data)
    }
}
