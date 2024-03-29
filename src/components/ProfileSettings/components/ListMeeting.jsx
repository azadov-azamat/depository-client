import React, {useEffect, useRef, useState} from 'react'
import '../../SomeStyle.css';
import {useHistory, useLocation, useParams} from "react-router-dom";
import {
    ACTIVE,
    CANCELED,
    DEPOSITORY_CURRENT_COMPANY,
    DEPOSITORY_CURRENT_MEETING,
    DISABLED,
    EXTRAORDINARY,
    FINISH,
    ORDINARY,
    PENDING
} from "../../../utils/contants";
import ButtonValue from "./ButtonValue";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import {useDispatch, useSelector} from "react-redux";
import Text from "antd/es/typography/Text";
import * as adminMeetingAction from "../../../redux/actions/MeetingAction";

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const ListMeeting = ({lang}) => {

    const {id} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const reducers = useSelector(state => state)
    const {meetings, meetingByUser} = reducers.meeting;
    const [statusMeet, setStatusMeet] = useState({success: FINISH, cancel: CANCELED, active: DISABLED})

    useEffect(() => {
        dispatch(adminMeetingAction.getMeetingByCompanyId({companyId: 25102}))
    }, [])

    let query = useQuery();

    console.log(meetings)
    // const companyId = query.get("company_id");

    useEffect(() => {
        if (query.get("type") === 'archive') {
            setStatusMeet({...statusMeet, success: PENDING, cancel: ACTIVE, active: "ACTIVATED"})
        } else if (query.get("type") === 'active') {
            setStatusMeet({...statusMeet, success: FINISH, cancel: CANCELED, active: DISABLED})
        }
    }, [query])

    function status(status) {
        if (status === ACTIVE) {
            return 'Активно по распиванию'
        } else if (status === PENDING) {
            return "Ожидает запуска"
        } else if (status === FINISH) {
            return 'Завершено (в архиве)'
        } else if (status === CANCELED) {
            return 'Отменено (в архиве)'
        } else if (status === DISABLED) {
            return 'Неактивно'
        } else if (status === EXTRAORDINARY) {
            return 'Плановое заседание наблюдательного совета'
        } else if (status === ORDINARY) {
            return 'Внеплановое заседание наблюдательного совета '
        }
    }

    function historyPushItem(meetingId) {
        localStorage.setItem(DEPOSITORY_CURRENT_MEETING, meetingId)
        localStorage.setItem(DEPOSITORY_CURRENT_COMPANY, id)
        // history.push('/issuerLegal/meeting/' + meetingId + "?memberId=" + memberId + "&page=agenda')
    }

    function btnValue(meetingId) {
        return (
            <>
                <button onClick={() => historyPushItem(meetingId)}
                        className="create py-2 my-2 px-2">
                    Ознакомиться
                </button>
            </>
        )
    }

    function getDate(currentDate) {
        let date = new Date(currentDate);
        return (
            <>
                {(date.getHours().toString().length === 1 ? ("0" + date.getHours()) : date.getHours()) + ":" + (date.getMinutes().toString().length === 1 ? ("0" + date.getMinutes()) : date.getMinutes()) + " " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()}
            </>
        )
    }

    function historyPushItem(role, memberId, meetingId) {
        // setStatusOnlineUser(memberId)
        dispatch(meetingActions.getMeetingByIdAction({meetingId: meetingId}))
        dispatch({
            type: "CURRENT_MEMBER_TYPE",
            payload: role
        });
        history.push("/issuerLegal/meeting/" + meetingId + "/agenda?companyId=" + 25102 + "&memberId=" + memberId)
    }

    function isConfirmed(memberId, role, meetingId) {
        // setStatusOnlineUser(memberId)
        dispatch(meetingActions.getMeetingByIdAction({meetingId: meetingId}))
        dispatch(meetingActions.IsConfirmedAction({currentMemberId: memberId}))
        dispatch({
            type: "CURRENT_MEMBER_TYPE",
            payload: role
        });
        history.push("/issuerLegal/meeting/" + meetingId + "/agenda?companyId=" + 25102 + "&memberId=" + memberId);
    }

    console.log(meetings)
    return (
        <>
            {meetings && meetings.map(userMeeting => {
                return (
                    userMeeting.status === statusMeet.success || userMeeting.status === statusMeet.cancel || userMeeting.status === statusMeet.active ? " " :
                        <div className="shadow p-3 my-3">
                            <div className="row">
                                <div className="col-12 d-block d-md-none text-center">
                                    <p style={{fontSize: '18px'}}><b>{status(userMeeting.typeEnum)}</b></p>
                                    <Text>Состояние заседание: <b>{status(userMeeting.status)}</b></Text>
                                    <br/>
                                    <Text>Начало регистрации на участие в заседании:</Text>
                                    <br/>
                                    <Text>
                                        <b>{getDate(userMeeting.startRegistration)}</b>
                                    </Text>
                                </div>
                                <div className="col-md-4 d-flex justify-content-center align-items-center d-md-none">
                                    {statusMeet.success !== FINISH && statusMeet.cancel !== CANCELED ?
                                        btnValue(userMeeting.id) :
                                        <ButtonValue meetingId={userMeeting.id} companyId={25102}/>
                                    }
                                </div>

                                <div className="col-md-7 d-none d-md-block mx-3 pt-2">
                                    <p style={{fontSize: '21px'}}><b>{status(userMeeting.typeEnum)}</b></p>
                                    <Text>Состояние заседание: <b>{status(userMeeting.status)}</b></Text>
                                    <br/>
                                    <Text>Начало регистрации на участие в
                                        заседании: <b>{getDate(userMeeting.startRegistration)}</b>
                                    </Text>
                                </div>

                                <div className="col-md-4 d-md-flex justify-content-center align-items-center d-none">
                                    {statusMeet.success !== FINISH && statusMeet.cancel !== CANCELED ?
                                        btnValue(userMeeting.id) :
                                        <ButtonValue meetingId={userMeeting.id} companyId={25102}/>
                                    }
                                </div>
                            </div>
                        </div>
                )
            })}
        </>
    )
}
