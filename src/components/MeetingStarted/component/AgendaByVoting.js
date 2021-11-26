import React, {useEffect, useMemo} from "react";
import * as meetingStartedAction from "../../../redux/actions/MeetingStartedAction";
import {AGAINST, DEPOSITORY_CURRENT_MEMBER, FOR, REFRAIN} from "../../../utils/contants";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "reactstrap";
import {element} from "prop-types";

export const AgendaByVoting = ({addBallot, deleteBallot, agenda, variant}) => {

    const dispatch = useDispatch();
    const reducers = useSelector(state => state)
    const {currentBallotVotingList, loadingBallot} = reducers.meetingStarted

    useEffect(() => {
        const data = {
            memberId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEMBER)),
            agendaId: agenda.id
        }
        dispatch(meetingStartedAction.getBallotVoting(data))
    }, [agenda.id, loadingBallot])

    const hasVoted = useMemo(() => {
        if (!currentBallotVotingList[agenda.id]) {
            return false;
        }
        return currentBallotVotingList[agenda.id].find(voting => voting.votingOptionId === variant.id) !== undefined
    }, [currentBallotVotingList, variant])

    console.log(currentBallotVotingList)

    if (hasVoted) {
        return (
            <Button className="text-white" onClick={() => deleteBallot(variant.id)}>
                Удалить голось
            </Button>
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
