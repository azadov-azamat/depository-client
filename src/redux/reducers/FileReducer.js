import * as types from "../actionTypes/CompanyActionTypes";
import {createReducer} from "../../utils/StoreUtils";

const initialState = {
    loading: false,
    logoCompany: []
}


const reducer = {
    [types.REQUEST_CREATE_LOGO_START](state){
        state.loading = true;
    },
    [types.REQUEST_CREATE_LOGO_SUCCESS](state, action){
        state.logoCompany = action.payload;
    },
    [types.REQUEST_CREATE_LOGO_ERROR](state){
        state.loading = true;
    },
    ['REQUEST_GET_COMPANY_LOGO_START'](state){
        state.loading = true;
    },
    ['REQUEST_GET_COMPANY_LOGO_SUCCESS'](state, action){
        state.loading = false;
        state.logoCompany = action.payload;
    },
    updateState(state, {payload}) {
        return {
            ...state,
            ...payload
        }
    }
}

export default createReducer(initialState, reducer)
// const FileReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case types.GET_FILE :
//             return state;
//         case types.ADD_FILE :
//             state = [...state, action.payload];
//             return state;
//         case types.UPDATE_FILE :
//             const updateState = state.map(file => file.id === action.payload.id ? action.payload : file);
//             state = updateState;
//             return state;
//         case types.DELETE_FILE :
//             const filterCompany = state.filter(file => file.id !== action.payload && file)
//             state = filterCompany;
//             return state;
//         default:
//             return state;
//     }
// }
//
// export default FileReducer;
