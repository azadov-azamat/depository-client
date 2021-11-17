export const api = {
    login: '/authenticate',
    userMe: '/account',
    userMethods: '/moder/user',
    userFilter: '/moder/user/filter',

    meetingMethod: '/meeting',
    member: '/member',
    memberManager: '/member/managers',
    memberByMeetingId: '/member/by-meeting',
    addReestrByMeetingUrl: '/reestr/parse',
    getReestrByMeetingUrl: '/reestr/download',

    agenda: '/agenda',
    agendaByMeetingId: '/agenda/by-meeting',
    votingAgenda: '/voting',

    getMeetingFile: '/file/meeting/',
    addMeetingFile: '/file/upload',
    deleteMeetingFile: '/file/',
    downloadFile: '/file/one/',

    companyMethod: '/company',
    companyFilter: '/company/filter',
    addLogoCompany: '/file/upload/logo',
    getLogoByCompanyId: '/file/logo/',
    companyUserById: '/company/user',

    getLoggingByMeeting: '/logging/by-meeting',
    addLogging: '/logging',
    getCountry: '/city',

    addQuestion: '/question',
    getQuestionByMeetingId: '/question/by-meeting',
    getQuestionByMemberId: '/question/by-member',

    ballotMethod: '/ballot',
    getBallotByMeeting: '/ballot/by-meeting',
    getBallotByAgenda: '/ballot/by-agenda',
    getBallotByMember: '/ballot/by-member',
    getBallotByOption: '/ballot/by-option',
    getBallotByVoting: '/ballot/by-voting',
    getBallotVoting: "/ballot/by-meet-and-mem",

};
