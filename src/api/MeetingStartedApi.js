import HttpClient from "../utils/HttpClient";
import {api} from "./api";

export const getLoggingApi = (data) => {
    return HttpClient.doGet(api.getLoggingByMeeting + (data && data.meetingId ? "?meetingId=" + data.meetingId + "&page=" + (data.page - 1) + "&size=" + data.size : ''))
}

export const addLoggingApi = (data) => {
    return HttpClient.doPost(api.addLogging, data)
}

export const deleteLoggingByIdApi=(data)=>{
    return HttpClient.doDelete(api.addLogging + "/" + data)
}

export const addQuestion = (data) => {
    return HttpClient.doPost(api.addQuestion, data)
}

export const editStatusQuestion = (data) => {
    return HttpClient.doPatch(api.addQuestion + "/" + data)
}

export const editQuestion = (data) => {
    return HttpClient.doPut(api.addQuestion, data)
}

export const getQuestionByMeetingIdApi = (data) => {
    return HttpClient.doGet(api.getQuestionByMeetingId + (data && data.meetingId ? "?meetingId=" + data.meetingId + "&page=" + (data.page - 1) + "&size=" + data.size : ''))
}

export const getQuestionByMemberIdApi = (data) => {
    return HttpClient.doGet(api.getQuestionByMemberId + "/" + data)
}

export const addBallotApi = (data) => {
    return HttpClient.doPost(api.ballotMethod, data)
}

export const getBallotByAgendaApi = (data) => {
    return HttpClient.doGet(api.getBallotByAgenda + (data && data.agendaId ? "?agendaId=" + data.agendaId + "&page=" + (data.page - 1) + "&size=" + data.size : ''))
}

export const getBallotByMeetingApi = (data) => {
    return HttpClient.doGet(api.getBallotByMeeting + (data && data.meetingId ? "?meetingId=" + data.meetingId + "&page=" + (data.page - 1) + "&size=" + data.size : ''))
}

export const getBallotByMemberApi = (data) => {
    return HttpClient.doGet(api.getBallotByMember + (data && data.memberId ? "?memberId=" + data.memberId + "&page=" + (data.page - 1) + "&size=" + data.size : ''))
}

export const getBallotByOptionApi = (data) => {
    return HttpClient.doGet(api.getBallotByOption + (data && data.option ? "?option=" + data.option + "&page=" + (data.page - 1) + "&size=" + data.size : ''))
}

export const getBallotByVotingApi = (data) => {
    return HttpClient.doGet(api.getBallotByVoting + (data && data.votingId ? "?votingId=" + data.votingId + "&page=" + (data.page - 1) + "&size=" + data.size : ''))
}

export const getBallotVotingApi = (data) => {
    console.log("API ga keldi")
    return HttpClient.doGet(api.getBallotVoting + (data && data.agendaId ? "?agendaId=" + data.agendaId + "&memberId=" + data.memberId : ''))
}
