import React, {useEffect, useState} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import {AvField, AvForm, AvInput} from 'availity-reactstrap-validation';
import {AiOutlineRight, FaArrowLeft, ImCancelCircle} from "react-icons/all";
import {useDispatch, useSelector} from 'react-redux';
import {Col, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import '../styles/settings.scss';
import {Select} from "antd";
import * as adminCompanyAction from '../../../redux/actions/CompanyAction';
import * as actionUser from '../../../redux/actions/UsersAction';
import Loader from "react-loader-spinner";
import {useTranslation} from "react-i18next";
import {BASE_URL} from "../../../utils/config";
import {api} from "../../../api/api";
import RouteByDashboard from "../RouteByDashboard";
import * as types from "../../../redux/actionTypes/UsersActionTypes";
import PhoneInput from "react-phone-number-input";
import { useIMask } from 'react-imask';
import {toast} from "react-toastify";

const {Option} = Select;

export default function AddOrEditCompany() {

    const {id} = useParams();
    const history = useHistory()
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const reducers = useSelector(state => state)
    const {currentCompany} = reducers.company;
    const {createCompanyLoading} = reducers.company;
    const {loading} = reducers.file
    const {logoCompany} = reducers.file
    const {users} = reducers.users

    const [ opts, setOpts ] = useState({ mask: Number});
    const { ref, maskRef } = useIMask(opts);
    const [file, setFile] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [selectUsers, setSelectUsers] = useState({secretary: '', chairman: '', active: false})
    const [isOpen, setIsOpen] = useState(false)
    const [selectSecretary, setSelectSecretary] = useState();
    const [phoneNumber, setPhoneNumber] = useState()
    const [inn, setInn] = useState() ////

    let $imagePreview = null;
    if (imagePreviewUrl) {
        $imagePreview = (
            <div className='d-flex'>
                <img src={imagePreviewUrl} style={{width: '92%', height: '20vh', textAlign: 'center'}}
                     alt={"bu yerda siz yuklagan rasm mavjud"}/>
                <ImCancelCircle onClick={upDataImg} className="text-danger position-absolute bg-transparent"
                                style={{
                                    zIndex: '1000', cursor: 'pointer',
                                    borderRadius: '50%',
                                    fontSize: '30px', marginTop: '-10px', marginLeft: '-10px'
                                }}/>
            </div>
        );
    }

    useEffect(() => {
        const current = parseInt(id);
        if (!isNaN(current)) {
            dispatch(adminCompanyAction.getCompanyByIdAction({companyId: parseInt(id), history}))
            dispatch(actionUser.getUsersList())
            // setSelectSecretary(currentCompany?.secretaryId)//
        }
    }, [id])

    useEffect(()=>{
        setPhoneNumber(currentCompany?.phoneNumber)
    },[currentCompany])
    function onSearch(val) {
        const NAME = "FULL_NAME";
        if (val.length >= 3) {
            dispatch(actionUser.getUserFilter({value: val, field: NAME}));
        }
    }

    function onBlur() {

    }

    function onFocus() {

    }


    function forChairMan(value) {
        setSelectUsers({...selectUsers, chairman: value})
    }

    function forSecretary(value) {
        setSelectUsers({...selectUsers, secretary: value})
    }

    function forStatus(value) {
        setSelectUsers({...selectUsers, active: value})
    }

    const addCompany = (e, v) => {
        if (selectUsers && phoneNumber && inn) {
            const data = {
                active: selectUsers.active,
                chairmanId: selectUsers.chairman,
                secretaryId: selectUsers.secretary,
                imageUrl: file ? "yes" : 'no',
                image: file,
                phoneNumber: phoneNumber,
                inn: inn,
                ...v
            }
            console.log(data)
            dispatch(adminCompanyAction.createCompanyForAdmin({data, history}))
        }else {
            toast.warning("Пожалуйста, Заполните все")
        }
    }

    const editCompany = (e, v) => {
        const data = {
            id: currentCompany.id,
            active: selectUsers.active,
            chairmanId: selectUsers.chairman,
            secretaryId: selectUsers.secretary,
            imageUrl: file ? "yes" : 'no',
            image: file,
            phoneNumber: phoneNumber,
            inn: inn,
            ...v
        }
        dispatch(adminCompanyAction.updateCompany({data, history}))
    }

    _handleImageChange = _handleImageChange.bind();

    function _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setFile(file)
            setImagePreviewUrl(reader.result);
        }

        reader.readAsDataURL(file)
    }

    function upDataImg() {
        setFile('')
        setImagePreviewUrl('');
    }

    function onChange(val) {
        const NAME = "FULL_NAME";
        if (val.length >= 3) {
            dispatch(actionUser.getUserFilter({value: val, field: NAME}));
        } else {
            dispatch({type: types.REQUEST_GET_USERS_LIST_SUCCESS, payload: ''})
        }
    }

    return (
        <div className="settings p-3">
            <div className="container-fluid" style={{marginTop: '12vh'}}>
                <RouteByDashboard cardName={'компаниями'} disabled={true} link2={`/admin/company`}
                                  statusName={currentCompany ? "РЕДАКТИРОВАТЬ КОМПАНИЮ" : "ДОБАВИТЬ КОМПАНИЮ"}/>
                <div className="d-block d-md-none text-center">
                    <h3>{currentCompany ? "РЕДАКТИРОВАТЬ КОМПАНИЮ" : "ДОБАВИТЬ КОМПАНИЮ"}</h3>
                </div>
                <AvForm className="container_wrapper" onValidSubmit={currentCompany ? editCompany : addCompany}
                        enctype="multipart/form-data">
                    <Row>
                        <Col md={2} className="d-flex justify-content-center align-items-center">
                            {currentCompany && currentCompany.imageUrl === "yes" ?
                                <div className='currentCompanyLogo d-flex align-items-center'>
                                    <img className="w-100"
                                         src={BASE_URL + api.getLogoByCompanyId + currentCompany.id}
                                         alt=""/>
                                </div>
                                :
                                <div className="app-custom-file">
                                    <div className={imagePreviewUrl ? `d-none` : ` `}>
                                        <form action="http://localhost:3000" method="post"
                                              encType="multipart/form-data">
                                            <input type="file" onChange={_handleImageChange} hidden={true} id="file"
                                                   accept="image/jpg, image/jpeg, image/png, .svg"/>
                                            <label htmlFor="file"
                                                   onChange={_handleImageChange}
                                                   className={`app-custom-label`}>
                                                <div className="app-custom-info">
                                                    <strong>Логотип!</strong>
                                                </div>
                                            </label>
                                        </form>

                                    </div>
                                    <div>
                                        {$imagePreview}
                                    </div>
                                </div>
                            }
                        </Col>
                        <Col md={4}>
                            <div className="form-group">
                                <Label className='required_fields'>Наименование организации</Label>
                                <AvField
                                    type="text"
                                    name="name"
                                    value={currentCompany.length !== 0 ? currentCompany.name : ""}
                                    style={{backgroundColor: "#ffffff"}}
                                    className="setting_input border"
                                    required
                                />
                            </div>
                            <Row>
                                <Col md={6}>
                                    <div className="form-group">
                                        <Label>Статус</Label>
                                        <Select
                                            className="setting_input w-100"
                                            placeholder="Выберите статус"
                                            optionFilterProp="children"
                                            onChange={forStatus}
                                            onFocus={onFocus}
                                            onBlur={onBlur}
                                            defaultValue={currentCompany.length !== 0 ? currentCompany.active : "true"}
                                        >
                                            <Option value={"true"}>Активно</Option>
                                            <Option value={"false"}>Неактивно</Option>
                                        </Select>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="form-group">
                                        <Label className='required_fields'>ИНН организации</Label>
                                        <input
                                            ref={ref}
                                            style={{backgroundColor: "#ffffff", paddingLeft: '6px'}}
                                            name="inn"
                                            value={currentCompany?.inn}
                                            minLength={9} maxLength={9}
                                            onChange={(e)=> setInn(e.target.value)}
                                            className="setting_input border "
                                            required
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <div className="">
                                <div className="form-group">
                                    <Label for="companySecretary">Секретарь наб.совета</Label>
                                </div>
                                <Select
                                    className="setting_input w-100"
                                    showSearch
                                    placeholder="Выберите статус"
                                    optionFilterProp="children"
                                    defaultValue={currentCompany.length !== 0 ? currentCompany.secretaryId : ""}
                                    onChange={forSecretary}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {users && users.map((value, index) =>
                                        <Option value={value.id} key={index}>{value.fullName}</Option>
                                    )}
                                </Select>
                            </div>
                            <div className="form-group">
                                <Label className='required_fields'>Телефон</Label>
                                <div className="setting_input border"  style={{backgroundColor: "#ffffff"}}>
                                    <PhoneInput
                                        placeholder="Enter phone number"
                                        value={phoneNumber}
                                        onChange={setPhoneNumber}/>
                                </div>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="">
                                <div className="form-group">
                                    <Label for="nabChairmanCompany">Председатель наб.совета</Label>
                                    <Select
                                        className="setting_input w-100"
                                        showSearch
                                        placeholder="Выберите статус"
                                        optionFilterProp="children"
                                        defaultValue={currentCompany.length !== 0 ? currentCompany.secretaryId : ""}
                                        onChange={forChairMan}
                                        onSearch={onSearch}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {users && users.map((value, index) =>
                                            <Option value={value.id} key={index}>{value.fullName}</Option>
                                        )}
                                    </Select>
                                </div>
                            </div>
                            <div className="form-group">
                                <Label className='required_fields'>Электронная Почта</Label>
                                <AvField
                                    type="email"
                                    value={currentCompany?.email}
                                    label=""
                                    name="email"
                                    style={{backgroundColor: "#ffffff"}}
                                    className="setting_input border "
                                    required
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <div className="form-group">
                                <Label className='required_fields'>Почтовый адрес</Label>
                                <AvField
                                    type="text"
                                    label=""
                                    name="postalAddress"
                                    value={currentCompany?.postalAddress}
                                    style={{backgroundColor: "#ffffff"}}
                                    className="setting_input border "
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <Label className='required_fields'>Юридический адрес</Label>
                                <AvField
                                    type="text"
                                    label=""
                                    name="legalAddress"
                                    value={currentCompany?.legalAddress}
                                    style={{backgroundColor: "#FFFFFF"}}
                                    className="setting_input border "
                                    required/>
                            </div>
                            <AvField
                                type="text"
                                label="Веб сайт"
                                name="webPage"
                                value={currentCompany?.webPage}
                                style={{backgroundColor: "#ffffff"}}
                                className="setting_input border "
                            />
                        </Col>
                        <Col md={6}>
                            <div className="form-group">
                                <Label className='required_fields'>Описание организации</Label>
                                <AvField
                                    type="textarea"
                                    name="description"
                                    value={currentCompany?.description}
                                    style={{backgroundColor: "#ffffff", resize: "none"}}
                                    className="setting_input border "
                                    required
                                />
                            </div>
                        </Col>
                        <div className="d-inline-flex justify-content-end mt-1">
                            {createCompanyLoading ?
                                <div className="d-flex align-items-center justify-content-center" style={{
                                    width: '8em', height: '44px', background: '#133B88', borderRadius: '6px',
                                    marginTop: '4px'
                                }}>
                                    <Loader
                                        type="ThreeDots"
                                        color="white"
                                        height={30}
                                        width={30}
                                    />
                                </div>
                                :
                                <button type="submit"
                                        className="btn-save px-3 py-2 my-1 mx-2">{currentCompany ? "Редактировать" : "Создать компанию"}</button>
                            }
                            <button className="btn-cancel  my-1 px-3 py-2 mx-2"><Link to="/admin/company">Отмена</Link>
                            </button>
                        </div>
                    </Row>
                </AvForm>
            </div>
        </div>
    )
}
