import {UPDATE_STATE} from "../types/userTypes";

export const initialState = {
    open : false,
    user: [],
    deleteModal : false,
    selectedIndex : "",
    selectedItem : {},
    totalCountUser: "",
    page: ""
};

export const usersReducer = (state = initialState, action) => {
    if (action.type === UPDATE_STATE) {
        return {
            ...state,
            ...action.payload
        }
    }
    return state;
}