import * as meetingActions from "../../redux/actions/MeetingAction";
import {useDispatch, useSelector} from "react-redux";

export default function MemberTypeEnum({meetingId}){
    const dispatch = useDispatch()
    const reducers = useSelector(state => state)
    const {memberManagerState} = reducers.meeting


    // dispatch(meetingActions.getMemberByMeetingId({meetingId: 13152}))

    return(
        <>a</>
    )
}
