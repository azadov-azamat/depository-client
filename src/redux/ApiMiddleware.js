import {TOTAL_COUNT_PAGE} from "./actionTypes/actionTypes";
import {AUTH_LOGOUT} from "./actionTypes/AuthActionTypes";

const apiMiddleware = ({dispatch}) => (next) => (action) => {
    if (!action.api) {
        return next(action);
    }
    const {api, types: [START, SUCCESS, ERROR], data} = action;

    dispatch({
        type: START
    });


    return api(data)
        .then((response) => {
            if (response && response.data && (response.data.success ||
                response.status === 201 || response.status === 204 || response.status === 200)) {
                const header = response.headers
                const sizeData = response.data
                dispatch({
                    type: SUCCESS,
                    requestData: data,
                    payload: response.data
                });
                dispatch({
                    type: TOTAL_COUNT_PAGE,
                    payload: [header["x-total-count"], sizeData.length]
                })
                dispatch({
                    type: 'updateState',
                    payload: {
                        loading: false
                    }
                });

                //then uchun add va editlarga...
                return {
                    payload: response.data,
                    data,
                    success: true,
                    statusCode: response.status
                }
            } else if (response.status === 401) {
                dispatch({
                    type: AUTH_LOGOUT
                })
                dispatch({
                    type: 'updateState',
                    payload: {
                        loading: false
                    }
                })
            } else {

                dispatch({
                    type: ERROR
                })

                dispatch({
                    type: 'updateState',
                    payload: {
                        loading: false
                    }
                })
            }
        }).catch(error => {
            dispatch({
                type: ERROR
            })
            dispatch({
                type: 'updateState',
                payload: {
                    loading: false
                }
            })
            throw error;
        })

}

export default apiMiddleware
