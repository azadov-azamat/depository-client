import React, {useEffect, useRef, useState} from 'react'
import {NavbarControlMeeting} from './NavbarControlMeeting'
import DayPlan from "./component/DayPlan"
import {Route, Switch, useHistory, useLocation} from 'react-router-dom';
import Router from "./Router";
import CommentsAllPage from "./component/CommentsAllPage";
import * as meetingActions from "../../redux/actions/MeetingAction";
import * as meetingStartedActions from "../../redux/actions/MeetingStartedAction";
import * as meetingStartedAction from "../../redux/actions/MeetingStartedAction";
import {useDispatch, useSelector} from "react-redux";
import {
    ACTIVE,
    CANCELED,
    CHAIRMAN,
    DEPOSITORY_CURRENT_COMPANY,
    DEPOSITORY_CURRENT_MEETING,
    DEPOSITORY_CURRENT_MEMBER,
    DEPOSITORY_MEMBER_TYPE_USER,
    DEPOSITORY_USER,
    DEPOSITORY_ZOOM_MEETING_LINK,
    DEPOSITORY_ZOOM_MEETING_PASSWORD,
    FINISH,
    PENDING,
    SECRETARY
} from "../../utils/contants";
import Question from "./component/Question";
import Comment from "./component/Comment";
import ControlMeeting from "./component/ControlMeeting";
import {confirmAlert} from "react-confirm-alert";
import {toast} from "react-toastify";
import * as userAction from "../../redux/actions/UsersAction";
import TableUsers from "./component/TableUsers";
import usePagination from "../Dashboard/Pagination";
import * as adminCompanyAction from "../../redux/actions/CompanyAction";
import importScript from "./component/Zoom Meeting/importScript";
import {Col, Container, Row} from "reactstrap";
import {Jutsu} from 'react-jutsu';
import Socket from "./socket.io/Socket";

export const ControllerMeeting = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const location = useLocation();
    const {pathname} = location
    const reducers = useSelector(state => state)
    const {agendaState, currentMeeting, userMemberType, memberManagerState} = reducers.meeting
    const {loadingLogging} = reducers.meetingStarted
    const {currentUser} = reducers.users
    const {currentCompany} = reducers.company
    const {payload} = reducers.auth.totalCount

    const [room, setRoom] = useState()
    const [end, setEnd] = useState(false);

    const username = currentUser?.fullName;
    const currentCompanyId = parseInt(localStorage.getItem(DEPOSITORY_CURRENT_COMPANY));
    const currentMeetingId = parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING));

    const [page, setPage] = useState(1);
    const size = 5;
    const count = Math.ceil(payload && payload[0] / size);
    const _DATA = usePagination(memberManagerState && memberManagerState, size);

    const startIndex = (page - 1) * size;
    const lastIndex = startIndex + (payload && payload[1]);

    const [zoomEnum, setZoomEnum] = useState(PENDING);
    console.log(memberManagerState)

    const handleStartMeeting = (roomName, userName, password, link) => {
        setEnd(false)
        console.log(roomName)
        console.log(userName)
        console.log(password)
        console.log(link)
    }

    const handleClose = () => {
        setEnd(true)
    }

    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    console.log(currentCompany)

    useEffect(() => {
        dispatch(userAction.getUserById({ID: parseInt(localStorage.getItem(DEPOSITORY_USER))}))
        dispatch(adminCompanyAction.getCompanyByIdAction({companyId: currentCompanyId, history}))
        dispatch(meetingActions.getMeetingByIdAction({meetingId: currentMeetingId}))
        dispatch(meetingActions.getAgendaByMeetingId({meetingId: currentMeetingId}))
        dispatch(meetingActions.getMemberByMeetingId({meetingId: currentMeetingId}))
        dispatch(meetingStartedActions.getBallotVoting({
            data: {
                memberId: localStorage.getItem(DEPOSITORY_CURRENT_MEMBER),
                meetingId: currentMeetingId
            }
        }))
        dispatch({type: "memberTypeCurrentUser", payload: localStorage.getItem(DEPOSITORY_MEMBER_TYPE_USER)});

        setRoom(currentCompanyId + "/" + currentMeetingId)
    }, [])

    function startMeeting({status, quorumCount}) {
        if (status === CANCELED || status === PENDING) {
            const dataForComment = {
                userId: parseInt(localStorage.getItem(DEPOSITORY_USER)),
                meetingId: currentMeetingId,
                loggingText:
                    status === ACTIVE ? 'Заседание начато' : ''
                    || status === FINISH ? 'Заседание начато' : ''
                    || status === CANCELED ? 'OTMEN KAROCHE' : ''
                    || status === PENDING ? "Meeting qoldirildi" : ""
            }
            const dataForUpdateMeetingStatus = {
                id: currentMeetingId,
                companyId: currentMeeting?.companyId,
                cityId: currentMeeting?.cityId,
                address: currentMeeting?.address,
                description: currentMeeting?.description,
                startDate: currentMeeting?.startDate,
                startRegistration: currentMeeting?.startRegistration,
                endRegistration: currentMeeting?.endRegistration,
                status: status,
                typeEnum: currentMeeting?.typeEnum,
            }

            confirmAlert({
                title: 'Не активировать',
                message: 'Вы действительно хотите начать заседанию?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => {
                            dispatch(meetingStartedAction.addLoggingAction({data: dataForComment}))
                            dispatch(meetingActions.updateMeetingAction({data: dataForUpdateMeetingStatus}))
                        }
                    },
                    {
                        label: 'Нет',
                    }
                ]
            });
        } else if (quorumCount >= 75) {
            const dataForComment = {
                userId: parseInt(localStorage.getItem(DEPOSITORY_USER)),
                meetingId: currentMeetingId,
                loggingText:
                    status === ACTIVE ? 'Заседание начато' : ''
                    || status === FINISH ? 'Заседание начато' : ''
                    || status === CANCELED ? 'OTMEN KAROCHE' : ''
                    || status === PENDING ? "Meeting qoldirildi" : ""
            }
            const dataForUpdateMeetingStatus = {
                id: currentMeeting.id,
                companyId: currentMeeting?.companyId,
                cityId: currentMeeting?.cityId,
                address: currentMeeting?.address,
                description: currentMeeting?.description,
                startDate: currentMeeting?.startDate,
                startRegistration: currentMeeting?.startRegistration,
                endRegistration: currentMeeting?.endRegistration,
                status: status,
                typeEnum: currentMeeting?.typeEnum,
            }

            confirmAlert({
                title: 'Активировать',
                message: 'Вы действительно хотите начать заседанию?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => {
                            dispatch(meetingStartedAction.addLoggingAction({data: dataForComment}))
                            dispatch(meetingActions.updateMeetingAction({data: dataForUpdateMeetingStatus}))
                        }
                    },
                    {
                        label: 'Нет',
                    }
                ]
            });
        } else {
            toast.error("Quorum 75% dan yuqori bo`lishi kerak!")
        }
    }

    importScript("https://meet.jit.si/external_api.js");

    const [call, setCall] = useState(false)
    const [password, setPassword] = useState('')
    const [close, setClose] = useState(false)
    const link = 'https://meet.jit.si/' + room;

    const handleClick = event => {
        event.preventDefault()
        if (room && username) setCall(true)
        handleStartMeeting(room, username, password, link);
        localStorage.setItem(DEPOSITORY_ZOOM_MEETING_PASSWORD, password)
        localStorage.setItem(DEPOSITORY_ZOOM_MEETING_LINK, link)
    }

    const onCloseButton = () => {
        handleClose()
        setPassword('')
        setCall(false);
        setClose(true);
        localStorage.removeItem(DEPOSITORY_ZOOM_MEETING_PASSWORD)
        localStorage.removeItem(DEPOSITORY_ZOOM_MEETING_LINK)
        setZoomEnum(PENDING)
        history.push("/issuerLegal/meetingSetting")
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(link).then(() => alert("Copied link: " + link))
    }

    return (
        <div className="container meeting">
            <div>
                <Router zoomEnum={setZoomEnum} currentMeeting={currentMeeting && currentMeeting}
                        currentCompany={currentCompany && currentCompany} userMemberType={userMemberType}/>
                <div className="shadow p-3 my-3">
                    <div className="row">
                        <div className="col-12 col-md-8">
                            <NavbarControlMeeting roleMember={userMemberType} zoomEnum={zoomEnum}
                                                  statusMeeting={currentMeeting && currentMeeting.status}/>
                            <Switch>
                                <Route path="/issuerLegal/meetingSetting" exact>
                                    <DayPlan agendaSubject={agendaState} roleMember={userMemberType}/>
                                </Route>
                                <Route path="/issuerLegal/meetingSetting/question">
                                    <Question/>
                                </Route>
                                <Route path="/issuerLegal/meetingSetting/comment-by-meeting">
                                    <Comment loading={loadingLogging}/>
                                </Route>
                                <Route path="/issuerLegal/meetingSetting/control-meeting">
                                    <ControlMeeting meetingStatus={currentMeeting && currentMeeting.status}
                                                    currentMeeting={currentMeeting}
                                                    memberList={memberManagerState && memberManagerState}/>
                                </Route>
                                <Route path="/issuerLegal/meetingSetting/list_users">
                                    <TableUsers page={page} startIndex={startIndex} handleChange={handleChange}
                                                count={count} lastIndex={lastIndex}
                                                members={memberManagerState && memberManagerState} payload={payload}/>
                                </Route>

                            </Switch>
                            <div className={pathname === "/issuerLegal/meetingSetting/zoom_meeting" ? '' : "d-none"}>
                                {
                                    call ? (
                                        <Container>
                                            <Row>
                                                <Col md={12}
                                                     className="d-flex flex-column justify-content-center text-center align-items-center">
                                                    <div aria-hidden={close}>
                                                        <Jutsu
                                                            roomName={room}
                                                            containerStyles={{width: '739px', height: '377px'}}
                                                            displayName={username}
                                                            password={password}
                                                            onMeetingEnd={() => onCloseButton()}
                                                            loadingComponent={<p>loading ...</p>}
                                                            errorComponent={<p>Oops, something went wrong</p>}
                                                            configOverwrite={{
                                                                prejoinPageEnabled: false,
                                                                startWithAudioMuted: true,
                                                                startWithVideoMuted: true
                                                            }}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Container>
                                    ) : (
                                        <Container>
                                            <Row>
                                                <Col md={12}
                                                     className="d-flex flex-column justify-content-between text-center align-items-center w-100 mt-4"
                                                     style={{height: '53vh'}}
                                                >
                                                    <div className="">
                                                        <h2>Zoom Meeting</h2>
                                                        <form>
                                                            <input
                                                                className="form-control"
                                                                id='password' type='text'
                                                                placeholder='Password (optional)'
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                maxLength={12}
                                                                minLength={4}
                                                            />
                                                            <button className="create py-2 px-3 mt-2"
                                                                    onClick={handleClick}
                                                                    type='submit'>
                                                                {userMemberType === CHAIRMAN || userMemberType === SECRETARY ?
                                                                    "Start video-meeting" : "Join video-meeting"
                                                                }
                                                            </button>
                                                        </form>
                                                    </div>
                                                    <div className="">
                                                        <span>{room}</span><br/>
                                                        <span>password: <code>{password}</code></span>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Container>
                                    )
                                }
                            </div>
                        </div>
                        <CommentsAllPage roleMember={userMemberType}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ControllerMeeting

