import React, {useEffect, useState} from "react";
import {Col, Label, Row} from "reactstrap";
import '../AzamatGlobal.scss';
import {AvField, AvForm} from 'availity-reactstrap-validation';
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
    const [selectCompany, setSelectCompany] = useState(null);
    const [selectStatus, setSelectStatus] = useState(null);
    const [selectCountry, setSelectCountry] = useState(null);
    const [selectTypeEnum, setSelectTypeEnum] = useState(null);
    const [descriptionMeeting, setDescriptionMeeting] = useState(null);
    const [startRegistration, setStartRegistration] = useState(null);
    const [endRegistration, setEndRegistration] = useState(null);
    const [startDate, setStartDate] = useState(null);

    const language = localStorage.getItem('i18nextLng');
    const role = localStorage.getItem(DEPOSITORY_ROLE);

    useEffect(() => {
        setSelectCompany(currentMeeting?.companyId);
        setSelectStatus(currentMeeting?.status);
        setSelectCountry(currentMeeting?.cityId);
        setSelectTypeEnum(currentMeeting?.typeEnum);
        setDescriptionMeeting(currentMeeting?.description);
        setStartRegistration(currentMeeting.length !== 0 ? currentMeeting.startRegistration.substr((currentMeeting.startRegistration) - 1, 16) : "")
        setEndRegistration(currentMeeting.length !== 0 ? currentMeeting.endRegistration.substr((currentMeeting.endRegistration) - 1, 16) : "")
        setStartDate(currentMeeting.length !== 0 ? currentMeeting.startDate.substr((currentMeeting.startDate) - 1, 16) : "")
    }, [currentMeeting])

    useEffect(() => {
        axios.get(BASE_URL + api.getCountry)
            .then(res => {
                setCountry(res.data)
            })
    }, [])

    function onSearch(val) {
        if (val.length >= 3) {
            if (role === 'admin') {
                dispatch(adminCompanyAction.getCompanySearchNameAction({name: val}));
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
        if (selectCompany === undefined || selectStatus === undefined || selectCountry === undefined || selectTypeEnum === undefined || startDate === '' || startRegistration === '' || endRegistration === '') {
            toast.warning(lang("toast.warning"))
        } else {
            const data = {
                companyId: selectCompany,
                cityId: selectCountry,
                address: v.address,
                description: v.description,
                startDate: startDate + ':00.000Z',
                startRegistration: startRegistration + ':00.000Z',
                endRegistration: endRegistration + ':00.000Z',
                status: selectStatus,
                typeEnum: selectTypeEnum,
            }

            dispatch(meetingActions.createMeeting({data, history, toast}))
        }
    }

    function editMeeting(e, v) {
        if (selectCompany === undefined || selectStatus === undefined || selectCountry === undefined || selectTypeEnum === undefined || startDate === '' || startRegistration === '' || endRegistration === '') {
            toast.warning(lang("toast.warning"))
        } else {
            const data = {
                id: parseInt(id),
                companyId: selectCompany,
                cityId: selectCountry,
                address: v.address,
                description: v.description,
                startDate: startDate + ':00.000Z',
                startRegistration: startRegistration + ':00.000Z',
                endRegistration: endRegistration + ':00.000Z',
                status: selectStatus,
                typeEnum: selectTypeEnum,
            }

            dispatch(meetingActions.updateMeetingAction({data, history}))
        }
    }

    function getCityName(city) {
        if (language === "uz") {
            return city.nameUz
        }
        if (language === "ru") {
            return city.nameRu
        }
        if (language === "en") {
            return city.nameEn
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
                            allowClear={true}
                            placeholder={lang("meetingCreated.placeholders.selectOrganization")}
                            optionFilterProp="children"
                            onChange={(value => setSelectCompany(value))}
                            onSearch={onSearch}
                            defaultValue={currentMeeting?.companyId}
                            value={selectCompany}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >

                            {
                                role === "user" ?
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
                            placeholder={lang("meetingCreated.placeholders.selectStatus")}
                            optionFilterProp="children"
                            defaultValue={currentMeeting?.status}
                            value={selectStatus}
                            onChange={(value => setSelectStatus(value))}
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
                            // allowClear={true}
                            className="setting_input w-100"
                            placeholder={lang("meetingCreated.placeholders.selectCity")}
                            optionFilterProp="children"
                            onChange={(value => setSelectCountry(value))}
                            defaultValue={currentMeeting?.cityId}
                            value={selectCountry}
                        >
                            {country && country.map((value, index) => (
                                <Option value={value.id} key={index}>{getCityName(value)}</Option>
                            ))}
                        </Select>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="form-group">
                        <Label className='required_fields'>{lang("meetingsList.address")}</Label>
                        <AvField
                            name="address"
                            type="text"
                            value={currentMeeting?.address}
                            placeholder={lang("meetingCreated.placeholders.yourAddress")}
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
                            placeholder={lang("meetingCreated.placeholders.selectType")}
                            optionFilterProp="children"
                            defaultValue={currentMeeting?.typeEnum}
                            value={selectTypeEnum}
                            onChange={(value => setSelectTypeEnum(value))}
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
                        <input
                            type="datetime-local"
                            defaultValue={startRegistration}
                            onChange={(e) => setStartRegistration(e.target.value)}
                            value={startRegistration}
                            name="startRegistration"
                            className="border text-center timer form-control"
                            style={{backgroundColor: '#FFFFFF'}}
                            required
                        />
                    </div>
                </Col>
                <Col md={3} sm={6} xs={6}>
                    <div className="form-group">
                        <Label className='required_fields'>{lang("meetingsList.finishRegister")}</Label>
                        <input
                            type="datetime-local"
                            defaultValue={endRegistration}
                            onChange={(e) => setEndRegistration(e.target.value)}
                            value={endRegistration}
                            name="endRegistration"
                            className="border text-center timer form-control"
                            style={{backgroundColor: '#FFFFFF'}}
                            required
                        />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={6} className='d-none flex-column d-md-flex'>
                    <div className="form-group">
                        <Label className='required_fields'>{lang("meetingsList.commentMeeting")}</Label>
                        <AvField
                            type="textarea"
                            name="description"
                            className="border"
                            placeholder={lang("meetingCreated.placeholders.enterDescription")}
                            defaultValue={currentMeeting?.description}
                            value={descriptionMeeting}
                            onChange={(e) => setDescriptionMeeting(e.target.value)}
                            style={{backgroundColor: '#FFFFFF', resize: 'none', height: '24vh'}}
                            required
                        />
                    </div>
                </Col>
                <Col md={3}>
                    <div className="form-group">
                        <Label className='required_fields'>{lang("meetingsList.startMeeting")}</Label>
                        <input
                            type="datetime-local"
                            defaultValue={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            value={startDate}
                            name="startDate"
                            className="border  text-center timer form-control"
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
                    <div className="form-group">
                        <Label className='required_fields'>{lang("meetingsList.commentMeeting")}</Label>
                        <AvField
                            type="textarea"
                            name="description"
                            placeholder={lang("meetingCreated.placeholders.enterDescription")}
                            className="border"
                            defaultValue={currentMeeting?.description}
                            value={descriptionMeeting}
                            onChange={(e) => setDescriptionMeeting(e.target.value)}
                            style={{backgroundColor: '#FFFFFF', resize: 'none', height: '24vh'}}
                            required
                        />
                    </div>
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
