import React, {useEffect, useState} from 'react'
import {AvField, AvForm} from 'availity-reactstrap-validation';
import {useHistory, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Col, Label, Row} from "reactstrap";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {
    ACTIVE,
    CANCELED,
    DISABLED,
    ENTITY,
    ERI,
    FINISH,
    FOREIGNER,
    INDIVIDUAL,
    INPASS,
    PENDING
} from "../../../utils/contants";
import RouteByDashboard from "../RouteByDashboard";
import {useTranslation} from "react-i18next";
import PhoneInput from "react-phone-number-input";
import {useIMask} from "react-imask";
import axios from "axios";
import {BASE_URL} from "../../../utils/config";
import {toast} from "react-toastify";
import * as adminUsersAction from '../../../redux/actions/UsersAction';
import {Select} from "antd";

const {Option} = Select;

export default function AddOrEditUser() {

    const dispatch = useDispatch()
    const history = useHistory()
    const {id} = useParams();
    const {t} = useTranslation();

    const reducers = useSelector(state => state)
    const {currentForUser} = reducers.users

    const lang = localStorage.getItem('i18nextLng')
    const [opts, setOpts] = useState({mask: Number});
    const {ref, maskRef} = useIMask(opts);

    const [password, setPassword] = useState({
        password: "",
        showPassword: false,
        generatePassword: "",
    })

    const [generateLogin, setGenerateLogin] = useState();
    const [savedPinfl, setSavedPinfl] = useState();
    const [savedInn, setSavedInn] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [myBoolean, setMyBoolean] = useState(false);
    const [selectStatusResident, setSelectStatusResident] = useState(currentForUser.resident);
    const [selectStatus, setSelectStatus] = useState(currentForUser.activated);
    const [selectGroupEnum, setSelectGroupEnum] = useState(currentForUser.groupEnum);

    useEffect(() => {
        setPhoneNumber(currentForUser?.phoneNumber)
        setSavedPinfl(currentForUser?.pinfl)
        setSavedInn(currentForUser?.inn)
        setGenerateLogin(currentForUser?.login)
        const auth = currentForUser.authorities
        if ({...auth} === "ROLE_MODERATOR") {
            setMyBoolean(true)
        }
    }, [currentForUser])

    useEffect(() => {
        const current = parseInt(id);
        dispatch(adminUsersAction.getUserById({userId: current, history}))
    }, [id])

    const addUser = (e, v) => {

        console.log(v)
        const authority = [];
        if (v.isAdmin === true) {
            authority.push("ROLE_MODERATOR")
        } else if (v.isAdmin === false) {
            authority.push("ROLE_USER")
        }
        if (savedPinfl && authority && generateLogin) {
            const data = {
                fullName: v.fullName,
                activated: selectStatus,
                authTypeEnum: v.authTypeEnum,
                authorities: authority,
                email: v.email,
                groupEnum: selectGroupEnum,
                inn: savedInn,
                login: generateLogin,
                password: v.password,
                passport: v.passport,
                pinfl: savedPinfl,
                resident: selectStatusResident,
                phoneNumber: phoneNumber
            }
            console.log(data)
            dispatch(adminUsersAction.createUserForAdmin({data, history, toast}))
        } else {
            toast.warning("Iltimos kerakli hamma malumotlarni to`ldiring")
        }
    }

    const editUser = (e, v) => {
        console.log(v)
        const authority = [];
        if (v.isAdmin === true) {
            authority.push("ROLE_MODERATOR")
        } else if (v.isAdmin === false) {
            authority.push("ROLE_USER")
        }
        const current = parseInt(id);
        if (savedPinfl && authority && generateLogin) {
            const data = {
                id: current,
                fullName: v.fullName,
                activated: selectStatus,
                authTypeEnum: v.authTypeEnum,
                authorities: authority,
                email: v.email,
                groupEnum: selectGroupEnum,
                inn: savedInn,
                login: generateLogin,
                password: v.password,
                passport: v.passport,
                pinfl: savedPinfl,
                resident: selectStatusResident,
                phoneNumber: phoneNumber
            }
            console.log(data)
            dispatch(adminUsersAction.editUserAction({data, history}))
        } else {
            toast.warning("Iltimos kerakli hamma malumotlarni to`ldiring")
        }
    }

    const savePinfl = (e) => {
        setSavedPinfl(e)
        if (e.toString().length === 14) {
            axios.post(BASE_URL + "/moder/user/generate-login/" + e)
                .then((res) => {
                    console.log(res)
                    setGenerateLogin(res.data)
                    setSavedPinfl(e)
                    generate();
                })
                .catch((error) => {
                    console.log(error.response)
                    setSavedPinfl('')
                    if (lang === "ru") {
                        toast.error("Пинфл уже использовался!")
                    }
                    if (lang === "uz") {
                        toast.error("Pinfl allaqachon ishlatilgan!")
                    }
                    if (lang === "en") {
                        toast.error(error.response.data.title)
                    }
                })
        }
    }

    const handleClickShowPassword = () => {
        setPassword({...password, showPassword: !password.showPassword});
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handlePasswordChange = (prop) => (event) => {
        setPassword({...password, [prop]: event.target.value});
    };

    function generate() {
        let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let string_length = 8;
        let randomstring = '';
        for (let i = 0; i < string_length; i++) {
            let rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        setPassword({...password, generatePassword: randomstring})
    }

    function selectStatusResidentUser(value) {
      setSelectStatusResident(value)
    }
    function selectStatusUser(value) {
      setSelectStatus(value)
    }
    function selectGroupEnumUser(value) {
      setSelectGroupEnum(value)
    }
    const statusText = [
        {value: INDIVIDUAL, text: t("user.jismoniy")},
        {value: ENTITY, text: t("user.yuridik")},
        {value: FOREIGNER, text: t("user.chetel")},
    ];

    return (
        <div className="settings p-3">
            <div className="container-fluid" style={{marginTop: '12vh'}}>
                <RouteByDashboard lang={t} cardName={t("routes.controlPage.user")} disabled={true}
                                  link2={`/admin/users`}
                                  statusName={id ? t("routes.addOrEditPage.editUser") : t("routes.addOrEditPage.addUser")}/>
            </div>
            <div className='container'>
                <AvForm className="container_wrapper" onValidSubmit={id ? editUser : addUser}>
                    <Row>
                        <Col md={6}>
                            <div className="form-group">
                                <Label className='required_fields'>{t("AdminUser.fullName")}</Label>
                                <AvField
                                    name="fullName"
                                    value={currentForUser?.fullName}
                                    style={{backgroundColor: "#ffffff"}}
                                    /* FULL_NAME */ className="setting_input border  p-2 w-100"
                                    type="text"
                                    required
                                />
                                <Label className='required_fields'>{t("AdminUser.email")}</Label>
                                <AvField
                                    name="email"
                                    value={currentForUser?.email}
                                    style={{backgroundColor: "#ffffff"}}
                                    /* EMAIL */ className="setting_input border  p-2 w-100"
                                    type="email"
                                    required
                                />
                                <Row>
                                    <Col md={6}>
                                        <Label>{t("AdminUser.group")}</Label>
                                        <Select
                                            className="setting_input w-100"
                                            placeholder="Выберите статус"
                                            optionFilterProp="children"
                                            defaultValue={selectGroupEnum}
                                            onChange={selectGroupEnumUser}
                                        >
                                            {statusText && statusText.map((value, index) =>
                                                <Option value={value.value} key={index}>{value.text}</Option>
                                            )}
                                        </Select>
                                        {/*<AvField*/}
                                        {/*    type="select"*/}
                                        {/*    label={t("AdminUser.group")}*/}
                                        {/*    style={{backgroundColor: "#ffffff"}}*/}
                                        {/*    className="setting_input border  p-2 w-100" name="groupEnum"*/}
                                        {/*     id="groupEnum"*/}
                                        {/*    defaultValue={id ? currentForUser.groupEnum : INDIVIDUAL}*/}
                                        {/*>*/}
                                        {/*    <option value={INDIVIDUAL}>{t("user.jismoniy")}</option>*/}
                                        {/*    <option value={ENTITY}>{t("user.yuridik")}</option>*/}
                                        {/*    <option value={FOREIGNER}>{t("user.chetel")}</option>*/}
                                        {/*</AvField>*/}
                                    </Col>
                                    <Col md={6}>
                                        <div className="form-group">
                                            <Label>{t("user.grajdan")}</Label>
                                            <Select
                                                className="setting_input w-100"
                                                placeholder="Выберите статус"
                                                optionFilterProp="children"
                                                defaultValue={selectStatusResident}
                                                onChange={selectStatusResidentUser}
                                            >
                                                    <Option value={true}>{t("user.rezident")}</Option>
                                                    <Option value={false}>{t("user.nerezident")}</Option>
                                            </Select>
                                        </div>
                                        {/*<AvField*/}
                                        {/*    className="setting_input border "*/}
                                        {/*    label={t("user.grajdan")}*/}
                                        {/*    type="select" name="resident"*/}
                                        {/*    style={{backgroundColor: "#ffffff"}}*/}

                                        {/*    defaultValue={id ? currentForUser.resident : true}*/}
                                        {/*>*/}
                                        {/*    <option value={true}>{t("user.rezident")}</option>*/}
                                        {/*    <option value={false}>{t("user.nerezident")}</option>*/}
                                        {/*</AvField>*/}
                                    </Col>
                                </Row>
                                <div className="row">
                                    <Col md={6}>
                                        <Label>{t("companiesList.phoneNumber")}</Label>
                                        <div className="setting_input border" style={{backgroundColor: "#ffffff"}}>
                                            <PhoneInput
                                                placeholder="Enter phone number"
                                                /* PHONE_NUMBER */ value={phoneNumber}
                                                onChange={setPhoneNumber}/>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <Label>{t("user.status")}</Label>
                                        <Select
                                            className="setting_input w-100"
                                            placeholder="Выберите статус"
                                            optionFilterProp="children"
                                            defaultValue={selectStatus}
                                            onChange={selectStatusUser}
                                        >
                                            <Option value={true}>{t("user.aktiv")}</Option>
                                            <Option value={false}>{t("user.neaktiv")}</Option>
                                        </Select>
                                        {/*<AvField*/}
                                        {/*    type="select"*/}
                                        {/*    label={t("user.status")}*/}
                                        {/*   style={{backgroundColor: "#ffffff"}}*/}
                                        {/*    className="setting_input border  p-2 w-100" name="activated"*/}
                                        {/*    id="activated"*/}
                                        {/*    defaultValue={id ? currentForUser.activated : true}>*/}
                                        {/*    <option value={true}>{t("user.aktiv")}</option>*/}
                                        {/*    <option value={false}>{t("user.neaktiv")}</option>*/}
                                        {/*</AvField>*/}
                                    </Col>
                                </div>
                                <Row className="d-none d-md-flex">
                                    <Col md={12}>
                                        <div className="d-flex align-items-center forCheck">
                                            <AvField
                                                className="mt-3 rounded"
                                                style={{width: "20px", height: "20px", borderRadius: "5px"}}
                                                id='forCheck'
                                                type='checkbox'
                                                name='isAdmin'
                                                defaultChecked={myBoolean}
                                            />
                                            <Label for='forCheck'>{t("user.dostup")}</Label>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col md={6}>
                            <Row>
                                <Col md={6}>
                                    <div className="form-group d-flex flex-column">
                                        <Label className='required_fields'>{t("user.pnfl")}</Label>
                                        <input
                                            ref={ref}
                                            style={{backgroundColor: "#ffffff", paddingLeft: '6px'}}
                                            name="pinfl"
                                            value={savedPinfl}
                                            minLength={14} maxLength={14}
                                            onChange={(event) => savePinfl(event.target.value)}
                                            className="setting_input border"
                                        />
                                    </div>

                                </Col>
                                {/*<Col md={6}>*/}
                                {/*    <div className="form-group d-flex flex-column">*/}
                                {/*        <Label className='required_fields'>{t("user.inn")}</Label>*/}
                                {/*        <AvField*/}
                                {/*            // ref={ref}*/}
                                {/*            style={{backgroundColor: "#ffffff", paddingLeft: '6px'}}*/}
                                {/*            name="inn"*/}
                                {/*            value={savedInn}*/}
                                {/*            onChange={(e) => setSavedInn(e.target.value)}*/}
                                {/*            minLength={9} maxLength={9}*/}
                                {/*            className="setting_input border"*/}
                                {/*            required*/}
                                {/*        />*/}
                                {/*    </div>*/}
                                {/*</Col>*/}
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <div className="form-group">
                                        <Label className='required_fields'>{t("user.login")}</Label>
                                        <AvField
                                            className="setting_input border"
                                            value={generateLogin}
                                            type="text"
                                            name="username"
                                            style={{backgroundColor: "#ffffff"}}
                                            disabled
                                        />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <AvField
                                        name="password"
                                        label={t("user.parol")}
                                        value={password.generatePassword}
                                        className="setting_input border"
                                        style={{backgroundColor: "#ffffff"}}
                                        onChange={handlePasswordChange("password")}
                                        type={password.showPassword ? "text" : "password"}
                                        maxLength={16}
                                        minLength={4}
                                        required
                                    />
                                    <div className="float-end">
                                        <InputAdornment style={{marginTop: "-19px"}} color={"dark"} position={"end"}>
                                            <IconButton
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {password.showPassword ? <Visibility/> : <VisibilityOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <AvField type="select"
                                             label={t("user.registr")}
                                             style={{backgroundColor: "#ffffff"}}
                                             className="setting_input border" name="authTypeEnum"
                                             defaultValue={id ? currentForUser.authTypeEnum : ERI}
                                    >
                                        <option value={ERI}>{t("user.etp")}</option>
                                        <option value={INPASS}>{t("user.loginetp")}</option>
                                    </AvField>
                                </Col>
                                <Col md={6}>
                                    <AvField
                                        style={{backgroundColor: "#ffffff"}}
                                        name="passport"
                                        value={currentForUser?.passport}
                                        label={t("user.passport")}
                                        className="setting_input border"
                                        minLength={2}
                                        maxLength={9}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6} className="d-flex d-md-none">
                                    <div className="d-flex align-items-center forCheck">
                                        <AvField
                                            id='forCheck'
                                            type='checkbox'
                                            name='isAdmin'
                                            style={{width: "20px", height: "20px", borderRadius: "5px"}}
                                            defaultChecked={myBoolean}
                                        />
                                        <Label for='forCheck'>{t("user.dostup")}</Label>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div
                                        className="d-inline-flex d-sm-flex justify-content-md-center justify-content-end  w-100 mt-md-4">
                                        <button type="submit" className="btn-save d-block px-3 py-2 mx-2 my-1">
                                            {id ? t("user.redaktorovat") : t("user.sozdat")}
                                        </button>
                                        <button onClick={() => history.push('/admin/users')}
                                                className="btn-cancel px-3 py-2 my-1 mx-2"> {t("cancel")}
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </AvForm>
            </div>
        </div>

    )
}
