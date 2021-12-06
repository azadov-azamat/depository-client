import React, {useEffect, useState} from 'react'
import {NavbarControlMeeting} from './NavbarControlMeeting'
import Agenda from "./component/Agenda"
import {Route, Switch, useHistory, useLocation, useParams} from 'react-router-dom';
import Router from "./Router";
import CommentsAllPage from "./component/CommentsAllPage";
import * as meetingActions from "../../redux/actions/MeetingAction";
import * as meetingStartedAction from "../../redux/actions/MeetingStartedAction";
import {useDispatch, useSelector} from "react-redux";
import {ACTIVE, CANCELED, CHAIRMAN, DEPOSITORY_USER, FINISH, PENDING, SECRETARY} from "../../utils/contants";
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
import {confirmAlert} from "react-confirm-alert";
import {toast} from "react-toastify";

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
    const {
        agendaState,
        currentMeeting,
        onlineMemberManager,
        userMemberType,
        memberManagerState,
        meetingFile
    } = reducers.meeting
    const {
        loadingLogging,
        questionList,
        loggingList,
        questionListMemberId,
        startCallMeeting,
        endCallMeeting,
        passwordZoomMeeting
    } = reducers.meetingStarted
    const {currentUser} = reducers.auth
    const {currentCompany} = reducers.company

    const [room, setRoom] = useState()

    const username = currentUser?.fullName;
    const meetingId = parseInt(id)

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

    useEffect(() => {
        dispatch(adminCompanyAction.getCompanyByIdAction({companyId: parseInt(companyId), history}))
        setRoom(companyId + "/" + meetingId)
    }, [companyId])

    useEffect(() => {
        dispatch(meetingActions.getMemberTypeEnumAction({meetingId: meetingId, userId: currentUser?.id}))
    }, [meetingId, currentUser])

    useEffect(() => {
        dispatch(meetingActions.getMeetingByIdAction({meetingId: meetingId}))
        dispatch(meetingActions.getAgendaByMeetingId({meetingId: meetingId}))
        dispatch(meetingStartedAction.getQuestionByMeetingAction({meetingId: meetingId}))
    }, [meetingId])

    useEffect(() => {
        questionList && questionList.forEach(element => {
            if (!element.questionAnswer) {
                setBadgeCount(prevState => prevState + 1)
            }
        })
    }, [questionList])

    useEffect(() => {
        dispatch(meetingActions.getMemberById({ID: memberId}))   // GET MEMBER TYPE
    }, [memberId])

    useEffect(() => {
        dispatch(subscribe('/topic/user'));
        dispatch(subscribe('/topic/get-zoom'));
        dispatch(subscribe('/topic/getMember/' + meetingId));
        return () => {
            dispatch(unsubscribe('/topic/user'));
            dispatch(unsubscribe('/topic/get-zoom'));
            dispatch(unsubscribe('/topic/getMember/' + meetingId));
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
            const data = {
                userId: parseInt(localStorage.getItem(DEPOSITORY_USER)),
                meetingId: parseInt(id),
                loggingText: "Видео конференция запущено, прошу присоединиться."
            }

            const dataZoom = {
                password: randomstring,
                zoom: true,
                meetingId: parseInt(id),
                memberId: parseInt(memberId)
            }

            // socketClient.sendMessage('/topic/user-all', JSON.stringify(data));
            socketClient.sendMessage('/topic/start-zoom', JSON.stringify(dataZoom));

            if (room && username)
                handleStartMeeting(room, username, password, link);

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
                zoom: false,
                meetingId: parseInt(id),
                memberId: parseInt(memberId)
            }
            socketClient.sendMessage('/topic/start-zoom', JSON.stringify(dataZoom));

            // const data = {
            //     userId: parseInt(localStorage.getItem(DEPOSITORY_USER)),
            //     meetingId: parseInt(id),
            //     loggingText: "Видео конференция завершено"
            // }
            // socketClient.sendMessage('/topic/user-all', JSON.stringify(data));
            // false
            setCall(!startCallMeeting)
        } else {
            setCall(false)
        }

        history.push("/issuerLegal/meeting/" + id + "/agenda?companyId=" + companyId + "&memberId=" + memberId)
    }

    function startMeeting({status, quorumCount}) {
        if (status === CANCELED || status === PENDING) {
            const dataForComment = {
                userId: parseInt(localStorage.getItem(DEPOSITORY_USER)),
                meetingId: meetingId,
                loggingText:
                    status === ACTIVE ? 'Заседание начато' : ''
                    || status === FINISH ? 'Заседание начато' : ''
                    || status === CANCELED ? 'OTMEN KAROCHE' : ''
                    || status === PENDING ? "Meeting qoldirildi" : ""
            }
            console.log(dataForComment)

            const dataForUpdateMeetingStatus = {
                meetingId: meetingId,
                statusEnum: status,
            }
            console.log(dataForUpdateMeetingStatus)

            confirmAlert({
                title: 'Не активировать',
                message: 'Вы действительно хотите начать заседанию?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => {
                            socketClient.sendMessage('/topic/user-all', JSON.stringify(dataForComment));
                            dispatch(meetingActions.updateMeetingStatusAction(dataForUpdateMeetingStatus))
                        }
                    },
                    {
                        label: 'Нет',
                    }
                ]
            });
        } else if (quorumCount >= 0) {
            const dataForComment = {
                userId: parseInt(localStorage.getItem(DEPOSITORY_USER)),
                meetingId: meetingId,
                loggingText:
                    status === ACTIVE ? 'Заседание начато' : ''
                    || status === FINISH ? 'Заседание начато' : ''
                    || status === CANCELED ? 'OTMEN KAROCHE' : ''
                    || status === PENDING ? "Meeting qoldirildi" : ""
            }
            const dataForUpdateMeetingStatus = {
                meetingId: meetingId,
                statusEnum: status,
            }

            console.log(dataForUpdateMeetingStatus)

            confirmAlert({
                title: 'Активировать',
                message: 'Вы действительно хотите начать заседанию?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => {
                            socketClient.sendMessage('/topic/user-all', JSON.stringify(dataForComment));
                            dispatch(meetingActions.updateMeetingStatusAction(dataForUpdateMeetingStatus))
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
function getMembers() {
    console.log("keldi")
    const data = {
        memberId: memberId,
        online: true
    }

    socketClient.sendMessage('/topic/setStatus', JSON.stringify(data));
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
                                                    startMeeting={startMeeting}
                                                   meetingId={parseInt(id)}/>
                                </Route>
                                <Route path={"/issuerLegal/meeting/" + id + "/all_users_list"}>
                                    <TableUsers members={onlineMemberManager && onlineMemberManager}/>
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
                                                                    startCallMeeting ?
                                                                        "Join zoom-meeting" : "Start video-meeting"
                                                                }
                                                            </button>
                                                        </div>
                                                        :
                                                        <div>
                                                            {
                                                                !startCallMeeting ?
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
                    <button onClick={getMembers}>click me</button>
                </div>
            </div>
            <Socket meetingId={meetingId} memberId={memberId}/>
        </div>
    )
}

export default ControllerMeeting

