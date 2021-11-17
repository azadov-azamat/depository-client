import React, {useEffect, useState} from 'react'
import {ACTIVE, CANCELED, DISABLED, FINISH, PENDING} from "../../../utils/contants";

export default function ControlMeeting({meetingStatus, memberList, buttonSubmit}) {

    const [count, setCount] = useState(0);

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

    console.log(memberList)

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
                        <button className=" btn-meet px-4 py-2 rounded" onClick={() => buttonSubmit({
                            status: ACTIVE,
                            quorumCount: percentQuorum
                        })}>Начать
                            заседание
                        </button>
                        <button className=" btn-meet-outline px-4 py-2 rounded"
                                onClick={() => buttonSubmit({
                                    status: CANCELED,
                                    quorumCount: percentQuorum
                                })}>Отменить заседание
                        </button>
                    </div> : '' ||
                    meetingStatus === ACTIVE ?
                        <div className="d-flex  justify-content-around align-items-end ">
                            <button className="btn-meet px-4 py-2 rounded" onClick={() => buttonSubmit({
                                status: FINISH,
                                quorumCount: percentQuorum
                            })}>
                                Завершить заседание
                            </button>
                            <button className=" btn-meet px-4 py-2 rounded" onClick={() => buttonSubmit({
                                status: PENDING,
                                quorumCount: percentQuorum
                            })}>
                                Перенести заседание
                            </button>
                            <button className=" btn-meet-outline px-4 py-2 rounded"
                                    onClick={() => buttonSubmit({
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
