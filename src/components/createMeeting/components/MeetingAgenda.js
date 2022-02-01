import React, {useEffect, useState} from "react";
import {Button, Card, CardBody, CardHeader, Col, Label, Row} from "reactstrap";
import {AvField, AvForm, AvInput} from "availity-reactstrap-validation";
import {Link, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Select} from "antd";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import {BiCheckDouble, FcStatistics, RiDeleteBinLine} from "react-icons/all";
import {confirmAlert} from "react-confirm-alert";
import {FIFTEENMIN, FIVEMIN, SPEAKER, TENMIN, TWENTYMIN, TWOMIN} from "../../../utils/contants";
import {FaPen} from "react-icons/fa";
import {toast} from "react-toastify";
import ModalAgenda from "./ModalAgenda/index"

const {Option} = Select;

export default function MeetingAgenda({currentMeetingId, lang}) {

    const history = useHistory();
    const dispatch = useDispatch();

    const reducers = useSelector(state => state)
    const {agendaState, memberManagerState} = reducers.meeting

    const [selectSpeaker, setSelectSpeaker] = useState(null);
    const [selectTime, setSelectTime] = useState(null);
    const [selectDebug, setSelectDebug] = useState(null);
    const [selectStatus, setSelectStatus] = useState(null);

    const [changeSubject, setChangeSubject] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [inputList, setInputList] = useState([{variant: ""}]);

    const [currentAgenda, setCurrentAgenda] = useState([]);
    const [currentVariants, setCurrentVariants] = useState([]);
    const [currentSpeaker, setCurrentSpeaker] = useState(null);
    const [currentTime, setCurrentTime] = useState(null);
    const [currentDebut, setCurrentDebut] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(false);

    useEffect(() => {
        dispatch(meetingActions.getMemberByMeetingId({meetingId: currentMeetingId, fromReestr: false}))

        return () => {
            dispatch({
                type: 'REQUEST_GET_MEMBER_LIST_SUCCESS',
                payload: []
            })
        }
    }, [agendaState])

    useEffect(() => {
        dispatch(meetingActions.getAgendaByMeetingId({meetingId: currentMeetingId}))
        return () => {
            dispatch({
                type: 'REQUEST_GET_AGENDA_MY_MEETING_ID_SUCCESS',
                payload: []
            })
        }
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
                speakerId: selectSpeaker === undefined ? null : selectSpeaker,
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
                speakerId: currentSpeaker === undefined ? null : currentSpeaker,
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

    const deleteAgenda = (currentAgendaId) => {
        confirmAlert({
            title: lang("alert.delete"),
            message: lang("alert.deleteMsg"),
            buttons: [
                {
                    label: lang("alert.yes"),
                    onClick: () => {
                        dispatch(meetingActions.deleteByIdAgenda({
                            currentAgendaId: currentAgendaId,
                            currentMeetingId: currentMeetingId,
                            toast
                        }))
                    }

                },
                {
                    label: lang("alert.no"),
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
            return lang("pages.agenda.minute2")
        } else if (time === FIVEMIN) {
            return lang("pages.agenda.minute5")
        } else if (time === TENMIN) {
            return lang("pages.agenda.minute10")
        } else if (time === FIFTEENMIN) {
            return lang("pages.agenda.minute15")
        } else if (time === TWENTYMIN) {
            return lang("pages.agenda.minute20")
        }
    }

    const timer = [
        {value: TWOMIN, text: lang("pages.agenda.minute2")},
        {value: FIVEMIN, text: lang("pages.agenda.minute5")},
        {value: TENMIN, text: lang("pages.agenda.minute10")},
        {value: FIFTEENMIN, text: lang("pages.agenda.minute15")},
        {value: TWENTYMIN, text: lang("pages.agenda.minute20")},
    ]

    function agendaSubjectAndVoting({subject, votingList}) {
        return (
            <>
                <p style={{fontWeight: 'bold'}}>{subject}</p>
                <hr/>
                {votingList?.map((element, index) =>
                    <div className='text-start d-flex align-items-center' key={index}>
                        <span>{index + 1} - {element.votingText}
                        </span>&nbsp;
                        <Link target={"_blank"}
                            to={"/supervisory/statistic_agenda?agenda_id=" + element.agendaId + "&voting_id=" + element.id}>(подробно)<FcStatistics/></Link>
                        <br/>
                    </div>
                )}
            </>
        )
    }

    const style = {
        cursor: 'pointer',
        zIndex: '1000'
    }

    return (
        <>
            <AvForm onValidSubmit={addAgenda}>
                <Row>
                    <Col md={6}>
                        <div className="form-group">
                            <Label className='required_fields'>{lang("pages.agenda.question")}</Label>
                            <AvInput
                                type="text"
                                name="subject"
                                placeholder={lang("meetingCreated.placeholders.yourQuest")}
                                style={{backgroundColor: '#FFFFFF'}}
                                onChange={(e) => setChangeSubject(e.target.value)}
                                value={changeSubject}
                            />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="form-group">
                            <Label for="companySecretary">{lang("companiesList.accountCount")}</Label>
                            <Select
                                className="setting_input w-100"
                                showSearch
                                allowClear={true}
                                placeholder={lang("meetingCreated.placeholders.selectUser")}
                                optionFilterProp="children"
                                onChange={(value) => setSelectSpeaker(value)}
                                value={selectSpeaker}
                                onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {memberManagerState?.map((username, index) =>
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
                                <Label className='required_fields'>{lang("pages.agenda.time")}</Label>
                                <Select
                                    className="setting_input w-100"
                                    placeholder={lang("meetingCreated.placeholders.selectTime")}
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
                                <Label className='required_fields'>{lang("pages.agenda.debut")}</Label>
                                <Select
                                    className="setting_input w-100"
                                    placeholder={lang("meetingCreated.placeholders.selectDebut")}
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
                                <Label className='required_fields'>{lang("pages.agenda.status")}</Label>
                                <Select
                                    className="setting_input w-100"
                                    placeholder={lang("meetingCreated.placeholders.selectStatus")}
                                    optionFilterProp="children"
                                    onChange={(value) => setSelectStatus(value)}
                                    value={selectStatus}
                                >
                                    <Option value={true}>{lang("pages.agenda.active")}</Option>
                                    <Option value={false}>{lang("pages.agenda.noActive")}</Option>
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
                                    <Label className='required_fields'>{lang("pages.agenda.answersList")}</Label>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Row className="d-flex align-items-center">
                                    {inputList.map((x, i) =>
                                        <div key={i} className="d-flex flex-row">
                                            <Col md={8} className=''>
                                                <AvField
                                                    name={"variant/" + i}
                                                    label={i + 1 + " - " + lang("pages.agenda.answer")}
                                                    value={x.variant}
                                                    onInput={toInputUppercase}
                                                    placeholder={lang("meetingCreated.placeholders.yourAnswer")}
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
                                        </div>
                                    )}
                                </Row>
                            </CardBody>
                        </Card>
                        <button
                            className="btn py-2 px-5 create">{lang("pages.agenda.added")}
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
                                    <th scope="col">{lang("meetingCreated.roles.speaker")}</th>
                                    <th scope="col">{lang("pages.agenda.time")}</th>
                                    <th scope="col">{lang("pages.agenda.debut")}</th>
                                    <th scope="col">{lang("pages.agenda.question")} | {lang("pages.agenda.solution")}</th>
                                    <th scope="col">{lang("pages.agenda.status")}</th>
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
                                                votingList: agenda.votingOptions
                                            })}</td>
                                            <td className="text-center">{agenda.active === true ? lang("pages.agenda.active") : lang("pages.agenda.noActive")}</td>
                                            <td className="text-center">
                                                <text style={style}
                                                      onClick={() => deleteAgenda(agenda.id)}
                                                >
                                                    <RiDeleteBinLine color={"red"} fontSize={20}/>
                                                </text>
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    <tr className='text-center'>
                                        <th colSpan="7">{lang("meetingCreated.emptyList")}</th>
                                    </tr>
                                }
                                </tbody>
                            </>
                        </table>
                    </div>
                </Col>
            </Row>
            <ModalAgenda setOpenModal={setOpenModal} openModal={openModal} lang={lang} currentAgenda={currentAgenda}
                         currentDebut={currentDebut} currentMeetingId={currentMeetingId}
                         memberManagerState={memberManagerState} deleteVoting={deleteVoting}
                         currentSpeaker={currentSpeaker} currentStatus={currentStatus} currentTime={currentTime}
                         currentVariants={currentVariants} dispatch={dispatch} editAgenda={editAgenda}
                         setCurrentSpeaker={setCurrentSpeaker} setCurrentTime={setCurrentTime}
                         setCurrentStatus={setCurrentStatus} handleAddClickEdit={handleAddClickEdit} onSearch={onSearch}
                         setCurrentDebut={setCurrentDebut} timer={timer} toInputUppercase={toInputUppercase}/>
        </>
    )
}
