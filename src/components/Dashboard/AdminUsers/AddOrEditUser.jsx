import React, {useEffect, useState} from 'react'
import {AvField, AvForm} from 'availity-reactstrap-validation';
import {Link, useHistory, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Col, Label, Row} from "reactstrap";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {UPDATE_USER, ADD_USER, ADD_USER_LIST} from '../../../redux/actionTypes/actionTypes';
import {AiOutlineRight, FaArrowLeft} from "react-icons/all";
import {ADMIN, ANY, ENTITY, ERI, FOREIGNER, INDIVIDUAL, INPASS} from "../../../utils/contants";
import * as adminUsersAction from '../../../redux/actions/UsersAction';
import axios from "axios";
import {BASE_URL} from "../../../utils/config";
import {api} from "../../../api/api";

export default function AddOrEditUser() {

    const dispatch = useDispatch()
    const history = useHistory()
    const {id} = useParams();
    const [password, setPassword] = useState({
        password: "",
        showPassword: false,
        generatePassword: ""
    })
    const currentUser = ''
    const currentEditUser = ''
    // const {users} = useSelector(state => state)
    // const dispatch = useDispatch();
    // const currentUser = users.find(user => user.id === parseInt(id))
    // const [currentEditUser, setCurrentEditUser] = useState({
    //     fullName: '',
    //     username: '',
    //     password: '',
    //     email: '',
    //     phoneNumber: '+998',
    //     pinfl: '',
    //     inn: '',
    //     passport: '',
    //     groupEnum: FOREIGNER,
    //     authTypeEnum: ANY,
    //     activated: false,
    //     isAdmin: false,
    //     resident: true
    //
    // })
    //
    // useEffect(() => {
    //     if (currentUser) {
    //         setCurrentEditUser({
    //             ...currentEditUser,
    //             fullName: currentUser.fullName,
    //             username: currentUser.username,
    //             password: currentUser.password,
    //             email: currentUser.email,
    //             phoneNumber: currentUser.phoneNumber,
    //             pinfl: currentUser.pinfl,
    //             inn: currentUser.inn,
    //             passport: currentUser.passport,
    //             groupEnum: currentUser.groupEnum,
    //             authTypeEnum: currentUser.authTypeEnum,
    //             activated: currentUser.activated,
    //             isAdmin: currentUser.isAdmin,
    //             resident: currentUser.resident
    //         })
    //     }
    //     axios.get(BASE_URL+api.createUser).
    //     then(res=>{
    //         console.log(res)
    //         dispatch({type: ADD_USER_LIST, payload: res.data})
    //     })
    //         .catch(err=>{
    //         console.log(err)})
    // }, [currentUser])

    const addUser = (e, v) => {
        // console.log(v)
        e.preventDefault();
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
        // console.log(data)
        // const data = {
        //     id: users.length > 0 ? users[users.length - 1]?.id + 1 : 0 + 1,
        //     ...v,
        // }
        // console.log(data)
        //
        dispatch(adminUsersAction.createUserForAdmin({data, history}))

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
                        className="nav-link text-dark h5 disabled">{currentUser ? "РЕДАКТИРОВАТЬ ПОЛЬЗОВАТЕЛЯ" : "ДОБАВИТЬ ПОЛЬЗОВАТЕЛЯ"}</Link>
                </div>
                <div className="d-block d-md-none text-center">
                    <h3>{currentUser ? "РЕДАКТИРОВАТЬ ПОЛЬЗОВАТЕЛЯ" : "ДОБАВИТЬ ПОЛЬЗОВАТЕЛЯ"}</h3>
                </div>

                <AvForm className="container_wrapper" onValidSubmit={currentUser ? editUser : addUser}>
                    <Row>
                        <Col md={6}>
                            <AvField
                                name={"fullName"}
                                label="Ф.И.О*"
                                value={currentEditUser?.fullName}
                                style={{backgroundColor: "#ffffff"}}
                                className="setting_input border border-2 p-2 w-100"
                                type="text"

                            />
                            <AvField
                                name="email"
                                label="E-mail"
                                value={currentEditUser?.email}
                                style={{backgroundColor: "#ffffff"}}
                                className="setting_input border border-2 p-2 w-100"
                                type="email"
                            />
                            <Row>
                                <Col md={6}>
                                    <AvField type="select"
                                             label={'Группа'}
                                             style={{backgroundColor: "#ffffff"}}
                                             className="setting_input border border-2 p-2 w-100" name="groupEnum"
                                             id="groupEnum">
                                        <option value={INDIVIDUAL}>Физическое лицо</option>
                                        <option value={ENTITY}>Юридическое лицо</option>
                                        <option value={FOREIGNER}>Иностранец</option>
                                        <option value={ADMIN}>Администратор</option>
                                        {/*<option>Иностранец юр-лицо</option>*/}
                                        {/*<option>Физ-лицо без ИНН</option>*/}
                                        {/*<option>Юр-лицо без ИНН</option>*/}
                                    </AvField>
                                </Col>
                                <Col md={6}>
                                    <AvField
                                        className="setting_input border border-2"
                                        label="Гражданства"
                                        type="select" name="resident"
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
                                        label={'Телефон'}
                                        name="phoneNumber"
                                        value={currentEditUser?.phoneNumber}
                                        className="setting_input border border-2"
                                        style={{backgroundColor: "#ffffff"}}
                                        minLength={6}
                                    />
                                </Col>
                                <Col md={6}>
                                    <AvField type="select"
                                             label="Статус"
                                             helpMessage=""
                                             style={{backgroundColor: "#ffffff"}}
                                             className="setting_input border border-2 p-2 w-100" name="activated"
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
                                            name='isAdmin'
                                            value={currentEditUser.isAdmin}
                                        />
                                        <Label for='forCheck'>Админ доступ</Label>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={6}>
                            <Row>
                                <Col md={6}>
                                    <AvField
                                        className="setting_input border border-2"
                                        label="ПИНФЛ*"
                                        type="text" name="pinfl"
                                        value={currentEditUser?.pinfl}
                                        style={{backgroundColor: "#ffffff"}}
                                        minLength={14} maxLength={14}
                                    />
                                </Col>
                                <Col md={6}>
                                    <AvField
                                        style={{backgroundColor: "#ffffff"}}
                                        name="inn"
                                        label="ИНН"
                                        value={currentEditUser?.inn}
                                        minLength={9} maxLength={9}
                                        className="setting_input border-2"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <AvField
                                        className="setting_input border-2"
                                        label="Логин"
                                        value={currentEditUser?.username}
                                        type="text"
                                        name="username"
                                        style={{backgroundColor: "#ffffff"}}
                                        disabled
                                    />
                                </Col>
                                <Col md={6}>
                                    <AvField
                                        name="password"
                                        label="Пароль"
                                        value={currentEditUser?.password}
                                        className="setting_input border-2"
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
                                             label={'Способ регистраций'}
                                             style={{backgroundColor: "#ffffff"}}
                                             className="setting_input border border-2" name="authTypeEnum">
                                            defaultValue={ERI}
                                        <option value={ERI}>Только ЭЦП</option>
                                        <option value={INPASS}>Только Логин и Пароль</option>
                                    </AvField>
                                </Col>
                                <Col md={6}>
                                    <AvField
                                        style={{backgroundColor: "#ffffff"}}
                                        name="passport"
                                        value={currentEditUser?.passport}
                                        label="Серия и номер паспорта"
                                        className="setting_input border-2"
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
                                        <Label for='forCheck'>Админ доступ</Label>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div
                                        className="d-inline-flex d-sm-flex justify-content-md-center justify-content-end  w-100 mt-md-5">
                                        <button type="submit" className="btn-save d-block px-3 py-2 mx-2 my-1">
                                            {currentUser ? "Редактировать" : "Создать "}
                                        </button>
                                        <button onClick={() => history.push('/admin')}
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

    )
}
