import {createReducer} from "../../utils/StoreUtils";
import * as types from "../actionTypes/MeetingActionTypes";
import {DEPOSITORY_MEMBER_TYPE_USER} from "../../utils/contants";

const initialState = {
    loading: false,
    totalCount: '',
    meetings: [],
    memberManagerState: [],
    currentMeeting: [],
    currentCity: {},
    memberManagerType: {},
    currentAgenda: [],
    onlineMemberManager: [],
    searchNameCompany: []
};

const reducers = {
    ['CURRENT_MEMBER_TYPE'](state, action) {
        state.userMemberType = action.payload.role;
        state.fromReestrMember = action.payload.fromReestr
    },
    [types.TOTAL_COUNT_MEETING](state, action) {
        state.totalCount = action;
    },
    [types.REQUEST_API_START_MEETING](state) {
        state.loading = true;
    },
    [types.REQUEST_API_SUCCESS_MEETING](state, action) {
        state.meetings = action.payload;
    },
    [types.REQUEST_API_ERROR_MEETING](state) {
        state.loading = true;
    },


    ["REQUEST_SUCCESS_COMPANY_SEARCH_NAME"](state, action) {
        state.searchNameCompany = action.payload;
    },
    ["REQUEST_GET_MEETING_START"](state) {
        state.loading = true;
    },
    ["REQUEST_GET_MEETING_ERROR"](state) {
        state.loading = true;
    },
    ["REQUEST_GET_MEETING_SUCCESS"](state, action) {
        state.loading = false;
        state.currentMeeting = action.payload;
    },

    ["REQUEST_GET_MEETING_BY_COMPANY_ID"](state, action){
      state.meetings = action.payload
    },

    ["REQUEST_UPDATE_MEETING_STATUS"](state, action){
      state.currentMeeting = action.payload
    },

    [types.REQUEST_GET_MEETING_LIST_START](state) {
        state.loading = true;
    },
    [types.REQUEST_GET_MEETING_LIST_SUCCESS](state, payload) {
        state.meetings = payload.payload;
    },
    [types.REQUEST_GET_MEETING_LIST_ERROR](state) {
        state.loading = true;
    },

    [types.REQUEST_GET_LIST_FILTER_MEETING_START](state) {
        state.searchLoading = true;
    },
    [types.REQUEST_GET_LIST_FILTER_MEETING_SUCCESS](state, payload) {
        state.filterMeetings = payload.payload
    },
    [types.REQUEST_GET_LIST_FILTER_MEETING_ERROR](state) {
        state.searchLoading = true
    },

    [types.REQUEST_CREATE_MEETING](state, payload) {
        state.currentMeeting = payload.payload
    },

    [types.REQUEST_UPDATE_BY_ID](state, payload){

    },

    [types.REQUEST_MEMBER_MANAGERS](state, action){
        state.memberManager = action.payload
    },
    [types.REQUEST_GET_MEMBER_LIST_SUCCESS](state, action) {
        state.memberManagerState = action.payload;
    },
    ["RESPONSE_GET_ONLINE_MEMBERS_LIST_SUCCESS"](state, action) {
        state.onlineMemberManager = action.payload;
    },
    ["REQUEST_GET_MEMBER_BY_ID_SUCCESS"](state, action) {
        state.currentMemberManager = action.payload;
    },


    ['REQUEST_GET_AGENDA_MY_MEETING_ID_SUCCESS'](state, action) {
        state.agendaState = action.payload;
    },
    ['REQUEST_GET_AGENDA_BY_ID_SUCCESS'](state, action) {
        state.currentAgenda = action.payload;
    },


    ['REQUEST_REESTR_START'](state) {
        state.loadingReestr = 'loading';
    },
    ['REQUEST_REESTR_ERROR'](state) {
        state.loadingReestr = 'error';
    },
    ['REQUEST_REESTR_SUCCESS'](state, action) {
        state.currentReestr = action.payload
        state.loadingReestr = 'download'
    },


    ['REQUEST_START_GET_FILES_BY_MEETING_ID'](state) {
        state.loadingMeetinfFile = true
    },
    ['REQUEST_SUCCESS_GET_FILES_BY_MEETING_ID'](state, action) {
        state.meetingFile = action.payload
    },


    ['REQUEST_UPLOAD_FILE_START'](state) {
        state.meetingFileStart = true
    },
    ['REQUEST_UPLOAD_FILE_SUCCESS'](state, action) {
        state.currentMeetingFile = action.payload
    },
    ['REQUEST_UPLOAD_FILE_ERROR'](state) {
        state.meetingFileStart = true
    },



    ['REQUEST_GET_BY_ID_CITY'](state, action) {
        // state.currentCity = action.payload
       state.currentCity[action.requestData] = action.payload
    },
    ['REQUEST_GET_CITIES'](state, action) {
        state.citiesList = action.payload
    },


    ['REQUEST_GET_MEMBER_TYPE_ENUM_LIST_SUCCESS'](state, action) {
        state.memberManagerType[action.requestData.meetingId] = action.payload
    },
    ['REQUEST_SUCCESS_MEETING_BY_USER_AND_COMPANY'](state, action) {
        state.meetingByUser = action.payload
    },

    // [types.REQUEST_DELETE_BY_ID](state, payload) {
    //     const filterMeeting = state.filter(meeting => meeting.id !== payload.payload && meeting)
    //     state = filterMeeting;
    // },
}

export default createReducer(initialState, reducers);
