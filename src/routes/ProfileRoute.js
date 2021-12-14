import React from "react";
import {Col, Nav, Navbar, NavItem, Row} from "reactstrap";
import {Link, NavLink, useHistory, useLocation} from "react-router-dom";
import "../components/Dashboard/styles/Profile.scss";
import "../components/createMeeting/AzamatGlobal.scss";
import {AiOutlineRight, FaArrowLeft} from "react-icons/all";
import {Select} from "antd";
import {DEPOSITORY_ROLE, DEPOSITORY_USER} from "../utils/contants";

const {Option} = Select;

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function ProfileRoute({lang, booleanComp}) {

    const history = useHistory();
    const location = useLocation();
    const {pathname} = location;

    const roleRoute = localStorage.getItem(DEPOSITORY_ROLE);

    let query = useQuery();
    const userId = query.get("ID");

    const routesProfile = [
        {
            text: lang("personalData"),
            link: "/supervisory/profile/user?ID=" + userId,
            style: '14em',
            className: "nav-link m-2"
        },
        {
            text: 'Мои организации',
            link: "/supervisory/profile/organization?ID=" + userId,
            className: booleanComp ? 'nav-link m-2' : 'd-none',
            style: ''
        },
        // {
        //     text: 'Активные заседание',
        //     link: "/supervisory/profile/activeMeeting?ID=" + userId + "&type=active",
        //     className: booleanComp ? 'nav-link m-2' : 'd-none',
        //     style: ''
        // },
        // {
        //     text: 'Черновик',
        //     link: "/supervisory/profile/draft?ID=" + userId + "&type=draft",
        //     className: booleanComp ? 'nav-link m-2' : 'd-none',
        //     style: ''
        // },
        // {
        //     text: 'Архив заседание',
        //     link: "/supervisory/profile/archiveMeeting?ID=" + userId + "&type=archive",
        //     className: booleanComp ? 'nav-link m-2' : 'd-none',
        //     style: ''
        // },
    ]

    const createRouteProfile = ({text, link, style, className}) => (
        <NavItem>
            <NavLink to={link} style={{width: style}} className={className}>{text}</NavLink>
        </NavItem>
    )

    function onChange(value) {
        history.push(value)
    }

    console.log(pathname)

    function adminPage() {
        return (
            <div className="d-lg-inline-flex align-items-center d-none">
                <Link to="/admin" className="nav-link text-dark"><FaArrowLeft/></Link>
                <Link to={'/'} className="nav-link" style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.electronVoting")}</Link>
                <Link className="nav-link disabled"><AiOutlineRight/></Link>
                <Link to={'/admin'} className="nav-link" style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.menu")}</Link>
                <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                <Link className="nav-link h4 disabled" style={{color: "#3D5398"}}>{lang("routes.profile")}</Link>
            </div>
        )
    }

    function clientPage() {
        return (
            <div className="d-lg-inline-flex align-items-center d-none">
                {
                    pathname === '/supervisory/profile/user' ?
                        <>
                            <Link to="/admin" className="nav-link text-dark"><FaArrowLeft/></Link>
                            <Link to={'/'} className="nav-link" style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.electronVoting")}</Link>
                            <Link className="nav-link disabled"><AiOutlineRight/></Link>
                            <Link to={'/issuerLegal/companies'} className="nav-link"
                                  style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.controlPage.clientPage")}</Link>
                            <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                            <Link className="nav-link h4 disabled" style={{color: "#3D5398"}}>{lang("routes.profile")}</Link>
                        </> :''
                }
                {
                    pathname === '/supervisory/profile/organization' ?
                        <>
                            <Link to="/admin" className="nav-link text-dark"><FaArrowLeft/></Link>
                            <Link to={'/'} className="nav-link" style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.electronVoting")}</Link>
                            <Link className="nav-link disabled"><AiOutlineRight/></Link>
                            <Link to={'/issuerLegal/companies'} className="nav-link"
                                  style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.controlPage.clientPage")}</Link>
                            <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                            <Link to={'/supervisory/profile/user'} className="nav-link"
                                  style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.profile")}</Link>
                            <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                            <Link className="nav-link h4 disabled" style={{color: "#3D5398"}}>Мои организации</Link>
                        </> :''
                }
                {
                    pathname === '/supervisory/profile/meetings' ?
                        <>
                            <Link to="/admin" className="nav-link text-dark"><FaArrowLeft/></Link>
                            <Link to={'/'} className="nav-link" style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.electronVoting")}</Link>
                            <Link className="nav-link disabled"><AiOutlineRight/></Link>
                            <Link to={'/issuerLegal/companies'} className="nav-link"
                                  style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.controlPage.clientPage")}</Link>
                            <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                            <Link to={'/supervisory/profile/user'} className="nav-link"
                                  style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.profile")}</Link>
                            <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                            <Link to={'/supervisory/profile/organization'} className="nav-link"
                                  style={{color: "rgba(155,153,150,0.98)"}}>Мои организации</Link>
                            <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                            <Link className="nav-link h4 disabled" style={{color: "#3D5398"}}>{lang("clientPage.countMeeting")}</Link>
                        </> :''
                }
            </div>
        )
    }

    return (
        <div className="container-fluid">
            <Row>
                <div className="col-md-12 routeProfile d-block justify-content-xl-center" style={{marginTop: '12vh'}}>
                    {
                        roleRoute === 'admin' ? adminPage() : clientPage()
                    }
                    {/*<Navbar light expand="md">*/}
                    {/*    <Nav*/}
                    {/*        className={booleanComp ? "nav-links d-flex justify-content-center align-items-center text-center" :*/}
                    {/*            "nav-links d-flex justify-content-center align-items-center text-center"} navbar>*/}
                    {/*        {routesProfile.map(createRouteProfile)}*/}
                    {/*    </Nav>*/}
                    {/*</Navbar>*/}
                </div>
            </Row>
            {/*<Row>*/}
            {/*    <Col md={12}>*/}
            {/*        <div className="d-md-none form-group text-center">*/}
            {/*            <Select*/}
            {/*                className="setting_input w-100"*/}
            {/*                optionFilterProp="children"*/}
            {/*                onChange={onChange}*/}
            {/*                value={pathname}*/}
            {/*                filterOption={(input, option) =>*/}
            {/*                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0*/}
            {/*                }*/}
            {/*            >*/}
            {/*                {routesProfile.map((value, index) =>*/}
            {/*                    <Option key={index} value={value.link} className={value.className}>{value.text}</Option>*/}
            {/*                )}*/}
            {/*            </Select>*/}
            {/*        </div>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
        </div>
    )
}
