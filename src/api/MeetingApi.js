import HttpClient from "../utils/HttpClient";
import {api} from "./api";

export const getMeetingBySorted = (data) => {
    return HttpClient.doGet(api.companyFilter +
        (data && data.value && data.field
            ?
            "?value=" + data.value + "&field=" + data.field
            : ""))
}
export const getMeetingSpecFilterApi = (data) => {
    return HttpClient.doPost(api.meetingSpecFilter + (data && data.page && data.size ?
        "?page=" + (data.page - 1) + "&size=" + data.size : ""), data.objectData)
}
export const postMeeting = (data) => {
    return HttpClient.doPost(api.meetingMethod, data)
}

export const editMeetingApi = (data) => {
    return HttpClient.doPut(api.meetingMethod, data)
}

export const editMeetingStatusApi = (data) => {
    return HttpClient.doPatch(api.editMeetingStatus + "?meetingId=" + data.meetingId + "&statusEnum=" + data.statusEnum)
}

export const getMeetingByIdApi = (data) => {
    return HttpClient.doGet(api.meetingMethod + "/" + data)
}

export const getMeetings = (data) => {
    return HttpClient.doGet(api.meetingMethod +
        (data && data.page && data.size ? "?page=" + (data.page - 1) + "&size=" + data.size : ""))
}

export const deleteMeeting = (data) => {
    return HttpClient.doDelete(api.meetingMethod + "/" + data)
}

export const getMeetingByCompanyIdApi = (data) => {
    return HttpClient.doGet(api.meetingByCompany + (data && data.companyId ? "?companyId=" + data.companyId : ""))
}


export const getMemberByIdApi = (data) => {
    return HttpClient.doGet(api.member + "/" + (data && data))
}
export const addedChairmanFromReestrPageApi = (data) => {
    return HttpClient.doPost(api.addedChairmanFromReestrPage + (data && data))
}
export const getMemberByMeetingIdApi = (data) => {
    return HttpClient.doGet(api.memberByMeetingId + (data && data.meetingId ? "?meetingId=" + data.meetingId + "&page=" + (data.page - 1) + "&size=" + data.size + "&fromReestr=" + data.fromReestr : ''))
}
export const getMemberTypeEnumApi = (data) => {
    return HttpClient.doGet(api.memberTypeEnum + (data && data.userId ? "?userId=" + data.userId + "&meetingId=" + data.meetingId : ""))
}

export const getMeetingByUserIdAndCompanyIdApi = (data) => {
    return HttpClient.doGet(api.meetingByUserAndCompany + (data && data.userId ? "?userId=" + data.userId + "&companyId=" + data.companyId : ""))
}

export const addMemberManagerApi = (data) => {
    return HttpClient.doPost(api.memberManager, data)
}

export const deleteMember = (data) => {
    return HttpClient.doDelete(api.member + "/" + data)
}

export const isConfirmed = (data) => {
    return HttpClient.doPut(api.member + "/" + data)
}

export const isRemotely = (data) => {
    return HttpClient.doPut(api.memberIsRemotely + (data && data.memberId ? "?memberId=" + data.memberId + "&remotely=" + data.remotely: ''))
}


export const deleteAgenda = (data) => {
    return HttpClient.doDelete(api.agenda + "/" + data)
}
export const getAgendaByMeetingIdApi = (data) => {
    return HttpClient.doGet(api.agendaByMeetingId + (data && data.meetingId ? "?meetingId=" + data.meetingId : ''))
}
export const getAgendaByIdApi = (data) => {
    return HttpClient.doGet(api.agenda + "/" + data)
}
export const addAgendaApi = (data) => {
    return HttpClient.doPost(api.agenda, data)
}
export const editAgendaApi = (data) => {
    return HttpClient.doPut(api.agenda, data)
}
export const editStatusAgenda = (data) => {
    return HttpClient.doPatch(api.agenda, data)
}


export const addReestrByMeetingApi = (data) => {
    return HttpClient.doPost(api.addReestrByMeetingUrl, data)
}
export const getReestrByMeetingApi = (data) => {
    return HttpClient.doGet(api.getReestrByMeetingUrl + (data && data.meetingId ? "?meetingId=" + data.meetingId : ''))
}

export const addVotingMeetingApi = (data) => {
    return HttpClient.doPost(api.votingAgenda, data)
}

export const addAgendaAndMeetingFileApi = (data) => {
    return HttpClient.doPost(api.addMeetingFile, data)
}

export const getMeetingFilesByMeetingIdApi = (data) => {
    return HttpClient.doGet(api.getMeetingFile + (data && data))
}

export const deleteMeetingFile = (data) => {
    return HttpClient.doDelete(api.deleteMeetingFile + data)
}

export const downloadByIdMeetingFilesApi = (data) => {
    return HttpClient.doGet(api.downloadFile + data)
}


export const getCityByIdApi = (data) => {
    return HttpClient.doGet(api.getCountry + "/" + data)
}

export const getCitiesApi = (data) => {
    return HttpClient.doGet(api.getCountry)
}


export const get_voting_details = (data) => {
    return HttpClient.doGet(api.voting_details + (data && data ? "?votingId=" + data : ''))
}

