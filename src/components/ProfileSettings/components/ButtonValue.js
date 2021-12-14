
import React, {useEffect} from "react";
import {
    CHAIRMAN,
    DEPOSITORY_CURRENT_MEETING,
    DEPOSITORY_USER,
    SECRETARY,
    SIMPLE,
    SPEAKER,
    WATCHER
} from "../../../utils/contants";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import * as meetingActions from "../../../redux/actions/MeetingAction";


export default function ButtonValue({meetingId, setStatusOnlineUser, companyId}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const reducers = useSelector(state => state)
    const {memberManagerState, memberManagerType} = reducers.meeting
    const {currentUser} = reducers.auth

    useEffect(() => {
        dispatch(meetingActions.getMemberTypeEnumAction({meetingId: meetingId, userId: currentUser?.id}))
    }, [meetingId])

    console.log(memberManagerType[meetingId]);

    function historyPushItem(role, memberId, meetingId) {
        // setStatusOnlineUser(memberId, meetingId)
        dispatch(meetingActions.getMeetingByIdAction({meetingId: meetingId}))
        dispatch({
            type: "CURRENT_MEMBER_TYPE",
            payload: role
        });
        history.push("/issuerLegal/meeting/" + meetingId + "/agenda?companyId=" + companyId + "&memberId=" + memberId)
    }

    function isConfirmed(role, memberId, meetingId) {
        // setStatusOnlineUser(memberId, meetingId)
        dispatch(meetingActions.getMeetingByIdAction({meetingId: meetingId}))
        dispatch(meetingActions.IsConfirmedAction({currentMemberId: memberId}))
        dispatch({
            type: "CURRENT_MEMBER_TYPE",
            payload: role
        });
        history.push("/issuerLegal/meeting/" + meetingId + "/agenda?companyId=" + companyId + "&memberId=" + memberId);
    }

    const style = {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whitespace: 'nowrap',
        // width: '13em',
        height: '65px',
    }

    return (
        <>
            {
                memberManagerType[meetingId] && memberManagerType[meetingId].map(element => {
                    console.log(element)
                    // if (element.userId === currentUser?.id) {
                    switch (element.memberTypeEnum){
                        case CHAIRMAN:
                            return (
                                <button style={style}
                                        onClick={() => historyPushItem(CHAIRMAN, element.id, meetingId)}
                                        className="create py-2 my-2 px-2 mx-2">
                                    Управлять заседаниями <br/> (Председатель)
                                </button>
                            )
                        case SECRETARY:
                            return (
                                <button
                                    style={style}
                                    onClick={() => historyPushItem(SECRETARY, element.id, meetingId)}
                                    className="create py-2 my-2 px-2 mx-2">
                                    Управлять заседаниями <br/> (Секретар)
                                </button>
                            )
                        case SIMPLE:
                            return (
                                <button
                                    style={style}
                                    onClick={() => isConfirmed(SIMPLE, element.id,  meetingId)}
                                    className="create py-2 my-2 px-2 mx-2">
                                    Проголосовать <br/> (Обычный - Реестр)
                                </button>
                            )
                        case WATCHER:
                            return (
                                <button
                                    style={style}
                                    onClick={() => isConfirmed(WATCHER, element.id, meetingId)}
                                    className="create py-2 my-2 px-2 mx-2">
                                    Проголосовать <br/> (Приглашенный)
                                </button>
                            )
                        case SPEAKER:
                            return (
                                <button
                                    style={style}
                                    onClick={() => isConfirmed(SPEAKER, element.id, meetingId)}
                                    className="create py-2 my-2 px-2 mx-2">
                                    Проголосовать <br/> (Доклатчик)
                                </button>
                            )
                    }
                })
            }
        </>
    )
}
