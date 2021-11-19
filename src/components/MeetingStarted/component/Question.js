import React, {useEffect, useRef, useState} from 'react'
import {AccordionQuestion} from "./Accordions/AccordionQuestion";
import {AvField, AvForm} from "availity-reactstrap-validation";
import {DEPOSITORY_CURRENT_MEETING, DEPOSITORY_USER} from "../../../utils/contants";
import * as meetingStartedAction from "../../../redux/actions/MeetingStartedAction";
import {useDispatch, useSelector} from "react-redux";
import {Pagination} from "@material-ui/lab";
import usePagination from "../../Dashboard/Pagination";
import SockJsClient from "react-stomp";

export default function Question() {

    const dispatch = useDispatch();
    let clientRef = useRef(null);
    const reducers = useSelector(state => state)
    const {questionLoading, questionList, loadingLogging} = reducers.meetingStarted
    const {payload} = reducers.auth.totalCount

    const [page, setPage] = useState(1);

    const size = 10;
    const count = Math.ceil(payload && payload[0] / size);
    const _DATA = usePagination(questionList && questionList, size);

    const startIndex = (page - 1) * size;
    const lastIndex = startIndex + (payload && payload[1]);

    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    useEffect(() => {
        dispatch(meetingStartedAction.getQuestionByMeetingAction({
            meetingId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING)),
            page,
            size
        }))
    }, [page])

    function editQuestion(e, v) {
        const data = {
            id: v.currentId,
            questionAnswer: v.questionAnswer,
            userId: parseInt(localStorage.getItem(DEPOSITORY_USER))
        }
        clientRef.sendMessage('/topic/question', JSON.stringify(data));
        // dispatch(meetingStartedAction.editQuestionAction({data}))
        if (v.checkbox) {
            dispatch(meetingStartedAction.editStatusQuestionAction({questionId: v.currentId}))
        }
    }

    return (
        <div style={{overflowY: 'scroll', height: '57vh'}}>
            <div className="header d-flex justify-content-center py-3">
                <text className=""><b>Поступающие вопросы от наблюдательного совета</b></text>
            </div>
            {questionList?.slice(0).reverse().map((element, index) =>
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
            <Pagination
                count={count}
                size="large"
                page={page}
                color="primary"
                variant="outlined"
                shape="rounded"
                className={payload && payload[0] === '0' ? 'd-none' : ''}
                onChange={handleChange}
                showFirstButton showLastButton
            />
            <SockJsClient
                url={"https://depositary.herokuapp.com:443/websocket/question/"}
                topics={['/topic/answer']}
                onConnect={() => console.log("Connected")}
                onDisconnect={() => console.log("Disconnected")}
                onMessage={(msg) => {
                    console.log(msg)
                    dispatch({
                        type: 'REQUEST_SUCCESS_QUESTION_LIST',
                        payload: msg
                    })
                    dispatch(meetingStartedAction.getQuestionByMeetingAction({
                        meetingId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING)),
                        page,
                        size
                    }))
                }}
                ref={(client) => {
                    clientRef = client
                }}
            />
        </div>
    )
}
