import React, {useEffect, useRef, useState} from 'react'
import {NavbarControlMeeting} from './NavbarControlMeeting'
import Agenda from "./component/Agenda"
import {Route, Switch, useHistory, useLocation} from 'react-router-dom';
import Router from "./Router";
import CommentsAllPage from "./component/CommentsAllPage";
import * as meetingActions from "../../redux/actions/MeetingAction";
import * as meetingStartedAction from "../../redux/actions/MeetingStartedAction";
import {useDispatch, useSelector} from "react-redux";
import {
    CHAIRMAN,
    DEPOSITORY_CURRENT_COMPANY,
    DEPOSITORY_CURRENT_MEETING,
    DEPOSITORY_CURRENT_MEMBER,
    DEPOSITORY_MEMBER_TYPE_USER,
    DEPOSITORY_USER,
    DEPOSITORY_ZOOM_MEETING_LINK,
    DEPOSITORY_ZOOM_MEETING_PASSWORD,
    PENDING,
    SECRETARY, TOKEN
} from "../../utils/contants";
import Question from "./component/Question";
import Comment from "./component/Comment";
import ControlMeeting from "./component/ControlMeeting";
import * as userAction from "../../redux/actions/UsersAction";
import TableUsers from "./component/TableUsers";
import usePagination from "../Dashboard/Pagination";
import * as adminCompanyAction from "../../redux/actions/CompanyAction";
import importScript from "./component/Zoom Meeting/importScript";
import {Col, Container, Row} from "reactstrap";
import {Jutsu} from 'react-jutsu';
import SockJsClient from "react-stomp";
import {DeleteLoggingByIdAction} from "../../redux/actions/MeetingStartedAction";

export const ControllerMeeting = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const location = useLocation();

    const {pathname} = location
    const reducers = useSelector(state => state)
    const {agendaState, currentMeeting, userMemberType, memberManagerState, meetingFile} = reducers.meeting
    const {loadingLogging, questionList, loggingList, questionListMemberId, password_zoom, password_id} = reducers.meetingStarted
    const {currentUser} = reducers.users
    const {currentCompany} = reducers.company
    const {payload} = reducers.auth.totalCount

    let clientRef = useRef(null);

    const [room, setRoom] = useState()
    const [end, setEnd] = useState(false);

    const username = currentUser?.fullName;
    const currentCompanyId = parseInt(localStorage.getItem(DEPOSITORY_CURRENT_COMPANY));
    const currentMeetingId = parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING));
    const currentMemberId = parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEMBER));

    const [page, setPage] = useState(1);
    const size = 5;
    const count = Math.ceil(payload && payload[0] / size);
    const _DATA = usePagination(memberManagerState && memberManagerState, size);

    const startIndex = (page - 1) * size;
    const lastIndex = startIndex + (payload && payload[1]);

    const [zoomEnum, setZoomEnum] = useState(PENDING);

    const [call, setCall] = useState(false)
    const [password, setPassword] = useState('')
    const [close, setClose] = useState(false)
    const link = 'https://meet.jit.si/' + room;
    const [badgeCount, setBadgeCount] = useState(0);

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

    let url = 'https://depositary.herokuapp.com:443/websocket/logger/';
    const authToken = localStorage.getItem(TOKEN)

    if (authToken) {
        const s = authToken.substr(7, authToken.length - 1);
        url += '?access_token=' + s;
    }

    useEffect(() => {
        dispatch(userAction.getUserById({ID: parseInt(localStorage.getItem(DEPOSITORY_USER))}))
        dispatch(adminCompanyAction.getCompanyByIdAction({companyId: currentCompanyId, history}))
        dispatch(meetingActions.getMeetingByIdAction({meetingId: currentMeetingId}))
        dispatch(meetingActions.getAgendaByMeetingId({meetingId: currentMeetingId}))
        dispatch(meetingActions.getMemberByMeetingId({meetingId: currentMeetingId}))
        dispatch(meetingStartedAction.getQuestionByMeetingAction({meetingId: currentMeetingId}))

        dispatch({type: "memberTypeCurrentUser", payload: localStorage.getItem(DEPOSITORY_MEMBER_TYPE_USER)});

        setRoom(currentCompanyId + "/" + currentMeetingId)
    }, [])

    useEffect(() => {
        memberManagerState && memberManagerState.forEach(element => {
            if (element.userId === parseInt(localStorage.getItem(DEPOSITORY_USER))) {
                localStorage.setItem(DEPOSITORY_CURRENT_MEMBER, element.id)
            }
        })
    }, [memberManagerState])

    useEffect(() => {
        questionList && questionList.forEach(element => {
            if (!element.questionAnswer) {
                setBadgeCount(prevState => prevState + 1)
            }
        })
    }, [])

    importScript("https://meet.jit.si/external_api.js");

    const handleClick = event => {
        event.preventDefault()
        if (room && username) setCall(true)
        handleStartMeeting(room, username, password, link);

        const data = {
            userId: parseInt(localStorage.getItem(DEPOSITORY_USER)),
            meetingId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING)),
            loggingText: "PASSWORD_ZOOM: " + password
        }
        clientRef.sendMessage('/topic/user-all', JSON.stringify(data));
    }

    const onCloseButton = () => {
        handleClose()
        setPassword('')
        setCall(false);
        setClose(true);
        localStorage.removeItem(DEPOSITORY_ZOOM_MEETING_PASSWORD)
        setZoomEnum(PENDING)
        dispatch(meetingStartedAction.DeleteLoggingByIdAction({ID: parseInt(password_id)}))
        history.push("/issuerLegal/meetingSetting")
    }

    console.log(password_id);
    console.log(password_zoom)

    return (
        <div className="container meeting">
            <div>
                <Router zoomEnum={setZoomEnum} currentMeeting={currentMeeting && currentMeeting}
                        currentCompany={currentCompany && currentCompany} userMemberType={userMemberType}/>
                <div className="shadow p-3 my-3">
                    <div className="row">
                        <div className="col-12 col-md-8">
                            <NavbarControlMeeting countBadge={badgeCount} roleMember={userMemberType}
                                                  zoomEnum={zoomEnum} password_zoom={password_zoom}
                                                  statusMeeting={currentMeeting && currentMeeting.status}/>
                            <Switch>
                                <Route path="/issuerLegal/meetingSetting" exact>
                                    <Agenda agendaSubject={agendaState} roleMember={userMemberType}/>
                                </Route>
                                <Route path="/issuerLegal/meetingSetting/question">
                                    <Question list={questionList && questionList}/>
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
                        <CommentsAllPage roleMember={userMemberType} list={questionList && questionList}
                                         currentUserId={currentUser && currentUser.id}
                                         meetingFile={meetingFile && meetingFile}
                                         loggingList={loggingList && loggingList}
                                         currentMeetingId={currentMeetingId}
                                         questionListMemberId={questionListMemberId && questionListMemberId}
                        />
                    </div>
                </div>
            </div>
            <SockJsClient
                url={url}
                topics={['/topic/user']}
                onConnect={() => console.log("Connected")}
                onDisconnect={() => console.log("Disconnected")}
                onMessage={(msg) => {
                    console.log(msg)
                    dispatch({
                        type: 'REQUEST_SUCCESS_LOGGING_LIST',
                        payload: msg
                    })
                    msg.forEach(element=>{
                        if (element.loggingText.startsWith("PASSWORD_ZOOM:")){
                            dispatch({
                                type: 'PASSWORD_ZOOM_MEETING',
                                payload: {
                                    password_zoom: element.loggingText.substr(15, (element.loggingText.length - 1)),
                                    password_id: element.id
                                }
                            })
                            localStorage.setItem(DEPOSITORY_ZOOM_MEETING_PASSWORD, element.loggingText.substr(15, (element.loggingText.length - 1)))
                            console.log(element.loggingText.substr(15, (element.loggingText.length - 1)))
                        }
                    })
                }}
                ref={(client) => {
                    clientRef = client
                }}
            />
        </div>
    )
}

export default ControllerMeeting

