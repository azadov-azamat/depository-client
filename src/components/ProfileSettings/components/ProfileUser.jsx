import React, {useState} from "react";
import {Button, Col, Container, Label, Row} from "reactstrap";
import {AvField, AvForm, AvInput} from "availity-reactstrap-validation";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {useDispatch} from "react-redux";
import * as userAction from '../../../redux/actions/UsersAction'
import Loader from "react-loader-spinner";
import {toast} from "react-toastify";
import {useHistory} from "react-router-dom";
import {AiOutlineDoubleRight} from "react-icons/all";
import PhoneInput from "react-phone-number-input";

export default function ProfileUser({lang, currentUser, loading, boolean}) {

    const dispatch = useDispatch()
    const history = useHistory();
    const [parol, setParol] = React.useState({
        password: "",
        showPassword: false,
        token: "",
    });

    const [phoneNumber, setPhoneNumber] = useState();

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
        <Container>
            <AvForm onValidSubmit={EditProfile}>
                <Row>
                    <Col md={12} className="container d-flex justify-content-center">
                        <div className="w-75">
                            <div className="form-group">
                                <Label>{lang("FISH")}</Label>
                                <AvInput
                                    type="text"
                                    name="fullName"
                                    value={currentUser?.fullName}
                                    className="border "
                                    style={style}
                                    disabled
                                    required
                                />
                            </div>

                            <Row>
                                <Col md={6}>
                                    <AvField
                                        type="text"
                                        name="passport"
                                        label={lang("passport")} helpMessage=""
                                        value={currentUser?.passport}
                                        className="border "
                                        style={style}
                                        disabled
                                        required
                                    />
                                </Col>
                                <Col md={6}>
                                    <AvField
                                        type="text"
                                        name="pinfl" label={lang("pinfl")}
                                        minLength={14}
                                        maxLength={14}
                                        value={currentUser?.pinfl}
                                        className="border "
                                        style={style}
                                        disabled
                                        required
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <AvField
                                        type="email"
                                        name="email"
                                        label={lang("email")} helpMessage=""
                                        value={currentUser?.email}
                                        className="border "
                                        style={{backgroundColor: "#ffffff"}}
                                        required
                                    />
                                </Col>
                                <Col md={6}>
                                    <div className="form-group">
                                        <Label className='required_fields'>{lang("companiesList.phoneNumber")}</Label>
                                        <div className="setting_input border" style={{backgroundColor: "#ffffff"}}>
                                            <PhoneInput
                                                placeholder="Введите номер телефона"
                                                value={phoneNumber}
                                                onChange={setPhoneNumber}
                                                required={true}
                                            />
                                        </div>
                                    </div>
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
                                        className="border "
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
                                        className="border "
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
                            <Row>
                                <Col md={12} className="d-flex justify-content-center">
                                    <div className="d-flex justify-content-center align-items-center mt-4 w-75">
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
                                        {boolean ?
                                            <Button className="py-2 px-5 mx-2 create" onClick={()=> history.push("/supervisory/profile/organization?ID=" + currentUser.id)}>
                                                Мои организации <AiOutlineDoubleRight/>
                                            </Button> : ''
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </AvForm>
        </Container>
    )
}
