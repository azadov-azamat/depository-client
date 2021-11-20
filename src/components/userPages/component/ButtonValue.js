import React, {useEffect} from "react";
import {
    CHAIRMAN,
    DEPOSITORY_CURRENT_COMPANY,
    DEPOSITORY_CURRENT_MEETING,
    DEPOSITORY_USER,
    SECRETARY
} from "../../../utils/contants";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import {REQUEST_CREATE_MEETING} from "../../../redux/actionTypes/MeetingActionTypes";


export default function ButtonValue({meetingId, pathname, id}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const reducers = useSelector(state => state)
    const {memberManagerState} = reducers.meeting

    function historyPushItem(role) {
        localStorage.setItem(DEPOSITORY_CURRENT_MEETING, meetingId)
        localStorage.setItem(DEPOSITORY_CURRENT_COMPANY, id)
        dispatch(meetingActions.getMeetingByIdAction({meetingId: meetingId}))
        dispatch({
            type: "memberTypeCurrentUser",
            payload: role
        });
        history.push('/issuerLegal/meetingSetting')
    }

    function isConfirmed({memberId, role}) {
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

    useEffect(() => {
        dispatch(meetingActions.getMemberByMeetingId({meetingId: meetingId}))
    }, [])

    const currentUserId = parseInt(localStorage.getItem(DEPOSITORY_USER));

    return (
        <>
            {
                memberManagerState && memberManagerState.map(element => {
                    if (element.userId === currentUserId) {
                        if (pathname === '/supervisory/activeMeeting/currentUser/' + id) {
                            return (
                                <>
                                    <button onClick={() => historyPushItem(element.memberTypeEnum)}
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
                                    <button onClick={() => historyPushItem(element.memberTypeEnum)}
                                            className="create py-2 my-2 px-2">
                                        Управлять заседаниями <br/> ({element.memberTypeEnum === CHAIRMAN ? "Председатель" : "Секретар"})
                                    </button>
                                    <button onClick={() => isConfirmed({
                                        role: element.memberTypeEnum,
                                        memberId: element.id
                                    })}
                                            className="create py-2 my-2 px-2">
                                        Проголосовать
                                    </button>
                                </>

                            )
                        } else {
                            return (
                                <button
                                    onClick={() => isConfirmed({role: element.memberTypeEnum, memberId: element.id})}
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
