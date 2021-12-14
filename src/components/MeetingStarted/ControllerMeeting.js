import React, {useEffect, useState} from 'react'
import {NavbarControlMeeting} from './NavbarControlMeeting'
import Agenda from "./component/Agenda"
import {Route, Switch, useHistory, useLocation, useParams} from 'react-router-dom';
import Router from "./Router";
import CommentsAllPage from "./component/CommentsAllPage";
import * as meetingActions from "../../redux/actions/MeetingAction";
import * as meetingStartedAction from "../../redux/actions/MeetingStartedAction";
import {useDispatch, useSelector} from "react-redux";
import {ACTIVE, CANCELED, CHAIRMAN, DEPOSITORY_USER, DISABLED, FINISH, PENDING, SECRETARY} from "../../utils/contants";
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
import {useTranslation} from "react-i18next";

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const ControllerMeeting = () => {

    const {id} = useParams();
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const location = useLocation();


    let query = useQuery();
    const meetingId = parseInt(id);
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
        passwordZoomMeeting,
        connected
    } = reducers.meetingStarted
    const {currentUser} = reducers.auth
    const {currentCompany} = reducers.company

    const [room, setRoom] = useState()

    const username = currentUser?.fullName;

    const [zoomEnum, setZoomEnum] = useState(PENDING);

    const [call, setCall] = useState(false)
    // const [password, setPassword] = useState()
    const [close, setClose] = useState(false)
    const link = 'https://meet.jit.si/' + room;
    const [badgeCount, setBadgeCount] = useState(0);

    const password = "18cb2890-bb7a-4812-b07b-db0ef273bab1";

    const socketClient = useSelector((state) => state.socket.client);

    const handleStartMeeting = (roomName, userName, password, link) => {
        setCall(true)
        // console.log(roomName)
        // console.log(userName)
        // console.log(password)
        // console.log(link)
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
        if (connected) {
            const data = {
                memberId: parseInt(memberId),
                online: true
            }
            socketClient.sendMessage('/topic/setStatus', JSON.stringify(data));
        }
    }, [connected])

    useEffect(() => {
        questionList?.forEach(element => {
            if (!element.questionAnswer) {
                setBadgeCount(prevState => prevState + 1)
            }
        })
    }, [questionList])

    useEffect(() => {
        dispatch(meetingActions.getMemberById({ID: memberId}))
    }, [memberId])

    useEffect(() => {

        dispatch(subscribe('/topic/user'));
        dispatch(subscribe('/topic/get-zoom/' + meetingId));
        dispatch(subscribe('/topic/getMember/' + meetingId));

        return () => {
            dispatch(unsubscribe('/topic/user'));
            dispatch(unsubscribe('/topic/get-zoom/' + meetingId));
            dispatch(unsubscribe('/topic/getMember/' + meetingId));
        }

    }, [dispatch])

    const [zoomStatusMe, setZoomStatusMe] = useState(true);

    function clicked() {
        if (zoomStatusMe) {
            const dataZoom = {
                meetingId: id,
                memberId
            }

            socketClient.sendMessage('/topic/start-zoom', JSON.stringify(dataZoom));
        } else {
            console.log("no clicked")
        }
    }

    console.log(startCallMeeting)

    // useEffect(() => {
    //     if (!startCallMeeting) {
    //         setCall(false)
    //     }
    // }, [startCallMeeting])

    importScript("https://meet.jit.si/external_api.js");

    const StartZoomMeeting = event => {

        if (currentMeeting.status === PENDING) {
            return toast.error(t("toast.statusMeeting.pending"))
        } else if (currentMeeting.status === CANCELED) {
            return toast.error(t("toast.statusMeeting.canceled"))
        } else if (currentMeeting.status === FINISH) {
            return toast.error(t("toast.statusMeeting.finish"))
        } else if (currentMeeting.status === DISABLED) {
            return toast.error(t("toast.statusMeeting.disabled"))
        }

        if (!startCallMeeting) {
            console.log("========= yangi ============")
            // let chars = "0123456789ABCDEFGHIJKLMNOPQRdepositroySTUVWXYZabcdefghijklmnopqrstuvwxyz";
            // let string_length = 8;
            // let randomstring = '';
            // for (let i = 0; i < string_length; i++) {
            //     let rnum = Math.floor(Math.random() * chars.length);
            //     randomstring += chars.substring(rnum, rnum + 1);
            // }

            const dataZoom = {
                password: password,
                zoom: true,
                meetingId,
                memberId
            }

            socketClient.sendMessage('/topic/start-zoom', JSON.stringify(dataZoom));

            const data = {
                userId: currentUser.id,
                meetingId,
                loggingText: t("toast.statusMeeting.zoomStarted")
            }

            socketClient.sendMessage('/topic/user-all', JSON.stringify(data));
            if (room && username)
                handleStartMeeting(room, username, password, link);
        } else {
            console.log("========= eski ============")
            setZoomStatusMe(false)
            const dataZoom = {
                zoom: false,
                meetingId,
                memberId
            }

            socketClient.sendMessage('/topic/start-zoom', JSON.stringify(dataZoom));
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

            const data = {
                userId: currentUser.id,
                meetingId: parseInt(id),
                loggingText: "Видео конференция завершено"
            }
            socketClient.sendMessage('/topic/user-all', JSON.stringify(data));
            setZoomStatusMe(false)
            setCall(false)
            // setCall(startCallMeeting)
        } else {
            setCall(false)
            setZoomStatusMe(false)
        }

        // history.push("/issuerLegal/meeting/" + id + "/agenda?companyId=" + companyId + "&memberId=" + memberId)
    }

    function startMeeting({status, quorumCount}) {

        const dataForUpdateMeetingStatus = {
            meetingId,
            statusEnum: status,
        }

        confirmAlert({
            title: status === ACTIVE ? 'Активировать' : 'Не активировать',
            message: 'Вы действительно хотите начать заседанию?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => {
                        if (status === ACTIVE) {
                            if (quorumCount >= 0) {
                                dispatch(meetingActions.updateMeetingStatusAction({
                                    dataForUpdateMeetingStatus,
                                    socketClient,
                                    status, userId: currentUser.id, meetingId, lang: t
                                }))
                            } else {
                                toast.error("Quorum 75% dan yuqori bo`lishi kerak!")
                            }
                        } else {
                            dispatch(meetingActions.updateMeetingStatusAction({
                                dataForUpdateMeetingStatus,
                                socketClient,
                                status, userId: currentUser.id, meetingId, lang: t
                            }))
                        }
                    }
                },
                {
                    label: 'Нет',
                }
            ]
        });
    }

    return (
        <div className="container meeting">
            <div>
                <Router zoomEnum={setZoomEnum} currentMeeting={currentMeeting && currentMeeting}
                        currentCompany={currentCompany && currentCompany} userMemberType={userMemberType}/>
                <div className="shadow p-3 my-3">
                    <div className="row">
                        <div className="col-12 col-md-8">
                            <NavbarControlMeeting clicked={clicked} countBadge={badgeCount} roleMember={userMemberType}
                                                  memberId={memberId} companyId={companyId}/>
                            <Switch>
                                <Route path={"/issuerLegal/meeting/" + id + "/agenda"}>
                                    <Agenda agendaSubject={agendaState} roleMember={userMemberType}
                                            meetingId={meetingId} memberId={parseInt(memberId)}/>
                                </Route>
                                <Route path={"/issuerLegal/meeting/" + id + "/question"}>
                                    <Question list={questionList} userId={currentUser.id}/>
                                </Route>
                                <Route path={"/issuerLegal/meeting/" + id + "/addComment"}>
                                    <Comment loading={loadingLogging} socketClient={socketClient}
                                             meetingId={meetingId} userId={currentUser.id}/>
                                </Route>
                                <Route path={"/issuerLegal/meeting/" + id + "/controlMeeting"}>
                                    <ControlMeeting meetingStatus={currentMeeting && currentMeeting.status}
                                                    startMeeting={startMeeting}
                                                    meetingId={meetingId}/>
                                </Route>
                                <Route path={"/issuerLegal/meeting/" + id + "/all_users_list"}>
                                    <TableUsers meetingId={meetingId} lang={t}/>
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
                                                    <div aria-hidden={!call}>
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
                                                    {
                                                        userMemberType === CHAIRMAN || userMemberType === SECRETARY
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
                </div>
            </div>
            <Socket meetingId={meetingId} memberId={memberId}/>
        </div>
    )
}

export default ControllerMeeting

