import React, {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from "react-redux";
import SockJsClient from "react-stomp";
import {CANCELED, CHAIRMAN, DISABLED, FINISH, PENDING, SIMPLE, SPEAKER, TOKEN, WATCHER} from "../../utils/contants";
import * as meetingStartedAction from "../../redux/actions/MeetingStartedAction";
import {setClient, unsetClient} from "../../redux/actions/socketActions"
import {useTranslation} from "react-i18next";

export const Socket = ({meetingId, memberId, currentMember, setOpenModal}) => {

    const dispatch = useDispatch();
    const {t} = useTranslation();
    const clientRef = useRef(null);
    const topics = useSelector(state => state.socket.topics);

    let url = 'https://depositary.herokuapp.com:443/websocket/logger/';
    const authToken = localStorage.getItem(TOKEN);

    if (authToken) {
        const s = authToken.substr(7, authToken.length - 1);
        url += '?access_token=' + s;
    }

    useEffect(() => {
        dispatch(setClient(clientRef.current));
        return () => {
            dispatch(unsetClient());
        }
    }, [dispatch])

    return (
        <SockJsClient
            ref={clientRef}
            url={url}
            topics={topics}

            onConnect={() => {
                dispatch({
                    type: "RESPONSE_CONNECT_SUCCESS",
                    payload: true
                })
            }}

            onDisconnect={() => {
                dispatch({
                    type: "RESPONSE_CONNECT_SUCCESS",
                    payload: false
                })
            }}

            onMessage={(msg, topic) => {

                if (topic === '/topic/user/' + meetingId) {
                    dispatch({
                        type: 'REQUEST_SUCCESS_LOGGING_LIST',
                        payload: msg
                    })
                }

                if (topic === '/topic/answer/' + meetingId) {
                    dispatch({
                        type: 'REQUEST_SUCCESS_QUESTION_LIST',
                        payload: msg
                    })
                    dispatch(meetingStartedAction.getQuestionByMeetingAction({meetingId: meetingId}));
                    dispatch(meetingStartedAction.getQuestionByMemberIdAction({memberId: memberId}));
                }

                if (topic === ('/topic/getMember/' + meetingId)) {
                    dispatch({
                        type: 'RESPONSE_GET_ONLINE_MEMBERS_LIST_SUCCESS',
                        payload: msg
                    })
                }

                if (topic === '/topic/get-zoom/' + meetingId) {
                    if (msg.zoom && msg.zoomPassword !== null) {
                        dispatch({
                            type: "PASSWORD_ZOOM_MEETING",
                            payload: {
                                startCallMeeting: true,
                                passwordZoomMeeting: msg.zoomPassword
                            }
                        })
                    } else if (!msg.zoom) {
                        dispatch({
                            type: "PASSWORD_ZOOM_MEETING",
                            payload: {
                                startCallMeeting: false,
                                passwordZoomMeeting: null
                            }
                        })
                    }
                }

                if (topic === '/topic/meeting-status/' + meetingId) {
                    dispatch({
                        type: 'REQUEST_GET_MEETING_SUCCESS',
                        payload: msg
                    })
                    if (msg.status === FINISH || msg.status === CANCELED || msg.status === DISABLED || msg.status === PENDING) {
                        if (currentMember?.memberTypeEnum === SIMPLE ||
                            currentMember?.memberTypeEnum === WATCHER ||
                            currentMember?.memberTypeEnum === SPEAKER ||
                            currentMember?.memberTypeEnum === CHAIRMAN && currentMember?.fromReestr) {
                            setOpenModal(true)
                        }
                    }
                }

                if (topic === '/topic/quorum/' + meetingId) {
                    dispatch({
                        type: 'COUNT_QUORUM_MEETING',
                        payload: parseInt((msg?.filter(element => element.isConfirmed === true).length / msg.length) * 100)
                    })
                }
            }}
        />
    )
}

export default Socket

