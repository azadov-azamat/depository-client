import React, {useEffect, useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import UsersHeading from "../components/Dashboard/AdminUsers/UsersHeading";
import {Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Label} from "reactstrap";
import {connect} from "react-redux";
import {saveUser, updateState, getUser} from "../redux/actions/userAction";
import {AvForm, AvField} from "availity-reactstrap-validation";
import {AiOutlineRight, FaArrowLeft} from "react-icons/all";
import {ENTITY, ERI, FOREIGNER, INDIVIDUAL, INPASS} from "../utils/contants";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import axios from "axios";
import {BASE_URL} from "../utils/config";
import data from "bootstrap/js/src/dom/data";
// import {waitForUseEffectCleanup} from "react-toastify/dist/test/helpers";

const UserTwo = (props) => {

    const [pnfl, setPnfl] = useState("");
    const [auth, setAuth] = useState("");

    function savePnfl(e) {
        console.log(e.target.value);
        if (e.target.value.length === 14) {
            axios.post(BASE_URL + "/moder/user/generate-login/" + e.target.value, e.target.value)
                .then((res) => {
                    setPnfl(res.data)
                })
        }
    }

    function authorities(e){
        console.log(e.target.value);
        setAuth(e.target.value);
    }

    const history = useHistory();

    return (
        <div className="settings p-3">
            <div className="container " style={{marginTop: '5em'}}>
                <div className="d-md-inline-flex d-none">
                    <Link to="/admin/users" className="nav-link text-dark"><FaArrowLeft/></Link>
                    <Link to={'/admin'} className="nav-link" style={{color: "rgba(155,153,150,0.98)"}}>Электронное
                        голосование</Link>
                    <Link className="nav-link disabled"><AiOutlineRight/></Link>
                    <Link to="/admin/users" className="nav-link" style={{color: "rgba(155,153,150,0.98)"}}>Управление
                        пользователями</Link>
                    <Link className="nav-link disabled"><AiOutlineRight/></Link>
                    <Link
                        className="nav-link text-dark h5 disabled"></Link>
                </div>
                <div className="d-block d-md-none text-center">
                    <h3>ДОБАВИТЬ ПОЛЬЗОВАТЕЛЯ</h3>
                </div>

                <AvForm className="container_wrapper" onSubmit={props.saveUser}>
                    <Row>
                        <Col md={6}>
                            <AvField
                                name="fullName"
                                label="Ф.И.О*"
                                style={{backgroundColor: "#ffffff"}}
                                className="setting_input border border-2 p-2 w-100"
                                type="text"
                                required
                            />
                            <AvField
                                name="email"
                                label="E-mail"
                                style={{backgroundColor: "#ffffff"}}
                                className="setting_input border border-2 p-2 w-100"
                                type="email"
                            />
                            <Row>
                                <Col md={6}>
                                    <AvField
                                        type="select"
                                        label="Группа"
                                        style={{backgroundColor: "#ffffff"}}
                                        className="setting_input border border-2 p-2 w-100"
                                        name="groupEnum"
                                        id="groupEnum"
                                    >
                                        <option value={INDIVIDUAL}>Физическое лицо</option>
                                        <option value={ENTITY}>Юридическое лицо</option>
                                        <option value={FOREIGNER}>Иностранец физ-лицо</option>
                                        {/*<option>Иностранец юр-лицо</option>*/}
                                        {/*<option>Физ-лицо без ИНН</option>*/}
                                        {/*<option>Юр-лицо без ИНН</option>*/}
                                    </AvField>
                                </Col>
                                <Col md={6}>
                                    <AvField
                                        className="setting_input border border-2"
                                        label="Гражданства"
                                        type="select"
                                        name="resident"
                                        style={{backgroundColor: "#ffffff"}}
                                    >
                                        <option value={'active'}>Резидент</option>
                                        <option value={'noActive'}>не Резидент</option>
                                    </AvField>
                                </Col>
                            </Row>
                            <div className="row">
                                <Col md={6}>
                                    <AvField
                                        label="Телефон"
                                        name="phoneNumber"
                                        className="setting_input border border-2"
                                        style={{backgroundColor: "#ffffff"}}
                                        minLength={6}
                                    />
                                </Col>
                                <Col md={6}>
                                    <AvField
                                        type="select"
                                        label="Статус"
                                        helpMessage=" "
                                        style={{backgroundColor: "#ffffff"}}
                                        className="setting_input border border-2 p-2 w-100"
                                        name="activated"
                                        id="activated">
                                        <option value={'active'}>Активно</option>
                                        <option value={'noActive'}>Неактивно</option>
                                    </AvField>
                                </Col>
                            </div>
                            <Row className="d-none d-md-block">
                                <Col md={12}>
                                    <div className="d-flex align-items-center forCheck">
                                        <AvField
                                            id='forCheck'
                                            type='checkbox'
                                            // name='isAdmin'
                                            onChange={authorities}
                                        />
                                        <Label for='forCheck'>Админ доступ</Label>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={6}>
                            <Row>
                                {/*pnfl*/}
                                <Col md={6}>
                                    <AvField
                                        className="setting_input border border-2"
                                        label="ПИНФЛ*"
                                        type="text"
                                        name="pinfl"
                                        style={{backgroundColor: "#ffffff"}}
                                        minLength={14} maxLength={14}
                                        required
                                        onChange={savePnfl}
                                    />
                                </Col>
                                {/*inn*/}
                                <Col md={6}>
                                    <AvField
                                        style={{backgroundColor: "#ffffff"}}
                                        name="inn"
                                        label="ИНН"
                                        minLength={9} maxLength={9}
                                        className="setting_input border-2"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                {/*login*/}
                                <Col md={6}>
                                    <AvField
                                        className="setting_input border-2"
                                        label="Логин"
                                        type="text"
                                        name="login"
                                        style={{backgroundColor: "#ffffff"}}
                                        required
                                        disabled
                                        value={pnfl}
                                    />
                                </Col>
                                {/*password*/}
                                <Col md={6}>
                                    <AvField
                                        name="password"
                                        label="Пароль"
                                        className="setting_input border-2"
                                        style={{backgroundColor: "#ffffff"}}
                                        maxLength={16}
                                        minLength={4}

                                    />
                                    <div className="float-end">
                                        <InputAdornment style={{marginTop: "-19px"}} color={"dark"} position={"end"}>
                                            <IconButton
                                            >
                                            </IconButton>
                                        </InputAdornment>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                {/*authTypeEnum*/}
                                <Col md={6}>
                                    <AvField
                                        type="select"
                                        label="Способ регистраций"
                                        style={{backgroundColor: "#ffffff"}}
                                        className="setting_input border border-2"
                                        name="authTypeEnum">
                                        <option value={ERI}>Только ЭЦП</option>
                                        <option value={INPASS}>Только Логин и Пароль</option>
                                    </AvField>
                                </Col>
                                {/*passport*/}
                                <Col md={6}>
                                    <AvField
                                        style={{backgroundColor: "#ffffff"}}
                                        name="passport"
                                        label="Серия и номер паспорта"
                                        className="setting_input border-2"
                                        minLength={2}
                                        maxLength={9}
                                    />
                                </Col>
                            </Row>
                            <Row>

                                {/*authorities*/}
                                <Col md={6} className="d-none">
                                    <AvField
                                        style={{backgroundColor: "#ffffff"}}
                                        name="authorities"
                                        label="Authorities"
                                        className="setting_input border-2"
                                        value={auth ? "ROLE_ADMIN" : "ROLE_USER"}
                                    />
                                </Col>


                                <Col md={6}>
                                    <div
                                        className="d-inline-flex d-sm-flex justify-content-md-center justify-content-end  w-100 mt-md-5">
                                        <button type="submit" className="btn-save d-block px-3 py-2 mx-2 my-1"
                                            // onClick={() => history.push("/admin/users")}
                                        >
                                            Создать
                                        </button>
                                        <button onClick={() => history.push("/admin/users")}
                                                className="btn-cancel px-3 py-2 my-1 mx-2">Отмена
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </AvForm>
            </div>
        </div>
    );
};
const mapStateToProps = (state) => {
    return {
        open: state.user.open,
        // user: state.user.user
    }
}

export default connect(mapStateToProps, {saveUser, updateState, getUser})(UserTwo);