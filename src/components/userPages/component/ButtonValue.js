import React, {useEffect} from "react";
import {CHAIRMAN, SECRETARY, SIMPLE, SPEAKER, WATCHER} from "../../../utils/contants";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import {useTranslation} from "react-i18next";


export default function ButtonValue({meetingId, companyId}) {

    const dispatch = useDispatch();
    const history = useHistory();
    const {t} = useTranslation();
    const reducers = useSelector(state => state)
    const {memberManagerType} = reducers.meeting
    const {currentUser} = reducers.auth

    useEffect(() => {
        dispatch(meetingActions.getMemberTypeEnumAction({
            meetingId: meetingId,
            userId: (currentUser && currentUser.id)
        }))
    }, [currentUser])

    function historyPushItem(role, memberId, meetingId, fromReestr) {
        const linkPushItem = "/issuerLegal/meeting/" + meetingId + "/agenda?companyId=" + companyId + "&memberId=" + memberId;
        dispatch(meetingActions.getMeetingByIdAction({meetingId: meetingId}))
        dispatch({
            type: "CURRENT_MEMBER_TYPE",
            payload: {role, fromReestr}
        });
        history.push(linkPushItem)
    }

    function isConfirmed(role, memberId, meetingId, fromReestr) {
        const linkPushItem = "/issuerLegal/meeting/" + meetingId + "/agenda?companyId=" + companyId + "&memberId=" + memberId
        dispatch(meetingActions.getMeetingByIdAction({meetingId: meetingId}))
        dispatch(meetingActions.IsConfirmedAction({currentMemberId: memberId}))
        dispatch({
            type: "CURRENT_MEMBER_TYPE",
            payload: {role, fromReestr}
        });
        history.push(linkPushItem);
    }

    const style = {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whitespace: 'nowrap',
        height: '65px',
    }

    return (
        <>
            {
                memberManagerType[meetingId] && memberManagerType[meetingId].map(element => {
                    switch (element.memberTypeEnum) {
                        case CHAIRMAN:
                            return (
                                <button
                                    style={style} key={element?.id}
                                    onClick={() => element.fromReestr ? isConfirmed(CHAIRMAN, element.id, meetingId, element.fromReestr) : historyPushItem(CHAIRMAN, element.id, meetingId, element.fromReestr)}
                                    className="create py-2 my-2 px-2 mx-2">
                                    {element.fromReestr ? t("clientPage.toVote") : t("clientPage.controlMeeting")}
                                    <br/> ({element.fromReestr ? t("meetingCreated.roles.simple") : t("meetingCreated.roles.chairman")})
                                </button>
                            )
                        case SECRETARY:
                            return (
                                <button
                                    style={style} key={element?.id}
                                    onClick={() => historyPushItem(SECRETARY, element.id, meetingId, element.fromReestr)}
                                    className="create py-2 my-2 px-2 mx-2">
                                    {t("clientPage.controlMeeting")} <br/> ({t("meetingCreated.roles.secretary")})
                                </button>
                            )
                        case SIMPLE:
                            return (
                                <button
                                    style={style} key={element?.id}
                                    onClick={() => isConfirmed(SIMPLE, element.id, meetingId, element.fromReestr)}
                                    className="create py-2 my-2 px-2 mx-2">
                                    {t("clientPage.toVote")} <br/> ({t("meetingCreated.roles.simple")})
                                </button>
                            )
                        case WATCHER:
                            return (
                                <button
                                    style={style} key={element?.id}
                                    onClick={() => isConfirmed(WATCHER, element.id, meetingId, element.fromReestr)}
                                    className="create py-2 my-2 px-2 mx-2">
                                    {t("clientPage.toVote")} <br/> ({t("meetingCreated.roles.watcher")})
                                </button>
                            )
                        case SPEAKER:
                            return (
                                <button
                                    style={style} key={element?.id}
                                    onClick={() => isConfirmed(SPEAKER, element.id, meetingId, element.fromReestr)}
                                    className="create py-2 my-2 px-2 mx-2">
                                    {t("clientPage.toVote")} <br/> ({t("meetingCreated.roles.speaker")})
                                </button>
                            )
                    }
                })
            }
        </>
    )
}
