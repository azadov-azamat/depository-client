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
import {subscribe} from "../../../redux/actions/socketActions";
import {getCompanySearchNameApi, getCompanySpecFilterApi} from "../../../api/CompanyApi";
import * as types from "../../../redux/actionTypes/CompanyActionTypes";
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

    function historyPushItem(role, memberId, meetingId) {
        const linkPushItem = "/issuerLegal/meeting/" + meetingId + "/agenda?companyId=" + companyId + "&memberId=" + memberId;
        dispatch(meetingActions.getMeetingByIdAction({meetingId: meetingId}))
        dispatch({
            type: "CURRENT_MEMBER_TYPE",
            payload: role
        });
        history.push(linkPushItem)
    }

    function isConfirmed(role, memberId, meetingId) {
        const linkPushItem = "/issuerLegal/meeting/" + meetingId + "/agenda?companyId=" + companyId + "&memberId=" + memberId
        dispatch(meetingActions.getMeetingByIdAction({meetingId: meetingId}))
        dispatch(meetingActions.IsConfirmedAction({currentMemberId: memberId}))
        dispatch({
            type: "CURRENT_MEMBER_TYPE",
            payload: role
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
                                <button style={style}
                                        onClick={() => historyPushItem(CHAIRMAN, element.id, meetingId)}
                                        className="create py-2 my-2 px-2 mx-2">
                                    {t("clientPage.controlMeeting")} <br/> ({t("meetingCreated.roles.chairman")})
                                </button>
                            )
                        case SECRETARY:
                            return (
                                <button
                                    style={style}
                                    onClick={() => historyPushItem(SECRETARY, element.id, meetingId)}
                                    className="create py-2 my-2 px-2 mx-2">
                                    {t("clientPage.controlMeeting")} <br/> ({t("meetingCreated.roles.secretary")})
                                </button>
                            )
                        case SIMPLE:
                            return (
                                <button
                                    style={style}
                                    onClick={() => isConfirmed(SIMPLE, element.id, meetingId)}
                                    className="create py-2 my-2 px-2 mx-2">
                                    {t("clientPage.toVote")} <br/> ({t("meetingCreated.roles.simple")})
                                </button>
                            )
                        case WATCHER:
                            return (
                                <button
                                    style={style}
                                    onClick={() => isConfirmed(WATCHER, element.id, meetingId)}
                                    className="create py-2 my-2 px-2 mx-2">
                                    {t("clientPage.toVote")} <br/> ({t("meetingCreated.roles.watcher")})
                                </button>
                            )
                        case SPEAKER:
                            return (
                                <button
                                    style={style}
                                    onClick={() => isConfirmed(SPEAKER, element.id, meetingId)}
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
