import React, {useEffect, useState} from "react";
import {Button, Card, CardBody, CardHeader, Col, Label, Row} from "reactstrap";
import {AvField, AvForm} from "availity-reactstrap-validation";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Select} from "antd";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import {BiCheckDouble, RiDeleteBinLine} from "react-icons/all";
import {confirmAlert} from "react-confirm-alert";
import {FIFTEENMIN, FIVEMIN, SPEAKER, TENMIN, TWENTYMIN, TWOMIN} from "../../../utils/contants";
import {FaPen} from "react-icons/fa";

const {Option} = Select;

export default function MeetingAgenda({currentMeeting}) {

    const history = useHistory();
    const dispatch = useDispatch();

    const reducers = useSelector(state => state)
    const {agendaState, memberManagerState, currentMemberManager} = reducers.meeting

    const [selectSpeaker, setSelectSpeaker] = useState();
    const [selectTime, setSelectTime] = useState();
    const [selectDebug, setSelectDebug] = useState();
    const [selectStatus, setSelectStatus] = useState();

    useEffect(() => {
        dispatch(meetingActions.getAgendaByMeetingId({meetingId: currentMeeting?.id}))
    }, [])

    const [inputList, setInputList] = useState([{variant: ""}]);

    const toInputUppercase = e => {
        e.target.value = ("" + e.target.value).toUpperCase();
    };

    // handle input change
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        const list = [...inputList];
        list[name] = value;
        setInputList(list);
    };

    const handleRemoveClick = index => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    const handleAddClick = () => {
        setInputList([...inputList, {variant: ""}]);
    };

    const setFile = (e, v) => {

        const keys = Object.entries(v)
        delete keys[0];

        let values = []

        keys.forEach(element => {
            values.push(element[1])
        })

        const data = {
            active: selectStatus,
            speakerId: selectSpeaker,
            debateEnum: selectDebug,
            meetingId: currentMeeting.id,
            speakTimeEnum: selectTime,
            subject: v.subject,
            typeEnum: 'MOST',
            variants: values
        }
        dispatch(meetingActions.addAgenda({data, history}))
    };

    function onSearch(val) {
        let field = '';
        if (parseInt(val)) {
            field = 'PINFL';
        } else {
            field = 'FULL_NAME'
        }
        if (val.length >= 3) {
            dispatch(meetingActions.getAgendaByMeetingId({value: val, field: field}))
        }
    }

    function forSpeaker(value) {
        setSelectSpeaker(value)
    }

    function forTime(value) {
        setSelectTime(value)
    }

    function forDebug(value) {
        setSelectDebug(value)
    }

    function forStatus(value) {
        setSelectStatus(value)
    }


    const submit = (currentAgendaId) => {
        confirmAlert({
            title: 'Удалить',
            message: 'Вы действительно хотите удалить в Пользователи?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => {
                        dispatch(meetingActions.deleteByIdAgenda({
                            currentAgendaId: currentAgendaId,
                            currentMeetingId: currentMeeting.id
                        }))
                    }

                },
                {
                    label: 'Нет',
                }
            ]
        });
    };

    function time(time) {
        if (time === TWOMIN) {
            return '2 минуты'
        } else if (time === FIVEMIN) {
            return "5 минуты"
        } else if (time === TENMIN) {
            return '10 минуты'
        } else if (time === FIFTEENMIN) {
            return '15 минуты'
        } else if (time === TWENTYMIN) {
            return '20 минуты'
        }
    }

    const timer = [
        {value: TWOMIN, text: '2 минуты'},
        {value: FIVEMIN, text: '5 минуты'},
        {value: TENMIN, text: '10 минуты'},
        {value: FIFTEENMIN, text: '15 минуты'},
        {value: TWENTYMIN, text: '20 минуты'},
    ]

    function agendaSubjectAndVoting({subject, votingLit}) {
        return (
            <>
                <p style={{fontWeight: 'bold'}}>{subject}</p>
                <hr/>
                {votingLit && votingLit.map((element, index) =>
                    <div className='text-start'><span key={index}>{index + 1} - {element.votingText}</span><br/></div>
                )}
            </>
        )
    }

    return (
        <>
            <AvForm onValidSubmit={setFile}>
                <Row>
                    <Col md={6}>
                        <div className="form-group">
                            <Label className='required_fields'>Вопрос</Label>
                            <AvField
                                type="text"
                                name="subject"
                                placeholder={'Ваш вопрос'}
                                style={{backgroundColor: '#FFFFFF'}}
                                required
                            />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="form-group">
                            <Label for="companySecretary">Учетная запись</Label>
                            <Select
                                className="setting_input w-100"
                                showSearch
                                placeholder="Выберите учетная запись"
                                optionFilterProp="children"
                                onChange={forSpeaker}
                                onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {memberManagerState && memberManagerState.map((username, index) =>
                                    username.memberTypeEnum === SPEAKER ?
                                        <Option key={index}
                                                value={username.id}>{username.user.fullName + " - " + username.user.pinfl}</Option> : ''
                                )}
                            </Select>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="d-md-inline-flex d-flex">
                        <div className=" col-4">
                            <div className="form-group">
                                <Label className='required_fields'>Время</Label>
                                <Select
                                    className="setting_input w-100"
                                    placeholder="Выберите время"
                                    optionFilterProp="children"
                                    onChange={forTime}
                                >
                                    {timer.map((element, index) =>
                                        <Option key={index} value={element.value}>{element.text}</Option>
                                    )}
                                </Select>
                            </div>
                        </div>
                        <div className="col-4  px-3">
                            <div className="form-group">
                                <Label className='required_fields'>Прения</Label>
                                <Select
                                    className="setting_input w-100"
                                    placeholder="Выберите прения"
                                    optionFilterProp="children"
                                    onChange={forDebug}
                                >
                                    {timer.map((element, index) =>
                                        <Option key={index} value={element.value}>{element.text}</Option>
                                    )}
                                </Select>
                            </div>
                        </div>

                        <div className="col-4">
                            <div className="form-group">
                                <Label className='required_fields'>Состояние</Label>
                                <Select
                                    className="setting_input w-100"
                                    placeholder="Выберите состояние"
                                    optionFilterProp="children"
                                    onChange={forStatus}
                                >
                                    <Option value={true}>Aктивно</Option>
                                    <Option value={false}>Неактивно</Option>
                                </Select>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} sm={12} className="mt-3">
                        <Card>
                            <CardHeader>
                                <div className="form-group">
                                    <Label className='required_fields'>Варианты голосования</Label>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Row className="d-flex align-items-center">
                                    {inputList.map((x, i) =>
                                        <>
                                            <Col md={8} className=''>
                                                <AvField
                                                    name={"variant/" + i}
                                                    label={i + 1 + " - Вариант"}
                                                    value={x.variant}
                                                    onInput={toInputUppercase}
                                                    onChange={
                                                        e => handleInputChange(e, i)}
                                                    className="variantAddedInput border border"
                                                    style={{backgroundColor: '#FFFFFF', fontWeight: "bold"}}
                                                    required
                                                />
                                            </Col>
                                            <Col md={4} className=''>
                                                <div className="float-end mt-4">
                                                    {inputList.length - 1 === i &&
                                                    <Button type="button" onClick={handleAddClick}
                                                            className="btn create">+</Button>}
                                                    {inputList.length !== 1 &&
                                                    <button type="button" onClick={() => handleRemoveClick(i)}
                                                            className="btn cancel mx-2">-</button>}
                                                </div>
                                            </Col>
                                        </>
                                    )}
                                </Row>
                            </CardBody>
                        </Card>
                        <button className="btn py-2 px-5 create">Создать</button>
                    </Col>
                </Row>
            </AvForm>
            <Row>
                <Col md={12} sm={12}>
                    <div className="d-flex justify-content-center mt-5 mb-5">
                        <table className="table table-hover table-bordered">
                            <>
                                <thead className="navUsers">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Докладчик</th>
                                    <th scope="col">Время</th>
                                    <th scope="col">Прения</th>
                                    <th scope="col">Вопрос | Решение</th>
                                    <th scope="col">Состояние</th>
                                    <th scope="col" style={{width: '0'}}>
                                        <BiCheckDouble fontSize={25} color={"green"}/>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="navUsers">
                                {agendaState && agendaState.length !== 0 ? agendaState.map((agenda, index) => (
                                        <tr key={index}>
                                            <td>
                                                <button
                                                    className='text-warning text-center bg-transparent border-0 m-0 p-0'>
                                                    <FaPen/>
                                                </button>
                                            </td>
                                            <td>{agenda.userName}</td>
                                            <td>{time(agenda.speakTimeEnum)}</td>
                                            <td>{time(agenda.debateEnum)}</td>
                                            <td>{agendaSubjectAndVoting({
                                                subject: agenda.subject,
                                                votingLit: agenda.votingOptions
                                            })}</td>
                                            <td>{agenda.active === true ? 'Aктивно' : 'Неактивно'}</td>
                                            <td>
                                                <button className="btn btn-link"
                                                        onClick={() => submit(agenda.id)}
                                                >
                                                    <RiDeleteBinLine color={"red"}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    <tr className='text-center'>
                                        <th colSpan="7">Ничего не найдена</th>
                                    </tr>
                                }
                                </tbody>
                            </>
                        </table>
                    </div>
                </Col>
            </Row>
        </>
    )
}
