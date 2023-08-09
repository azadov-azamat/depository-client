import React, {useEffect, useState} from 'react';
import {
    Collapse,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarToggler,
    NavItem,
    UncontrolledDropdown,
} from 'reactstrap';
import {Link} from "react-router-dom"
import logo from '../images/img/lgo.png'
import {HiUserCircle} from "react-icons/all";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {logout, networkAction} from "../redux/actions/AuthActions";


const NavbarIn = ({setNav}) => {

    const dispatch = useDispatch()
    const reducers = useSelector(state => state)
    const {currentUser} = reducers.auth
    const language = localStorage.getItem('i18nextLng');

    useEffect(() => {
        setNav(false)
        dispatch(networkAction({success: window.navigator.onLine}))
        window.addEventListener('online', () => dispatch(networkAction({success: true})));
        window.addEventListener('offline', () => dispatch(networkAction({success: false})));
    }, [])

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    function infoVideoBtn() {
        setNav(false)
    }

    function infoVideoBtn2() {
        setNav(true)
        dispatch(logout());
    }

    const {t, i18n} = useTranslation();

    const textLanguage = [
        {id: 1, value: 'en', text: 'EN'},
        {id: 2, value: 'ru', text: 'RU'},
        {id: 3, value: 'uz', text: 'UZ'},
    ]

    const btnLanguage = ({value, text, id}) => (
        <button key={id}
                onClick={() => i18n.changeLanguage(value)}
                className={language === value ? `btn btn-link nav-link border px-2 active` : `btn btn-link nav-link border px-2`}>{text}
        </button>
    )
    return (
        <div>
            <Navbar className={'mt-lg-0 py-lg-0 navbarIN d-flex justify-content-between shadow position-fixed w-100'}
                    color="white"
                    light expand="lg">
                <div className="container">
                    <Link to={'/'}
                          className={'text-dark text-decoration-none  '}>
                        <div className={'d-flex  align-items-md-center '}>
                            <img src={logo} width={190} alt=''/>
                            {/*<span className={'fs-7 d-md-flex d-none'} style={{*/}
                            {/*    width: language === 'ru' ? '32vh' : language === 'en' ? '20vh' : "25vh",*/}
                            {/*    fontWeight: 'bold'*/}
                            {/*}}>{t("centralDepos")}</span>*/}
                            {/*<h5 className={'my-0 fs d-lg-block d-none text-center'}*/}
                            {/*    style={{width: "22vh",}}>{t("electronVoice")}</h5>*/}
                        </div>
                    </Link>
                    <NavbarToggler onClick={toggle}/>
                    <Collapse className={'justify-content-md-end'} isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem className={'btn d-lg-none p-0 d-block border-0  border-02 '}>
                                <Link onClick={infoVideoBtn}
                                      className={'border-0r text-dark text-decoration-none d-block  py-4 px-4   fs rounded-0 hover'}
                                      to={"/supervisory/profile/user?ID=" + currentUser?.id}>{t("settings")}</Link>
                            </NavItem>
                            <NavItem className={'btn d-lg-none p-0  d-block border-0  border-02 '}>
                                <Link onClick={infoVideoBtn2} to={"/"}
                                      className={'border-0r text-dark text-decoration-none d-block  py-4 px-4   fs rounded-0 hover'}>
                                    {t("exit")}
                                </Link>
                            </NavItem>
                            <NavItem className={'p-0  d-flex border-2 mx-3 justify-content-center'}>
                                <div className="langBtnS d-inline-flex">
                                    {textLanguage.map(btnLanguage)}
                                </div>
                            </NavItem>
                        </Nav>
                    </Collapse>
                    <Nav className="d-none d-lg-block" navbar>
                        <UncontrolledDropdown nav inNavbar className="float-end">
                            <DropdownToggle nav caret className="dropdown-toggle ">
                                <div className="d-inline-flex align-items-center text-dark">
                                    <HiUserCircle className="img-fluid user-logo"/>
                                    <div className="d-none d-md-flex">
                                        {currentUser?.fullName}
                                    </div>
                                </div>
                            </DropdownToggle>
                            <DropdownMenu className={'w-auto absolute'}>
                                <DropdownItem className={'ps-2'}>
                                    <Link onClick={infoVideoBtn}
                                          className={'text-dark text-decoration-none d-block     fs rounded-0  '}
                                          to={"/supervisory/profile/user?ID=" + currentUser?.id}>{t("settings")}</Link>
                                </DropdownItem>
                                <DropdownItem className={'ps-2'}>
                                    <Link onClick={infoVideoBtn2}
                                          className={'text-dark text-decoration-none d-block     fs rounded-0  '}
                                          to={"/"}> {t("exit")}</Link>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </div>
            </Navbar>
        </div>
    );
}

export default NavbarIn;
