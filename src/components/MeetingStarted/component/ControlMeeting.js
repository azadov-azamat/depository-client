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
import {useDispatch, useSelector} from "react-redux";
import SockJsClient from "react-stomp";
import {updateMeetingStatusAction} from "../../../redux/actions/MeetingAction";
import {Table} from "reactstrap";
import {Link} from "react-router-dom";
import {FaCheck, FaPen, FaTimes} from "react-icons/fa";

export default function ControlMeeting({meetingStatus, startMeeting, quorum, lang, agenda}) {

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
                <p style={{fontWeight: 'bold'}}>{subject}</p>
                {speaker !== null ?
                    <span>Доклатчик: {speaker}</span> : ''
                } <br/>
                <span style={{fontSize: "12px"}}
                      className={extraInfo === null || extraInfo === undefined ? 'd-none' : ''}>Причина: {extraInfo}</span>
            </>
        )
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
                        принимали участие дистанционно: голосов;
                        <br/>
                        принимали участие очно: голосов
                        <br/>
                        кворум ({isNaN(quorum) ? 0 : quorum}%)
                    </p>
                </div>
                {meetingStatus === PENDING ?
                    <div className="d-flex  justify-content-around align-items-end ">
                        <button className=" btn-meet px-4 py-2 rounded" onClick={() => startMeeting({
                            status: ACTIVE,
                            quorumCount: quorum
                        })}>Начать
                            заседание
                        </button>
                        <button className=" btn-meet-outline px-4 py-2 rounded"
                                onClick={() => startMeeting({
                                    status: CANCELED,
                                    quorumCount: quorum
                                })}>Отменить заседание
                        </button>
                    </div> : '' ||
                    meetingStatus === ACTIVE ?
                        <div className="d-flex  justify-content-around align-items-end ">
                            <button className="btn-meet px-4 py-2 rounded" onClick={() => startMeeting({
                                status: FINISH,
                                quorumCount: quorum
                            })}>
                                Завершить заседание
                            </button>
                            <button className=" btn-meet px-4 py-2 rounded" onClick={() => startMeeting({
                                status: PENDING,
                                quorumCount: quorum
                            })}>
                                Перенести заседание
                            </button>
                            <button className=" btn-meet-outline px-4 py-2 rounded"
                                    onClick={() => startMeeting({
                                        status: CANCELED,
                                        quorumCount: quorum
                                    })}>Отменить заседание
                            </button>
                        </div> : '' ||
                        meetingStatus === FINISH ?
                            <div>
                                <h4>Resultant</h4>
                                <Table hover>
                                    <thead>
                                    <tr>
                                        {/*<th style={{width: '15px'}}/>*/}
                                        <th className="text-center">Вопросы поставленные <br/> на голосование</th>
                                        <th className="text-center">
                                            Итого голосования
                                        </th>
                                        {/*<th className="text-center">Доклатчик</th>*/}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {agenda?.length !== 0 ?
                                        agenda?.map((element, index) => (
                                          <>
                                              <tr key={index}>
                                                  {/*<td className={"text-center"}>*/}
                                                  {/*    {index + 1}*/}
                                                  {/*</td>*/}
                                                  <td colSpan={'2'} className="text-center">{agendaSubjectAndVoting({
                                                      subject: element.subject,
                                                      speaker: element.userName,
                                                      extraInfo: element.extraInfo
                                                  })}</td>
                                                  {/*<td>*/}
                                                  {/*    За: 50 <br/>*/}
                                                  {/*    Против: 20 <br/>*/}
                                                  {/*    Воздержались: 25*/}
                                                  {/*</td>*/}
                                                  {/*<td className="text-center">{element.userName}</td>*/}
                                              </tr>
                                              {
                                                  element.votingOptions.map(elementVoting=>
                                                      <tr key={element.id}>
                                                          <td>{elementVoting.votingText}</td>
                                                          <td>
                                                              За: 50 <br/>
                                                              Против: 20 <br/>
                                                              Воздержались: 25
                                                          </td>
                                                          {/*<td className="text-center">{element.userName}</td>*/}
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
                            </div> :""
                }
            </div>
        </>
    )
}
