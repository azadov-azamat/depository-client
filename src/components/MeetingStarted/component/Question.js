import React, {useEffect, useRef, useState} from 'react'
import {AccordionQuestion} from "./Accordions/AccordionQuestion";
import {AvField, AvForm} from "availity-reactstrap-validation";
import {DEPOSITORY_CURRENT_MEETING, DEPOSITORY_USER, TOKEN} from "../../../utils/contants";
import * as meetingStartedAction from "../../../redux/actions/MeetingStartedAction";
import {useDispatch, useSelector} from "react-redux";
import {Pagination} from "@material-ui/lab";
import usePagination from "../../Dashboard/Pagination";
import {subscribe, unsubscribe} from "../../../redux/actions/socketActions";

export default function Question({list}) {
    const dispatch = useDispatch();

    const socketClient = useSelector((state) => state.socket.client);

    useEffect(() => {
        dispatch(subscribe('/topic/answer'));
        return () => {
            dispatch(unsubscribe('/topic/answer'));
        }
    }, [dispatch])

    function editQuestion(e, v) {
        const data = {
            id: v.currentId,
            questionAnswer: v.questionAnswer,
            userId: parseInt(localStorage.getItem(DEPOSITORY_USER))
        }
        socketClient.sendMessage('/topic/question', JSON.stringify(data));

        if (v.checkbox) {
            dispatch(meetingStartedAction.editStatusQuestionAction({questionId: v.currentId}))
        }
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
