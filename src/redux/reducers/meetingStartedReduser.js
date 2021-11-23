import {createReducer} from "../../utils/StoreUtils";

const initialState = {
    loadingLogging: false,
    loggingList: [],
    questionListMemberId: [],
    countBadge: 0
};

const reducers = {
    ["REQUEST_START_LOGGING_LIST"](state) {
        state.loadingLogging = true;
    },
    ["REQUEST_SUCCESS_LOGGING_LIST"](state, action) {
        state.loadingLogging = false
        state.loggingList = action.payload;
    },
    ["REQUEST_ERROR_LOGGING_LIST"](state) {
        state.loadingLogging = true;
    },

    ["REQUEST_ADD_START_LOGGING"](state) {
        state.loadingLogging = true;
    },
    ["REQUEST_ADD_SUCCESS_LOGGING"](state, action) {
        state.loadingLogging = false
        state.currentLogging = action.payload;
    },
    ["REQUEST_ADD_ERROR_LOGGING"](state) {
        state.loadingLogging = true;
    },


    ["REQUEST_START_QUESTION_LIST"](state) {
        state.questionListLoading = true
    },
    ["REQUEST_ERROR_QUESTION_LIST"](state) {
        state.questionListLoading = true
    },
    ["REQUEST_SUCCESS_QUESTION_LIST"](state, action) {
        state.questionListLoading = false
        state.questionList = action.payload
    },

    ["REQUEST_START_ADD_QUESTION"](state) {
        state.questionLoading = true
    },
    ["REQUEST_ERROR_ADD_QUESTION"](state) {
        state.questionLoading = true
    },
    ["REQUEST_SUCCESS_ADD_QUESTION"](state, action) {
        state.questionLoading = false
        state.currentQuestion = action.payload
    },

    ["REQUEST_START_EDIT_QUESTION"](state) {
        state.questionLoading = true
    },
    ["REQUEST_SUCCESS_EDIT_QUESTION"](state) {
        state.questionLoading = true
    },
    ["REQUEST_ERROR_EDIT_QUESTION"](state, action) {
        state.questionLoading = false
        state.currentQuestion = action.payload
    },

    ["REQUEST_START_QUESTION_LIST_BY_MEMBER_ID"](state) {
        state.questionLoading = true
    },
    ["REQUEST_ERROR_QUESTION_LIST_BY_MEMBER_ID"](state) {
        state.questionLoading = true
    },
    ["REQUEST_SUCCESS_QUESTION_LIST_BY_MEMBER_ID"](state, action) {
        state.questionLoading = false
        state.questionListMemberId = action.payload
    },


    ["REQUEST_SUCCESS_GET_BALLOT_VOTING"](state, action) {
        state.ballotVotingList = action.payload
    },
    ["COUNT_BADGE"](state, action) {
        state.countBadge = action.payload
    }
}

export default createReducer(initialState, reducers);
