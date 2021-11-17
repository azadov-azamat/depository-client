import React, {useEffect, useState} from 'react'
import '../SomeStyle.css';
import {useHistory, useParams} from "react-router-dom";
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
} from "../../utils/contants";
import ButtonValue from "./component/ButtonValue";

export const List = ({pathname, meetings}) => {

    const {id} = useParams();
    const [statusMeet, setStatusMeet] = useState({success: FINISH, cancel: CANCELED})
    const history = useHistory();

    useEffect(() => {
        if (pathname === 'archive') {
            setStatusMeet({...statusMeet, success: PENDING, cancel: ACTIVE})
        }
    }, [])

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
        history.push('/issuerLegal/meetingSetting')
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

    return (
        <>
            {meetings && meetings.map(userMeeting => {
                return (
                    userMeeting.status === statusMeet.success || userMeeting.status === statusMeet.cancel ? " " :
                        <div className="shadow p-3 my-3">
                            <div className="row">

                                <div className="col-12 d-block d-md-none text-center">
                                    <p style={{fontSize: '18px'}}><b>{status(userMeeting.typeEnum)}</b></p>
                                    <text>Состояние заседание: <b>{status(userMeeting.status)}</b></text>
                                    <br/>
                                    <text>Начало регистрации на участие в заседании:</text>
                                    <br/>
                                    <text>
                                        <b>{userMeeting.startRegistration.substr(0, 10) + " " + userMeeting.startRegistration.substr(11, 5)}</b>
                                    </text>
                                </div>
                                <div className="col-md-4 d-flex justify-content-center align-items-center d-md-none">
                                    {statusMeet.success !== FINISH && statusMeet.cancel !== CANCELED ?
                                        btnValue(userMeeting.id) :
                                        <ButtonValue meetingId={userMeeting.id} pathname={pathname} id={id}/>
                                    }
                                </div>

                                <div className="col-md-7 d-none d-md-block mx-3 pt-2">
                                    <p style={{fontSize: '21px'}}><b>{status(userMeeting.typeEnum)}</b></p>
                                    <text>Состояние заседание: <b>{status(userMeeting.status)}</b></text>
                                    <br/>
                                    <text>Начало регистрации на участие в
                                        заседании: <b>{userMeeting.startRegistration.substr(0, 10) + " " + userMeeting.startRegistration.substr(11, 5)}</b>
                                    </text>
                                </div>

                                <div
                                    className="col-md-4 d-flex justify-content-end align-items-center d-none d-md-grid">
                                    {statusMeet.success !== FINISH && statusMeet.cancel !== CANCELED ?
                                        btnValue(userMeeting.id) :
                                        <ButtonValue meetingId={userMeeting.id} pathname={pathname} id={id}/>
                                    }
                                </div>
                            </div>
                        </div>
                )
            })}
        </>
    )
}
