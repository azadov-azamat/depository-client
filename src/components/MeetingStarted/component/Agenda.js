import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import * as meetingStarted from "../../../redux/actions/MeetingStartedAction";
import {confirmAlert} from "react-confirm-alert";
import {ACTIVE, CANCELED, CHAIRMAN, FINISH, PENDING, SECRETARY, SIMPLE} from "../../../utils/contants";
import {AccordionAgenda} from "./Accordions/AccordionAgenda";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import AgendaByVoting from "./components/AgendaByVoting";
import {BiCheckDouble} from "react-icons/all";
import {FaCheck, FaTimes} from "react-icons/fa";
import {Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import Text from "antd/es/typography/Text";
import {AccordionAnswersModal} from "./Accordions/AccordionAnswersModal";
import {AvField, AvForm} from "availity-reactstrap-validation";
import Loader from "react-loader-spinner";
import {toast} from "react-toastify";

export default function Agenda({agendas, lang, roleMember, meetingId, memberId, quorum, fromReestr, currentMeeting}) {

    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [currentAgenda, setCurrentAgenda] = useState([]);

    const loading = '';

    useEffect(() => {
        dispatch(meetingActions.getAgendaByMeetingId({meetingId: meetingId}))
    }, [meetingId])

    function editStatusElement(element) {
        if (currentMeeting?.status === FINISH) {
            return toast.error(lang("toast.statusMeeting.finish"))
        }
        if (currentMeeting?.status === CANCELED) {
            return toast.error(lang("toast.statusMeeting.canceled"))
        }
        if (currentMeeting?.status === ACTIVE) {
            return toast.error(lang("toast.statusMeeting.active"))
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
                title: lang("alert.updateStatus"),
                message: lang("alert.updateMsg"),
                buttons: [
                    {
                        label: lang("alert.yes"),
                        onClick: () => {
                            dispatch(meetingStarted.editStatusAgendaAction({data}))
                        }

                    },
                    {
                        label: lang("alert.no"),
                    }
                ]
            });
        }
    }

    function editAgendaStatusIsActive(e, v) {
        if (currentMeeting?.status === FINISH) {
            return toast.error(lang("toast.statusMeeting.finish"))
        }
        if (currentMeeting?.status === CANCELED) {
            return toast.error(lang("toast.statusMeeting.canceled"))
        }
        if (currentMeeting?.status === ACTIVE) {
            return toast.error(lang("toast.statusMeeting.active"))
        }
        const data = {
            id: currentAgenda.id,
            meetingId: meetingId,
            active: false,
            extraInfo: v.extraInfo
        }
        dispatch(meetingStarted.editStatusAgendaAction({data}))
        setOpenModal(false)
    }

    function agendaSubjectAndVoting({subject, votingList, extraInfo}) {
        return (
            <>
                <p style={{fontWeight: 'bold'}}>{subject}</p>
                <span style={{fontSize: "12px"}}
                      className={extraInfo === null || extraInfo === undefined ? 'd-none' : ''}>{lang("meetingStarted.cause")}: {extraInfo}</span>
                <hr/>
                {votingList?.map((element, index) =>
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
                                                    style={element.active ? {color: '#6B8C67FF'} : {color: '#CBCBC7FF'}}><b>{lang("meetingCreated.roles.speaker")}: {element.userName}</b></span>
                                            </div>
                                        </AccordionAgenda.Header>
                                        <AccordionAgenda.Body>
                                            {element.active ?
                                                element.votingOptions.map((elementOption, index) =>
                                                    <>
                                                        <div className="mt-2 container" key={index}>
                                                            {index === 0 ? <><span
                                                                style={{fontSize: '23px'}}>{lang("pages.agenda.solution")}:</span><br/></> : ""}
                                                            <span
                                                                style={{fontWeight: 'bold'}}>{elementOption.votingText}</span>
                                                        </div>
                                                        <AgendaByVoting quorum={quorum} agenda={element} lang={lang}
                                                                        variant={elementOption}
                                                                        memberId={memberId} meetingId={meetingId}
                                                                        currentMeeting={currentMeeting}
                                                        />
                                                    </>
                                                ) :
                                                <span>{lang("meetingStarted.cause")}: {element.extraInfo}</span>
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
                                        style={{width: '20vh'}}>{element.active ? lang("meetingStarted.disable") : lang("meetingStarted.turnOn")}</button>
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
                                        style={{width: '20vh'}}>{element.active ? lang("meetingStarted.disable") : lang("meetingStarted.turnOn")}</button>
                            </div>
                        ) :
                        roleMember === SIMPLE ?
                            agendas?.map((element, index) =>
                                <div className="mt-2">
                                    <AccordionAgenda open={1}>
                                        <AccordionAgenda.Item>
                                            <AccordionAgenda.Header status={element.active}>
                                                <div className="agenda" key={index}>
                                                    <span
                                                        style={element.active ? {} : {color: '#CBCBC7FF'}}><b>{element.subject}</b></span><br/>
                                                    <span
                                                        style={element.active ? {color: '#6B8C67FF'} : {color: '#CBCBC7FF'}}><b>{lang("meetingCreated.roles.speaker")}: {element.userName}</b></span>
                                                </div>
                                            </AccordionAgenda.Header>
                                            <AccordionAgenda.Body>
                                                {element.active ?
                                                    element.votingOptions.map((elementOption, index) =>
                                                        <>
                                                            <div className="mt-2 container" key={index}>
                                                                {index === 0 ? <><span
                                                                    style={{fontSize: '23px'}}>{lang("pages.agenda.solution")}:</span><br/></> : ""}
                                                                <span
                                                                    style={{fontWeight: 'bold'}}>{elementOption.votingText}</span>
                                                            </div>
                                                            <AgendaByVoting quorum={quorum} agenda={element}
                                                                            variant={elementOption}
                                                                            memberId={memberId} meetingId={meetingId}/>
                                                        </>
                                                    ) :
                                                    <span>{lang("meetingStarted.cause")}: {element.extraInfo}</span>
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
                                                <th scope="col" className="w-25">{lang("meetingCreated.roles.speaker")}</th>
                                                <th scope="col">{lang("pages.agenda.question")} | {lang("pages.agenda.solution")}</th>
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
                                                            votingList: agenda.votingOptions,
                                                            extraInfo: agenda.extraInfo
                                                        })}</td>
                                                        <td className="text-center">{agenda.active ?
                                                            <span className="text-success"> <FaCheck/></span> :
                                                            <span className="text-danger"><FaTimes/></span>}</td>
                                                    </tr>
                                                ))
                                                :
                                                <tr className='text-center'>
                                                    <th colSpan="5">{lang("meetingCreated.emptyList")}</th>
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
                    <h3>{lang("alert.updateStatus")}</h3>
                </ModalHeader>
                <ModalBody className='container-fluid'>
                    <AvForm onValidSubmit={editAgendaStatusIsActive}>
                        <AvField
                            type="textarea"
                            name="extraInfo"
                            label={lang("meetingStarted.navbar.comment")}
                            placeholder={lang("meetingCreated.placeholders.enterDescription")}
                            className="border"
                            style={{backgroundColor: '#FFFFFF', resize: 'none', height: '30vh'}}
                            required
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
                            <button className="btn create mt-2">{lang("meetingStarted.confirm")}</button>
                        }
                    </AvForm>
                </ModalBody>
            </Modal>
        </div>
    )
}
