import React, {useEffect, useState} from "react";
import {Button, Card, CardBody, CardHeader, Col, Label, Modal, ModalBody, Row} from "reactstrap";
import {AvField, AvForm, AvInput} from "availity-reactstrap-validation";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Select} from "antd";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import * as meetingStartedActions from "../../../redux/actions/MeetingStartedAction";
import {BiCheckDouble, RiDeleteBinLine} from "react-icons/all";
import {confirmAlert} from "react-confirm-alert";
import {FIFTEENMIN, FIVEMIN, SPEAKER, TENMIN, TWENTYMIN, TWOMIN} from "../../../utils/contants";
import {FaPen} from "react-icons/fa";
import {element} from "prop-types";
import {toast} from "react-toastify";

const {Option} = Select;

export default function MeetingAgenda({currentMeetingId, lang}) {

    const history = useHistory();
    const dispatch = useDispatch();

    const reducers = useSelector(state => state)
    const {agendaState, memberManagerState} = reducers.meeting

    const [selectSpeaker, setSelectSpeaker] = useState(null);
    const [selectTime, setSelectTime] = useState(null);
    const [selectDebug, setSelectDebug] = useState(null);
    const [selectStatus, setSelectStatus] = useState(true);
    const [changeSubject, setChangeSubject] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [inputList, setInputList] = useState([{variant: ""}]);

    const [currentAgenda, setCurrentAgenda] = useState([]);
    const [currentVariants, setCurrentVariants] = useState([]);
    const [editedVariant, setEditedVariant] = useState([]);
    const [currentSpeaker, setCurrentSpeaker] = useState(null);
    const [currentTime, setCurrentTime] = useState(null);
    const [currentDebut, setCurrentDebut] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(false);

    useEffect(() => {
        dispatch(meetingActions.getMemberByMeetingId({meetingId: currentMeetingId, fromReestr: false}))
    }, [agendaState])

    useEffect(() => {
        dispatch(meetingActions.getAgendaByMeetingId({meetingId: currentMeetingId}))
    }, [currentMeetingId])

    useEffect(() => {
        setCurrentSpeaker(currentAgenda?.speakerId);
        setCurrentTime(currentAgenda?.speakTimeEnum);
        setCurrentDebut(currentAgenda?.debateEnum);
        setCurrentStatus(currentAgenda?.active)

    }, [currentAgenda])

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

    const handleInputChangeEdited = (e) => {
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

    const handleAddClickEdit = () => {
        setCurrentVariants([...currentVariants, {votingText: ""}]);
    };

    const handleRemoveClickEdit = index => {
        const list = [...currentVariants];
        list.splice(index, 1);
        setCurrentVariants(list);
    };

    const addAgenda = (e, v) => {
        if (v.subject && selectDebug && selectTime) {
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
                meetingId: currentMeetingId,
                speakTimeEnum: selectTime,
                subject: v.subject,
                typeEnum: 'MOST',
                variants: values
            }
            dispatch(meetingActions.addAgenda({data, history, toast})).then(res => {
                setSelectSpeaker(null);
                setSelectTime(null);
                setSelectDebug(null);
                setSelectStatus(true);
                setChangeSubject('')
                for (let i = 0; i < inputList.length; i++) {
                    const list = [...inputList];
                    list.splice(i, inputList.length);
                    setInputList(list);
                }
                setInputList([{variant: ''}])
            })
        } else {
            toast.warning(lang("toast.warning"))
        }
    };

    function editAgenda(e, v) {
        console.log(v);
        if (currentDebut && currentTime && v.subject) {
            const keys = Object.entries(v)
            delete keys[0];

            let values = []

            keys.forEach(element => {
                values.push({id: parseInt(element[0].substr(8, (element[0].length - 1))), votingText: element[1]})
            })

            const data = {
                id: currentAgenda?.id,
                isActive: currentStatus,
                speakerId: currentSpeaker,
                debateEnum: currentDebut,
                meetingId: parseInt(currentMeetingId),
                speakTimeEnum: currentTime,
                subject: v.subject,
                typeEnum: 'MOST',
                votingOptions: values
            }
            dispatch(meetingActions.editAgendaAction({data, history, setOpenModal, toast}))
        } else {
            toast.warning(lang("toast.warning"))
        }
    }

    function onSearch(val) {

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
                            currentMeetingId: currentMeetingId,
                            toast
                        }))
                    }

                },
                {
                    label: 'Нет',
                }
            ]
        });
    };

    function deleteVoting(id, index) {
        if (id === undefined || id === null) {
            handleRemoveClickEdit(index)
        } else {
            dispatch(meetingActions.deleteVotingAction({id: id ? id : null, handleRemoveClickEdit, index}))
        }
    }

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

    const style = {
        cursor: 'pointer',
        zIndex: '1000'
    }
    console.log(currentAgenda)

    return (
        <>
            <AvForm onValidSubmit={addAgenda}>
                <Row>
                    <Col md={6}>
                        <div className="form-group">
                            <Label className='required_fields'>Вопрос</Label>
                            <AvInput
                                type="text"
                                name="subject"
                                placeholder={'Ваш вопрос'}
                                style={{backgroundColor: '#FFFFFF'}}
                                onChange={(e) => setChangeSubject(e.target.value)}
                                value={changeSubject}
                            />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="form-group">
                            <Label for="companySecretary">Учетная запись</Label>
                            <Select
                                className="setting_input w-100"
                                showSearch
                                allowClear={true}
                                placeholder="Выберите учетная запись"
                                optionFilterProp="children"
                                onChange={(value) => setSelectSpeaker(value)}
                                value={selectSpeaker}
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
                                    onChange={(value) => setSelectTime(value)}
                                    value={selectTime}
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
                                    onChange={(value) => setSelectDebug(value)}
                                    value={selectDebug}
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
                                    onChange={(value) => setSelectStatus(value)}
                                    value={selectStatus}
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
                        <button
                            className="btn py-2 px-5 create">Создать
                        </button>
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
                                <tbody className="">
                                {agendaState && agendaState.length !== 0 ?
                                    agendaState.map((agenda, index) => (
                                        <tr key={index}>
                                            <td className={"text-center"}>
                                                <text style={style}
                                                      className='text-warning text-center'>
                                                    <FaPen
                                                        onClick={() => {
                                                            // console.log(agenda.votingOptions)
                                                            setCurrentAgenda(agenda)
                                                            setCurrentVariants(agenda.votingOptions)
                                                            setOpenModal(true)
                                                        }}/>
                                                </text>
                                            </td>
                                            <td className="text-center">{agenda.userName}</td>
                                            <td className="text-center">{time(agenda.speakTimeEnum)}</td>
                                            <td className="text-center">{time(agenda.debateEnum)}</td>
                                            <td>{agendaSubjectAndVoting({
                                                subject: agenda.subject,
                                                votingLit: agenda.votingOptions
                                            })}</td>
                                            <td className="text-center">{agenda.active === true ? 'Aктивно' : 'Неактивно'}</td>
                                            <td className="text-center">
                                                <text style={style}
                                                      onClick={() => submit(agenda.id)}
                                                >
                                                    <RiDeleteBinLine color={"red"} fontSize={20}/>
                                                </text>
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

            <Modal isOpen={openModal} className="modal-dialog modal-lg container">
                <ModalBody>
                    <AvForm onValidSubmit={editAgenda}>
                        <Row>
                            <Col md={6}>
                                <div className="form-group">
                                    <Label className='required_fields'>Вопрос</Label>
                                    <AvField
                                        type="text"
                                        name="subject"
                                        value={currentAgenda?.subject}
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
                                        allowClear={true}
                                        placeholder="Выберите учетная запись"
                                        optionFilterProp="children"
                                        onChange={(value) => setCurrentSpeaker(value)}
                                        defaultValue={currentAgenda?.speakerId}
                                        value={currentSpeaker}
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
                                            onChange={(value) => setCurrentTime(value)}
                                            defaultValue={currentAgenda?.speakTimeEnum}
                                            value={currentTime}
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
                                            onChange={(value) => setCurrentDebut(value)}
                                            defaultValue={currentAgenda?.debateEnum}
                                            value={currentDebut}
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
                                            onChange={(value) => setCurrentStatus(value)}
                                            defaultValue={currentAgenda?.active}
                                            value={currentStatus}
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
                                            {currentVariants.map((voting, index) =>
                                                <div key={index} className="d-flex flex-row">
                                                    <Col md={8} className=''>
                                                        <AvField
                                                            name={"variant/" + voting.id}
                                                            label={index + 1 + " - Вариант"}
                                                            value={voting.votingText}
                                                            onInput={toInputUppercase}
                                                            // onChange={
                                                            //     e => handleInputChange(e, i)}
                                                            className="variantAddedInput border border"
                                                            style={{backgroundColor: '#FFFFFF', fontWeight: "bold"}}
                                                            required
                                                        />
                                                    </Col>
                                                    <Col md={4} className=''>
                                                        <div className="float-end mt-4">
                                                            {currentVariants.length - 1 === index &&
                                                            <Button type="button" onClick={handleAddClickEdit}
                                                                    className="btn create">+</Button>}
                                                            {currentVariants.length !== 1 &&
                                                            <button type="button"
                                                                    onClick={() => deleteVoting(voting.id, index)}
                                                                    className="btn cancel mx-2">-</button>}
                                                        </div>
                                                    </Col>
                                                </div>
                                            )}
                                        </Row>
                                    </CardBody>
                                </Card>
                                <button type={"submit"}
                                        className="btn py-2 px-5 create">Редактировать
                                </button>
                                <button className="btn btnAll m-2 cancel" type={"button"}
                                        onClick={() => {
                                            dispatch(meetingActions.getAgendaByMeetingId({meetingId: currentMeetingId}))
                                            setOpenModal(false)
                                        }}>{lang("user.otmena")}</button>
                            </Col>
                        </Row>
                    </AvForm>
                </ModalBody>
            </Modal>
        </>
    )
}
