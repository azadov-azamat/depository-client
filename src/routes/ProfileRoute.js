import React from "react";
import {Row} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import "../components/Dashboard/styles/Profile.scss";
import "../components/createMeeting/AzamatGlobal.scss";
import {AiOutlineRight, FaArrowLeft} from "react-icons/all";
import {DEPOSITORY_ROLE} from "../utils/contants";

export default function ProfileRoute({lang}) {

    const location = useLocation();
    const {pathname} = location;

    const roleRoute = localStorage.getItem(DEPOSITORY_ROLE);

    function adminPage() {
        return (
            <div className="d-lg-inline-flex align-items-center d-none">
                <Link to="/admin" className="nav-link text-dark"><FaArrowLeft/></Link>
                <Link to={'/'} className="nav-link"
                      style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.electronVoting")}</Link>
                <Link className="nav-link disabled"><AiOutlineRight/></Link>
                <Link to={'/admin'} className="nav-link"
                      style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.menu")}</Link>
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
                            <Link to={'/'} className="nav-link"
                                  style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.electronVoting")}</Link>
                            <Link className="nav-link disabled"><AiOutlineRight/></Link>
                            <Link to={'/issuerLegal/companies'} className="nav-link"
                                  style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.controlPage.clientPage")}</Link>
                            <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                            <Link className="nav-link h4 disabled"
                                  style={{color: "#3D5398"}}>{lang("routes.profile")}</Link>
                        </> : ''
                }
                {
                    pathname === '/supervisory/profile/organization' ?
                        <>
                            <Link to="/admin" className="nav-link text-dark"><FaArrowLeft/></Link>
                            <Link to={'/'} className="nav-link"
                                  style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.electronVoting")}</Link>
                            <Link className="nav-link disabled"><AiOutlineRight/></Link>
                            <Link to={'/issuerLegal/companies'} className="nav-link"
                                  style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.controlPage.clientPage")}</Link>
                            <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                            <Link to={'/supervisory/profile/user'} className="nav-link"
                                  style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.profile")}</Link>
                            <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                            <Link className="nav-link h4 disabled" style={{color: "#3D5398"}}>Мои организации</Link>
                        </> : ''
                }
                {
                    pathname === '/supervisory/profile/meetings' ?
                        <>
                            <Link to="/admin" className="nav-link text-dark"><FaArrowLeft/></Link>
                            <Link to={'/'} className="nav-link"
                                  style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.electronVoting")}</Link>
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
                            <Link className="nav-link h4 disabled"
                                  style={{color: "#3D5398"}}>{lang("clientPage.countMeeting")}</Link>
                        </> : ''
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
                </div>
            </Row>
        </div>
    )
}
