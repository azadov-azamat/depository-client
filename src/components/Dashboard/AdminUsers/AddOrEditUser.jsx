import React, {useEffect, useState} from 'react'
import {AvField, AvForm} from 'availity-reactstrap-validation';
import {useHistory, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Col, Label, Row} from "reactstrap";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {ANY, ENTITY, ERI, FOREIGNER, INDIVIDUAL, INPASS} from "../../../utils/contants";
import RouteByDashboard from "../RouteByDashboard";
import {useTranslation} from "react-i18next";
import PhoneInput from "react-phone-number-input";
import {useIMask} from "react-imask";
import axios from "axios";
import {BASE_URL} from "../../../utils/config";
import {toast} from "react-toastify";
import * as adminUsersAction from '../../../redux/actions/UsersAction';
import {Select} from "antd";
import * as types from "../../../redux/actionTypes/UsersActionTypes";
import InputMask from "react-input-mask";

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
        password: null,
        showPassword: false,
        generatePassword: null,
    })
    const [phoneNumber, setPhoneNumber] = useState();
    const [pinfl, setPinfl] = useState();
    const [myBoolean, setMyBoolean] = useState(false);
    const [userInfo, setUserInfo] = useState({
        isAdmin: null,
        pinfl: null,
        generateLogin: null,

        booleanAdmin: null,
        resident: null,
        activated: null,
        groupEnum: null,

        authTypeEnum: null,
        generatePassword: null
    })

    useEffect(() => {
        setUserInfo({
            ...userInfo,
            pinfl: currentForUser.pinfl,
            generateLogin: currentForUser.login,

            resident: currentForUser.resident !== undefined ? currentForUser.resident : true,
            activated: currentForUser.activated !== undefined ? currentForUser.activated : true,
            groupEnum: currentForUser.groupEnum ? currentForUser.groupEnum : INDIVIDUAL,
            authTypeEnum: currentForUser.authTypeEnum ? currentForUser.authTypeEnum : INPASS,
        })
        setPinfl(currentForUser.pinfl)
        setPhoneNumber(currentForUser.phoneNumber)
        const role = currentForUser?.authorities

        // role.forEach(element => {
        //     console.log(element)
        //         // if (element === "ROLE_ADMIN") {
        //         //     setMyBoolean(true);
        //         // } else if (element === "ROLE_MODERATOR") {
        //         //     setMyBoolean(true);
        //         // } else if (element === "ROLE_USER") {
        //         //     setMyBoolean(false);
        //         // }
        //     }
        // )
        // setMyBoolean(role.some(element=> element === "ROLE_MODERATOR"))
        // console.log(role.some(element=> element === "ROLE_MODERATOR"))
        // if (role[0] === "ROLE_MODERATOR" || role[0] === "ROLE_ADMIN") {
        //     setMyBoolean(true)
        // }
    }, [currentForUser])

    useEffect(() => {
        const current = parseInt(id);
        if (!isNaN(current)) {
            dispatch(adminUsersAction.getUserById({userId: current, history}))
        }

        return () => {
            dispatch({
                type: types.REQUEST_GET_USER_SUCCESS,
                payload: []
            })
        }
    }, [id])

    const addUser = (e, v) => {
        if (pinfl || userInfo.generateLogin) {
            const data = {
                fullName: v.fullName,
                activated: userInfo.activated,
                authTypeEnum: userInfo.authTypeEnum,
                authorities: myBoolean ? ["ROLE_MODERATOR"] : ["ROLE_USER"],
                email: v.email,
                groupEnum: userInfo.groupEnum,
                inn: null,
                login: userInfo.generateLogin,
                password: userInfo.generatePassword,
                passport: v.passport,
                pinfl: pinfl.toString().replaceAll(" ", ""),
                resident: userInfo.resident,
                phoneNumber: phoneNumber === undefined ? null : phoneNumber
            }
            dispatch(adminUsersAction.createUserForAdmin({data, history, toast}))
        } else {
            toast.warning(t("toast.warning"))
        }
    }

    const editUser = (e, v) => {
        const authority = [];
        if (v.isAdmin === true) {
            authority.push("ROLE_MODERATOR")
        } else if (v.isAdmin === false) {
            authority.push("ROLE_USER")
        }
        const current = parseInt(id);
        if (pinfl || authority && userInfo.generateLogin) {
            const data = {
                id: current,
                fullName: v.fullName,
                activated: userInfo.activated,
                authTypeEnum: userInfo.authTypeEnum,
                authorities: authority,
                email: v.email,
                groupEnum: userInfo.groupEnum,
                inn: null,
                login: userInfo.generateLogin,
                password: userInfo.generatePassword,
                passport: v.passport,
                pinfl: pinfl.toString().replaceAll(" ", ""),
                resident: userInfo.resident,
                phoneNumber: phoneNumber === undefined ? null : phoneNumber
            }
            dispatch(adminUsersAction.editUserAction({data, history, toast}))
        } else {
            toast.warning("Iltimos kerakli hamma malumotlarni to`ldiring")
        }
    }

    const savePinfl = (value) => {
        if (value.replaceAll(" ", '').length === 14) {
            axios.post(BASE_URL + "/moder/user/generate-login/" + value.replaceAll(" ", ''))
                .then((res) => {
                    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                    let string_length = 8;
                    let randomstring = '';
                    for (let i = 0; i < string_length; i++) {
                        let rnum = Math.floor(Math.random() * chars.length);
                        randomstring += chars.substring(rnum, rnum + 1);
                    }
                    setUserInfo({...userInfo, generateLogin: res.data, generatePassword: randomstring})
                })
                .catch((error) => {
                    console.log(error.response.data)
                    setUserInfo({...userInfo, pinfl: null})
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

    const statusText = [
        {id: 1, value: INDIVIDUAL, text: t("user.jismoniy")},
        {id: 2, value: ENTITY, text: t("user.yuridik")},
        {id: 3, value: FOREIGNER, text: t("user.chetel")},
    ];

    const statusLogin = [
        {id: 1, value: ERI, text: t("user.etp")},
        {id: 2, value: INPASS, text: t("user.loginetp")},
        {id: 3, value: ANY, text: t("user.any")}
    ];

    return (
        <div className="settings p-3">
            <div className="container-fluid" style={{marginTop: '12vh'}}>
                <RouteByDashboard lang={t} cardName={t("routes.controlPage.user")} disabled={true}
                                  link2={`/admin/users`}
                                  statusName={id ? t("routes.addOrEditPage.editUser") : t("routes.addOrEditPage.addUser")}/>
            </div>
            <div className='container shadow pt-1 pb-2 rounded mt-3'>
                <AvForm className="container_wrapper" onValidSubmit={id ? editUser : addUser}>
                    <Row>
                        <Col md={6}>
                            <div className="form-group">
                                <Label className='required_fields'>{t("AdminUser.fullName")}</Label>
                                <AvField
                                    name="fullName"
                                    value={currentForUser?.fullName}
                                    placeholder={t("meetingCreated.placeholders.enterName")}
                                    style={{backgroundColor: "#ffffff"}}
                                    /* FULL_NAME */ className="setting_input border  p-2 w-100"
                                    type="text"
                                    required
                                />
                                <Label className='required_fields'>{t("AdminUser.email")}</Label>
                                <AvField
                                    name="email"
                                    value={currentForUser?.email}
                                    placeholder={t("meetingCreated.placeholders.enterEmail")}
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
                                            defaultValue={currentForUser?.groupEnum}
                                            value={userInfo.groupEnum}
                                            onChange={(value => setUserInfo({...userInfo, groupEnum: value}))}
                                        >
                                            {statusText?.map(value =>
                                                <Option value={value.value} key={value.id}>{value.text}</Option>
                                            )}
                                        </Select>
                                    </Col>
                                    <Col md={6}>
                                        <div className="form-group">
                                            <Label>{t("user.grajdan")}</Label>
                                            <Select
                                                className="setting_input w-100"
                                                placeholder="Выберите статус"
                                                optionFilterProp="children"
                                                defaultValue={currentForUser?.resident}
                                                value={userInfo.resident}
                                                onChange={(value => setUserInfo({...userInfo, resident: value}))}
                                            >
                                                <Option value={true}>{t("user.rezident")}</Option>
                                                <Option value={false}>{t("user.nerezident")}</Option>
                                            </Select>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="row">
                                    <Col md={6}>
                                        <Label>{t("companiesList.phoneNumber")}</Label>
                                        <div className="setting_input border" style={{backgroundColor: "#ffffff"}}>
                                            <PhoneInput
                                                placeholder={t("meetingCreated.placeholders.enterPhone")}
                                                value={phoneNumber}
                                                onChange={setPhoneNumber}/>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <Label>{t("user.status")}</Label>
                                        <Select
                                            className="setting_input w-100"
                                            placeholder="Выберите статус"
                                            optionFilterProp="children"
                                            defaultValue={currentForUser?.activated}
                                            value={userInfo.activated}
                                            onChange={(value => setUserInfo({...userInfo, activated: value}))}
                                        >
                                            <Option value={true}>{t("user.aktiv")}</Option>
                                            <Option value={false}>{t("user.neaktiv")}</Option>
                                        </Select>
                                    </Col>
                                </div>
                                <Row className="d-none d-md-flex">
                                    <Col md={12}>
                                        <div className="d-flex align-items-center forCheck">
                                            <AvField
                                                className="mt-3 rounded form-check-input"
                                                id='forCheck'
                                                type='checkbox'
                                                name='isAdmin'
                                                checked={myBoolean}
                                                style={{width: "20px", height: "20px", borderRadius: "5px"}}
                                                onChange={(e) => setMyBoolean(!myBoolean)}
                                                value={myBoolean}
                                            />
                                            <Label for='forCheck'
                                                   className="form-check-label">{t("user.dostup")}</Label>
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
                                        <AvField
                                            className="setting_input border w-100 form-control"
                                            placeholder={t("meetingCreated.placeholders.enterPinfl")}
                                            style={{backgroundColor: "#ffffff", paddingLeft: '6px'}}
                                            mask="9 9999 999 999 999"
                                            tag={InputMask}
                                            maskChar=" "
                                            name="pinfl"
                                            value={pinfl}
                                            onChange={(event) => {
                                                const value = event.target.value;
                                                setPinfl(value)
                                                savePinfl(value)
                                            }}
                                            required
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <div className="form-group">
                                        <Label className='required_fields'>{t("user.login")}</Label>
                                        <AvField
                                            className="setting_input border"
                                            placeholder={t("meetingCreated.placeholders.enterLogin")}
                                            value={userInfo.generateLogin}
                                            type="text"
                                            name="username"
                                            style={{backgroundColor: "#ffffff"}}
                                            required
                                            disabled
                                        />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <AvField
                                        name="password_depository"
                                        placeholder={t("meetingCreated.placeholders.enterPassword")}
                                        label={t("user.parol")}
                                        value={userInfo.generatePassword}
                                        className="setting_input border"
                                        style={{backgroundColor: "#ffffff"}}
                                        onChange={(e) => {
                                            setUserInfo({...userInfo, generatePassword: e.target.value})
                                        }}
                                        type={password.showPassword ? "text" : "password"}
                                        maxLength={16}
                                        minLength={4}
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
                                    <div className="form-group">
                                        <Label>{t("user.registr")}</Label>
                                        <Select
                                            className="setting_input w-100"
                                            placeholder="Выберите статус"
                                            optionFilterProp="children"
                                            defaultValue={currentForUser?.authTypeEnum}
                                            value={userInfo.authTypeEnum}
                                            onChange={(value => setUserInfo({...userInfo, authTypeEnum: value}))}
                                        >
                                            {statusLogin?.map(value =>
                                                <Option value={value.value} key={value.id}>{value.text}</Option>
                                            )}
                                        </Select>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <AvField
                                        style={{backgroundColor: "#ffffff"}}
                                        name="passport"
                                        value={currentForUser?.passport}
                                        placeholder={t("meetingCreated.placeholders.enterPassport")}
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
                                            className="mt-3 rounded form-check-input"
                                            id='forCheck'
                                            type='checkbox'
                                            name='isAdmin'
                                            checked={myBoolean}
                                            style={{width: "20px", height: "20px", borderRadius: "5px"}}
                                            onChange={(e) => setMyBoolean(!myBoolean)}
                                            value={myBoolean}
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
