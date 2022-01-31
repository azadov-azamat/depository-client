import React, {useEffect, useMemo} from "react";
import * as meetingStartedAction from "../../../../redux/actions/MeetingStartedAction";
import {ACTIVE, AGAINST, CANCELED, DEPOSITORY_CURRENT_MEMBER, FINISH, FOR, REFRAIN} from "../../../../utils/contants";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "reactstrap";
import {element} from "prop-types";
import {confirmAlert} from "react-confirm-alert";
import * as meetingStarted from "../../../../redux/actions/MeetingStartedAction";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";

export const AgendaByVoting = ({memberId, agenda, variant, meetingId}) => {

    const dispatch = useDispatch();
    const {t} = useTranslation();
    const reducers = useSelector(state => state)
    const {currentBallotVotingList, loadingBallot, countQuorum} = reducers.meetingStarted
    const {currentMeeting} = reducers.meeting

    useEffect(() => {
        const data = {
            memberId: parseInt(memberId),
            agendaId: agenda.id
        }
        dispatch(meetingStartedAction.getBallotVoting(data))
    }, [agenda.id, loadingBallot])

    const deleteBallot = (votingId) => {
        if (currentMeeting?.status === FINISH) {
            return toast.error(t("toast.statusMeeting.finish"))
        }
        if (currentMeeting?.status === CANCELED) {
            return toast.error(t("toast.statusMeeting.canceled"))
        }

        const data = {
            memberId: parseInt(memberId),
            agendaId: agenda.id,
            id: votingId
        }

        confirmAlert({
            title: t("alert.delete"),
            message: t("alert.deleteMsg"),
            buttons: [
                {
                    label: 'Да',
                    onClick: () => {
                        dispatch(meetingStarted.deleteBallotAction({data}))
                    }
                },
                {
                    label: 'Нет',
                }
            ]
        });
    }

    const addBallot = ({votingId, option, agendaId}) => {

        if (currentMeeting?.status === FINISH) {
            return toast.error(t("toast.statusMeeting.finish"))
        }
        if (currentMeeting?.status === CANCELED) {
            return toast.error(t("toast.statusMeeting.canceled"))
        }

        if (countQuorum > 74) {
            confirmAlert({
                title: t("alert.vote"),
                message: t("alert.voteMsg"),
                buttons: [
                    {
                        label: t("alert.yes"),
                        onClick: () => {
                            const data = {
                                agendaId: agendaId,
                                meetingId: meetingId,
                                memberId: memberId,
                                options: option,
                                votingOptionId: votingId
                            }

                            dispatch(meetingStarted.addBallotAction({data}))
                        }
                    },
                    {
                        label: t("alert.no"),
                    }
                ]
            });
        } else {
            return toast.error(t("toast.quorum"))
        }
    };

    const voting = useMemo(() => {
        if (!currentBallotVotingList[agenda.id]) {
            return undefined;
        }
        return currentBallotVotingList[agenda.id].find(voting => voting.votingOptionId === variant.id);
    }, [currentBallotVotingList, variant])

    if (voting !== undefined) {
        return (
            <div className="container">
                <Button className="text-white" onClick={() => deleteBallot(voting.id)}>
                    {t("meetingStarted.deleteVote")}
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center">
                <Button style={{width: "33%"}} color={"success"}
                        className="text-white" onClick={() =>
                    addBallot({
                        votingId: variant.id,
                        option: FOR,
                        agendaId: agenda.id
                    })}>
                    {t("meetingStarted.vote.yes")}
                </Button>
                <Button style={{width: "33%"}} color={"danger"}
                        onClick={() => addBallot({
                            votingId: variant.id,
                            option: REFRAIN,
                            agendaId: agenda.id
                        })}
                        className='mx-2'>{t("meetingStarted.vote.no")}</Button>
                <Button style={{width: "33%"}}
                        onClick={() => addBallot({
                            votingId: variant.id,
                            option: AGAINST,
                            agendaId: agenda.id
                        })}
                >{t("meetingStarted.vote.abstained")}</Button>
            </div>
        </>
    )
}

export default AgendaByVoting
