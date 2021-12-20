import React, {useEffect, useMemo} from "react";
import * as meetingStartedAction from "../../../redux/actions/MeetingStartedAction";
import {AGAINST, DEPOSITORY_CURRENT_MEMBER, FOR, REFRAIN} from "../../../utils/contants";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "reactstrap";
import {element} from "prop-types";
import {confirmAlert} from "react-confirm-alert";
import * as meetingStarted from "../../../redux/actions/MeetingStartedAction";
import {toast} from "react-toastify";

export const AgendaByVoting = ({memberId, agenda, variant, meetingId, quorum}) => {

    const dispatch = useDispatch();
    const reducers = useSelector(state => state)
    const {currentBallotVotingList, loadingBallot} = reducers.meetingStarted

    useEffect(() => {
        const data = {
            memberId: parseInt(memberId),
            agendaId: agenda.id
        }
        dispatch(meetingStartedAction.getBallotVoting(data))
    }, [agenda.id, loadingBallot])

    const deleteBallot = (votingId) => {
        const data = {
            memberId: parseInt(memberId),
            agendaId: agenda.id,
            id: votingId
        }

        confirmAlert({
            title: 'Удалить голось',
            message: 'Вы действительно хотите удалить в голось?',
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

        if (quorum < 75) {
            return toast.error("Quorum 75% dan yuqori bo`lishi kerak!")
        }

        confirmAlert({
            title: 'Проголосовать',
            message: 'Вы действительно хотите удалить в компанию?',
            buttons: [
                {
                    label: 'Да',
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
                    label: 'Нет',
                }
            ]
        });
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
                    Удалить голось
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
                    За
                </Button>
                <Button style={{width: "33%"}} color={"danger"}
                        onClick={() => addBallot({
                            votingId: variant.id,
                            option: REFRAIN,
                            agendaId: agenda.id
                        })}
                        className='mx-2'>Против</Button>
                <Button style={{width: "33%"}}
                        onClick={() => addBallot({
                            votingId: variant.id,
                            option: AGAINST,
                            agendaId: agenda.id
                        })}
                >Воздержался</Button>
            </div>
        </>
    )
}

export default AgendaByVoting
