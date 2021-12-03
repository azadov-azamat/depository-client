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


export default function ButtonValue({meetingId, pathname, companyId, historyPushItem, isConfirmed}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const reducers = useSelector(state => state)
    const {memberManagerState} = reducers.meeting

    useEffect(() => {
        dispatch(meetingActions.getMemberByMeetingId({meetingId: meetingId}))
    }, [meetingId])

    const currentUserId = parseInt(localStorage.getItem(DEPOSITORY_USER));

    return (
        <>
            {
                memberManagerState && memberManagerState.map(element => {
                    if (element.userId === currentUserId) {
                        // if (pathname === '/supervisory/activeMeeting/currentUser/' + companyId) {
                        //     return (
                        //         <>
                        //             <button onClick={() => historyPushItem(element.memberTypeEnum, element.id, meetingId)}
                        //                     className="create py-2 my-2 px-2">
                        //                 Управлять заседаниями
                        //             </button>
                        //             <button onClick={() => {
                        //                 history.push('/supervisory/addOrEditMeeting/' + meetingId)
                        //                 localStorage.setItem(DEPOSITORY_CURRENT_MEETING, meetingId)
                        //             }}
                        //                     className="create py-2 my-2 px-2 mx-2 mx-md-0">
                        //                 Редактирование заседание
                        //             </button>
                        //         </>
                        //     )
                        // }
                        if (element.memberTypeEnum === CHAIRMAN || element.memberTypeEnum === SECRETARY) {
                            return (
                                <>
                                    <button onClick={() => historyPushItem(element.memberTypeEnum, element.id, meetingId)}
                                            className="create py-2 my-2 px-2">
                                        Управлять
                                        заседаниями <br/> ({element.memberTypeEnum === CHAIRMAN ? "Председатель" : "Секретар"})
                                    </button>
                                    <button onClick={() => isConfirmed(element.id, element.memberTypeEnum, meetingId)}
                                            className="create py-2 my-2 px-2">
                                        Проголосовать
                                    </button>
                                </>
                            )
                        } else
                            if (element.memberTypeEnum === SIMPLE || element.memberTypeEnum === WATCHER || element.memberTypeEnum === SPEAKER) {
                            return (
                                <button
                                    onClick={() => isConfirmed(element.id, element.memberTypeEnum, meetingId)}
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
