import React from 'react'
import {useDispatch} from "react-redux";
import * as meetingStarted from "../../../redux/actions/MeetingStartedAction";
import {confirmAlert} from "react-confirm-alert";
import {
    AGAINST, CHAIRMAN,
    DEPOSITORY_CURRENT_MEETING,
    DEPOSITORY_CURRENT_MEMBER,
    FOR,
    REFRAIN,
    SECRETARY
} from "../../../utils/contants";
import {AccordionAgenda} from "./Accordions/AccordionAgenda";
import {Button} from "reactstrap";

export default function DayPlan({agendaSubject, roleMember}) {

    const dispatch = useDispatch();

    function editStatusElement(id) {
        const data = {
            id: id,
            meetingId: agendaSubject.meetingId
        }

        confirmAlert({
            title: 'Удалить',
            message: 'Вы действительно хотите?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => {
                        dispatch(meetingStarted.editStatusAgendaAction({data}))
                    }

                },
                {
                    label: 'Нет',
                }
            ]
        });
    }

    const addBallot = ({votingId, option, agendaId}) => {
        confirmAlert({
            title: 'Проголосовать',
            message: 'Вы действительно хотите удалить в компанию?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => {
                        const data = {
                            agendaId: agendaId,
                            meetingId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING)),
                            memberId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEMBER)),
                            options: option,
                            votingOptionId: votingId
                        }
                        dispatch(meetingStarted.addBallotAction({data}))
                    }
                },
                {
                    label: 'Нет',
                }
            ]
        });
    };

    return (
        <div style={{overflowY: 'scroll', height: roleMember === CHAIRMAN || roleMember === SECRETARY ? '57vh' : "75vh"}}>
            <div className="header d-flex justify-content-center py-3">
                <text className=""><b>Повестка дня</b></text>
            </div>
            {
                roleMember === CHAIRMAN || roleMember === SECRETARY ?
                    agendaSubject && agendaSubject.map((element, index) =>
                            <div key={index}
                                 className={element.active ? 'questions p-2 mb-3 d-flex justify-content-between w-100 align-items-center shadow' : 'questions border p-2 mb-3 d-flex justify-content-between w-100 align-items-center'}
                                 style={{height: '10vh'}}>
                    <span
                        className="text-me d-flex align-items-center justify-content-between"> {element.subject}</span>
                                <button onClick={() => editStatusElement(element.id)} className='btn create py-2'
                                        style={{width: '20vh'}}>{element.active ? "Включить" : "Отключить"}</button>
                            </div>
                    ) :
                    agendaSubject && agendaSubject.map((element, index) =>
                        element.active ?
                            <AccordionAgenda open={1}>
                                <AccordionAgenda.Item>
                                    <AccordionAgenda.Header>
                                        <div className="agenda" key={index}>
                                            <span style={{fontSize: '20px'}}>{element.subject}</span><br/>
                                            <span><b>Доклатчик: {element.userName}</b></span>
                                        </div>
                                    </AccordionAgenda.Header>
                                    <AccordionAgenda.Body>
                                        {element.votingOptions.map((elementOption, index) =>
                                            <>
                                                <div className="mt-2 container" key={index}>
                                                    {index === 0 ? <><span
                                                        style={{fontSize: '23px'}}>Решения:</span><br/></> : ""}
                                                    <span style={{fontWeight: 'bold'}}>{elementOption.votingText}</span>
                                                </div>
                                                <div className="container d-flex justify-content-center align-items-center">
                                                    <Button style={{width: "33%"}} color={"success"}
                                                            className="text-white" onClick={() =>
                                                        addBallot({
                                                            votingId: elementOption.id,
                                                            option: FOR,
                                                            agendaId: element.id
                                                        })}>
                                                        За
                                                    </Button>
                                                    <Button style={{width: "33%"}} color={"danger"}
                                                            onClick={() => addBallot({
                                                                votingId: elementOption.id,
                                                                option: REFRAIN,
                                                                agendaId: element.id
                                                            })}
                                                            className='mx-2'>Против</Button>
                                                    <Button style={{width: "33%"}}
                                                            onClick={() => addBallot({
                                                                votingId: elementOption.id,
                                                                option: AGAINST,
                                                                agendaId: element.id
                                                            })}
                                                    >Воздержался</Button>
                                                </div>
                                            </>
                                        )}
                                    </AccordionAgenda.Body>
                                </AccordionAgenda.Item>
                            </AccordionAgenda> : ""
                    )
            }
        </div>
    )
}
