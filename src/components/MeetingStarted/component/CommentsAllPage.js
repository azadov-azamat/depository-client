import React, {useEffect, useRef, useState} from "react";
import {Col, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import * as meetingStartedAction from "../../../redux/actions/MeetingStartedAction";
import {useDispatch, useSelector} from "react-redux";
import {
    AiOutlineFileExcel,
    AiOutlineFileImage,
    AiOutlineFilePdf,
    AiOutlineFileWord,
    AiOutlineVideoCameraAdd,
    BsFillImageFill
} from "react-icons/all";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import {BASE_URL} from "../../../utils/config";
import {api} from "../../../api/api";
import {
    CHAIRMAN,
    DEPOSITORY_CURRENT_MEETING,
    DEPOSITORY_CURRENT_MEMBER,
    DEPOSITORY_USER,
    SECRETARY,
    SPEAKER
} from "../../../utils/contants";
import {AvField, AvForm} from "availity-reactstrap-validation";
import {AccordionAnswersModal} from "./Accordions/AccordionAnswersModal";
import {css} from "@emotion/css";
import ScrollToBottom from "react-scroll-to-bottom";

export default function CommentsAllPage({data, roleMember}) {

    const dispatch = useDispatch();
    const reducers = useSelector(state => state)
    const {loggingList, questionLoading, questionList, questionListMemberId} = reducers.meetingStarted
    const {meetingFile, memberManagerState} = reducers.meeting
    const {currentUser} = reducers.auth
    const {companiesByUserId} = reducers.company
    const [booleanMy, setBooleanMy] = useState(false);
    const [openQuestionModal, setOpenQuestionModal] = useState(false);
    const [openAnswerModal, setOpenAnswerModal] = useState(false);

    useEffect(() => {
        dispatch(meetingStartedAction.getLoggingAction({meetingId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING))}))
        dispatch(meetingActions.getMeetingFilesByMeetingIdAction({meetingId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING))}))
        dispatch(meetingStartedAction.getQuestionByMeetingAction({meetingId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING))}))
        dispatch(meetingStartedAction.getQuestionByMemberIdAction({memberId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEMBER))}))

        companiesByUserId && companiesByUserId.forEach(element => {
            if (element.chairmanId === currentUser.id || element.secretaryId === currentUser.id) {
                setBooleanMy(true)
            }
        })
        dispatch(meetingActions.getMemberByMeetingId({meetingId: 14352}))
        memberManagerState && memberManagerState.forEach((element, index) => {
            if (element.userId === parseInt(localStorage.getItem(DEPOSITORY_USER))) {
                localStorage.setItem(DEPOSITORY_CURRENT_MEMBER, element.id)
            }
        })
    }, [])

    const ROOT_CSS = css({
        height: 140,
        width: 322
    });

    console.log(questionListMemberId)

    function fileTypeIcon(type) {

        const excel = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        const word = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        const pdf = "application/pdf";
        const video = 'video/mp4';
        const image = 'image/jpeg';
        const imgPNG = 'image/png';

        if (type === excel) {
            return <AiOutlineFileExcel fontSize={30} className='text-success'/>
        } else if (type === word) {
            return <AiOutlineFileWord fontSize={30} style={{color: '#132e85'}}/>
        } else if (type === pdf) {
            return <AiOutlineFilePdf fontSize={30} className='text-danger'/>
        } else if (type === imgPNG) {
            return <AiOutlineFileImage fontSize={30} className='text-info'/>
        } else if (type === image) {
            return <BsFillImageFill fontSize={30} style={{color: '#132e85'}}/>
        } else if (type === video) {
            return <AiOutlineVideoCameraAdd fontSize={30} className='text-warning'/>
        }
    }

    const style = {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whitespace: 'nowrap',
        width: '41vh',
        height: '29px'
    }

    function addQuestion(e, v) {
        const data = {
            meetingId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING)),
            memberId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEMBER)),
            questionText: v.questionText
        }
        console.log(data)
        dispatch(meetingStartedAction.addQuestionAction({data, setOpenQuestionModal}))
    }

    return (
        <>
            <div className="col-12 col-md-4 rounded mt-2">
                <div className="p-3 border d-flex flex-column meeting-info">
                    <div className="text-center">
                        <p>Инфармационное окно</p>
                    </div>
                    <div style={{overflowY: 'scroll'}}>
                        {loggingList && loggingList.slice(0).reverse().map((element, index) =>
                            <>
                                <span
                                    key={index}>{element.createdDate.substr(11, 5)} - {element.loggingText}</span><br/>
                            </>
                        )
                        }
                    </div>
                </div>
                <div className="documentationMeeting border p-3 d-flex flex-column mt-2">
                    <div className="text-center">
                        <p>Файлы заседания</p>
                    </div>
                    <div className="h-100" style={{overflowY: 'scroll'}}>
                        {meetingFile && meetingFile.length !== 0 ?
                            meetingFile && meetingFile.map((element, index) =>
                                <>
                                    <a href={BASE_URL + api.downloadFile + element.id} download key={index}
                                       className="text-dark border-0"
                                       style={{listStyleType: 'none'}}>{fileTypeIcon(element.contentType)} - {element.originalFileName}</a>
                                    <br/>
                                </>
                            ) : (
                                <div className='d-flex justify-content-center align-items-center'>
                                    <p>Ничего не найдена</p>
                                </div>
                            )
                        }
                    </div>
                </div>
                {roleMember === SECRETARY ||  roleMember === CHAIRMAN ? "" :
                    <div className={'questionNabMeeting text-center'}>
                        <button onClick={() => setOpenQuestionModal(true)} className="btn create mt-2 mb-1">
                            Задать вопрос организаторам
                        </button>
                        <button onClick={() => setOpenAnswerModal(true)} type="button"
                                className="btn cancel mt-2 position-relative">
                            Ответы на вопросы
                        </button>
                    </div>}
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
                                {questionListMemberId && questionListMemberId.map((element, index) =>
                                    <>
                                        <AccordionAnswersModal open={1} key={index}>
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
                                    </>
                                )}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="accordion" id="accordionExample" style={{overflowY: 'scroll'}}>
                                <span style={{fontWeight: 'bold'}}>Umumiy savollar</span>
                                {questionList && questionList.map((element, index) =>
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
