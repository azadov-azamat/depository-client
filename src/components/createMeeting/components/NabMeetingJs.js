import React, {useEffect, useState} from "react";
import {Col, Label, Row} from "reactstrap";
import '../AzamatGlobal.scss';
import {AvField, AvForm, AvGroup, AvInput} from 'availity-reactstrap-validation';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    ACTIVE,
    CANCELED,
    DEPOSITORY_ROLE,
    DISABLED,
    EXTRAORDINARY,
    FINISH,
    ORDINARY,
    PENDING
} from "../../../utils/contants";
import {Select} from 'antd';
import 'antd/dist/antd.css';
import * as adminCompanyAction from "../../../redux/actions/CompanyAction";
import * as companyAction from "../../../redux/actions/CompanyAction";
import axios from "axios";
import {BASE_URL} from "../../../utils/config";
import {api} from "../../../api/api";
import {toast} from "react-toastify";
import * as meetingActions from '../../../redux/actions/MeetingAction';
import {REQUEST_API_SUCCESS} from "../../../redux/actionTypes/CompanyActionTypes";

const {Option} = Select;

export default function NabMeetingJs({id, currentMeeting, lang}) {

    const history = useHistory();
    const dispatch = useDispatch();

    const reducers = useSelector(state => state)
    const {companies, companiesByUserId} = reducers.company
    const {currentUser} = reducers.auth

    const [country, setCountry] = useState([]);
    const [selectCompany, setSelectCompany] = useState(currentMeeting.length !== 0 ? currentMeeting.companyId : "");
    const [selectStatus, setSelectStatus] = useState(currentMeeting.length !== 0 ? currentMeeting.status : "");
    const [selectCountry, setSelectCountry] = useState(currentMeeting.length !== 0 ? currentMeeting.cityId : "");
    const [selectTypeEnum, setSelectTypeEnum] = useState(currentMeeting.length !== 0 ? currentMeeting.typeEnum : "");

    const language = localStorage.getItem('i18nextLng');
    const role = localStorage.getItem(DEPOSITORY_ROLE);

    useEffect(() => {
        axios.get(BASE_URL + api.getCountry)
            .then(res => {
                setCountry(res.data)
            })
            .catch(err => {
            })
        dispatch({
            type: "REQUEST_GET_AGENDA_BY_ID_SUCCESS",
            payload: []
        })
    }, [])

    function onSearch(val) {
        const NAME = "NAME";
        if (val.length >= 3) {
            if (role === 'admin') {
                dispatch(adminCompanyAction.getCompanyFilter({value: val, field: NAME}));
            } else {
                dispatch(companyAction.getCompanyByUserId({currentUserId: currentUser?.id}))
            }
        } else {
            dispatch({
                type: REQUEST_API_SUCCESS,
                payload: []
            });
        }
    }

    function selectCompanyForMeeting(value) {
        setSelectCompany(value)
    }

    function selectStatusMeeting(value) {
        setSelectStatus(value)
    }

    function selectCountryMeeting(value) {
        setSelectCountry(value)
    }

    function selectType(value) {
        setSelectTypeEnum(value)
    }

    const statusText = [
        {value: PENDING, text: lang("meetingCreated.meetingStatus.pending")},
        {value: ACTIVE, text: lang("meetingCreated.meetingStatus.active")},
        {value: FINISH, text: lang("meetingCreated.meetingStatus.finish")},
        {value: CANCELED, text: lang("meetingCreated.meetingStatus.canceled")},
        {value: DISABLED, text: lang("meetingCreated.meetingStatus.disabled")}
    ];

    const typeEnumText = [
        {value: EXTRAORDINARY, text: lang("meetingCreated.meetingStatus.extraordinary")},
        {value: ORDINARY, text: lang("meetingCreated.meetingStatus.ordinary")},
    ];

    function CreateMeeting(e, v) {
        e.preventDefault();
        console.log("keldi create")
        if (!selectCompany && !selectStatus && !selectCountry && !selectTypeEnum) {
            toast.warning(lang("toast.warning"))
        } else {
            const data = {
                companyId: selectCompany,
                cityId: parseInt(selectCountry),
                address: v.address,
                description: v.description ? v.description : v.description2,
                startDate: v.startDate + ':22.981Z',
                startRegistration: v.startRegistration + ':22.981Z',
                endRegistration: v.endRegistration + ':22.981Z',
                status: selectStatus,
                typeEnum: selectTypeEnum,
            }
            console.log(data)
            dispatch(meetingActions.createMeeting({data, history, toast}))
        }
    }

    function editMeeting(e, v) {
        e.preventDefault();
        const data2 = {
            id: parseInt(id),
            companyId: selectCompany,
            cityId: parseInt(selectCountry),
            address: v.address,
            description: v.description,
            startDate: v.startDate + ':22.981Z',
            startRegistration: v.startRegistration + ':22.981Z',
            endRegistration: v.endRegistration + ':22.981Z',
            status: selectStatus,
            typeEnum: selectTypeEnum,
        }
        console.log(data2)
        if (!selectCompany && !selectStatus && !selectCountry && !selectTypeEnum) {
            toast.warning("Пожалуйста, Заполните все")
        } else {
            const data = {
                id: parseInt(id),
                companyId: selectCompany,
                cityId: parseInt(selectCountry),
                address: v.address,
                description: v.description,
                startDate: v.startDate + ':22.981Z',
                startRegistration: v.startRegistration + ':22.981Z',
                endRegistration: v.endRegistration + ':22.981Z',
                status: selectStatus,
                typeEnum: selectTypeEnum,
            }
            dispatch(meetingActions.updateMeetingAction({data, history}))
        }
    }

    return (
        <AvForm onValidSubmit={currentMeeting.length !== 0 ? editMeeting : CreateMeeting}>
            <Row>
                <Col md={3}>
                    <div className="form-group">
                        <Label className='required_fields'>{lang("pages.company.nameCompany")}</Label>
                        <Select
                            className="setting_input w-100"
                            showSearch
                            placeholder="Выберите организацию"
                            optionFilterProp="children"
                            onChange={selectCompanyForMeeting}
                            onSearch={onSearch}
                            defaultValue={currentMeeting.length !== 0 ? currentMeeting.companyId : ""}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >

                            {role === "user" ?
                                companiesByUserId && companiesByUserId.map((element, index) =>
                                    element.chairmanId === currentUser.id || element.secretaryId === currentUser.id ?
                                        <Option value={element.id} key={index}>
                                            {element.name}
                                        </Option> : ''
                                ) :
                                companies && companies.map((value, index) => (
                                    <Option value={value.id} key={index}>
                                        {value.name}
                                    </Option>
                                ))
                            }
                        </Select>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="form-group">
                        <Label className='required_fields'>{lang("meetingsList.statusMeeting")}</Label>
                        <Select
                            className="setting_input w-100"
                            placeholder="Выберите статус"
                            optionFilterProp="children"
                            defaultValue={currentMeeting.length !== 0 ? currentMeeting.status : ""}
                            onChange={selectStatusMeeting}
                        >
                            {statusText && statusText.map((value, index) =>
                                <Option value={value.value} key={index}>{value.text}</Option>
                            )}
                        </Select>
                    </div>
                </Col>

                <Col md={3}>
                    <div className="form-group">
                        <Label className='required_fields'>{lang("meetingsList.city")}</Label>
                        <Select
                            className="setting_input w-100"
                            placeholder="Выберите область"
                            optionFilterProp="children"
                            onChange={selectCountryMeeting}
                            defaultValue={currentMeeting.length !== 0 ? currentMeeting.cityId : ""}
                        >
                            {country && country.map((value, index) => (
                                <Option value={value.id} key={index}>
                                    {
                                        language && language === 'uz' || language === 'en' ?
                                            value.nameUz : value.nameRu
                                    }
                                </Option>
                            ))}
                        </Select>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="form-group">
                        <Label className='required_fields'>{lang("meetingsList.address")}</Label>
                        <AvField
                            name="address"
                            label=""
                            type="text"
                            defaultValue={currentMeeting.length !== 0 ? currentMeeting.address : ""}
                            className="border "
                            style={{backgroundColor: '#FFFFFF'}}
                            required
                        />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <div className="form-group">
                        <Label className='required_fields'>{lang("meetingsList.typeMeeting")}</Label>
                        <Select
                            className="setting_input w-100"
                            placeholder="Выберите тип заседание"
                            optionFilterProp="children"
                            defaultValue={currentMeeting.length !== 0 ? currentMeeting.typeEnum : ""}
                            onChange={selectType}
                        >
                            {typeEnumText && typeEnumText.map((value, index) =>
                                <Option value={value.value} key={index}>{value.text}</Option>
                            )}
                        </Select>
                    </div>
                </Col>
                <Col md={3} sm={6} xs={6}>
                    <div className="form-group">
                        <Label className='required_fields'>{lang("meetingsList.startRegister")}</Label>
                        <AvField
                            type="datetime-local"
                            defaultValue={currentMeeting.length !== 0 ? currentMeeting.startRegistration.substr((currentMeeting?.startRegistration) - 1, 16) : ""}
                            name="startRegistration"
                            label="" helpMessage=""
                            className="border  text-center timer"
                            style={{backgroundColor: '#FFFFFF'}}
                            required
                        />
                    </div>
                </Col>
                <Col md={3} sm={6} xs={6}>
                    <div className="form-group">
                        <Label className='required_fields'>{lang("meetingsList.finishRegister")}</Label>
                        <AvField
                            type="datetime-local"
                            defaultValue={currentMeeting.length !== 0 ? currentMeeting.endRegistration.substr((currentMeeting?.endRegistration) - 1, 16) : ""}
                            name="endRegistration"
                            label="" helpMessage=""
                            className="border  text-center timer"
                            style={{backgroundColor: '#FFFFFF'}}
                            required
                        />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={6} className='d-none flex-column d-md-flex'>
                    <AvGroup>
                        <Label className='required_fields'>{lang("meetingsList.commentMeeting")}</Label>
                        <AvInput
                            type="textarea"
                            name="description"
                            label="Описания заседание"
                            className="border"
                            defaultValue={currentMeeting.length !== 0 ? currentMeeting.description : ""}
                            style={{backgroundColor: '#FFFFFF', resize: 'none', height: '24vh'}}
                        />
                    </AvGroup>
                </Col>
                <Col md={3}>
                    <div className="form-group">
                        <Label className='required_fields'>{lang("meetingsList.startMeeting")}</Label>
                        <AvField
                            type="datetime-local"
                            defaultValue={currentMeeting.length !== 0 ? currentMeeting.startDate.substr((currentMeeting?.startDate) - 1, 16) : ""}
                            name="startDate"
                            label="" helpMessage=""
                            className="border  text-center timer"
                            style={{backgroundColor: '#FFFFFF'}}
                            required
                        />
                    </div>
                </Col>
                <Col md={3}>
                    <div className="d-none d-md-flex justify-content-center" style={{marginTop: '25px'}}>
                        <button type={"submit"}
                            className="btn btnAll m-2 create">{currentMeeting.length !== 0 ? lang("user.redaktorovat") : lang("user.sozdat")}
                        </button>
                        <button className="btn btnAll m-2 cancel"
                                onClick={() => history.push("/admin/meetings")}>{lang("user.otmena")}</button>
                    </div>
                </Col>
                <Col md={6} className='d-md-none flex-column d-md-flex'>
                    <AvGroup>
                        <Label className='required_fields'>{lang("meetingsList.commentMeeting")}</Label>
                        <AvInput
                            type="textarea"
                            name="description2"
                            label="Описания заседание"
                            className="border"
                            defaultValue={currentMeeting.length !== 0 ? currentMeeting.description : ""}
                            style={{backgroundColor: '#FFFFFF', resize: 'none', height: '24vh'}}
                        />
                    </AvGroup>
                    <div className="d-md-none d-flex justify-content-center mt-3 mb-3">
                        <button type={"submit"}
                                className="btn btnAll m-2 create">{currentMeeting.length !== 0 ? lang("user.redaktorovat") : lang("user.sozdat")}
                        </button>
                        <button className="btn btnAll m-2 cancel"
                                onClick={() => history.push("/admin/meetings")}>{lang("user.otmena")}</button>
                    </div>
                </Col>
            </Row>
        </AvForm>
    )
}
