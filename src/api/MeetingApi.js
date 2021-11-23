import HttpClient from "../utils/HttpClient";
import {api} from "./api";
import * as url from "url";

export const getMeetingBySorted = (data) => {
    return HttpClient.doGet(api.companyFilter +
        (data && data.value && data.field
            ?
            "?value=" + data.value + "&field=" + data.field
            : ""))
}

export const postMeeting = (data) => {
    return HttpClient.doPost(api.meetingMethod, data)
}

export const editMeetingApi = (data) => {
    return HttpClient.doPut(api.meetingMethod, data)
}

export const getMeetingByIdApi = (data) => {
    return HttpClient.doGet(api.meetingMethod + "/" + data)
}

export const getMeetings = (data) => {
    return HttpClient.doGet(api.meetingMethod + (data && data.page && data.size ? "?page=" + (data.page - 1) + "&size=" + data.size : ""))
}

export const deleteMeeting = (data) => {
    return HttpClient.doDelete(api.meetingMethod + "/" + data)
}


export const getMemberByIdApi = (data) => {
    return HttpClient.doGet(api.member + "/" + (data && data))
}
export const getMemberByMeetingIdApi = (data) => {
    return HttpClient.doGet(api.memberByMeetingId + (data && data.meetingId ? "?meetingId=" + data.meetingId + "&page=" + (data.page - 1) + "&size=" + data.size : ''))
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


export const deleteAgenda = (data) => {
    return HttpClient.doDelete(api.agenda + "/" + data)
}
export const getAgendaByMeetingIdApi = (data) => {
    return HttpClient.doGet(api.agendaByMeetingId + (data && data.meetingId ? "?meetingId=" + data.meetingId : ''))
}
export const addAgendaApi = (data) => {
    return HttpClient.doPost(api.agenda, data)
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
