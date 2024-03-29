import React, {useEffect, useState} from "react";
import {Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import * as meetingStartedAction from "../../../redux/actions/MeetingStartedAction";
import {useDispatch, useSelector} from "react-redux";
import {
    AiOutlineFileExcel,
    AiOutlineFileImage,
    AiOutlineFilePdf,
    AiOutlineFileWord,
    AiOutlineVideoCameraAdd,
    BsFillFileEarmarkImageFill, FaRegFileAudio, FaRegFileVideo, MdOutlineFilePresent, VscJson
} from "react-icons/all";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import {BASE_URL} from "../../../utils/config";
import {api} from "../../../api/api";
import {ACTIVE, CANCELED, CHAIRMAN, FINISH, SECRETARY} from "../../../utils/contants";
import {AvField, AvForm} from "availity-reactstrap-validation";
import {AccordionAnswersModal} from "./Accordions/AccordionAnswersModal";
import {subscribe, unsubscribe} from "../../../redux/actions/socketActions";
import Text from "antd/es/typography/Text";
import {toast} from "react-toastify";

export default function CommentsAllPage({
                                            roleMember,
                                            list,
                                            loggingList,
                                            meetingFile,
                                            questionListMemberId,
                                            currentMeetingId,
                                            memberId,
                                            fromReestr,
                                            currentMeeting
                                        }) {

    const dispatch = useDispatch();

    const [openQuestionModal, setOpenQuestionModal] = useState(false);
    const [openAnswerModal, setOpenAnswerModal] = useState(false);

    const socketClient = useSelector((state) => state.socket.client);

    useEffect(() => {
        dispatch(subscribe('/topic/answer/' + currentMeetingId));
        return () => {
            dispatch(unsubscribe('/topic/answer/'+currentMeetingId));
        }
    }, [dispatch])

    useEffect(() => {
        dispatch(meetingStartedAction.getLoggingAction({meetingId: currentMeetingId}))
        dispatch(meetingActions.getMeetingFilesByMeetingIdAction({meetingId: currentMeetingId}))
        dispatch(meetingStartedAction.getQuestionByMemberIdAction({memberId: memberId}));

    }, [currentMeetingId])

    function fileTypeIcon(type) {

        const excel = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        const word = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        const presentation = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        const jsonFile = "application/json";
        const pdf = "application/pdf";
        const video = 'video/mp4';
        const audioMpeg = 'audio/mpeg';
        const image = 'image/jpeg';
        const imgPNG = 'image/png';

        if (type === excel) {
            return <AiOutlineFileExcel fontSize={30} className='text-success'/>
        } else if (type === word) {
            return <AiOutlineFileWord fontSize={30} style={{color: '#132e85'}}/>
        } else if (type === pdf) {
            return <AiOutlineFilePdf fontSize={30} className='text-danger'/>
        } else if (type === imgPNG) {
            return <BsFillFileEarmarkImageFill fontSize={30} className='text-info'/>
        } else if (type === image) {
            return <AiOutlineFileImage fontSize={30} style={{color: '#132e85'}}/>
        } else if (type === video) {
            return <FaRegFileVideo fontSize={30} className='text-dark'/>
        }else if (type === jsonFile){
            return <VscJson fontSize={30} className='text-warning'/>
        }else if (type === audioMpeg){
            return <FaRegFileAudio fontSize={30} className='text-danger'/>
        }else if (type === presentation){
            return <MdOutlineFilePresent fontSize={30} className='text-danger'/>
        }
    }

    async function getRequest(e, v) {
        if (currentMeeting?.status === FINISH) {
            return toast.error("Засидание в статусе - Заверщено!")
        }
        if (currentMeeting?.status === CANCELED) {
            return toast.error("Засидание в статусе - Отмена!")
        }

        const data = {
            meetingId: currentMeetingId,
            memberId: memberId,
            questionText: v.questionText
        }
        socketClient.sendMessage('/topic/question', JSON.stringify(data));
    }

    function addQuestion(e, v) {
        getRequest(e, v).then(res => {
            dispatch(meetingStartedAction.getQuestionByMemberIdAction({memberId: memberId}));
            setOpenQuestionModal(false)
        })
    }

    return (
        <>
            <div className="col-12 col-md-4 rounded mt-2">
                <div className="p-3 border d-flex flex-column meeting-info">
                    <div className="text-center">
                        <p>Инфармационное окно</p>
                    </div>
                    <div style={{overflowY: 'scroll'}}>
                        {
                            loggingList?.slice(0).reverse().map((element) => {
                                let date = new Date(element.createdDate);
                                return (
                                    <Text key={element.id}>
                                        <span>{(date.getHours().toString().length === 1 ? ("0" + date.getHours()) : date.getHours()) + ":" + (date.getMinutes().toString().length === 1 ? ("0" + date.getMinutes()) : date.getMinutes())} - {element.loggingText}</span><br/>
                                    </Text>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="documentationMeeting border p-3 d-flex flex-column mt-2">
                    <div className="text-center">
                        <p>Файлы заседания</p>
                    </div>
                    <div className="h-100" style={{overflowY: 'scroll'}}>
                        {meetingFile?.length !== 0 ?
                            meetingFile?.map((element, index) =>
                                <Text key={index}>
                                    <a href={BASE_URL + api.downloadFile + element.id} download
                                       className="text-dark border-0"
                                       style={{listStyleType: 'none'}}>{fileTypeIcon(element.contentType)} - {element.originalFileName}</a>
                                    <br/>
                                </Text>
                            ) : (
                                <div className='d-flex justify-content-center align-items-center'>
                                    <p>Ничего не найдена</p>
                                </div>
                            )
                        }
                    </div>
                </div>
                {
                    roleMember === CHAIRMAN ?
                        fromReestr ?
                            <div className={'questionNabMeeting text-center'}>
                                <button onClick={() => setOpenQuestionModal(true)} className="btn create mt-2 mb-1">
                                    Задать вопрос организаторам
                                </button>
                                <button onClick={() => setOpenAnswerModal(true)} type="button"
                                        className="btn cancel mt-2 position-relative">
                                    Ответы на вопросы
                                </button>
                            </div>
                            : ""
                        :
                        roleMember === SECRETARY ? ''
                            :
                            <div className={'questionNabMeeting text-center'}>
                                <button onClick={() => setOpenQuestionModal(true)} className="btn create mt-2 mb-1">
                                    Задать вопрос организаторам
                                </button>
                                <button onClick={() => setOpenAnswerModal(true)} type="button"
                                        className="btn cancel mt-2 position-relative">
                                    Ответы на вопросы
                                </button>
                            </div>
                }
            </div>
            <Modal isOpen={openQuestionModal} centered>
                <ModalHeader toggle={() => setOpenQuestionModal(!openQuestionModal)}
                             className="d-flex align-items-center">
                    <h3>Задать вопрос организаторам</h3>
                </ModalHeader>
                <ModalBody>
                    <div className="container">
                        <AvForm onValidSubmit={addQuestion}>
                            <AvField
                                type="textarea"
                                name="questionText"
                                label="Ваш вопрос"
                                className="border"
                                style={{backgroundColor: '#FFFFFF', resize: 'none', height: '20vh'}}
                            />
                            <button className="btn create m-2 float-end">Отправить</button>
                        </AvForm>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={openAnswerModal} className="modal-dialog modal-lg">
                <ModalHeader toggle={() => setOpenAnswerModal(!openAnswerModal)}
                             className="d-flex align-items-center">
                    <h3>Ответы</h3>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md={6}>
                            <div className="accordion" id="accordionExample" style={{overflowY: 'scroll'}}>
                                <span style={{fontWeight: 'bold'}}>Sizning savollaringiz:</span>
                                {questionListMemberId && questionListMemberId.map(element =>
                                    <Text key={element.id}>
                                        <AccordionAnswersModal open={1}>
                                            <AccordionAnswersModal.Item>
                                                <AccordionAnswersModal.Header style={element.questionAnswer}>
                                                    {element.questionText}
                                                </AccordionAnswersModal.Header>
                                                <AccordionAnswersModal.Body>
                                                    {element.questionAnswer === null ?
                                                        "Ничего не найдена" : element.questionAnswer
                                                    }
                                                </AccordionAnswersModal.Body>
                                            </AccordionAnswersModal.Item>
                                        </AccordionAnswersModal>
                                    </Text>
                                )}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="accordion" id="accordionExample" style={{overflowY: 'scroll'}}>
                                <span style={{fontWeight: 'bold'}}>Umumiy savollar</span>
                                {list && list.map((element, index) =>
                                    element.active === true ?
                                        <AccordionAnswersModal open={1} key={index}>
                                            <AccordionAnswersModal.Item>
                                                <AccordionAnswersModal.Header>
                                                    {element.questionText}
                                                </AccordionAnswersModal.Header>
                                                <AccordionAnswersModal.Body>
                                                    {element.questionAnswer === null ?
                                                        "bunga xali javob berishmadi" : element.questionAnswer
                                                    }
                                                </AccordionAnswersModal.Body>
                                            </AccordionAnswersModal.Item>
                                        </AccordionAnswersModal> : ''
                                )}
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </>
    )
}
