import React, {useEffect, useRef} from "react";
import {
    CHAIRMAN,
    DEPOSITORY_CURRENT_COMPANY,
    DEPOSITORY_CURRENT_MEETING, DEPOSITORY_CURRENT_MEMBER,
    DEPOSITORY_USER,
    SECRETARY, SIMPLE, SPEAKER, TOKEN, WATCHER
} from "../../../utils/contants";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import {REQUEST_CREATE_MEETING} from "../../../redux/actionTypes/MeetingActionTypes";
import SockJsClient from "react-stomp";


export default function ButtonValue({meetingId, pathname, companyId}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const reducers = useSelector(state => state)
    const {memberManagerState} = reducers.meeting
    let clientRef = useRef(null);

    let url = 'https://depositary.herokuapp.com:443/websocket/online/';
    const authToken = localStorage.getItem(TOKEN)

    if (authToken) {
        const s = authToken.substr(7, authToken.length - 1);
        url += '?access_token=' + s;
    }

    function historyPushItem(role, memberId) {
        socketIo(memberId)
        localStorage.setItem(DEPOSITORY_CURRENT_MEETING, meetingId)
        localStorage.setItem(DEPOSITORY_CURRENT_COMPANY, companyId)
        dispatch(meetingActions.getMeetingByIdAction({meetingId: meetingId}))
        dispatch({
            type: "memberTypeCurrentUser",
            payload: role
        });
        history.push('/issuerLegal/meetingSetting')
    }

    function isConfirmed(memberId, role) {
        socketIo(memberId)
        localStorage.setItem(DEPOSITORY_CURRENT_MEETING, meetingId)
        localStorage.setItem(DEPOSITORY_CURRENT_COMPANY, companyId)
        dispatch(meetingActions.getMeetingByIdAction({meetingId: meetingId}))
        dispatch(meetingActions.IsConfirmedAction({currentMemberId: memberId}))
        dispatch({
            type: "memberTypeCurrentUser",
            payload: role
        });
        history.push('/issuerLegal/meetingSetting')
    }

    const socketIo = (memberId) => {
        const data = {
            memberId: memberId,
            online: true
        }
        clientRef.sendMessage('/topic/setStatus', JSON.stringify(data));
    }
    console.log(memberManagerState)
    useEffect(() => {
        dispatch(meetingActions.getMemberByMeetingId({meetingId: meetingId}))
    }, [meetingId])

    const currentUserId = parseInt(localStorage.getItem(DEPOSITORY_USER));

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
            {
                memberManagerState && memberManagerState.map(element => {
                    if (element.userId === currentUserId) {
                        if (pathname === '/supervisory/activeMeeting/currentUser/' + companyId) {
                            return (
                                <>
                                    <button onClick={() => historyPushItem(element.memberTypeEnum, element.id)}
                                            className="create py-2 my-2 px-2">
                                        Управлять заседаниями
                                    </button>
                                    <button onClick={() => {
                                        history.push('/supervisory/addOrEditMeeting/' + meetingId)
                                        localStorage.setItem(DEPOSITORY_CURRENT_MEETING, meetingId)
                                    }}
                                            className="create py-2 my-2 px-2 mx-2 mx-md-0">
                                        Редактирование заседание
                                    </button>
                                </>
                            )
                        }
                        if (element.memberTypeEnum === CHAIRMAN || element.memberTypeEnum === SECRETARY) {
                            return (
                                <>
                                    <button onClick={() => historyPushItem(element.memberTypeEnum, element.id)}
                                            className="create py-2 my-2 px-2">
                                        Управлять
                                        заседаниями <br/> ({element.memberTypeEnum === CHAIRMAN ? "Председатель" : "Секретар"})
                                    </button>
                                    <button onClick={() => isConfirmed(element.id, element.memberTypeEnum)}
                                            className="create py-2 my-2 px-2">
                                        Проголосовать
                                    </button>
                                </>
                            )
                        } else
                            if (element.memberTypeEnum === SIMPLE || element.memberTypeEnum === WATCHER || element.memberTypeEnum === SPEAKER) {
                            return (
                                <button
                                    onClick={() => isConfirmed(element.id, element.memberTypeEnum)}
                                    className="create py-2 my-2 px-2">
                                    Проголосовать
                                </button>
                            )
                        }
                    }
                })
            }
        </>
    )
}
