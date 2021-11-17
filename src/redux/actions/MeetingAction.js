import {
    addAgendaAndMeetingFileApi,
    addAgendaApi,
    addMemberManagerApi,
    addReestrByMeetingApi,
    addVotingMeetingApi,
    deleteAgenda,
    deleteMeeting,
    deleteMeetingFile,
    deleteMember, downloadByIdMeetingFilesApi, editMeetingApi,
    getAgendaByMeetingIdApi, getMeetingByIdApi,
    getMeetingBySorted,
    getMeetingFilesByMeetingIdApi,
    getMeetings,
    getMemberByIdApi,
    getMemberByMeetingIdApi,
    getReestrByMeetingApi, isConfirmed,
    postMeeting
} from "../../api/MeetingApi";
import * as types from "../actionTypes/MeetingActionTypes";
import {toast} from "react-toastify";
import {DEPOSITORY_CURRENT_MEETING} from "../../utils/contants";

export const getMeetingByIdAction = (payload) => async (dispatch) => {
    dispatch({
        api: getMeetingByIdApi,
        types: [
            "REQUEST_GET_MEETING_START",
            "REQUEST_GET_MEETING_SUCCESS",
            "REQUEST_GET_MEETING_ERROR",
        ],
        data: payload.meetingId
    }).then(res=>{
        console.log(res)
    })
} //success 90%

export const getMeetingList = (payload) => async (dispatch) => {
    dispatch({
        api: getMeetings,
        types: [
            types.REQUEST_GET_MEETING_LIST_START,
            types.REQUEST_GET_MEETING_LIST_SUCCESS,
            types.REQUEST_GET_MEETING_LIST_ERROR
        ],
        data: payload
    })
} //success 90%

export const getMeetingFilter = (payload) => async (dispatch) => {
    console.log(payload);
    try {
        const res = await dispatch({
            api: getMeetingBySorted,
            types: [types.REQUEST_API_START_MEETING, types.REQUEST_GET_MEETING_LIST_SUCCESS, types.REQUEST_API_ERROR_MEETING],
            data: payload
        });
        if (res.success) {
            console.log(res)
        }
        return true;
    } catch (err) {
        if (err.response) {
            console.log(err)
        }
    }
} // checking !!!

export const createMeeting = (payload) => async (dispatch) => {
    dispatch({
        api: postMeeting,
        types: ["REQUEST_START", types.REQUEST_CREATE_MEETING, "",],
        data: payload.data
    }).then(res => {
        console.log(res)
        payload.history.push('/supervisory/meetingUsers')
    }).catch(err => {
        console.log(err.response);
    })
} // success 95%

export const updateMeetingAction = (payload) => async (dispatch) => {
    dispatch({
        api: editMeetingApi,
        types: ["REQUEST_START_UPDATE_MEETING", "REQUEST_UPDATE_MEETING", "REQUEST_ERROR_UPDATE_MEETING",],
        data: payload.data
    }).then(res => {
        dispatch(getMeetingByIdAction({meetingId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING))}))
        payload.history.push('/supervisory/meetingUsers')
    }).catch(err => {
        console.log(err.response);
    })
} // success 95%

export const deleteMeetingById = (payload) => async (dispatch) => {
    console.log('action')
    console.log(payload)
    dispatch({
        api: deleteMeeting,
        types: types.REQUEST_DELETE_BY_ID,
        data: payload
    }).then(res => {
        dispatch(getMeetingList({page: 1, size: 6}))
    }).catch(err => {
        console.log(err)
        toast.error('Извини, ты ошибся')
    })
} // warning 60%


export const getMemberByMeetingId = (payload) => async (dispatch) => {
    dispatch({
        api: getMemberByMeetingIdApi,
        types: ["REQUEST_START_MEMBER", types.REQUEST_GET_MEMBER_LIST_SUCCESS, "REQUEST_ERROR_MEMBER"],
        data: payload
    });
} // success 90%

export const getMemberById = (payload) => async (dispatch) => {
    dispatch({
        api: getMemberByIdApi,
        types: ["", "REQUEST_GET_MEMBER_BY_ID_SUCCESS", ""],
        data: payload.ID
    }).then(res => {
        console.log(res)
    });
} // success 90%

export const addMemberManagers = (payload) => async (dispatch) => {
    console.log(payload)
    dispatch({
        api: addMemberManagerApi,
        types: ["REQUEST_START", types.REQUEST_MEMBER_MANAGERS, "REQUEST_ERROR_MEMBER",],
        data: payload.data
    }).then(res => {
        console.log(res)
        dispatch(getMemberByMeetingId({meetingId: payload.data.meetingId, page: 1, size: 6}))
    }).catch(err => {
        console.log(err.response);
    })
} // success 95%

export const deleteMemberById = (payload) => async (dispatch) => {
    console.log('action')
    console.log(payload)
    dispatch({
        api: deleteMember,
        types: types.REQUEST_DELETE_BY_ID,
        data: payload.currentMemberId
    }).then(res => {
        console.log(res)
        dispatch(getMemberByMeetingId({meetingId: payload.currentMeetingId, page: 1, size: 6}))
    }).catch(err => {
        console.log(err)
        toast.error('Извини, ты ошибся')
    })
} // success 90%

export const IsConfirmedAction =(payload)=> async (dispatch)=>{
    dispatch({
        api: isConfirmed,
        types: ["REQUEST_START_IS_CONFIRMED", "REQUEST_SUCCESS_IS_CONFIRMED","REQUEST_ERROR_IS_CONFIRMED"],
        data: payload.currentMemberId
    }).then(res=> {
        console.log(res)
    }).catch(err=>{
        console.log(err);
    })
}

export const getAgendaByMeetingId = (payload) => async (dispatch) => {
    dispatch({
        api: getAgendaByMeetingIdApi,
        types: ["REQUEST_START_AGENDA", "REQUEST_GET_AGENDA_MY_MEETING_ID_SUCCESS", "REQUEST_ERROR_AGENDA"],
        data: payload
    }).then(res => {
        console.log(res)
    }).catch(err=>{
        console.log(err)
    })
}

export const addAgenda = (payload) => async (dispatch) => {
    dispatch({
        api: addAgendaApi,
        types: ["REQUEST_START", "REQUEST_AGENDA_SUCCESS", "REQUEST_ERROR_AGENDA",],
        data: payload.data
    }).then(res => {
        console.log(res)
        dispatch(getAgendaByMeetingId({meetingId: res.payload.meetingId}))
    }).catch(err => {
        console.log(err.response);
        if (err.response.data.errorKey === "subjectExists") {
            toast.error('Bu kun tartibidagi masalani siz kiritgansiz!')
        }
    })
}  // warning 70%

export const deleteByIdAgenda = (payload) => async (dispatch) => {
    dispatch({
        api: deleteAgenda,
        types: types.REQUEST_DELETE_BY_ID,
        data: payload.currentAgendaId
    }).then(res => {
        console.log(res)
        dispatch(getAgendaByMeetingId({meetingId: payload.currentMeetingId}))
    }).catch(err => {
        console.log(err)
        toast.error('Извини, ты ошибся')
    })
}

export const addReestrByMeetingAction = (payload) => async (dispatch) => {
    dispatch({
        api: addReestrByMeetingApi,
        types: ["REQUEST_REESTR_START", "REQUEST_REESTR_SUCCESS", "REQUEST_REESTR_ERROR"],
        data: payload
    }).then(res => {
        console.log(res)
        dispatch(getMemberByMeetingId({meetingId: res.payload.meetingId}))
    }).catch(err => {
        const {detail} = err.response.data;
        console.log(err.response)
        if (detail === "Required request part 'file' is not present") {
            toast.error("\"Fayl\" so'rovining kerakli qismi mavjud emas! iltimos tekshiring")
        } else {
            toast.error('Извини, ты ошибся')
        }
    })
}


export const addVotingAgendaAction = (payload) => async (dispatch) => {
    dispatch({
        api: addVotingMeetingApi,
        types: ["REQUEST_POST_VOTING_AGENDA_START", "REQUEST_POST_VOTING_AGENDA_SUCCESS", "REQUEST_POST_VOTING_AGENDA_ERROR"],
        payload: payload.data
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
}

export const getMeetingFilesByMeetingIdAction = (payload) => async (dispatch) => {
    dispatch({
        api: getMeetingFilesByMeetingIdApi,
        types: ["REQUEST_START_GET_FILES_BY_MEETING_ID", "REQUEST_SUCCESS_GET_FILES_BY_MEETING_ID", "REQUEST_ERROR_GET_FILES_BY_MEETING_ID"],
        data: payload.meetingId
    })
}

export const addAgendaAndMeetingFile = (payload) => async (dispatch) => {
    dispatch({
        api: addAgendaAndMeetingFileApi,
        types: [
            "REQUEST_UPLOAD_FILE_START",
            "REQUEST_UPLOAD_FILE_SUCCESS",
            "REQUEST_UPLOAD_FILE_ERROR",
        ],
        data: payload.data
    }).then(res => {
        dispatch(getMeetingFilesByMeetingIdAction({meetingId: res.payload.meetingId}))
    }).catch(err => {
        console.log(err)
    })
} // success 90%

export const deleteMeetingFileAction = (payload) => async (dispatch) => {
    console.log(payload)
    dispatch({
        api: deleteMeetingFile,
        types: "REQUEST_DELETE_FILE_SUCCESS",
        data: payload.id
    }).then(res => {
        console.log(res)
        dispatch(getMeetingFilesByMeetingIdAction({meetingId: payload.meetingId}))
    }).catch(err => {
        console.log(err.response)
    })
} // warning 70%

export const downloadByIdMeetingFiles = (payload) => async (dispatch) => {
    dispatch({
        api: downloadByIdMeetingFilesApi,
        types: ['REQUEST_DOWNLOAD_START', "REQUEST_DOWNLOAD_SUCCESS", "REQUEST_DOWNLOAD_ERROR"],
        data: payload
    })
}
