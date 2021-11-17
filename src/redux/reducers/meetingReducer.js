import {createReducer} from "../../utils/StoreUtils";
import * as types from "../actionTypes/MeetingActionTypes";
import {DEPOSITORY_MEMBER_TYPE_USER} from "../../utils/contants";

const initialState = {
    loading: false,
    totalCount: '',
    memberManagerState: [],
    currentMeeting: []
};

const reducers = {
    ['memberTypeCurrentUser'](state, action) {
        localStorage.setItem(DEPOSITORY_MEMBER_TYPE_USER, action.payload)
        state.userMemberType = action.payload;
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
    ["REQUEST_GET_MEMBER_BY_ID_SUCCESS"](state, action) {
        state.currentMemberManager = action.payload;
    },


    ['REQUEST_GET_AGENDA_MY_MEETING_ID_SUCCESS'](state, action) {
        state.agendaState = action.payload;
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

    // [types.REQUEST_DELETE_BY_ID](state, payload) {
    //     const filterMeeting = state.filter(meeting => meeting.id !== payload.payload && meeting)
    //     state = filterMeeting;
    // },
}

export default createReducer(initialState, reducers);

// const meetingReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case GET_MEETING :
//             state = action.payload;
//             return state;
//         case ADD_MEETING :
//             state = [...state, action.payload];
//             return state;
//         case SEARCH_MEETING :
//             const searchMeeting = state.filter(meeting => meeting?.companyId.includes(action.payload.companyId.trim()))
//             state = searchMeeting;
//             return state;
//         case UPDATE_MEETING :
//             const updateState = state.map(meeting => meeting.id === action.payload.id ? action.payload : meeting);
//             state = updateState;
//             return state;
//
//         case ADD_ROLE_MEETING :
//             const updateRole = state.map(meeting => meeting.id === action.payload.id ? meeting = {
//                 ...meeting,
//                 roles: [...meeting?.roles, action.payload]
//             } : meeting);
//             state = updateRole;
//             return state;
//         case DELETE_ROLE_MEETING:
//             const filterRoleMeeting = state.filter(roleMeeting => roleMeeting.id !== action.payload && roleMeeting)
//             state = filterRoleMeeting;
//             return state;
//
//         case ADD_DAYPLAN_MEETING :
//             const updateDayplan = state.map(meeting => meeting.id === action.payload.id ? meeting = {
//                 ...meeting,
//                 dayplan: [...meeting?.dayplan, action.payload]
//             } : meeting);
//             state = updateDayplan;
//             return state;
//
//         case ADD_FILENAME_MEETING :
//             const updateFileName = state.map(meeting => meeting.id === action.payload.id ? meeting = {
//                 ...meeting,
//                 file: [...meeting.file, action.payload.file]
//             } : meeting);
//             state = updateFileName;
//             return state;
//         case DELETE_FILENAME_MEETING:
//             const filterFileMeeting = state.filter(fileMeeting => fileMeeting.fileName !== action.payload && fileMeeting)
//             state = filterFileMeeting;
//             return state;
//         case ADD_MEMBERS_LIST :
//             const updateMemberslist = state.map(meeting => meeting.id === action.payload.id ? meeting = {
//                 ...meeting,
//                 memberslist: [...meeting.memberslist, action.payload]
//             } : meeting);
//             state = updateMemberslist;
//             return state;
//         case DELETE_MEETING :
//             const filterMeeting = state.filter(meeting => meeting.id !== action.payload && meeting)
//             state = filterMeeting;
//             return state;
//         default:
//             return state;
//     }
// }
//
// export default meetingReducer;
