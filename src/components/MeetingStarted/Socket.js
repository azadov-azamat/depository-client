import React, {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from "react-redux";
import SockJsClient from "react-stomp";
import {DEPOSITORY_CURRENT_MEETING, DEPOSITORY_ZOOM_MEETING_PASSWORD, TOKEN} from "../../utils/contants";
import * as meetingStartedAction from "../../redux/actions/MeetingStartedAction";
import {setClient, unsetClient} from "../../redux/actions/socketActions"

export const Socket = () => {
    const dispatch = useDispatch();
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
            onConnect={() => console.log("Connected")}
            onDisconnect={() => console.log("Disconnected")}
            onMessage={(msg, topic) => {

                if (topic === '/topic/user') {
                    dispatch({
                        type: 'REQUEST_SUCCESS_LOGGING_LIST',
                        payload: msg
                    })

                    msg.forEach(element => {
                        if (element.loggingText.startsWith("PASSWORD_ZOOM:")) {
                            console.log(element)
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
                }

                if (topic === '/topic/answer') {
                    dispatch({
                        type: 'REQUEST_SUCCESS_QUESTION_LIST',
                        payload: msg
                    })
                    dispatch(meetingStartedAction.getQuestionByMeetingAction({meetingId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING))}));
                }

                if (topic === "/topic/getMember") {
                    console.log("RESPONSE FROM QUESTION", msg)
                    dispatch({
                        type: 'REQUEST_GET_MEMBER_LIST_SUCCESS',
                        payload: msg
                    })
                }

                if (topic === '/topic/get-zoom'){
                    debugger
                    console.log(msg)
                    if (msg.startCall){
                        dispatch({
                            type: "PASSWORD_ZOOM_MEETING",
                            payload: {
                                startCallMeeting: true,
                                endCallMeeting: false,
                                passwordZoomMeeting: msg.password
                            }
                        })
                    }else if (msg.endCall){
                        dispatch({
                            type: "PASSWORD_ZOOM_MEETING",
                            payload: {
                                startCallMeeting: false,
                                endCallMeeting: true,
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

