import React, {useEffect, useState} from 'react'
import {AvField, AvForm} from 'availity-reactstrap-validation';
import {useHistory, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Col, Label, Row} from "reactstrap";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {ANY, ENTITY, FOREIGNER, INDIVIDUAL, INPASS} from "../../../utils/contants";
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
    const [myBoolean, setMyBoolean] = useState(null);
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

            resident: currentForUser.resident,
            activated: currentForUser.activated,
            groupEnum: currentForUser.groupEnum,
            authTypeEnum: currentForUser.authTypeEnum,
        })
        setPinfl(currentForUser.pinfl)
        setPhoneNumber(currentForUser.phoneNumber)
        const auth = currentForUser.authorities
        if ({...auth} === "ROLE_MODERATOR") {
            setMyBoolean(true)
        }
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
        const authority = [];
        if (v.isAdmin === true) {
            authority.push("ROLE_MODERATOR")
        } else if (v.isAdmin === false) {
            authority.push("ROLE_USER")
        }
        if (pinfl && userInfo.generateLogin) {
            const data = {
                fullName: v.fullName,
                activated: userInfo.activated,
                authTypeEnum: ['ROLE_USER'],
                authorities: authority,
                email: v.email,
                groupEnum: userInfo.groupEnum,
                inn: null,
                login: userInfo.generateLogin,
                password: userInfo.generatePassword,
                passport: v.passport,
                pinfl: pinfl,
                resident: userInfo.resident,
                phoneNumber: phoneNumber
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
        if (pinfl && authority && userInfo.generateLogin) {
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
                pinfl: pinfl,
                resident: userInfo.resident,
                phoneNumber: phoneNumber
            }
            dispatch(adminUsersAction.editUserAction({data, history}))
        } else {
            toast.warning("Iltimos kerakli hamma malumotlarni to`ldiring")
        }
    }

    const savePinfl = (value) => {
        if (value.length === 14) {
            axios.post(BASE_URL + "/moder/user/generate-login/" + value)
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

    function generate(pinfl, login) {
        let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let string_length = 8;
        let randomstring = '';
        for (let i = 0; i < string_length; i++) {
            let rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        setUserInfo({...userInfo, generateLogin: login, pinfl: pinfl, generatePassword: randomstring})
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

    function selectStatusResidentUser(value) {
        setUserInfo({...userInfo, resident: value})
    }

    function selectStatusUser(value) {
        setUserInfo({...userInfo, activated: value})
    }

    function selectGroupEnumUser(value) {
        setUserInfo({...userInfo, groupEnum: value})
    }

    function selectLoginTypeUser(value) {
        setUserInfo({...userInfo, authTypeEnum: value})
    }

    const statusText = [
        {value: INDIVIDUAL, text: t("user.jismoniy")},
        {value: ENTITY, text: t("user.yuridik")},
        {value: FOREIGNER, text: t("user.chetel")},
    ];

    const statusLogin = [
        {value: ANY, text: t("user.etp")},
        {value: INPASS, text: t("user.loginetp")},
    ];

    console.log(currentForUser)

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
                                            defaultValue={currentForUser?.groupEnum}
                                            value={userInfo.groupEnum}
                                            onChange={selectGroupEnumUser}
                                        >
                                            {statusText && statusText.map(value =>
                                                <Option value={value.value}>{value.text}</Option>
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
                                                onChange={selectStatusResidentUser}
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
                                                placeholder="Enter phone number"
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
                                            onChange={selectStatusUser}
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
                                                className="mt-3 rounded"
                                                id='forCheck'
                                                type='checkbox'
                                                name='isAdmin'
                                                style={{width: "20px", height: "20px", borderRadius: "5px"}}
                                                onChange={(e) => setMyBoolean(e.target.value)}
                                                defaultValue={() => currentForUser.authorities.some(element => element === 'ROLE_ADMIN')}
                                                value={myBoolean}
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
                                            value={pinfl}
                                            maxLength={14}
                                            onChange={(event) => {
                                                const value = event.target.value;
                                                setPinfl(value)
                                                savePinfl(value)
                                            }}
                                            className="setting_input border"
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
                                            value={userInfo.generateLogin}
                                            type="text"
                                            name="username"
                                            style={{backgroundColor: "#ffffff"}}
                                            disabled
                                        />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <AvField
                                        name="passwordferfwrthtyhsdfwreg"
                                        label={t("user.parol")}
                                        value={userInfo.generatePassword}
                                        className="setting_input border"
                                        style={{backgroundColor: "#ffffff"}}
                                        onChange={(e) => {
                                            setUserInfo({...userInfo, generatePassword: e.target.value})
                                            handlePasswordChange("password")
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
                                            value={currentForUser.authTypeEnum}
                                            onChange={selectLoginTypeUser}
                                        >
                                            {statusLogin && statusLogin.map((value, index) =>
                                                <Option value={value.value} key={index}>{value.text}</Option>
                                            )}
                                        </Select>
                                    </div>
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
                                            onChange={(e) => setMyBoolean(e.target.value)}
                                            defaultValue={myBoolean}
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
