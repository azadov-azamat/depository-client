
export const api = {
    login: '/authenticate',
    loginEds: '/eds/signrequest',
    userMe: '/account',
    userMethods: '/moder/user',
    userFilter: '/moder/user/filter',
    userSpecFilter: '/moder/user/spec-filter',
    userSearch: '/moder/user/search',

    meetingMethod: '/meeting',
    editMeetingStatus: '/meeting/meeting-status',
    meetingByCompany: '/meeting/by-company',
    meetingByUserAndCompany: '/meeting/by-user',
    meetingSpecFilter: "/meeting/spec-filter",
    member: '/member',
    addedChairmanFromReestrPage: '/member/elect-chairmen/',
    memberManager: '/member/managers',
    memberByMeetingId: '/member/by-meeting',
    memberTypeEnum: '/member/member-types',
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
    companySpecFilter: '/company/spec-filter',
    companySearchName: '/company/search',
    addLogoCompany: '/file/upload/logo',
    getLogoByCompanyId: '/file/logo',
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
    getBallotVoting: "/ballot/ballots-by-agen-mem",

    votingMethod: "/voting"
};
