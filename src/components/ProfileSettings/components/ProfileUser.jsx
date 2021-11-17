import React from "react";
import {Button, Col, Row} from "reactstrap";
import {AvField, AvForm} from "availity-reactstrap-validation";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {useDispatch} from "react-redux";
import * as userAction from '../../../redux/actions/UsersAction'
import Loader from "react-loader-spinner";
import {toast} from "react-toastify";

export default function ProfileUser({lang, currentUser, loading}) {

    const dispatch = useDispatch()
    const [parol, setParol] = React.useState({
        password: "",
        showPassword: false,
        token: "",
    });

    const style = {
        cursor: 'no-drop',
    }
    const handleClickShowPassword = () => {
        setParol({...parol, showPassword: !parol.showPassword});
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handlePasswordChange = (prop) => (event) => {
        setParol({...parol, [prop]: event.target.value});
    };

    function EditProfile(e, v) {
        if (v.password === v.prePassword) {
            const data = {
                fullName: currentUser?.fullName,
                activated: currentUser?.activated,
                authTypeEnum: currentUser?.authTypeEnum,
                authorities: currentUser?.authorities,
                groupEnum: currentUser?.groupEnum,
                id: currentUser?.id,
                inn: currentUser?.inn,
                login: currentUser?.login,
                passport: currentUser?.passport,
                pinfl: currentUser?.pinfl,
                resident: currentUser?.resident,
                email: v.email,
                phoneNumber: v.phoneNumber,
                password: v.password
            }
            dispatch(userAction.editUserAction({data}))
        } else {
            toast.error("Parollar mos emas")
        }
    }


    return (
        <AvForm onValidSubmit={EditProfile}>
            <Row>
                <Col md={6}>
                    <div className="">
                        <AvField
                            type="text"
                            name="fullName"
                            label={lang("FISH")}
                            value={currentUser?.fullName}
                            className="border border-2"
                            style={style}
                            disabled
                            required
                        />

                        <Row>
                            <Col md={6}>
                                <AvField
                                    type="text"
                                    name="passport"
                                    label={lang("passport")} helpMessage=""
                                    value={currentUser?.passport}
                                    className="border border-2"
                                    style={style}
                                    disabled
                                    required
                                />
                            </Col>
                            <div className='d-md-none'>
                                <Col md={6}>
                                    <AvField
                                        type="text"
                                        name="pinfl" label={lang("pinfl")}
                                        minLength={14}
                                        maxLength={14}
                                        value={currentUser?.pinfl}
                                        className="border border-2"
                                        style={style}
                                        disabled
                                        required
                                    />
                                </Col>
                                <Col md={6}>
                                    <AvField
                                        type="text"
                                        name="inn" label={lang("inn")} helpMessage=""
                                        errorMessage="real-check"
                                        minLength={9}
                                        maxLength={9}
                                        value={currentUser?.inn}
                                        className="border border-2"
                                        style={style}
                                        disabled
                                        required
                                    />
                                </Col>
                                <AvField
                                    type="text"
                                    label={lang("phoneNumber")}
                                    name="phoneNumber"
                                    value={currentUser?.phoneNumber}
                                    className="border border-2"
                                    style={{backgroundColor: "#ffffff"}}
                                    validate={{
                                        minLength: {value: 6, errorMessage: ''},
                                    }}
                                    required
                                />
                            </div>
                            <Col md={6}>
                                <AvField
                                    type="email"
                                    name="email"
                                    label={lang("email")} helpMessage=""
                                    value={currentUser?.email}
                                    className="border border-2"
                                    style={{backgroundColor: "#ffffff"}}
                                    required
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <AvField
                                    label={lang("password")}
                                    name="password"
                                    minLength={4}
                                    value={currentUser?.password}
                                    onChange={handlePasswordChange("password")}
                                    type={parol.showPassword ? "text" : "password"}
                                    className="border border-2"
                                    style={{backgroundColor: "#ffffff"}}
                                    required
                                />
                                <div className="float-end">
                                    <InputAdornment style={{marginTop: "-19px"}} color={"dark"}
                                                    position={"end"}>
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {parol.showPassword ? <Visibility/> : <VisibilityOff/>}
                                        </IconButton>
                                    </InputAdornment>
                                </div>
                            </Col>
                            <Col md={6}>
                                <AvField
                                    label={lang("prePassword")}
                                    name="prePassword"
                                    minLength={4}
                                    onChange={handlePasswordChange("password")}
                                    type={parol.showPassword ? "text" : "password"}
                                    className="border border-2"
                                    style={{backgroundColor: "#ffffff"}}
                                    required
                                />
                                <div className="float-end">
                                    <InputAdornment style={{marginTop: "-19px"}} color={"dark"}
                                                    position={"end"}>
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {parol.showPassword ? <Visibility/> : <VisibilityOff/>}
                                        </IconButton>
                                    </InputAdornment>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col md={6}>
                    <Row className='d-none d-md-flex'>
                        <Col md={6}>
                            <AvField
                                type="text"
                                name="pinfl" label={lang("pinfl")}
                                minLength={14}
                                maxLength={14}
                                value={currentUser?.pinfl}
                                className="border border-2"
                                style={style}
                                disabled
                                required
                            />
                        </Col>
                        <Col md={6}>
                            <AvField
                                type="text"
                                name="inn" label={lang("inn")} helpMessage=""
                                errorMessage="real-check"
                                minLength={9}
                                maxLength={9}
                                value={currentUser?.inn}
                                className="border border-2"
                                style={style}
                                disabled
                                required
                            />
                        </Col>
                    </Row>
                    <div className="d-none d-md-grid">
                        <AvField
                            type="text"
                            label={lang("phoneNumber")}
                            name="phoneNumber"
                            value={currentUser?.phoneNumber}
                            className="border border-2"
                            style={{backgroundColor: "#ffffff"}}
                            validate={{
                                minLength: {value: 6, errorMessage: ''},
                            }}
                            required
                        />
                    </div>
                    <div className="d-flex justify-content-center align-items-center mt-4 mb-4">
                        {
                            loading ?
                                <div className="py-2 px-5 mx-2 create">
                                    <Loader
                                        type="ThreeDots"
                                        color="white"
                                        height={25}
                                        width={25}
                                    />
                                </div>
                                :
                                <Button className="py-2 px-5 mx-2 create">
                                    Обновить персональные данные
                                </Button>
                        }
                    </div>
                </Col>
            </Row>
        </AvForm>
    )
}
