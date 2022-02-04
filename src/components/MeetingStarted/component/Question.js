import React, {useEffect, useState} from 'react'
import {AccordionQuestion} from "./Accordions/AccordionQuestion";
import {AvField, AvForm} from "availity-reactstrap-validation";
import * as meetingStartedAction from "../../../redux/actions/MeetingStartedAction";
import {useDispatch, useSelector} from "react-redux";
import {subscribe, unsubscribe} from "../../../redux/actions/socketActions";
import {ACTIVE, CANCELED, FINISH} from "../../../utils/contants";
import {toast} from "react-toastify";

export default function Question({list, userId, currentMeeting}) {

    const dispatch = useDispatch();
    const [logging, setLogging] = useState();

    const socketClient = useSelector((state) => state.socket.client);

    useEffect(() => {
        dispatch(subscribe('/topic/answer'));
        return () => {
            dispatch(unsubscribe('/topic/answer'));
        }
    }, [dispatch])

    async function responseQuestion(e, v) {
        if (currentMeeting?.status === FINISH) {
            return toast.error("Засидание в статусе - Заверщено!")
        }
        if (currentMeeting?.status === CANCELED) {
            return toast.error("Засидание в статусе - Отмена!")
        }
        // if (currentMeeting?.status === ACTIVE) {
        //     return toast.error("Засидание в статусе - Активный!")
        // }
        const data = {
            id: v.currentId,
            questionAnswer: logging,
            userId: userId
        }

        socketClient.sendMessage('/topic/question', JSON.stringify(data));

        if (v.checkbox) {
            dispatch(meetingStartedAction.editStatusQuestionAction({questionId: v.currentId}))
        }
    }

    function editQuestion(e, v) {
        responseQuestion(e, v).then(res => {
            setLogging("")
        })
    }

    return (
        <div style={{overflowY: 'scroll', height: '57vh'}}>
            <div className="header d-flex justify-content-center py-3">
                <text className=""><b>Поступающие вопросы от наблюдательного совета</b></text>
            </div>
            {list?.slice(0).reverse().map((element, index) =>
                <AccordionQuestion open={1}>
                    <AccordionQuestion.Item>
                        <AccordionQuestion.Header>
                            <div className="question" key={index}>
                                Savol: {element.questionText}
                            </div>
                            <div className="answer">
                                <span
                                    style={element.questionAnswer !== null ? {color: 'black'} : {color: 'red'}}>Javob</span>: {element.questionAnswer}
                            </div>
                        </AccordionQuestion.Header>
                        <AccordionQuestion.Body>
                            <AvForm onValidSubmit={editQuestion}>
                                <AvField
                                    type="text"
                                    name="questionAnswer"
                                    className="border"
                                    value={logging}
                                    onChange={(e) => setLogging(e.target.value)}
                                    placeholder={'Sizning javobibgiz'}
                                    style={{backgroundColor: '#FFFFFF'}}
                                />
                                <AvField
                                    type="text"
                                    name="currentId"
                                    className="d-none"
                                    value={element.id}
                                />
                                <div className="mt-2">
                                    <AvField
                                        type="checkbox"
                                        name="checkbox"
                                        label="Разместить для всех"
                                        className="border"
                                    />
                                </div>
                                <button className="btn create mt-2">Сохранить</button>
                            </AvForm>
                        </AccordionQuestion.Body>
                    </AccordionQuestion.Item>
                </AccordionQuestion>
            )}
        </div>
    )
}
