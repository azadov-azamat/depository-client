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
    getAgendaByMeetingIdApi, getCitiesApi, getCityByIdApi, getMeetingByIdApi,
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
    }).then(res => {
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
    try {
        const res = await dispatch({
            api: getMeetingBySorted,
            types: [types.REQUEST_API_START_MEETING, types.REQUEST_GET_MEETING_LIST_SUCCESS, types.REQUEST_API_ERROR_MEETING],
            data: payload
        });
        if (res.success) {
        }
        return true;
    } catch (err) {
        if (err.response) {
        }
    }
} // checking !!!

export const createMeeting = (payload) => async (dispatch) => {
    const lang = localStorage.getItem("i18nextLng")
    dispatch({
        api: postMeeting,
        types: ["REQUEST_START", types.REQUEST_CREATE_MEETING, "REQUEST_ERROR_CREATE_MEETING",],
        data: payload.data
    }).then(res => {
        console.log(res)
        const currentMeetingId = res.payload.id;
        localStorage.setItem(DEPOSITORY_CURRENT_MEETING, currentMeetingId)
        payload.history.push("/supervisory/addOrEditMeeting/" + currentMeetingId + "/member-by-meeting")
    }).catch(err => {
        console.log(err.response.data)
        if (err.response.data.detail === "Company must have Chairmen or Secretary"){
            if (lang === "uz"){
                payload.toast.error("Kompaniyada rais yoki kotib bo'lishi kerak")
            }
            if (lang === "ru"){
                payload.toast.error("Компания должна иметь председателя или секретаря")
            }
            if (lang === "en"){
                payload.toast.error(err.response.data.detail)
            }
        }
    })
} // success 95%

export const updateMeetingAction = (payload) => async (dispatch) => {
    dispatch({
        api: editMeetingApi,
        types: ["REQUEST_START_UPDATE_MEETING", "REQUEST_UPDATE_MEETING", "REQUEST_ERROR_UPDATE_MEETING",],
        data: payload.data
    }).then(res => {
        const currentMeetingId = parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING));
        dispatch(getMeetingByIdAction({meetingId: currentMeetingId}))
        payload.history.push("/supervisory/addOrEditMeeting/" + currentMeetingId + "/member-by-meeting")
    }).catch(err => {
    })
} // success 95%

export const deleteMeetingById = (payload) => async (dispatch) => {
    dispatch({
        api: deleteMeeting,
        types: types.REQUEST_DELETE_BY_ID,
        data: payload
    }).then(res => {
        dispatch(getMeetingList({page: 1, size: 6}))
    }).catch(err => {
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
    });
} // success 90%

export const addMemberManagers = (payload) => async (dispatch) => {
    dispatch({
        api: addMemberManagerApi,
        types: ["REQUEST_START", types.REQUEST_MEMBER_MANAGERS, "REQUEST_ERROR_MEMBER",],
        data: payload.data
    }).then(res => {
        dispatch(getMemberByMeetingId({meetingId: payload.data.meetingId, page: 1, size: 6}))
    }).catch(err => {
    })
} // success 95%

export const deleteMemberById = (payload) => async (dispatch) => {
    dispatch({
        api: deleteMember,
        types: types.REQUEST_DELETE_BY_ID,
        data: payload.currentMemberId
    }).then(res => {
        dispatch(getMemberByMeetingId({meetingId: payload.currentMeetingId, page: 1, size: 6}))
    }).catch(err => {
        toast.error('Извини, ты ошибся')
    })
} // success 90%

export const IsConfirmedAction = (payload) => async (dispatch) => {
    dispatch({
        api: isConfirmed,
        types: ["REQUEST_START_IS_CONFIRMED", "REQUEST_SUCCESS_IS_CONFIRMED", "REQUEST_ERROR_IS_CONFIRMED"],
        data: payload.currentMemberId
    }).then(res => {
    }).catch(err => {
    })
}

export const getAgendaByMeetingId = (payload) => async (dispatch) => {
    dispatch({
        api: getAgendaByMeetingIdApi,
        types: ["REQUEST_START_AGENDA", "REQUEST_GET_AGENDA_MY_MEETING_ID_SUCCESS", "REQUEST_ERROR_AGENDA"],
        data: payload
    }).then(res => {
    }).catch(err => {
    })
}

export const addAgenda = (payload) => async (dispatch) => {
    dispatch({
        api: addAgendaApi,
        types: ["REQUEST_START", "REQUEST_AGENDA_SUCCESS", "REQUEST_ERROR_AGENDA",],
        data: payload.data
    }).then(res => {
        dispatch(getAgendaByMeetingId({meetingId: res.payload.meetingId}))
    }).catch(err => {
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
        dispatch(getAgendaByMeetingId({meetingId: payload.currentMeetingId}))
    }).catch(err => {
        toast.error('Извини, ты ошибся')
    })
}

export const addReestrByMeetingAction = (payload) => async (dispatch) => {
    dispatch({
        api: addReestrByMeetingApi,
        types: ["REQUEST_REESTR_START", "REQUEST_REESTR_SUCCESS", "REQUEST_REESTR_ERROR"],
        data: payload
    }).then(res => {
        dispatch(getMemberByMeetingId({meetingId: res.payload.meetingId}))
    }).catch(err => {
        const lang = localStorage.getItem("i18nextLng")
        const {errorKey, detail, title} = err.response.data;
        console.log(err.response.data)
        if (errorKey === "chairmenError"){
            if (lang === "uz"){
                toast.error("Ushbu reestr uchun Rais topilmadi!");
            }else if (lang === "ru"){
                toast.error("По этому Реестру не найдено Председателя!")
            }else {
                toast.error(title)
            }
        }
        else if (errorKey==="NullPointer"){
            if (lang === "uz"){
                toast.error("Hujayra null bo'lmasligi kerak");
            }else if (lang === "ru"){
                toast.error("Ячейка не должна содержать null")
            }else {
                toast.error(title)
            }
        }
        else if (detail === "Required request part 'file' is not present") {
            toast.error("\"Fayl\" so'rovining kerakli qismi mavjud emas! iltimos tekshiring")
        }
    })
}


export const addVotingAgendaAction = (payload) => async (dispatch) => {
    dispatch({
        api: addVotingMeetingApi,
        types: ["REQUEST_POST_VOTING_AGENDA_START", "REQUEST_POST_VOTING_AGENDA_SUCCESS", "REQUEST_POST_VOTING_AGENDA_ERROR"],
        payload: payload.data
    }).then(res => {
    }).catch(err => {
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
    })
} // success 90%

export const deleteMeetingFileAction = (payload) => async (dispatch) => {
    dispatch({
        api: deleteMeetingFile,
        types: "REQUEST_DELETE_FILE_SUCCESS",
        data: payload.id
    }).then(res => {
        dispatch(getMeetingFilesByMeetingIdAction({meetingId: payload.meetingId}))
    }).catch(err => {
    })
} // warning 70%

export const downloadByIdMeetingFiles = (payload) => async (dispatch) => {
    dispatch({
        api: downloadByIdMeetingFilesApi,
        types: ['REQUEST_DOWNLOAD_START', "REQUEST_DOWNLOAD_SUCCESS", "REQUEST_DOWNLOAD_ERROR"],
        data: payload
    })
}

export const getCityByIdAction = (payload) => async (dispatch) => {
    dispatch({
        api: getCityByIdApi,
        types: ["", "REQUEST_GET_BY_ID_CITY", ""],
        data: payload.cityId
    })
}
export const getCitiesAction = (payload) => async (dispatch) => {
    dispatch({
        api: getCitiesApi,
        types: "REQUEST_GET_CITIES",
        data: payload
    })
}
