import React from "react";
import {Col, Container, Nav, Navbar, NavItem, Row} from "reactstrap";
import {Link, NavLink, useHistory, useLocation} from "react-router-dom";
import {AiOutlineLeft, AiOutlineRight, FaArrowLeft} from "react-icons/all";
import {Select} from "antd";
import {DEPOSITORY_ROLE} from "../utils/contants";

const {Option} = Select;

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function MeetingSettingRoutes({isDisabled, id, lang}) {
    const history = useHistory();
    const location = useLocation();
    const {pathname} = location;
    const roleRoute = localStorage.getItem(DEPOSITORY_ROLE)

    let query = useQuery();
    const typeMeeting = query.get("type");

    const links = [
        {
            id: 1,
            href: typeMeeting === "update" ? ("/supervisory/addOrEditMeeting/meeting?type=update&meeting_id=" + id)
                :
                ("/supervisory/addOrEditMeeting/meeting?type=create"),
            text: lang("meetingCreated.general"),
            className: isDisabled ? 'disabled' : ''
        },
        {
            id: 2,
            href: "/supervisory/addOrEditMeeting/add_members?type=update&meeting_id=" + id,
            text: lang("meetingCreated.addedMember"),
            className: isDisabled ? 'disabled' : ''
        },
        {
            id: 3,
            href: "/supervisory/addOrEditMeeting/add_agenda?type=update&meeting_id=" + id,
            text: lang("meetingCreated.addedAgenda"),
            className: isDisabled ? 'disabled' : ''
        },
        {
            id: 4,
            href: "/supervisory/addOrEditMeeting/add_reestr?type=update&meeting_id=" + id,
            text: lang("meetingCreated.addedReestr"),
            className: isDisabled ? 'disabled' : ''
        },
        {
            id: 5,
            href: "/supervisory/addOrEditMeeting/add_files?type=update&meeting_id=" + id,
            text: lang("meetingCreated.addedFiles"),
            className: isDisabled ? 'disabled' : ''
        },
    ];

    const createNavItem = ({href, text, className}) => (
        <NavItem>
            <NavLink to={href} className={"nav-link mx-2 " + className}>{text}</NavLink>
        </NavItem>
    )

    function onChange(value) {
        history.push(value)
    }

    function adminRoutes() {
        return (
            <div className="d-inline-flex align-items-center" style={{marginTop: '6em'}}>
                <Link to="/admin/meetings" className="nav-link text-dark"><FaArrowLeft/></Link>
                <Link to={'/'} className="nav-link"
                      style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.electronVoting")}</Link>
                <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                <Link to={'/admin'} className="nav-link"
                      style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.menu")}</Link>
                <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                <Link to={'/admin/meetings'} className="nav-link"
                      style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.controlPage.control") + lang("routes.controlPage.meeting")}</Link>
                <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                <Link to={'#'}
                      className="nav-link h4 disabled text-dark">{typeMeeting === "create" ? lang("routes.addOrEditPage.addMeeting") : lang("routes.addOrEditPage.editMeeting")}</Link>
            </div>
        )
    }

    function clientRoutes() {
        return (
            <div className="d-inline-flex align-items-center" style={{marginTop: '6em'}}>
                <Link to="/issuerLegal/companies" className="nav-link text-dark"><FaArrowLeft/></Link>
                <Link to={'/'} className="nav-link"
                      style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.electronVoting")}</Link>
                <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                <Link to={'/issuerLegal/companies'} className="nav-link"
                      style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.controlPage.clientPage")}</Link>
                <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                <Link to={'#'}
                      className="nav-link h4 disabled text-dark">{typeMeeting === "create" ? lang("routes.addOrEditPage.addMeeting") : lang("routes.addOrEditPage.editMeeting")}</Link>
            </div>
        )
    }

    return (
        <>
            <Row className="container-fluid d-none d-md-block">
                <Col md={12} sm={12}>
                    {roleRoute === 'admin' ? adminRoutes() : clientRoutes()}
                </Col>
            </Row>
            <Container>
                <Row>
                    <Col md={12}>
                        <Navbar light expand="md" className="d-flex justify-content-between">
                            <Nav className="nav-links" navbar>
                                {links.map(createNavItem)}
                            </Nav>
                        </Navbar>
                    </Col>
                </Row>
                <Row className="d-md-none">
                    <Col md={12}>
                        <div style={{marginTop: '3em'}} className="d-flex justify-content-between align-items-center">
                            <Link to={'/admin/meetings'} className="nav-link text-dark"><AiOutlineLeft
                                className="h3"/></Link>
                            <h3 style={{color: '#132E85'}}>{typeMeeting === "create" ? lang("routes.addOrEditPage.addMeeting") : lang("routes.addOrEditPage.editMeeting")}</h3>
                        </div>
                    </Col>
                    <div className="form-group text-center">
                        <Select
                            className="setting_input w-100"
                            optionFilterProp="children"
                            onChange={onChange}
                            value={typeMeeting === "create" ? pathname + "?type=create" : pathname + "?type=update&meeting_id=" + id}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {links.map(value =>
                                <Option disabled={isDisabled} value={value.href}>{value.text}</Option>
                            )}
                        </Select>
                    </div>
                </Row>
            </Container>
        </>

    )
}
