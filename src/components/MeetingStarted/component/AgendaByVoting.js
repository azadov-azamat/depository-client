import React, {useEffect} from "react";
import * as meetingStartedAction from "../../../redux/actions/MeetingStartedAction";
import {DEPOSITORY_CURRENT_MEMBER} from "../../../utils/contants";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "reactstrap";

export default function AgendaByVoting({agendaId, votingOptionID}) {
    const dispatch = useDispatch();
    const reducers = useSelector(state => state)
    const {ballotVotingList} = reducers.meetingStarted

    console.log(agendaId)
    console.log(ballotVotingList)

    useEffect(() => {
        const data = {
            memberId: localStorage.getItem(DEPOSITORY_CURRENT_MEMBER),
            agendaId: agendaId
        }
        dispatch(meetingStartedAction.getBallotVoting(data))
    }, [agendaId])

    return(
        <>
            {
                ballotVotingList && ballotVotingList.map((voting, index)=>{
                    if(voting.votingOptionId === votingOptionID){
                        return (
                            <>
                            Bunga ovoz bergansiz
                            </>
                        )
                    }else {
                        return (
                            <>
                            Ovoz bering
                            </>
                        )
                    }

                })
            }

            {/*<div className="container d-flex justify-content-center align-items-center">*/}
            {/*    <Button style={{width: "33%"}} color={"success"}*/}
            {/*            className="text-white" onClick={() =>*/}
            {/*        addBallot({*/}
            {/*            votingId: elementOption.id,*/}
            {/*            option: FOR,*/}
            {/*            agendaId: element.id*/}
            {/*        })}>*/}
            {/*        За*/}
            {/*    </Button>*/}
            {/*    <Button style={{width: "33%"}} color={"danger"}*/}
            {/*            onClick={() => addBallot({*/}
            {/*                votingId: elementOption.id,*/}
            {/*                option: REFRAIN,*/}
            {/*                agendaId: element.id*/}
            {/*            })}*/}
            {/*            className='mx-2'>Против</Button>*/}
            {/*    <Button style={{width: "33%"}}*/}
            {/*            onClick={() => addBallot({*/}
            {/*                votingId: elementOption.id,*/}
            {/*                option: AGAINST,*/}
            {/*                agendaId: element.id*/}
            {/*            })}*/}
            {/*    >Воздержался</Button>*/}
            {/*</div>*/}
        </>
    )
}
