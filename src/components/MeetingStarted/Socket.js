import React, {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from "react-redux";
import SockJsClient from "react-stomp";
import {TOKEN} from "../../utils/contants";
import * as meetingStartedAction from "../../redux/actions/MeetingStartedAction";
import * as meetingAction from "../../redux/actions/MeetingAction";
import {setClient, unsetClient} from "../../redux/actions/socketActions"
import {useTranslation} from "react-i18next";

export const Socket = ({meetingId, memberId, setCount, memberManagerState}) => {

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
                dispatch({
                    type: 'COUNT_QUORUM_MEETING',
                    payload: parseInt((memberManagerState?.filter(element=> element.isConfirmed === true).length / memberManagerState.length) * 100)
                })

                if (topic === '/topic/user') {
                    dispatch({
                        type: 'REQUEST_SUCCESS_LOGGING_LIST',
                        payload: msg
                    })

                    msg.forEach(element => {
                        if (element.loggingText === t("meetingCreated.meetingStatus.active")) {
                            dispatch(meetingAction.getMeetingByIdAction({meetingId}))
                        }
                    })
                }

                if (topic === '/topic/answer') {
                    dispatch({
                        type: 'REQUEST_SUCCESS_QUESTION_LIST',
                        payload: msg
                    })
                    dispatch(meetingStartedAction.getQuestionByMeetingAction({meetingId: meetingId}));
                    dispatch(meetingStartedAction.getQuestionByMemberIdAction({memberId: memberId}));
                }

                if (topic === ("/topic/getMember/" + meetingId)) {
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
            }}
        />
    )
}

export default Socket

