import * as types from "../actionTypes/CompanyActionTypes";
import {createReducer} from "../../utils/StoreUtils";

const initialState = {
    loading: false,
    searchLoading: false,
    currentCompany: []
}

const reducers = {
    [types.REQUEST_API_START](state) {
        state.loading = true;
    },
    [types.REQUEST_API_SUCCESS](state, action) {
        state.companies = action.payload;
    },
    [types.REQUEST_API_ERROR](state) {
        state.loading = true;
    },

    [types.REQUEST_GET_ADMIN_LIST_START](state) {
        state.loading = true;
    },
    [types.REQUEST_GET_ADMIN_LIST_SUCCESS](state, payload) {
        state.companies = payload.payload;
    },
    [types.REQUEST_GET_ADMIN_LIST_ERROR](state) {
        state.loading = true;
    },

    [types.REQUEST_GET_LIST_FILTER_COMPANY_START](state) {
        state.searchLoading = true;
    },
    [types.REQUEST_GET_LIST_FILTER_COMPANY_SUCCESS](state, payload) {
        state.filterCompany = payload.payload
    },
    [types.REQUEST_GET_LIST_FILTER_COMPANY_ERROR](state) {
        state.searchLoading = true
    },

    ["REQUEST_CREATE_NEW_COMPANY_START"](state) {
        state.createCompanyLoading = true;
    },
    [types.REQUEST_CREATE_COMPANY](state, action) {
        state.createCompanyLoading = false;
        state.newCompany = action.payload;
    },
    ["REQUEST_CREATE_NEW_COMPANY_ERROR"](state) {
        state.createCompanyLoading = true;
    },


    ['REQUEST_UPDATE_COMPANY_START'](state) {
        state.createCompanyLoading = true;
    },
    ['REQUEST_UPDATE_COMPANY_ERROR'](state) {
        state.createCompanyLoading = true;
    },
    [types.REQUEST_UPDATE_BY_ID](state, payload) {
        state.createCompanyLoading = false;
        state.updateCurrentCompany = payload.payload;
    },

    [types.REQUEST_DELETE_START](state) {
        state.loading = true
    },
    [types.REQUEST_DELETE_BY_ID](state) {
        state.loading = false
    },

    ['REQUEST_GET_COMPANY_START'](state){
      state.loading = true
    },
    ['REQUEST_GET_COMPANY_SUCCESS'](state, action){
      state.companiesByUserId = action.payload
    },

    ['REQUEST_GET_COMPANY_ERROR'](state){
      state.loading = true
    },

    ['REQUEST_GET_COMPANY_BY_ID'](state, action){
      state.currentCompany = action.payload
    },

    updateState(state, {payload}) {
        return {
            ...state,
            ...payload
        }
    }
}

export default createReducer(initialState, reducers);

// const companyReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case types.GET_COMPANY :
//             return state;
//         case types.ADD_COMPANY :
//             state = [...state, action.payload];
//             return state;

//         case types.ADD_COMPANY_LIST:
//             state = action.payload
//             return state;
//
//         case types.SEARCH_COMPANY :
//             const searchCompany = state.filter(company => company.name.includes(action.payload.name.trim()))
//             state = searchCompany;
//             return state;
//         case types.UPDATE_COMPANY :
//             const updateState = state.map(company => company.id === action.payload.id ? action.payload : company);
//             state = updateState;
//             return state;
//         case types.DELETE_COMPANY :
//             const filterCompany = state.filter(company => company.id !== action.payload && company)
//             state = filterCompany;
//             return state;
//         default:
//             return state;
//     }
// }
