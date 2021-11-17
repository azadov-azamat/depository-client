import React from "react";
import {Col, Nav, Navbar, NavItem, Row} from "reactstrap";
import {Link, NavLink, useHistory, useLocation, useParams} from "react-router-dom";
import "../components/Dashboard/styles/Profile.scss";
import "../components/createMeeting/AzamatGlobal.scss";
import {AiOutlineRight, FaArrowLeft} from "react-icons/all";
import {Select} from "antd";
import {DEPOSITORY_ROLE, DEPOSITORY_USER} from "../utils/contants";

const {Option} = Select;

export default function ProfileRoute({lang, booleanComp, user, pagePath}) {

    // const {id} = useParams();
    const history = useHistory();
    const location = useLocation();
    const {pathname} = location;

    const roleRoute = localStorage.getItem(DEPOSITORY_ROLE);
    const id = localStorage.getItem(DEPOSITORY_USER)

    const routesProfile = [
        {
            text: lang("personalData"),
            link: "/supervisory/personalData/currentUser",
            style: '14em',
            className: "nav-link m-2"
        },
        {
            text: 'Мои организации',
            link: "/supervisory/organization/currentUser/" + id,
            className: booleanComp ? 'nav-link m-2' : 'd-none',
            style: ''
        },
        {
            text: 'Активные заседание',
            link: "/supervisory/activeMeeting/currentUser/" + id,
            className: booleanComp ? 'nav-link m-2' : 'd-none',
            style: ''
        },
        {text: 'Черновик', link: "/supervisory/draft/" + id, className: booleanComp ? 'nav-link m-2' : 'd-none', style: ''},
        {
            text: 'Архив заседание',
            link: "/supervisory/archiveMeeting/currentUser/" + id,
            className: booleanComp ? 'nav-link m-2' : 'd-none',
            style: ''
        },
    ]

    const createRouteProfile = ({text, link, style, className}) => (
        <NavItem>
            <NavLink to={link} style={{width: style}} className={className}>{text}</NavLink>
        </NavItem>
    )

    function onChange(value) {
        history.push(value)
    }

    function adminPage() {
        return (
            <div className="d-lg-inline-flex align-items-center d-none">
                <Link to="/admin" className="nav-link text-dark"><FaArrowLeft/></Link>
                <Link to={'/'} className="nav-link" style={{color: "rgba(155,153,150,0.98)"}}>Электронное
                    голосование</Link>
                <Link className="nav-link disabled"><AiOutlineRight/></Link>
                <Link to={'/admin'} className="nav-link" style={{color: "rgba(155,153,150,0.98)"}}>Главное
                    меню</Link>
                <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                <Link className="nav-link h4 disabled" style={{color: "#3D5398"}}>Мой профиль</Link>
            </div>
        )
    }

    function clientPage() {
        return (
            <div className="d-lg-inline-flex align-items-center d-none">
                <Link to="/admin" className="nav-link text-dark"><FaArrowLeft/></Link>
                <Link to={'/'} className="nav-link" style={{color: "rgba(155,153,150,0.98)"}}>Электронное
                    голосование</Link>
                <Link className="nav-link disabled"><AiOutlineRight/></Link>
                <Link to={'/issuerLegal'} className="nav-link"
                      style={{color: "rgba(155,153,150,0.98)"}}>Акционерное общества</Link>
                <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                <Link className="nav-link h4 disabled" style={{color: "#3D5398"}}>Мой профиль</Link>
            </div>
        )
    }

    return (
        <>
            <Row>
                <div className="col-md-12 routeProfile d-block justify-content-xl-center" style={{marginTop: '12vh'}}>
                    {
                        roleRoute === 'admin' ? adminPage() : clientPage()
                    }
                    <Navbar light expand="md">
                        <Nav
                            className={booleanComp ? "nav-links d-flex justify-content-center align-items-center text-center" :
                                "nav-links d-flex justify-content-center align-items-center text-center"} navbar>
                            {routesProfile.map(createRouteProfile)}
                        </Nav>
                    </Navbar>
                </div>
            </Row>
            <Row>
                <Col md={12}>
                    <div className="d-md-none form-group text-center">
                        <Select
                            className="setting_input w-100"
                            optionFilterProp="children"
                            onChange={onChange}
                            value={pathname}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {routesProfile.map((value, index) =>
                                <Option key={index} value={value.link} className={value.className}>{value.text}</Option>
                            )}
                        </Select>
                    </div>
                </Col>
            </Row>
        </>
    )
}
