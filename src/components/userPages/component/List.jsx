import React, {useEffect, useRef, useState} from 'react'
import '../../SomeStyle.css';
import {useHistory, useLocation, useParams} from "react-router-dom";
import {
    ACTIVE,
    CANCELED,
    DEPOSITORY_CURRENT_COMPANY,
    DEPOSITORY_CURRENT_MEETING,
    DISABLED,
    EXTRAORDINARY,
    FINISH,
    ORDINARY,
    PENDING,
    TOKEN
} from "../../../utils/contants";
import ButtonValue from "./ButtonValue";
import SockJsClient from "react-stomp";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import {useDispatch, useSelector} from "react-redux";

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const List = ({pathname, meetings}) => {

    const {id} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const reducers = useSelector(state => state)
    const {memberManagerState} = reducers.meeting
    const [statusMeet, setStatusMeet] = useState({success: FINISH, cancel: CANCELED, active: DISABLED})

    let query = useQuery();
    let clientRef = useRef(null);

    let url = 'https://depositary.herokuapp.com:443/websocket/online/';
    const authToken = localStorage.getItem(TOKEN)

    if (authToken) {
        const s = authToken.substr(7, authToken.length - 1);
        url += '?access_token=' + s;
    }

    console.log(query.get("type"))

    useEffect(() => {
        if (query.get("type") === 'archive') {
            setStatusMeet({...statusMeet, success: PENDING, cancel: ACTIVE, active: "ACTIVATED"})
        } else if (query.get("type") === 'active') {
            setStatusMeet({...statusMeet, success: FINISH, cancel: CANCELED, active: DISABLED})
        }
    }, [query])

    function status(status) {
        if (status === ACTIVE) {
            return 'Активно по распиванию'
        } else if (status === PENDING) {
            return "Ожидает запуска"
        } else if (status === FINISH) {
            return 'Завершено (в архиве)'
        } else if (status === CANCELED) {
            return 'Отменено (в архиве)'
        } else if (status === DISABLED) {
            return 'Неактивно'
        } else if (status === EXTRAORDINARY) {
            return 'Плановое заседание наблюдательного совета'
        } else if (status === ORDINARY) {
            return 'Внеплановое заседание наблюдательного совета '
        }
    }

    function historyPushItem(meetingId) {
        localStorage.setItem(DEPOSITORY_CURRENT_MEETING, meetingId)
        localStorage.setItem(DEPOSITORY_CURRENT_COMPANY, id)
        history.push('/issuerLegal/meetingSetting')
    }

    function btnValue(meetingId) {
        return (
            <>
                <button onClick={() => historyPushItem(meetingId)}
                        className="create py-2 my-2 px-2">
                    Ознакомиться
                </button>
            </>
        )
    }

    function getDate(currentDate) {
        let date = new Date(currentDate);
        return (
            <>
                {(date.getHours().toString().length === 1 ? ("0" + date.getHours()) : date.getHours()) + ":" + (date.getMinutes().toString().length === 1 ? ("0" + date.getMinutes()) : date.getMinutes()) + " " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()}
            </>
        )
    }

    const socketIo = (memberId) => {
        const data = {
            memberId: memberId,
            online: true
        }
        clientRef.sendMessage('/topic/setStatus', JSON.stringify(data));
    }

    function historyPushItem(role, memberId, meetingId) {
        socketIo(memberId)
        localStorage.setItem(DEPOSITORY_CURRENT_MEETING, meetingId)
        localStorage.setItem(DEPOSITORY_CURRENT_COMPANY, id)
        dispatch(meetingActions.getMeetingByIdAction({meetingId: meetingId}))
        dispatch({
            type: "memberTypeCurrentUser",
            payload: role
        });
        history.push('/issuerLegal/meetingSetting')
    }

    function isConfirmed(memberId, role, meetingId) {
        socketIo(memberId)
        localStorage.setItem(DEPOSITORY_CURRENT_MEETING, meetingId)
        localStorage.setItem(DEPOSITORY_CURRENT_COMPANY, id)
        dispatch(meetingActions.getMeetingByIdAction({meetingId: meetingId}))
        dispatch(meetingActions.IsConfirmedAction({currentMemberId: memberId}))
        dispatch({
            type: "memberTypeCurrentUser",
            payload: role
        });
        history.push('/issuerLegal/meetingSetting')
    }

    return (
        <>
            <SockJsClient url={url}
                          topics={['/topic/getMember']}
                          onConnect={() => {
                              console.log("CONNECT online users !!!!!!!!")
                          }}
                          onDisconnect={() => {
                              console.log("Disconnected online users !!!!!!")
                          }}
                          onMessage={(msg) => {
                              console.log("RESPONSE FROM QUESTION", msg)
                              dispatch({
                                  type: 'REQUEST_GET_MEMBER_LIST_SUCCESS',
                                  payload: msg
                              })
                          }}
                          ref={(client) => {
                              clientRef = client
                          }}
            />
            {meetings && meetings.map(userMeeting => {
                return (
                    userMeeting.status === statusMeet.success || userMeeting.status === statusMeet.cancel || userMeeting.status === statusMeet.active ? " " :
                        <div className="shadow p-3 my-3">
                            <div className="row">
                                <div className="col-12 d-block d-md-none text-center">
                                    <p style={{fontSize: '18px'}}><b>{status(userMeeting.typeEnum)}</b></p>
                                    <text>Состояние заседание: <b>{status(userMeeting.status)}</b></text>
                                    <br/>
                                    <text>Начало регистрации на участие в заседании:</text>
                                    <br/>
                                    <text>
                                        <b>{getDate(userMeeting.startRegistration)}</b>
                                    </text>
                                </div>
                                <div className="col-md-4 d-flex justify-content-center align-items-center d-md-none">
                                    {statusMeet.success !== FINISH && statusMeet.cancel !== CANCELED ?
                                        btnValue(userMeeting.id) :
                                        <ButtonValue meetingId={userMeeting.id} pathname={pathname} id={id}
                                                     isConfirmed={isConfirmed} historyPushItem={historyPushItem}/>
                                    }
                                </div>

                                <div className="col-md-7 d-none d-md-block mx-3 pt-2">
                                    <p style={{fontSize: '21px'}}><b>{status(userMeeting.typeEnum)}</b></p>
                                    <text>Состояние заседание: <b>{status(userMeeting.status)}</b></text>
                                    <br/>
                                    <text>Начало регистрации на участие в
                                        заседании: <b>{getDate(userMeeting.startRegistration)}</b>
                                    </text>
                                </div>

                                <div
                                    className="col-md-4 d-flex justify-content-end align-items-center d-none d-md-grid">
                                    {statusMeet.success !== FINISH && statusMeet.cancel !== CANCELED ?
                                        btnValue(userMeeting.id) :
                                        <ButtonValue meetingId={userMeeting.id} pathname={pathname} companyId={id} isConfirmed={isConfirmed} historyPushItem={historyPushItem}/>
                                    }
                                </div>
                            </div>
                        </div>
                )
            })}
        </>
    )
}
