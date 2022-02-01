import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as meetingStartedAction from "../../../../redux/actions/MeetingStartedAction";
import {AGAINST, FOR, REFRAIN} from "../../../../utils/contants";
import {FcStatistics} from "react-icons/all";
import {Button} from "reactstrap";
import {Link} from "react-router-dom";

export default function AnalysisBallots({votingId, meetingStatus, agendaId}) {

    const dispatch = useDispatch();
    const reducers = useSelector(state => state);
    const {votingBallots} = reducers.meetingStarted

    const [countFor, setCountFor] = useState(0);
    const [countAgainst, setCountAgainst] = useState(0);
    const [countRefrain, setCountRefrain] = useState(0);

    useEffect(() => {
        dispatch(meetingStartedAction.getBallotByVotingAction({votingId}))
    }, [votingId])


    useEffect(() => {
        votingBallots[votingId]?.forEach(ballot => {
            if (ballot.options === FOR) {
                setCountFor(prevState => prevState + 1)
            }
            if (ballot.options === AGAINST) {
                setCountAgainst(prevState => prevState + 1)
            }
            if (ballot.options === REFRAIN) {
                setCountRefrain(prevState => prevState + 1)
            }
        })
    }, [meetingStatus])

    const styleCursor = {
        cursor: 'pointer'
    }

    return (
        <div className="d-flex">
            <div
                className="for-ballots p-2 border text-white d-flex justify-content-center align-items-center w-25 bg-success"
                style={styleCursor} data-toggle="tooltip" data-placement="top"
                title="За">
                <span>{countFor}</span>
            </div>
            <div
                className="against-ballots p-2 border text-white d-flex justify-content-center align-items-center w-25 bg-danger"
                style={styleCursor} data-toggle="tooltip" data-placement="top"
                title="Против">
                <span>{countAgainst}</span>
            </div>
            <div
                className="refrain-ballots p-2 border text-white d-flex justify-content-center align-items-center w-25 bg-dark opacity-50"
                style={styleCursor} data-toggle="tooltip" data-placement="top"
                title="Воздержались">
                <span>{countRefrain}</span>
            </div>
            <Link className={"d-flex align-items-center mx-1"} target={"_blank"}
                  to={"/supervisory/statistic_agenda?agenda_id=" + agendaId + "&voting_id=" + votingId}>Подробно...</Link>
        </div>
    )
}
