import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import * as meetingStarted from "../../../redux/actions/MeetingStartedAction";
import {confirmAlert} from "react-confirm-alert";
import {ACTIVE, CANCELED, CHAIRMAN, FINISH, SECRETARY, SIMPLE} from "../../../utils/contants";
import {AccordionAgenda} from "./Accordions/AccordionAgenda";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import AgendaByVoting from "./AgendaByVoting";
import {BiCheckDouble} from "react-icons/all";
import {FaCheck, FaTimes} from "react-icons/fa";
import {Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import Text from "antd/es/typography/Text";
import {AccordionAnswersModal} from "./Accordions/AccordionAnswersModal";
import {AvField, AvForm} from "availity-reactstrap-validation";
import Loader from "react-loader-spinner";
import {toast} from "react-toastify";

export default function Agenda({agendas, roleMember, meetingId, memberId, quorum, fromReestr, currentMeeting}) {

    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [currentAgenda, setCurrentAgenda] = useState([]);

    const loading = '';

    useEffect(() => {
        dispatch(meetingActions.getAgendaByMeetingId({meetingId: meetingId}))
    }, [meetingId])

    function editStatusElement(element) {
        if (currentMeeting?.status === FINISH){
            return toast.error("Засидание в статусе - Заверщено!")
        }
        if (currentMeeting?.status === CANCELED){
            return toast.error("Засидание в статусе - Отмена!")
        }
        if (currentMeeting?.status === ACTIVE){
            return toast.error("Засидание в статусе - Активный!")
        }
        if (element.active) {
            setCurrentAgenda(element)
            setOpenModal(true)
        } else {
            const data = {
                id: element.id,
                meetingId: meetingId,
                active: true
            }

            confirmAlert({
                title: 'Изменить статус',
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
    }

    function editAgendaStatusIsActive(e, v) {
        const data = {
            id: currentAgenda.id,
            meetingId: meetingId,
            active: false,
            extraInfo: v.extraInfo
        }
        dispatch(meetingStarted.editStatusAgendaAction({data}))
        setOpenModal(false)
    }

    function agendaSubjectAndVoting({subject, votingLit, extraInfo}) {
        return (
            <>
                <p style={{fontWeight: 'bold'}}>{subject}</p>
                <span style={{fontSize: "12px"}}
                      className={extraInfo === null || extraInfo === undefined ? 'd-none' : ''}>Причина: {extraInfo}</span>
                <hr/>
                {votingLit && votingLit.map((element, index) =>
                    <div className='text-start'><span key={index}>{index + 1} - {element.votingText}</span><br/></div>
                )}
            </>
        )
    }

    return (
        <div style={{
            overflowY: 'scroll',
            height: roleMember === CHAIRMAN || roleMember === SECRETARY ? '57vh' : "75vh"
        }}>
            {
                roleMember === CHAIRMAN ?
                    fromReestr ?
                        agendas?.map((element, index) =>
                            <div className="mt-2">
                                <AccordionAgenda open={1}>
                                    <AccordionAgenda.Item>
                                        <AccordionAgenda.Header status={element.active}>
                                            <div className="agenda" key={index}>
                                                <span
                                                    style={element.active ? {} : {color: '#CBCBC7FF'}}><b>{element.subject}</b></span><br/>
                                                <span
                                                    style={element.active ? {color: '#6B8C67FF'} : {color: '#CBCBC7FF'}}><b>Доклатчик: {element.userName}</b></span>
                                            </div>
                                        </AccordionAgenda.Header>
                                        <AccordionAgenda.Body>
                                            {element.active ?
                                                element.votingOptions.map((elementOption, index) =>
                                                    <>
                                                        <div className="mt-2 container" key={index}>
                                                            {index === 0 ? <><span
                                                                style={{fontSize: '23px'}}>Решения:</span><br/></> : ""}
                                                            <span
                                                                style={{fontWeight: 'bold'}}>{elementOption.votingText}</span>
                                                        </div>
                                                        <AgendaByVoting quorum={quorum} agenda={element}
                                                                        variant={elementOption}
                                                                        memberId={memberId} meetingId={meetingId}/>
                                                    </>
                                                ) :
                                                <span>Причина: {element.extraInfo}</span>
                                            }
                                        </AccordionAgenda.Body>
                                    </AccordionAgenda.Item>
                                </AccordionAgenda>
                            </div>
                        )
                        :
                        agendas?.map((element, index) =>
                            <div key={index}
                                 className={element.active ? 'questions p-2 mb-3 d-flex justify-content-between w-100 align-items-center shadow' : 'questions border p-2 mb-3 d-flex justify-content-between w-100 align-items-center'}>
                            <span
                                className="text-me d-flex align-items-center justify-content-between"><b
                                style={element.active ? {color: '#198754'} : {color: '#bb2d3b'}}>{element.subject}</b></span>
                                <button onClick={() => editStatusElement(element)} className='btn create py-2'
                                        style={{width: '20vh'}}>{element.active ? "Отключить" : "Включить"}</button>
                            </div>
                        )
                    :
                    roleMember === SECRETARY ?
                        agendas?.map((element, index) =>
                            <div key={index}
                                 className={element.active ? 'questions p-2 mb-3 d-flex justify-content-between w-100 align-items-center shadow' : 'questions border p-2 mb-3 d-flex justify-content-between w-100 align-items-center'}>
                            <span
                                className="text-me d-flex align-items-center justify-content-between"><b
                                style={element.active ? {color: '#198754'} : {color: '#bb2d3b'}}>{element.subject}</b></span>
                                <button onClick={() => editStatusElement(element)} className='btn create py-2'
                                        style={{width: '20vh'}}>{element.active ? "Отключить" : "Включить"}</button>
                            </div>
                        ) :
                        roleMember === SIMPLE ?
                            agendas?.map((element, index) =>
                                <div className="mt-2">
                                    <AccordionAgenda open={1}>
                                        <AccordionAgenda.Item>
                                            <AccordionAgenda.Header status={element.active}>
                                                <div className="agenda" key={index}>
                                                <span style={element.active ? {} : {color: '#CBCBC7FF'}}><b>{element.subject}</b></span><br/>
                                                    <span
                                                        style={element.active ? {color: '#6B8C67FF'} : {color: '#CBCBC7FF'}}><b>Доклатчик: {element.userName}</b></span>
                                                </div>
                                            </AccordionAgenda.Header>
                                            <AccordionAgenda.Body>
                                                {element.active ?
                                                    element.votingOptions.map((elementOption, index) =>
                                                        <>
                                                            <div className="mt-2 container" key={index}>
                                                                {index === 0 ? <><span
                                                                    style={{fontSize: '23px'}}>Решения:</span><br/></> : ""}
                                                                <span
                                                                    style={{fontWeight: 'bold'}}>{elementOption.votingText}</span>
                                                            </div>
                                                            <AgendaByVoting quorum={quorum} agenda={element}
                                                                            variant={elementOption}
                                                                            memberId={memberId} meetingId={meetingId}/>
                                                        </>
                                                    ) :
                                                    <span>Причина: {element.extraInfo}</span>
                                                }
                                            </AccordionAgenda.Body>
                                        </AccordionAgenda.Item>
                                    </AccordionAgenda>
                                </div>
                            ) :
                            <>
                                <div className="d-flex justify-content-center">
                                    <table className="table table-hover table-bordered">
                                        <>
                                            <thead className="navUsers">
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col" className="w-25">Докладчик</th>
                                                <th scope="col">Вопрос | Решение</th>
                                                <th scope="col" style={{width: '0'}}>
                                                    <BiCheckDouble fontSize={25} color={"green"}/>
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className="">
                                            {agendas?.length !== 0 ?
                                                agendas?.map((agenda, index) => (
                                                    <tr key={index}>
                                                        <td className={"text-center"}>
                                                            {index + 1}
                                                        </td>
                                                        <td className="text-center">{agenda.userName}</td>
                                                        <td>{agendaSubjectAndVoting({
                                                            subject: agenda.subject,
                                                            votingLit: agenda.votingOptions,
                                                            extraInfo: agenda.extraInfo
                                                        })}</td>
                                                        <td className="text-center">{agenda.active ?
                                                            <span className="text-success"> <FaCheck/></span> :
                                                            <span className="text-danger"><FaTimes/></span>}</td>
                                                    </tr>
                                                ))
                                                :
                                                <tr className='text-center'>
                                                    <th colSpan="5">Ничего не найдена</th>
                                                </tr>
                                            }
                                            </tbody>
                                        </>
                                    </table>
                                </div>
                            </>
            }
            <Modal isOpen={openModal} className="modal-dialog modal-md">
                <ModalHeader toggle={() => setOpenModal(!openModal)}
                             className="d-flex align-items-center">
                    <h3>Вы действительно хотите изменить статус?</h3>
                </ModalHeader>
                <ModalBody className='container-fluid'>
                    <AvForm onValidSubmit={editAgendaStatusIsActive}>
                        <AvField
                            type="textarea"
                            name="extraInfo"
                            label="Комментирование"
                            className="border"
                            // value={logging}
                            // onChange={(e) => setLogging(e.target.value)}
                            style={{backgroundColor: '#FFFFFF', resize: 'none', height: '30vh'}}
                        />
                        {loading ?
                            <div className="d-flex align-items-center justify-content-center" style={{
                                width: '8em', height: '44px', background: '#133B88', borderRadius: '6px',
                                marginTop: '4px'
                            }}>
                                <Loader
                                    type="ThreeDots"
                                    color="white"
                                    height={30}
                                    width={30}
                                />
                            </div>
                            :
                            <button className="btn create mt-2">Подтвердит</button>
                        }
                    </AvForm>
                </ModalBody>
            </Modal>
        </div>
    )
}
