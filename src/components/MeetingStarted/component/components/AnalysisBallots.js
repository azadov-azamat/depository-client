import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as meetingStartedAction from "../../../../redux/actions/MeetingStartedAction";
import {AGAINST, FOR, REFRAIN} from "../../../../utils/contants";

export default function AnalysisBallots({votingId}) {

    const dispatch = useDispatch();
    const reducers = useSelector(state => state);
    const {memberManagerState} = reducers.meeting
    const {votingBallots} = reducers.meetingStarted

    const [allUserPercent, setAllUserPercent] = useState(0);
    const [countFor, setCountFor] = useState(0);
    const [countAgainst, setCountAgainst] = useState(0);
    const [countRefrain, setCountRefrain] = useState(0);

    useEffect(() => {
        dispatch(meetingStartedAction.getBallotByVotingAction({votingId}))
    }, [votingId])

    useEffect(() => {
        setAllUserPercent((votingBallots[votingId]?.length / memberManagerState.length) * 100)
    }, [memberManagerState])

    useEffect(() => {
        votingBallots[votingId]?.forEach(ballot => {
            if (ballot.options === FOR) {
                setCountFor(countFor + 1)
            }
            if (ballot.options === AGAINST) {
                setCountAgainst(countAgainst + 1)
            }
            if (ballot.options === REFRAIN) {
                setCountRefrain(countRefrain + 1)
            }
        })
    }, [votingId])

    const styleCursor={
        cursor: 'pointer'
    }

    return (
        <div className="d-flex">
            <div className="for-ballots p-2 border text-white d-flex justify-content-center align-items-center w-25 bg-success" style={styleCursor} data-toggle="tooltip" data-placement="top"
                 title="За">
                <span>{countFor}</span>
            </div>
            <div className="against-ballots p-2 border text-white d-flex justify-content-center align-items-center w-25 bg-danger" style={styleCursor} data-toggle="tooltip" data-placement="top"
                 title="Против">
                <span>{countAgainst}</span>
            </div>
            <div className="refrain-ballots p-2 border text-white d-flex justify-content-center align-items-center w-25 bg-dark opacity-50" style={styleCursor} data-toggle="tooltip" data-placement="top"
                 title="Воздержались">
                <span>{countRefrain}</span>
            </div>
        </div>
    )
}
