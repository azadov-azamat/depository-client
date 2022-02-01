import React from 'react'
import {ACTIVE, CANCELED, DISABLED, FINISH, PENDING} from "../../../utils/contants";
import {Table} from "reactstrap";
import AnalysisBallots from "./components/AnalysisBallots";

export default function ControlMeeting({meetingStatus, startMeeting, quorum, lang, agenda, members}) {

    function status(status) {
        if (status === ACTIVE) {
            return lang("meetingCreated.meetingStatus.active")
        } else if (status === PENDING) {
            return lang("meetingCreated.meetingStatus.pending")
        } else if (status === FINISH) {
            return lang("meetingCreated.meetingStatus.finish")
        } else if (status === CANCELED) {
            return lang("meetingCreated.meetingStatus.canceled")
        } else if (status === DISABLED) {
            return lang("meetingCreated.meetingStatus.disabled")
        }
    }

    function agendaSubjectAndVoting({subject, speaker, extraInfo}) {
        return (
            <>
                <p style={{fontWeight: 'bold'}}>Повестка дня: {subject}</p>
                {speaker !== null ?
                    <span>Доклатчик: {speaker}</span> : ''
                } <br/>
                <span style={{fontSize: "12px"}}
                      className={extraInfo === null || extraInfo === undefined ? 'd-none' : ''}>Причина: {extraInfo}</span>
            </>
        )
    }


    const styleTable = {
        whiteSpace: 'nowrap',
        width: '22em',
        height: '20px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        padding: '0',
        margin: '0'
    }

    return (
        <>
            <div className="p-3 d-flex flex-column justify-content-between ">
                <div>
                    <h2 className="text-2xl font-bold">{lang("meetingManagement")}</h2>
                    <p>{lang("clientPage.statusNameMeeting")}: <b>{status(meetingStatus)}</b></p>
                </div>
                <div className="">
                    <p>
                        <b>из них:</b>
                        <br/>
                        принимали участие дистанционно: {
                        (members?.filter(element=> element.isConfirmed)).filter(element1=> element1.isRemotely).length
                    } голосов;
                        <br/>
                        принимали участие очно: {
                        (members?.filter(element=> element.isConfirmed)).filter(element1=> !element1.isRemotely).length
                    } голосов
                        <br/>
                        кворум ({isNaN(quorum) ? 0 : quorum}%)
                    </p>
                </div>
                {meetingStatus === PENDING ?
                    <div className="d-flex  justify-content-around align-items-end ">
                        <button className=" btn-meet px-4 py-2 rounded" onClick={() => startMeeting({
                            status: ACTIVE,
                        })}>Начать
                            заседание
                        </button>
                        <button className=" btn-meet-outline px-4 py-2 rounded"
                                onClick={() => startMeeting({
                                    status: CANCELED,
                                })}>Отменить заседание
                        </button>
                    </div> : '' ||
                    meetingStatus === ACTIVE ?
                        <div className="d-flex  justify-content-around align-items-end ">
                            <button className="btn-meet px-4 py-2 rounded" onClick={() => startMeeting({
                                status: FINISH,
                            })}>
                                Завершить заседание
                            </button>
                            <button className=" btn-meet px-4 py-2 rounded" onClick={() => startMeeting({
                                status: PENDING,
                            })}>
                                Перенести заседание
                            </button>
                            <button className=" btn-meet-outline px-4 py-2 rounded"
                                    onClick={() => startMeeting({
                                        status: CANCELED,
                                    })}>Отменить заседание
                            </button>
                        </div> : '' ||
                        meetingStatus === FINISH ?
                            <div>
                                <h4>РЕЗУЛЬТАТЫ</h4>
                                <Table hover>
                                    <thead>
                                    <tr>
                                        <th className="text-center">Вопросы поставленные <br/> на голосование</th>
                                        <th className="text-center">
                                            Итого голосования
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {agenda?.length !== 0 ?
                                        agenda?.map((element, index) => (
                                            <>
                                                <tr key={index}>
                                                    <td colSpan={'2'} className="text-center">{agendaSubjectAndVoting({
                                                        subject: element.subject,
                                                        speaker: element.userName,
                                                        extraInfo: element.extraInfo
                                                    })}
                                                    </td>
                                                </tr>
                                                {
                                                    element.votingOptions.map(elementVoting =>
                                                        <tr key={element.id}>
                                                            <td>
                                                                <p style={styleTable}>{elementVoting.votingText}</p>
                                                            </td>
                                                            <td>
                                                                <AnalysisBallots agendaId={element.id} votingId={elementVoting.id} meetingStatus={meetingStatus}/>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            </>
                                        ))
                                        :
                                        <tr className='text-center'>
                                            <th colSpan="5">Ничего не найдена</th>
                                        </tr>
                                    }
                                    </tbody>
                                </Table>
                            </div> : ""
                }
            </div>
        </>
    )
}
