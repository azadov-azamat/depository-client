import {
    addAgendaAndMeetingFileApi,
    addAgendaApi,
    addedChairmanFromReestrPageApi,
    addMemberManagerApi,
    addReestrByMeetingApi,
    addVotingMeetingApi,
    deleteAgenda,
    deleteMeeting,
    deleteMeetingFile,
    deleteMember,
    downloadByIdMeetingFilesApi,
    editAgendaApi,
    editMeetingApi,
    editMeetingStatusApi, get_voting_details,
    getAgendaByIdApi,
    getAgendaByMeetingIdApi,
    getCitiesApi,
    getCityByIdApi,
    getMeetingByCompanyIdApi,
    getMeetingByIdApi,
    getMeetingBySorted,
    getMeetingByUserIdAndCompanyIdApi,
    getMeetingFilesByMeetingIdApi,
    getMeetings,
    getMeetingSpecFilterApi,
    getMemberByIdApi,
    getMemberByMeetingIdApi,
    getMemberTypeEnumApi,
    isConfirmed, isRemotely,
    postMeeting
} from "../../api/MeetingApi";
import * as types from "../actionTypes/MeetingActionTypes";
import {toast} from "react-toastify";
import {deleteVotingByIdApi} from "../../api/MeetingStartedApi";
import {ACTIVE, CANCELED, FINISH, PENDING} from "../../utils/contants";

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
    }).then(res => {
        //
    }).catch(err => {

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

export const getMeetingSpecFilterAction = (payload) => async (dispatch) => {
    try {
        const res = await dispatch({
            api: getMeetingSpecFilterApi,
            types: ["REQUEST_API_START", types.REQUEST_GET_MEETING_LIST_SUCCESS, "REQUEST_API_ERROR"],
            data: payload
        });
        if (res.success) {

        }
    } catch (err) {
        if (err.response) {

        }
    }
}

export const createMeeting = (payload) => async (dispatch) => {
    const lang = localStorage.getItem("i18nextLng")
    dispatch({
        api: postMeeting,
        types: ["REQUEST_START", types.REQUEST_CREATE_MEETING, "REQUEST_ERROR_CREATE_MEETING",],
        data: payload.data
    }).then(res => {

        const currentMeetingId = res.payload.id;
        payload.history.push("/supervisory/addOrEditMeeting/add_members?type=update&meeting_id=" + currentMeetingId)
    }).catch(err => {

        if (err.response.data.detail === "Company must have Chairmen or Secretary") {
            if (lang === "uz") {
                payload.toast.error("Kompaniyada rais yoki kotib bo'lishi kerak")
            }
            if (lang === "ru") {
                payload.toast.error("Компания должна иметь председателя или секретаря")
            }
            if (lang === "en") {
                payload.toast.error(err.response.data.detail)
            }
        }
    })
} // success 95%

export const updateMeetingAction = (payload) => async (dispatch) => {
    dispatch({
        api: editMeetingApi,
        types: ["REQUEST_START_UPDATE_MEETING", "REQUEST_GET_MEETING_SUCCESS", "REQUEST_ERROR_UPDATE_MEETING",],
        data: payload.data
    }).then(res => {
        const currentMeetingId = res.payload.id;
        payload.history.push("/supervisory/addOrEditMeeting/add_members?type=update&meeting_id=" + currentMeetingId)
    }).catch(err => {

    })
}
export const updateMeetingStatusAction = (payload) => async (dispatch) => {
    const {status, socketClient, dataForUpdateMeetingStatus, userId, meetingId, lang} = payload
    dispatch({
        api: editMeetingStatusApi,
        types: ["REQUEST_START_UPDATE_MEETING_STATUS", "REQUEST_UPDATE_MEETING_STATUS", "REQUEST_ERROR_UPDATE_MEETING_STATUS",],
        data: dataForUpdateMeetingStatus
    }).then(res => {
        const dataForComment = {
            userId,
            meetingId,
            loggingText:
                status === ACTIVE ? lang("meetingCreated.meetingStatus.active") : ""
                || status === FINISH ? lang("meetingCreated.meetingStatus.finish") : ""
                || status === CANCELED ? lang("meetingCreated.meetingStatus.canceled") : ""
                || status === PENDING ? lang("meetingCreated.meetingStatus.pending") : ""
        }
        socketClient.sendMessage('/topic/user-all', JSON.stringify(dataForComment));
    }).catch(err => {
        const lang = localStorage.getItem("i18nextLng")
        const {errorKey, detail, title, status} = err.response.data;

        if (errorKey === "CompanyNotActive") {
            if (lang === "uz") {
                toast.error("Uchrashuv holatini o'zgartirish uchun kompaniya FAOL holatida bo'lishi kerak!");
            } else if (lang === "ru") {
                toast.error("Компания должна быть в АКТИВНОМ состоянии для изменения статуса встречи!")
            } else {
                toast.error(title)
            }
        }
        if (status === 500) {
            if (lang === 'uz') {
                toast.error("O`chirishda xatolik!")
            }
            if (lang === 'ru') {
                toast.error("Ошибка при удалении!")
            }
            if (lang === 'en') {
                toast.error("Error deleting!")
            }
        }
    })
} // success 95%

export const deleteMeetingById = (payload) => async (dispatch) => {
    dispatch({
        api: deleteMeeting,
        types: types.REQUEST_DELETE_BY_ID,
        data: payload
    }).then(res => {
        dispatch(getMeetingList({page: 1, size: 8}))
    }).catch(err => {
        const lang = localStorage.getItem("i18nextLng")
        const {errorKey, detail, title, status} = err.response.data;

        if (errorKey === "ReestrExist") {
            if (lang === "uz") {
                toast.error("Bu uchrashuvda allaqachon Reestr ochilgan!");
            } else if (lang === "ru") {
                toast.error("К этому собранию уже есть Реестр!")
            } else {
                toast.error(title)
            }
        }
        if (status === 500) {
            if (lang === 'uz') {
                toast.error("O`chirishda xatolik!")
            }
            if (lang === 'ru') {
                toast.error("Ошибка при удалении!")
            }
            if (lang === 'en') {
                toast.error("Error deleting!")
            }
        }
    })
} // warning 60%


export const getMemberByMeetingId = (payload) => async (dispatch) => {
    dispatch({
        api: getMemberByMeetingIdApi,
        types: ["REQUEST_START_MEMBER", types.REQUEST_GET_MEMBER_LIST_SUCCESS, "REQUEST_ERROR_MEMBER"],
        data: payload
    }).then(res => {


    });
} // success 90%

export const addedChairmanFromReestrPageAction = (payload) => async (dispatch) => {
    dispatch({
        api: addedChairmanFromReestrPageApi,
        types: ["REQUEST_START_MEMBER", "REQUEST_ADDED_CHAIRMAN_FROM_REESTR_PAGE_SUCCESS", "REQUEST_ERROR_MEMBER"],
        data: payload.memberId
    }).then(res => {

        dispatch(getMemberByMeetingId({meetingId: res.payload.meetingId, fromReestr: true}))
    });
} // success 90%

export const getMemberTypeEnumAction = (payload) => async (dispatch) => {
    dispatch({
        api: getMemberTypeEnumApi,
        types: ["REQUEST_START_MEMBER_TYPE_ENUM", "REQUEST_GET_MEMBER_TYPE_ENUM_LIST_SUCCESS", "REQUEST_ERROR_MEMBER_TYPE_ENUM"],
        data: payload
    })
}
export const getMeetingByUserIdAndCompanyIdAction = (payload) => async (dispatch) => {
    dispatch({
        api: getMeetingByUserIdAndCompanyIdApi,
        types: ["REQUEST_START_MEETING_BY_USER_AND_COMPANY", "REQUEST_SUCCESS_MEETING_BY_USER_AND_COMPANY", "REQUEST_ERROR_MEETING_BY_USER_AND_COMPANY"],
        data: payload
    }).then(res => {

    });
} // success 90%

export const getMemberById = (payload) => async (dispatch) => {
    dispatch({
        api: getMemberByIdApi,
        types: ["", "REQUEST_GET_MEMBER_BY_ID_SUCCESS", ""],
        data: payload.ID
    }).then(res => {
        dispatch({
            type: 'CURRENT_MEMBER_TYPE',
            payload: {role: res.payload.memberTypeEnum, fromReestr: res.payload.fromReestr}
        })
    });
} // success 90%

export const addMemberManagers = (payload) => async (dispatch) => {
    dispatch({
        api: addMemberManagerApi,
        types: ["REQUEST_START", types.REQUEST_MEMBER_MANAGERS, "REQUEST_ERROR_MEMBER",],
        data: payload.data
    }).then(res => {
        dispatch(getMemberByMeetingId({meetingId: payload.data.meetingId, page: 1, size: 6, fromReestr: false}))
    }).catch(err => {
        const lang = localStorage.getItem("i18nextLng")
        const {errorKey, detail, title} = err.response.data;

        if (errorKey === "memberExistByType") {
            if (lang === "uz") {
                payload.toast.error("Bu foydalanuvchi, shu rol bilan allaqachon tizimga kiritilgan")
            }
            if (lang === "ru") {
                payload.toast.error("Участник уже имеет от этого MemberTypeEnum")
            }
            if (lang === "en") {
                payload.toast.error(title)
            }
        }
        if (errorKey === "memberExistByTypeSecretary") {
            if (lang === "uz") {
                payload.toast.error("A'zolar ro`yxati allaqachon bu Role ga ega: KOTIB")
            }
            if (lang === "ru") {
                payload.toast.error("Участник уже имеет от этого Роль: SECRETARY")
            }
            if (lang === "en") {
                payload.toast.error(title)
            }
        }
        if (errorKey === "meetingIsNotPending") {
            if (lang === 'uz') {
                payload.toast.error("Joriy yig`ilish KUTISH holatida emas!")
            }
            if (lang === 'ru') {
                payload.toast.error("Текущая встреча не в статусе - ОЖИДАЕТ!")
            }
            if (lang === 'en') {
                payload.toast.error(title)
            }
        }
        dispatch(getMemberByMeetingId({meetingId: payload.data.meetingId, page: 1, size: 6, fromReestr: false}))
    })
} // success 95%

export const deleteMemberById = (payload) => async (dispatch) => {
    dispatch({
        api: deleteMember,
        types: types.REQUEST_DELETE_BY_ID,
        data: payload.currentMemberId
    }).then(res => {
        dispatch(getMemberByMeetingId({meetingId: payload.currentMeetingId, page: 1, size: 6, fromReestr: false}))
    }).catch(err => {
        const lang = localStorage.getItem("i18nextLng")
        const {errorKey, detail, title, status} = err.response.data;

        if (errorKey === "existInAgenda") {
            if (lang === "uz") {
                payload.toast.error("Bu a'zo allaqachon boshqa kun tartibida ishtirok etgan!")
            }
            if (lang === "ru") {
                payload.toast.error("Этот участник уже участвует в другой повестке дня")
            }
            if (lang === "en") {
                payload.toast.error(title)
            }
        }
        if (errorKey === "meetingIsNotPending") {
            if (lang === 'uz') {
                payload.toast.error("Joriy yig`ilish KUTISH holatida emas!")
            }
            if (lang === 'ru') {
                payload.toast.error("Текущая встреча не в статусе - ОЖИДАЕТ!")
            }
            if (lang === 'en') {
                payload.toast.error(title)
            }
        }
        if (status === 500) {
            toast.error('Извини, ты ошибся')
        }
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

export const IsRemotelyAction = (payload) => async (dispatch) => {
    dispatch({
        api: isRemotely,
        types: ["REQUEST_START_IS_REMOTELY", "REQUEST_SUCCESS_IS_REMOTELY", "REQUEST_ERROR_IS_REMOTELY"],
        data: payload.data
    }).then(res => {
        payload.setOpenModal(false)
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
export const getAgendaById = (payload) => async (dispatch) => {
    dispatch({
        api: getAgendaByIdApi,
        types: ["REQUEST_START_AGENDA", "REQUEST_GET_AGENDA_BY_ID_SUCCESS", "REQUEST_ERROR_AGENDA"],
        data: payload.agendaId
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
        const lang = localStorage.getItem("i18nextLng")
        const {errorKey, detail, title, status} = err.response.data;

        if (errorKey === "subjectExists") {
            if (lang === 'uz') {
                payload.toast.error("Mavzu bu uchrashuvda allaqachon mavjud!")
            }
            if (lang === 'ru') {
                payload.toast.error("Тема уже присутствует на этой встрече!")
            }
            if (lang === 'en') {
                payload.toast.error(title)
            }
        }
        if (errorKey === "meetingIsNotPending") {
            if (lang === 'uz') {
                payload.toast.error("Joriy yig`ilish KUTISH holatida emas!")
            }
            if (lang === 'ru') {
                payload.toast.error("Текущая встреча не в статусе - ОЖИДАЕТ!")
            }
            if (lang === 'en') {
                payload.toast.error(title)
            }
        }
    })
}  // warning 95%

export const editAgendaAction = (payload) => async (dispatch) => {
    dispatch({
        api: editAgendaApi,
        types: ["REQUEST_START", "REQUEST_AGENDA_SUCCESS", "REQUEST_ERROR_AGENDA",],
        data: payload.data
    }).then(res => {
        payload.setOpenModal(false)
        dispatch(getAgendaByMeetingId({meetingId: res.payload.meetingId}))
    }).catch(err => {
        const lang = localStorage.getItem("i18nextLng")
        const {errorKey, detail, title, status} = err.response.data;
        payload.setOpenModal(false)
        if (errorKey === "subjectExists") {
            if (lang === 'uz') {
                payload.toast.error("Joriy yig`ilish KUTISH holatida emas!")
            }
            if (lang === 'ru') {
                payload.toast.error("Текущая встреча не в статусе - ОЖИДАЕТ!")
            }
            if (lang === 'en') {
                payload.toast.error(title)
            }
        }
        if (errorKey === "meetingIsNotPending") {
            if (lang === 'uz') {
                payload.toast.error("Joriy yig`ilish KUTISH holatida emas!")
            }
            if (lang === 'ru') {
                payload.toast.error("Текущая встреча не в статусе - ОЖИДАЕТ!")
            }
            if (lang === 'en') {
                payload.toast.error(title)
            }
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
        const lang = localStorage.getItem("i18nextLng")
        const {errorKey, detail, title, status} = err.response.data;

        if (errorKey === "meetingIsNotPending") {
            if (lang === 'uz') {
                payload.toast.error("Joriy yig`ilish KUTISH holatida emas!")
            }
            if (lang === 'ru') {
                payload.toast.error("Текущая встреча не в статусе - ОЖИДАЕТ!")
            }
            if (lang === 'en') {
                payload.toast.error(title)
            }
        }
        if (status === 500) {
            toast.error('Извини, ты ошибся')
        }
    })
}

export const getMeetingByCompanyId = (payload) => async (dispatch) => {
    dispatch({
        api: getMeetingByCompanyIdApi,
        types: ['', 'REQUEST_GET_MEETING_BY_COMPANY_ID', ''],
        data: payload
    }).then(res => {

    }).catch(err => {

    })
}

export const addReestrByMeetingAction = (payload) => async (dispatch) => {
    dispatch({
        api: addReestrByMeetingApi,
        types: ["REQUEST_REESTR_START", "REQUEST_REESTR_SUCCESS", "REQUEST_REESTR_ERROR"],
        data: payload.data
    }).then(res => {
        dispatch(getMemberByMeetingId({meetingId: res.payload.meetingId, fromReestr: true}))
    }).catch(err => {
        const lang = localStorage.getItem("i18nextLng")
        const {errorKey, detail, title} = err.response.data;
        if (errorKey === "chairmenError") {
            if (lang === "uz") {
                toast.error("Ushbu reestr uchun Rais topilmadi!");
            } else if (lang === "ru") {
                toast.error("По этому Реестру не найдено Председателя!")
            } else {
                toast.error(title)
            }
        }
        if (errorKey === "notFoundChairman") {
            if (lang === "uz") {
                toast.error("Kompaniyada saylangan rais ro'yxatdan topilmadi!");
            } else if (lang === "ru") {
                toast.error("Председатель компании не нашелся в реестре!")
            } else {
                toast.error(title)
            }
        }
        if (errorKey === "NullPointer") {
            if (lang === "uz") {
                toast.error("Hujayra null bo'lmasligi kerak");
            } else if (lang === "ru") {
                toast.error("Ячейка не должна содержать null")
            } else {
                toast.error(title)
            }
        }
        if (errorKey === "emailexists") {
            if (lang === "uz") {
                toast.error("Email allaqachon ishlatilmoqda!");
            } else if (lang === "ru") {
                toast.error("Email уже используется!")
            } else {
                toast.error(title)
            }
        }
        if (detail === "Required request part 'file' is not present") {
            toast.error("\"Fayl\" so'rovining kerakli qismi mavjud emas! iltimos tekshiring")
        }
        if (errorKey === 'userexists') {
            if (lang === "ru") {
                payload.toast.error("Паспорт уже использовался!")
            }
            if (lang === "uz") {
                payload.toast.error("Passport allaqachon ishlatilgan!")
            }
            if (lang === "en") {
                payload.toast.error(err.response.data.title)
            }
        }
        if (errorKey === 'phonenumberexists') {
            if (lang === "ru") {
                payload.toast.error("Телефонный номер уже используется!")
            }
            if (lang === "uz") {
                payload.toast.error("Telefon raqami allaqachon ishlatilgan!")
            }
            if (lang === "en") {
                payload.toast.error(err.response.data.title)
            }
        }

        dispatch(getMemberByMeetingId({meetingId: payload.meetingId, fromReestr: true}))
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
        types: ["", "REQUEST_GET_CITIES", ""],
        data: payload
    })
}

export const deleteVotingAction = (payload) => async (dispatch) => {
    dispatch({
        api: deleteVotingByIdApi,
        types: ["REQUEST_DELETE_VOTING_START", "REQUEST_DELETE_VOTING_SUCCESS", "REQUEST_DELETE_VOTING_ERROR"],
        data: payload.id
    }).then(res => {

        payload.handleRemoveClickEdit(parseInt(payload.index))
    }).catch(err => {


    })
}

export const get_voting_details_action = (payload) => async (dispatch) => {
    dispatch({
        api: get_voting_details,
        types: ["REQUEST_VOTING_DETAILS_START", "REQUEST_VOTING_DETAILS_SUCCESS", "REQUEST_VOTING_DETAILS_ERROR"],
        data: payload
    }).then(res => {

    }).catch(err => {


    })
}
