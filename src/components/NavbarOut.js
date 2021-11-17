import React, {useEffect, useState} from 'react';
import {Collapse, Nav, Navbar, NavbarToggler, NavItem,} from 'reactstrap';
import {Link, useHistory, useLocation} from "react-router-dom"
import logo from '../images/img/lgo.png'
import Play from "../images/img/pley.png";
import {useTranslation} from "react-i18next";
import {TOKEN} from "../utils/contants";
import jwt from "jwt-decode";
import {networkAction} from "../redux/actions/AuthActions";
import {useDispatch} from "react-redux";

function Submit({t}) {
    let history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(networkAction({success: window.navigator.onLine}))
        window.addEventListener('online', () => dispatch(networkAction({success: true})));
        window.addEventListener('offline', () => dispatch(networkAction({success: false})));
    }, [])

    function handleClick() {
        const token = localStorage.getItem(TOKEN);
        if (token) {
            let parsedToken = jwt(token);
            let app = parsedToken.auth;
            if (app === "ROLE_ADMIN") {
                history.push('/admin')
            } else if (app === "ROLE_MODERATOR") {
                history.push('/admin')
            } else {
                history.push("/issuerLegal");
            }
        } else {
            history.push('/site/login')
        }
    }

    return (
        <>
            <NavItem className={'btn d-block  d-lg-none'}>
                <div
                    onClick={handleClick}
                    className={'btn btn-primaryy w-100 text-white py-3 px-4 rounded-pill  fs-5 py-xl-4 py-xl-4 px-xl-4 py-lg-3 px-lg-3 py-md-3 px-md-3'}
                >{t("toBegin")} <img
                    src={Play} alt=""/></div>
            </NavItem>
            <NavItem
                className={'btn d-none d-md-flex p-0'}
                style={{height: '100%'}}>
                <button onClick={handleClick}
                        className={'btn btn-primaryy text-white h-100 w-100 py-3 fs-5 py-xl-4 py-xl-4 px-xl-4 py-lg-3 px-lg-3 py-md-3 px-md-3'}
                >{t("toBegin")} <img
                    src={Play} alt=""/></button>
            </NavItem>
        </>
    )
}

function NavbarOut({setNav}) {

    let location = useLocation()
    const language = localStorage.getItem('i18nextLng');
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    const [infoV, setInfoV] = useState(true)

    function infoVideoBtn() {
        setInfoV(false)
    }

    function infoVideoBtn2() {
        setInfoV(true)
    }

    useEffect(() => {
        if (location.pathname.includes("admin")) {
            setNav(false)
        }
    }, [location])

    const [uz, setUz] = useState("");
    const [ru, setRu] = useState("");
    const [en, setEn] = useState("");

    const {t, i18n} = useTranslation();

    const style = {
        background: "#FFFFFF",
        cursor: 'pointer',
        zIndex: '1000'
    }


    const textLanguage = [
        {value: 'en', text: 'EN'},
        {value: 'ru', text: 'RU'},
        {value: 'uz', text: 'UZ'},
    ]

    const btnLanguage = ({value, text}) => (
        <button
            onClick={() => i18n.changeLanguage(value)}
            className={language === value ? `btn btn-link nav-link border px-2 active` : `btn btn-link nav-link border px-2`}>{text}
        </button>
    )

    return (
        <div>
            <Navbar className={'mt-lg-0  py-lg-0 d-flex justify-content-between position-fixed w-100  shadow'}
                    color="white"
                    style={style}
                    light expand="lg">
                <div className="container">
                    <Link onClick={infoVideoBtn2} to={'/'} className={'text-dark text-decoration-none  '}>
                        <div className={'d-flex  align-items-md-center '}>
                            <img src={logo} width={85} alt=''/> <span className={' fs-7 d-md-flex d-none '}
                                                                      style={{width: "30vh"}}>{t("centralDepos")}</span>
                        </div>
                        <h5 className={'my-0 fs  d-lg-block d-none'}>{t("electronVoice")}</h5>
                    </Link>
                    <NavbarToggler toggle={toggle} onClick={toggle}/>
                    <Collapse className={'justify-content-md-between'} isOpen={isOpen} navbar>
                        <Nav className="mr-auto justify-content-end " navbar>
                            {
                                infoV ? <Submit t={t}/> : <div/>
                            }
                            <div
                                className="   d-md-flex align-items-md-center  d-block justify-content-center  ">
                                <NavItem className={'btn p-0 d-block border-0 border-02'}>
                                    <a className={'text-dark text-decoration-none d-block py-4 px-4  rounded-0 hover fs py-xl-4 py-xl-4 px-xl-4 py-lg-4 px-lg-3 py-md-3 px-md-3'}
                                       href="http://www.deponet.uz/">{t("aboutDepos")}</a>
                                </NavItem>
                                <NavItem className={'btn p-0 d-block border-0  border-02 '}>
                                    <a href="/file/document.pdf"
                                       className="text-dark border-0r text-decoration-none d-block py-4 px-4 rounded-0   fs hover py-xl-4 px-xl-4  py-lg-4 px-lg-3 py-md-3 px-md-3">
                                        {t("documentation")}</a>
                                </NavItem>
                                <NavItem className={'btn p-0  d-block border-0  border-02 '}>
                                    <Link onClick={infoVideoBtn}
                                          className={'border-0r text-dark text-decoration-none d-block  py-4 px-4   fs rounded-0 hover py-xl-4 px-xl-4  py-lg-4 px-lg-3 py-md-3 px-md-3'}
                                          to={"/site/info"}>{t("InstructionalVideo")}</Link>
                                </NavItem>
                                <NavItem className={'p-0  d-flex border-2 mx-3 justify-content-center'}>
                                    <div className="langBtnS d-flex">
                                        {textLanguage.map(btnLanguage)}
                                    </div>
                                </NavItem>
                            </div>
                        </Nav>
                    </Collapse>
                </div>
            </Navbar>
        </div>
    );
}

export default NavbarOut;
