import React, {useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import {Row, Col, Label} from "reactstrap";
import {connect} from "react-redux";
import {saveUser, updateState, getUser, editUser} from "../redux/actions/userAction";
import {AvForm, AvField} from "availity-reactstrap-validation";
import {AiOutlineRight, FaArrowLeft} from "react-icons/all";
import {ADMIN, ENTITY, ERI, FOREIGNER, INDIVIDUAL, INPASS} from "../utils/contants";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import {BASE_URL} from "../utils/config";
import {toast} from "react-toastify";
import {IoMdRefresh} from "react-icons/io";
import {SELECTED_ITEM} from "../redux/actionTypes/UsersActionTypes";
import {useTranslation} from "react-i18next";
import {login} from "../redux/actions/AuthActions";

const User = (props) => {

    const {t} = useTranslation();
    const [authType, setAuthType] = useState(INPASS);
    const [pnfl, setPnfl] = useState("");
    const [auth, setAuth] = useState(["ROLE_USER"]);
    const [count, setCount] = useState(1);
    const [randomS, setRandomS] = useState('');

    function savePnfl(e) {
        // console.log(e.target.value);
        if (e.target.value.length === 14) {
            axios.post(BASE_URL + "/moder/user/generate-login/" + e.target.value, e.target.value)
                .then((res) => {
                    setPnfl(res.data);
                    generate();
                })
                .catch((error) => {
                    toast.error('Bu pnfl oldin kiritilgan')
                })
        }
    }

    function generate() {
        let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let string_length = 8;
        let randomstring = '';
        for (let i = 0; i < string_length; i++) {
            let rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
            setRandomS(randomstring)
        }
    }

    const handleChange = (e) => {
        setCount(count + 1);
        // console.log(count)
        // const check = e.target.value;
        // console.log(check);
        // console.log("check");
        console.log(count);

        count % 2 === 0 ? setAuth(['ROLE_USER']) : setAuth(['ROLE_MODERATOR']);

        // isAdmin === ['ROLE_MODERATOR'] ? setCount(1) : setCount(0);
    };


    const selectItem = JSON.parse(localStorage.getItem(SELECTED_ITEM));
    // console.log(selectItem);
    const history = useHistory();
    const adminDostup = selectItem?.authorities;
    const isAdmin = adminDostup ? adminDostup[0] : false;
    const groupEnum = selectItem?.groupEnum;
    console.log(groupEnum)
    const resident = selectItem?.resident;
    console.log(resident)
    const activated = selectItem?.activated;
    console.log(activated)
    const authTypeEnum = selectItem?.authTypeEnum;
    console.log(authTypeEnum);



    return (
        <div className="settings p-3">
            <div className="container " style={{marginTop: '5em'}}>
                <div className="d-md-inline-flex d-none align-items-center">
                    <Link to="/admin/users" className="nav-link text-dark"><FaArrowLeft/></Link>
                    <Link to={'/admin'} className="nav-link"
                          style={{color: "rgba(155,153,150,0.98)"}}>{t("UsersHeading.sound")}</Link>
                    <Link className="nav-link disabled"><AiOutlineRight/></Link>
                    <Link to="/admin/users" className="nav-link"
                          style={{color: "rgba(155,153,150,0.98)"}}>{t("UsersHeading.user")}</Link>
                    <Link className="nav-link disabled"><AiOutlineRight/></Link>
                    <Link
                        className="nav-link text-dark h5 disabled">
                    </Link>
                    <div className="d-block">
                        {props.selectedItem.id ? <h5 className="mt-2">{t("UsersHeading.update")}</h5> :
                            <h5 className="mt-2">{t("UsersHeading.save")}</h5>
                        }
                    </div>
                </div>


                <AvForm className="container_wrapper" onSubmit={
                    props.selectedItem.id ?
                        (event, error, values) => {
                            props.editUser(event, error, values, props.history)
                        } :
                        (event, error, values) => {
                            props.saveUser(event, error, values, props.history)
                        }
                }
                        model={selectItem}
                >
                    {/*{console.log(props.selectedItem.authorities)}*/}
                    <Row>
                        {props.selectedItem.id ?
                            <AvField name="id" type="text" className="inputNone d-none"/>
                            : ""
                        }
                        <Col md={6}>
                            <AvField
                                name="fullName"
                                label={t("AdminUser.fullName") + "*"}
                                style={{backgroundColor: "#ffffff"}}
                                className="setting_input border border-2 p-2 w-100"
                                type="text"
                                required
                            />
                            <AvField
                                name="email"
                                label={t("AdminUser.email")}
                                style={{backgroundColor: "#ffffff"}}
                                className="setting_input border border-2 p-2 w-100"
                                type="email"
                            />
                            <Row>

                                {/*groupEnum*/}
                                <Col md={6}>
                                    <AvField
                                        type="select"
                                        label={t("AdminUser.group")}
                                        style={{backgroundColor: "#ffffff"}}
                                        className="setting_input border border-2 p-2 w-100"
                                        name="groupEnum"
                                        id="groupEnum"
                                        defaultValue={selectItem.groupEnum ? groupEnum : INDIVIDUAL}
                                    >
                                        <option value={INDIVIDUAL}>{t("user.jismoniy")}</option>
                                        <option value={ENTITY}>{t("user.yuridik")}</option>
                                        <option value={FOREIGNER}>{t("user.chetel")}</option>
                                        {/*<option value={ADMIN}>{t("user.admin")}</option>*/}
                                    </AvField>
                                </Col>

                                {/*resident*/}
                                <Col md={6}>
                                    <AvField
                                        className="setting_input border border-2"
                                        label={t("user.grajdan")}
                                        type="select"
                                        name="resident"
                                        style={{backgroundColor: "#ffffff"}}
                                        defaultValue={selectItem ? resident : true}
                                    >
                                        <option value={true}>{t("user.rezident")}</option>
                                        <option value={false}>{t("user.nerezident")}</option>
                                    </AvField>
                                </Col>
                            </Row>
                            <div className="row">

                                {/*phonenumber*/}
                                <Col md={6}>
                                    <AvField
                                        label={t("user.tel")}
                                        name="phoneNumber"
                                        className="setting_input border border-2"
                                        style={{backgroundColor: "#ffffff"}}
                                        minLength={6}
                                        maxLength={13}
                                    />
                                </Col>

                                {/*activated*/}
                                <Col md={6}>
                                    <AvField
                                        type="select"
                                        label={t("user.status")}
                                        helpMessage=" "
                                        style={{backgroundColor: "#ffffff"}}
                                        className="setting_input border border-2 p-2 w-100"
                                        name="activated"
                                        id="activated"
                                        defaultValue={selectItem ? activated : true}>
                                            <option value={true}>{t("user.aktiv")}</option>
                                            <option value={false}>{t("user.neaktiv")}</option>
                                    </AvField>
                                </Col>
                            </div>

                            <Row className="d-none d-md-block">
                                {/*checkbox*/}
                                <Col md={12}>
                                    <div className="d-flex align-items-center forCheck">
                                        <AvField
                                            className="mt-3 rounded"
                                            style={{width: "20px", height: "20px", borderRadius: "5px"}}
                                            id='forCheck'
                                            type='checkbox'
                                            name='isAdmin'
                                            // onChange={authorities}
                                            onChange={handleChange}
                                            defaultChecked={isAdmin === 'ROLE_MODERATOR' ? true : false}
                                            // defaultChecked === 'ROLE_MODERATOR'}
                                        />
                                        <Label for='forCheck'>{t("user.dostup")}</Label>
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
                                        label={t("user.pnfl") + "*"}
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
                                        label={t("user.inn")}
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
                                        label={t("user.login") + "*"}
                                        type="text"
                                        name="login"
                                        style={{backgroundColor: "#ffffff"}}
                                        required
                                        value={pnfl}
                                        disabled
                                    />
                                </Col>
                                {/*password*/}
                                <Col className="position-relative" md={6}>

                                    <button type="button" className="absolut_btn" onClick={generate}><IoMdRefresh/>
                                    </button>
                                    <AvField
                                        name="password"
                                        label={t("user.parol")}
                                        className="setting_input border-2"
                                        style={{backgroundColor: "#ffffff"}}
                                        maxLength={16}
                                        minLength={4}
                                        value={randomS}
                                    />
                                    <div className="float-end">
                                        <InputAdornment style={{marginTop: "-19px"}} color={"dark"} position={"end"}>
                                            <IconButton>

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
                                        label={t("user.registr")}
                                        style={{backgroundColor: "#ffffff"}}
                                        className="setting_input border border-2"
                                        name="authTypeEnum"
                                        defaultValue={selectItem.authTypeEnum ? authTypeEnum : INPASS}
                                    >
                                        <option value={INPASS}>{t("user.loginetp")}</option>
                                        <option value={ERI}>{t("user.etp")}</option>
                                    </AvField>
                                </Col>
                                {/*passport*/}
                                <Col md={6}>
                                    <AvField
                                        style={{backgroundColor: "#ffffff"}}
                                        name="passport"
                                        label={t("user.passport")}
                                        className="setting_input border-2"
                                        minLength={2}
                                        maxLength={9}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                {/*authorities*/}
                                <Col md={6} className="d-block d-md-none">
                                    <div className="d-flex align-items-center forCheck">
                                        <AvField
                                            className="rounded-2 mt-3"
                                            id='forCheck'
                                            type='checkbox'
                                            name='isAdmin'
                                            style={{width: "20px", height: "20px", borderRadius: "40%!important"}}
                                            onChange={handleChange}
                                            defaultChecked={isAdmin === 'ROLE_MODERATOR' ? true : false}
                                        />
                                        <Label for='forCheck'>{t("user.dostup")}</Label>
                                    </div>
                                </Col>
                                <Col md={6} className="d-none">
                                    <AvField
                                        style={{backgroundColor: "#ffffff"}}
                                        name="authorities"
                                        label="Authorities"
                                        className="setting_input border-2"
                                        value={auth}
                                    />
                                </Col>
                                {/*buttons*/}
                                <Col md={6}>
                                    <div
                                        className="d-inline-flex d-sm-flex justify-content-md-center justify-content-end  w-100"
                                        style={{marginTop: "29px"}}>
                                        <button type="submit" className="btn-save d-block px-3 py-2 mx-2 my-1">
                                            {props.selectedItem.id ? t("user.redaktorovat") : t("user.sozdat")}
                                        </button>
                                        <button onClick={() => {
                                            history.push("/admin/users");
                                            localStorage.setItem(SELECTED_ITEM, JSON.stringify({}))
                                        }} type="button"
                                                className="btn-cancel px-3 py-2 my-1 mx-2">{t("user.otmena")}
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
        user: state.user.user,
        selectedItem: state.user.selectedItem
    }
}

export default connect(mapStateToProps, {saveUser, updateState, getUser, editUser})(User);