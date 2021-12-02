import React, {useEffect, useState} from 'react'
import {NavbarControlMeeting} from './NavbarControlMeeting'
import Agenda from "./component/Agenda"
import {Route, Switch, useHistory, useLocation, useParams} from 'react-router-dom';
import Router from "./Router";
import CommentsAllPage from "./component/CommentsAllPage";
import * as meetingActions from "../../redux/actions/MeetingAction";
import * as meetingStartedAction from "../../redux/actions/MeetingStartedAction";
import {useDispatch, useSelector} from "react-redux";
import {CHAIRMAN, DEPOSITORY_USER, PENDING, SECRETARY} from "../../utils/contants";
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
import Socket from "./Socket";
import {subscribe, unsubscribe} from "../../redux/actions/socketActions";

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const ControllerMeeting = () => {

    const {id} = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const location = useLocation();

    let query = useQuery();
    const companyId = query.get("companyId");
    const memberId = query.get("memberId");

    const {pathname} = location
    const reducers = useSelector(state => state)
    const {agendaState, currentMeeting, userMemberType, memberManagerState, meetingFile} = reducers.meeting
    const {
        loadingLogging,
        questionList,
        loggingList,
        questionListMemberId,
        startCallMeeting,
        endCallMeeting,
        passwordZoomMeeting
    } = reducers.meetingStarted
    const {currentUser} = reducers.users
    const {currentCompany} = reducers.company
    const {payload} = reducers.auth.totalCount

    const [room, setRoom] = useState()

    const username = currentUser?.fullName;

    const [page, setPage] = useState(1);
    const size = 5;
    const count = Math.ceil(payload && payload[0] / size);
    const _DATA = usePagination(memberManagerState && memberManagerState, size);

    const startIndex = (page - 1) * size;
    const lastIndex = startIndex + (payload && payload[1]);

    const [zoomEnum, setZoomEnum] = useState(PENDING);

    const [call, setCall] = useState(false)
    const [password, setPassword] = useState(passwordZoomMeeting)
    const [close, setClose] = useState(false)
    const link = 'https://meet.jit.si/' + room;
    const [badgeCount, setBadgeCount] = useState(0);

    const socketClient = useSelector((state) => state.socket.client);

    const handleStartMeeting = (roomName, userName, password, link) => {
        setCall(true)
        console.log(roomName)
        console.log(userName)
        console.log(password)
        console.log(link)
    }

    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    useEffect(() => {
        dispatch(userAction.getUserById({ID: parseInt(localStorage.getItem(DEPOSITORY_USER))}))
        dispatch(adminCompanyAction.getCompanyByIdAction({companyId: parseInt(companyId), history}))
        dispatch(meetingActions.getMeetingByIdAction({meetingId: parseInt(id)}))
        dispatch(meetingActions.getAgendaByMeetingId({meetingId: parseInt(id)}))
        dispatch(meetingActions.getMemberByMeetingId({meetingId: parseInt(id)}))
        dispatch(meetingStartedAction.getQuestionByMeetingAction({meetingId: parseInt(id)}))

        setRoom(companyId + "/" + id)
    }, [companyId, id])

    useEffect(() => {
        questionList && questionList.forEach(element => {
            if (!element.questionAnswer) {
                setBadgeCount(prevState => prevState + 1)
            }
        })
    }, [questionList])

    useEffect(() => {
        memberManagerState && memberManagerState.forEach(element => {
            if (element.id === parseInt(memberId)) {
                dispatch({
                    type: 'CURRENT_MEMBER_TYPE',
                    payload: element.memberTypeEnum
                })
            }
        })
    }, [memberManagerState])

    useEffect(() => {
        dispatch(subscribe('/topic/user'));
        dispatch(subscribe('/topic/get-zoom'));
        return () => {
            dispatch(unsubscribe('/topic/user'));
            dispatch(unsubscribe('/topic/get-zoom'));
        }
    }, [dispatch])

    useEffect(() => {
        if (endCallMeeting && !startCallMeeting) {
            setCall(false)
        }
    }, [startCallMeeting, endCallMeeting])


    importScript("https://meet.jit.si/external_api.js");

    const StartZoomMeeting = event => {
        event.preventDefault()
        let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let string_length = 8;
        let randomstring = '';
        for (let i = 0; i < string_length; i++) {
            let rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        setPassword(randomstring)

        if (endCallMeeting && !startCallMeeting) {
            if (room && username)
                handleStartMeeting(room, username, password, link);

            const data = {
                userId: parseInt(localStorage.getItem(DEPOSITORY_USER)),
                meetingId: parseInt(id),
                loggingText: "Видео конференция запущено, прошу присоединиться."
            }

            const dataZoom = {
                password: randomstring,
                startCall: true,
                endCall: false
            }

            socketClient.sendMessage('/topic/user-all', JSON.stringify(data));
            socketClient.sendMessage('/topic/start-zoom', JSON.stringify(dataZoom));
        } else if (startCallMeeting && !endCallMeeting) {
            setPassword(passwordZoomMeeting)
            if (room && username)
                handleStartMeeting(room, username, password, link);
        }
    }

    const FinishZoomMeeting = () => {

        if (userMemberType === CHAIRMAN || userMemberType === SECRETARY) {

            const dataZoom = {
                password: null,
                startCall: false,
                endCall: true
            }
            socketClient.sendMessage('/topic/start-zoom', JSON.stringify(dataZoom));

            const data = {
                userId: parseInt(localStorage.getItem(DEPOSITORY_USER)),
                meetingId: parseInt(id),
                loggingText: "Видео конференция завершено"
            }
            socketClient.sendMessage('/topic/user-all', JSON.stringify(data));
            // false
            setCall(endCallMeeting)
        } else {
            setCall(false)
        }

        // history.push("/issuerLegal/meeting/" + id + "/agenda?companyId=" + companyId + "&memberId=" + memberId)
    }

    return (
        <div className="container meeting">
            <div>
                <Router zoomEnum={setZoomEnum} currentMeeting={currentMeeting && currentMeeting}
                        currentCompany={currentCompany && currentCompany} userMemberType={userMemberType}/>
                <div className="shadow p-3 my-3">
                    <div className="row">
                        <div className="col-12 col-md-8">
                            <NavbarControlMeeting countBadge={badgeCount} roleMember={userMemberType}
                                                  memberId={memberId} companyId={companyId}/>
                            <Switch>
                                <Route path={"/issuerLegal/meeting/" + id + "/agenda"}>
                                    <Agenda agendaSubject={agendaState} roleMember={userMemberType}
                                            meetingId={parseInt(id)} memberId={parseInt(memberId)}/>
                                </Route>
                                <Route path={"/issuerLegal/meeting/" + id + "/question"}>
                                    <Question list={questionList}/>
                                </Route>
                                <Route path={"/issuerLegal/meeting/" + id + "/addComment"}>
                                    <Comment loading={loadingLogging} socketClient={socketClient}
                                             meetingId={parseInt(id)}/>
                                </Route>
                                <Route path={"/issuerLegal/meeting/" + id + "/controlMeeting"}>
                                    <ControlMeeting meetingStatus={currentMeeting && currentMeeting.status}
                                                    currentMeeting={currentMeeting}
                                                    memberList={memberManagerState && memberManagerState}
                                                    socketClient={socketClient} meetingId={parseInt(id)}/>
                                </Route>
                                <Route path={"/issuerLegal/meeting/" + id + "/all_users_list"}>
                                    <TableUsers page={page} startIndex={startIndex} handleChange={handleChange}
                                                count={count} lastIndex={lastIndex}
                                                members={memberManagerState && memberManagerState} payload={payload}/>
                                </Route>

                            </Switch>
                            <div
                                className={pathname === "/issuerLegal/meeting/" + id + "/zoom-meeting" ? '' : "d-none"}>
                                {
                                    call ? (
                                        <Container>
                                            <Row>
                                                <Col md={12}
                                                     className="d-flex flex-column justify-content-center text-center align-items-center">
                                                    <div aria-hidden={endCallMeeting}>
                                                        <Jutsu
                                                            roomName={room}
                                                            containerStyles={{width: '748px', height: '377px'}}
                                                            displayName={username}
                                                            password={password}
                                                            onMeetingEnd={FinishZoomMeeting}
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
                                                    {userMemberType === CHAIRMAN || userMemberType === SECRETARY
                                                        ?
                                                        <div className="">
                                                            <h2>Zoom Meeting</h2>
                                                            <button className="create py-2 px-3 mt-2"
                                                                    onClick={StartZoomMeeting}
                                                                    type='submit'>
                                                                {
                                                                    startCallMeeting && !endCallMeeting ?
                                                                        "Join zoom-meeting" : "Start video-meeting"
                                                                }
                                                            </button>
                                                        </div>
                                                        :
                                                        <div>
                                                            {
                                                                endCallMeeting && !startCallMeeting ?
                                                                    <h5>Видео конференция еще не запущено</h5>
                                                                    :
                                                                    <button className="create py-2 px-3 mt-2"
                                                                            onClick={StartZoomMeeting}
                                                                            type='submit'>
                                                                        Join video-meeting
                                                                    </button>
                                                            }
                                                        </div>
                                                    }
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
                                         currentMeetingId={parseInt(id)}
                                         questionListMemberId={questionListMemberId && questionListMemberId}
                                         memberId={parseInt(memberId)}/>
                    </div>
                </div>
            </div>
            <Socket/>
        </div>
    )
}

export default ControllerMeeting

