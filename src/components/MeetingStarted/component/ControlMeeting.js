import React, {useEffect, useRef, useState} from 'react'
import {
    ACTIVE,
    CANCELED,
    DEPOSITORY_CURRENT_MEETING,
    DEPOSITORY_USER,
    DISABLED,
    FINISH,
    PENDING, TOKEN
} from "../../../utils/contants";
import {confirmAlert} from "react-confirm-alert";
import * as meetingStartedAction from "../../../redux/actions/MeetingStartedAction";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import SockJsClient from "react-stomp";

export default function ControlMeeting({meetingStatus, memberList, meetingId, currentMeeting, socketClient}) {

    const dispatch = useDispatch();
    const [count, setCount] = useState(0);


    function startMeeting({status, quorumCount}) {
        if (status === CANCELED || status === PENDING) {
            const dataForComment = {
                userId: parseInt(localStorage.getItem(DEPOSITORY_USER)),
                meetingId: meetingId,
                loggingText:
                    status === ACTIVE ? 'Заседание начато' : ''
                    || status === FINISH ? 'Заседание начато' : ''
                    || status === CANCELED ? 'OTMEN KAROCHE' : ''
                    || status === PENDING ? "Meeting qoldirildi" : ""
            }
            const dataForUpdateMeetingStatus = {
                id: meetingId,
                companyId: currentMeeting?.companyId,
                cityId: currentMeeting?.cityId,
                address: currentMeeting?.address,
                description: currentMeeting?.description,
                startDate: currentMeeting?.startDate,
                startRegistration: currentMeeting?.startRegistration,
                endRegistration: currentMeeting?.endRegistration,
                status: status,
                typeEnum: currentMeeting?.typeEnum,
            }

            confirmAlert({
                title: 'Не активировать',
                message: 'Вы действительно хотите начать заседанию?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => {
                            socketClient.sendMessage('/topic/user-all', JSON.stringify(dataForComment));
                            dispatch(meetingActions.updateMeetingAction({data: dataForUpdateMeetingStatus}))
                        }
                    },
                    {
                        label: 'Нет',
                    }
                ]
            });
        } else if (quorumCount >= 60) {
            const dataForComment = {
                userId: parseInt(localStorage.getItem(DEPOSITORY_USER)),
                meetingId: meetingId,
                loggingText:
                    status === ACTIVE ? 'Заседание начато' : ''
                    || status === FINISH ? 'Заседание начато' : ''
                    || status === CANCELED ? 'OTMEN KAROCHE' : ''
                    || status === PENDING ? "Meeting qoldirildi" : ""
            }
            const dataForUpdateMeetingStatus = {
                id: currentMeeting.id,
                companyId: currentMeeting?.companyId,
                cityId: currentMeeting?.cityId,
                address: currentMeeting?.address,
                description: currentMeeting?.description,
                startDate: currentMeeting?.startDate,
                startRegistration: currentMeeting?.startRegistration,
                endRegistration: currentMeeting?.endRegistration,
                status: status,
                typeEnum: currentMeeting?.typeEnum,
            }

            confirmAlert({
                title: 'Активировать',
                message: 'Вы действительно хотите начать заседанию?',
                buttons: [
                    {
                        label: 'Да',
                        onClick: () => {
                            socketClient.sendMessage('/topic/user-all', JSON.stringify(dataForComment));
                            dispatch(meetingActions.updateMeetingAction({data: dataForUpdateMeetingStatus}))
                        }
                    },
                    {
                        label: 'Нет',
                    }
                ]
            });
        } else {
            toast.error("Quorum 75% dan yuqori bo`lishi kerak!")
        }
    }

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
        }
    }


    useEffect(() => {
        memberList.forEach(element => {
            if (element.isConfirmed === true) {
                setCount(prevState => prevState + 1)
            }
        })
    }, [])

    const percentQuorum = parseInt((count / memberList.length) * 100)

    return (
        <>
            <div className="p-3 d-flex flex-column justify-content-between ">
                <div>
                    <h2 className="text-2xl font-bold">Управление собранием</h2>
                    <p>Состояние заседание: <b>{status(meetingStatus)}</b></p>
                </div>
                <div className="">
                    <p>
                        <b>из них:</b>
                        <br/>
                        принимали участие дистанционно: голосов;
                        <br/>
                        принимали участие очно: голосов
                        <br/>
                        кворум ({percentQuorum}%)
                    </p>
                </div>
                {meetingStatus === PENDING ?
                    <div className="d-flex  justify-content-around align-items-end ">
                        <button className=" btn-meet px-4 py-2 rounded" onClick={() => startMeeting({
                            status: ACTIVE,
                            quorumCount: percentQuorum
                        })}>Начать
                            заседание
                        </button>
                        <button className=" btn-meet-outline px-4 py-2 rounded"
                                onClick={() => startMeeting({
                                    status: CANCELED,
                                    quorumCount: percentQuorum
                                })}>Отменить заседание
                        </button>
                    </div> : '' ||
                    meetingStatus === ACTIVE ?
                        <div className="d-flex  justify-content-around align-items-end ">
                            <button className="btn-meet px-4 py-2 rounded" onClick={() => startMeeting({
                                status: FINISH,
                                quorumCount: percentQuorum
                            })}>
                                Завершить заседание
                            </button>
                            <button className=" btn-meet px-4 py-2 rounded" onClick={() => startMeeting({
                                status: PENDING,
                                quorumCount: percentQuorum
                            })}>
                                Перенести заседание
                            </button>
                            <button className=" btn-meet-outline px-4 py-2 rounded"
                                    onClick={() => startMeeting({
                                        status: CANCELED,
                                        quorumCount: percentQuorum
                                    })}>Отменить заседание
                            </button>
                        </div> : ''
                }
            </div>
        </>
    )
}
