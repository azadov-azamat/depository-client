import React, {useState} from 'react'
import {AvField, AvForm} from 'availity-reactstrap-validation';
import {useHistory, useParams} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {Col, Label, Row} from "reactstrap";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {ENTITY, ERI, FOREIGNER, INDIVIDUAL, INPASS} from "../../../utils/contants";
import RouteByDashboard from "../RouteByDashboard";
import {useTranslation} from "react-i18next";
import PhoneInput from "react-phone-number-input";
import {useIMask} from "react-imask";

export default function AddOrEditUser() {

    const dispatch = useDispatch()
    const history = useHistory()
    const {id} = useParams();
    const {t} = useTranslation();

    const currentUser = ''
    const currentEditUser = ''
    const [password, setPassword] = useState({
        password: "",
        showPassword: false,
        generatePassword: ""
    })
    const [phoneNumber, setPhoneNumber] = useState();
    const [opts, setOpts] = useState({mask: Number});
    const {ref, maskRef} = useIMask(opts);

    const addUser = (e, v) => {
        const data = {
            fullName: v.fullName,
            activated: v.activated === 'active',
            authTypeEnum: "INPASS",
            authorities: [v.isAdmin === true ? "ROLE_ADMIN" : 'ROLE_USER'],
            email: v.email,
            groupEnum: "INDIVIDUAL",
            inn: v.inn,
            login: v.username,
            password: v.password,
            passport: v.passport,
            pinfl: v.pinfl,
            resident: v.resident === 'active',
            phoneNumber: v.phoneNumber
        }

        // dispatch(adminUsersAction.createUserForAdmin({data, history}))

    }

    const editUser = (e, v) => {
        // console.log(v)
        // e.preventDefault();
        // const data = {
        //     id: parseInt(id),
        //     ...v,
        //
        // }
        // // console.log(data)
        // dispatch({type: UPDATE_USER, payload: data})
        // history.push('/admin/users')
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

            // setPassword({generatePassword: randomstring})
        }
    }

    let savePinfl;

    return (
        <div className="settings p-3">
            <div className="container-fluid" style={{marginTop: '12vh'}}>
                <RouteByDashboard lang={t} cardName={t("routes.controlPage.user")} disabled={true}
                                  link2={`/admin/users`}
                                  statusName={currentUser ? t("routes.addOrEditPage.editUser") : t("routes.addOrEditPage.addUser")}/>
                <div className="d-block d-md-none text-center">
                    <h3>{currentUser ? t("routes.addOrEditPage.editCompany") : t("routes.addOrEditPage.addCompany")}</h3>
                </div>
            </div>
            <div className='container'>
                <AvForm className="container_wrapper" onValidSubmit={currentUser ? editUser : addUser}>
                    <Row>
                        <Col md={6}>
                            <div className="form-group">
                                <Label className='required_fields'>{t("AdminUser.fullName")}</Label>
                                <AvField
                                    name="fullName"
                                    value={currentEditUser?.fullName}
                                    style={{backgroundColor: "#ffffff"}}
                                    className="setting_input border  p-2 w-100"
                                    type="text"

                                />
                                <AvField
                                    name="email"
                                    label={t("AdminUser.email")}
                                    value={currentEditUser?.email}
                                    style={{backgroundColor: "#ffffff"}}
                                    className="setting_input border  p-2 w-100"
                                    type="email"
                                />
                                <Row>
                                    <Col md={6}>
                                        <AvField type="select"
                                                 label={t("AdminUser.group")}
                                                 style={{backgroundColor: "#ffffff"}}
                                                 className="setting_input border  p-2 w-100" name="groupEnum"
                                                 id="groupEnum">
                                            <option value={INDIVIDUAL}>{t("user.jismoniy")}</option>
                                            <option value={ENTITY}>{t("user.yuridik")}</option>
                                            <option value={FOREIGNER}>{t("user.chetel")}</option>
                                        </AvField>
                                    </Col>
                                    <Col md={6}>
                                        <AvField
                                            className="setting_input border "
                                            label={t("user.grajdan")}
                                            type="select" name="resident"
                                            style={{backgroundColor: "#ffffff"}}
                                            defaultValue={true}
                                        >
                                            <option value={true}>{t("user.rezident")}</option>
                                            <option value={false}>{t("user.nerezident")}</option>
                                        </AvField>
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
                                        <AvField type="select"
                                                 label={t("user.status")}
                                                 helpMessage=""
                                                 style={{backgroundColor: "#ffffff"}}
                                                 className="setting_input border  p-2 w-100" name="activated"
                                                 id="activated"
                                                 defaultValue={true}>
                                            <option value={true}>{t("user.aktiv")}</option>
                                            <option value={false}>{t("user.neaktiv")}</option>
                                        </AvField>
                                    </Col>
                                </div>
                                <Row className="d-none d-md-block">
                                    <Col md={12}>
                                        <div className="d-flex align-items-center forCheck">
                                            <AvField
                                                className="mt-3 rounded"
                                                style={{width: "20px", height: "20px", borderRadius: "5px"}}
                                                id='forCheck'
                                                type='checkbox'
                                                name='isAdmin'
                                                // onChange={authorities}
                                                // onChange={handleChange}
                                                // defaultChecked={isAdmin === 'ROLE_MODERATOR' ? true : false}
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
                                            name="inn"
                                            minLength={14} maxLength={14}
                                            // onChange={savePinfl}
                                            className="setting_input border "
                                            required
                                        />
                                    </div>

                                </Col>
                                <Col md={6}>
                                    <div className="form-group d-flex flex-column">
                                        <Label className='required_fields'>{t("user.inn")}</Label>
                                        <input
                                            ref={ref}
                                            style={{backgroundColor: "#ffffff", paddingLeft: '6px'}}
                                            name="inn"
                                            value={currentEditUser?.inn}
                                            minLength={9} maxLength={9}
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
                                            value={currentEditUser?.username}
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
                                        value={currentEditUser?.password}
                                        className="setting_input border"
                                        style={{backgroundColor: "#ffffff"}}
                                        onChange={handlePasswordChange("password")}
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
                                    <AvField type="select"
                                             label={t("user.registr")}
                                             style={{backgroundColor: "#ffffff"}}
                                             className="setting_input border" name="authTypeEnum"
                                        // defaultValue={selectItem.authTypeEnum ? authTypeEnum : INPASS}
                                    >
                                        <option value={ERI}>{t("user.etp")}</option>
                                        <option value={INPASS}>{t("user.loginetp")}</option>
                                    </AvField>
                                </Col>
                                <Col md={6}>
                                    <AvField
                                        style={{backgroundColor: "#ffffff"}}
                                        name="passport"
                                        value={currentEditUser?.passport}
                                        label={t("user.passport")}
                                        className="setting_input border"
                                        minLength={2}
                                        maxLength={9}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6} className="d-block d-md-none">
                                    <div className="d-flex align-items-center forCheck">
                                        <AvField
                                            id='forCheck'
                                            type='checkbox'
                                            name='isAdmin'
                                            value={currentEditUser.isAdmin}
                                        />
                                        <Label for='forCheck'>{t("user.dostup")}</Label>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div
                                        className="d-inline-flex d-sm-flex justify-content-md-center justify-content-end  w-100 mt-md-5">
                                        <button type="submit" className="btn-save d-block px-3 py-2 mx-2 my-1">
                                            {currentUser ? t("user.redaktorovat") : t("user.sozdat")}
                                        </button>
                                        <button onClick={() => history.push('/admin')}
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
