import {
    addBallotApi,
    addLoggingApi,
    addQuestion, deleteBallot, deleteLoggingByIdApi,
    editQuestion,
    editStatusQuestion,
    getBallotByAgendaApi,
    getBallotByMeetingApi,
    getBallotByMemberApi,
    getBallotByOptionApi,
    getBallotByVotingApi,
    getBallotVotingApi,
    getLoggingApi,
    getQuestionByMeetingIdApi,
    getQuestionByMemberIdApi
} from "../../api/MeetingStartedApi";
import {editStatusAgenda} from "../../api/MeetingApi";
import * as meetingActions from "../../redux/actions/MeetingAction";
import {DEPOSITORY_CURRENT_MEETING, DEPOSITORY_CURRENT_MEMBER} from "../../utils/contants";
import {toast} from "react-toastify";

export const getLoggingAction = (payload) => async (dispatch) => {
    dispatch({
        api: getLoggingApi,
        types: ['REQUEST_START_LOGGING_LIST', 'REQUEST_SUCCESS_LOGGING_LIST', 'REQUEST_ERROR_LOGGING_LIST'],
        data: payload
    })
}

export const addLoggingAction = (payload) => async (dispatch) => {
    dispatch({
        api: addLoggingApi,
        types: ["REQUEST_ADD_START_LOGGING", "REQUEST_ADD_SUCCESS_LOGGING", "REQUEST_ADD_ERROR_LOGGING",],
        data: payload.data
    }).then(res => {
        dispatch(getLoggingAction({meetingId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING))}))
    }).catch(err => {
    })
} // success 95%

export const DeleteLoggingByIdAction = (payload) => async (dispatch) => {
    dispatch({
        api: deleteLoggingByIdApi,
        types: ["REQUEST_DELETE_START_LOGGING", "REQUEST_DELETE_SUCCESS_LOGGING", "REQUEST_DELETE_ERROR_LOGGING",],
        data: payload.ID
    }).then(res=>{
        console.log("bu delete logging =====================")
        dispatch({
            type: 'PASSWORD_ZOOM_MEETING',
            payload: {
                password_zoom: null,
                password_id: null
            }
        })
    })
} // success 95%


export const editStatusAgendaAction = (payload) => async (dispatch) => {
    dispatch({
        api: editStatusAgenda,
        types: ["REQUEST_START_STATUS_AGENDA", "", "REQUEST_ERROR_STATUS_AGENDA"],
        data: payload.data
    }).then(res => {
        dispatch(meetingActions.getAgendaByMeetingId({meetingId: res.payload.meetingId}))
    })
}


export const getQuestionByMeetingAction = (payload) => async (dispatch) => {
    dispatch({
        api: getQuestionByMeetingIdApi,
        types: ["REQUEST_START_QUESTION_LIST", "REQUEST_SUCCESS_QUESTION_LIST", "REQUEST_ERROR_QUESTION_LIST"],
        data: payload
    }).then(res => {
    }).catch(err => {
    })
}

export const getQuestionByMemberIdAction = (payload) => async (dispatch) => {
    dispatch({
        api: getQuestionByMemberIdApi,
        types: ["REQUEST_START_QUESTION_LIST_BY_MEMBER_ID", "REQUEST_SUCCESS_QUESTION_LIST_BY_MEMBER_ID", "REQUEST_ERROR_QUESTION_LIST_BY_MEMBER_ID"],
        data: payload.memberId
    }).then(res => {
    }).catch(err => {
    })
}

export const addQuestionAction = (payload) => async (dispatch) => {
    dispatch({
        api: addQuestion,
        types: ["REQUEST_START_ADD_QUESTION", "REQUEST_SUCCESS_ADD_QUESTION", "REQUEST_ERROR_ADD_QUESTION"],
        data: payload.data
    }).then(res => {
        toast.success("Xabaringiz yuborildi")
        dispatch(getQuestionByMemberIdAction({memberId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEMBER))}))
        payload.setOpenQuestionModal(false)
    })
}

export const editQuestionAction = (payload) => async (dispatch) => {
    dispatch({
        api: editQuestion,
        types: ["REQUEST_START_EDIT_QUESTION", "REQUEST_SUCCESS_EDIT_QUESTION", "REQUEST_ERROR_EDIT_QUESTION"],
        data: payload.data
    }).then(res => {
        dispatch(getQuestionByMeetingAction({meetingId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING))}))
    })
}

export const editStatusQuestionAction = (payload) => async (dispatch) => {
    dispatch({
        api: editStatusQuestion,
        types: ["REQUEST_START_STATUS_QUESTION", "", "REQUEST_ERROR_STATUS_QUESTION"],
        data: payload.questionId
    }).then(res => {
        dispatch(getQuestionByMeetingAction({meetingId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING))}))
    })
}


export const addBallotAction = (payload) => async (dispatch) => {
    dispatch({
        api: addBallotApi,
        types: ["REQUEST_START_ADD_BALLOT", "REQUEST_SUCCESS_ADD_BALLOT", "REQUEST_ERROR_ADD_BALLOT"],
        data: payload.data
    }).then(res => {
        toast.success("ok")
    }).catch(err => {
    })
}

export const getBallotByAgendaAction = (payload) => async (dispatch) => {
    dispatch({
        api: getBallotByAgendaApi,
        types: ["REQUEST_START_GET_BALLOT_BY_AGENDA", "REQUEST_SUCCESS_GET_BALLOT_BY_AGENDA", "REQUEST_ERROR_GET_BALLOT_BY_AGENDA"],
        data: payload
    }).then(res => {
    }).catch(err => {
    })
}

export const getBallotByMeetingAction = (payload) => async (dispatch) => {
    dispatch({
        api: getBallotByMeetingApi,
        types: ["REQUEST_START_GET_BALLOT_BY_MEETING", "REQUEST_SUCCESS_GET_BALLOT_BY_MEETING", "REQUEST_ERROR_GET_BALLOT_BY_MEETING"],
        data: payload
    }).then(res => {
    }).catch(err => {
    })
}

export const getBallotByMemberAction = (payload) => async (dispatch) => {
    dispatch({
        api: getBallotByMemberApi,
        types: ["REQUEST_START_GET_BALLOT_BY_MEMBER", "REQUEST_SUCCESS_GET_BALLOT_BY_MEMBER", "REQUEST_ERROR_GET_BALLOT_BY_MEMBER"],
        data: payload
    }).then(res => {
    }).catch(err => {
    })
}

export const getBallotByOptionAction = (payload) => async (dispatch) => {
    dispatch({
        api: getBallotByOptionApi,
        types: ["REQUEST_START_GET_BALLOT_BY_OPTION", "REQUEST_SUCCESS_GET_BALLOT_BY_OPTION", "REQUEST_ERROR_GET_BALLOT_BY_OPTION"],
        data: payload
    }).then(res => {
    }).catch(err => {
    })
}

export const getBallotByVotingAction = (payload) => async (dispatch) => {
    dispatch({
        api: getBallotByVotingApi,
        types: ["REQUEST_START_GET_BALLOT_BY_VOTING", "REQUEST_SUCCESS_GET_BALLOT_BY_VOTING", "REQUEST_ERROR_GET_BALLOT_BY_VOTING"],
        data: payload
    }).then(res => {
    }).catch(err => {
    })
}

export const getBallotVoting = (payload) => async (dispatch) => {
    console.log("Action ga keldi")
    console.log(payload)
    dispatch({
        api: getBallotVotingApi,
        types: ["REQUEST_START_GET_BALLOT_VOTING", "REQUEST_SUCCESS_GET_BALLOT_VOTING", "REQUEST_ERROR_GET_BALLOT_VOTING"],
        data: payload
    }).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}

export const deleteBallotAction=(payload)=> async (dispatch)=>{
    dispatch({
        api: deleteBallot,
        types: ["REQUEST_DELETE_BALLOT_START", "REQUEST_DELETE_BALLOT_SUCCESS", "REQUEST_DELETE_BALLOT_ERROR"],
        data: payload.data
    }).then(res=>{
        console.log(res)
        console.log("success")
    }).catch(err=>{
        console.log(err)
        console.log("error")
    })
}
