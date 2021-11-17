import React from "react";
import {Col, Nav, Navbar, NavItem, Row} from "reactstrap";
import {Link, NavLink, useHistory, useLocation} from "react-router-dom";
import {AiOutlineLeft} from "react-icons/all";
import {Select} from "antd";

const {Option} = Select;

export default function NabRoute({isDisabled, id}) {

    const history = useHistory();
    const location = useLocation();
    const {pathname} = location;

    const links = [
        {id: 1, href: `/admin/addOrEditMeeting/create`, text: 'Общее', className: ''},
        {id: 2, href: '/admin/meetingUsers', text: 'Пользователи системы', className: isDisabled ? 'disabled' : ''},
        {id: 3, href: '/admin/meetingAgenda', text: 'Вопросы повестки дня', className: isDisabled ? 'disabled' : ''},
        {
            id: 4,
            href: '/admin/meetingListMembers',
            text: 'Список членов наб совета',
            className: isDisabled ? 'disabled' : ''
        },
        {id: 5, href: "/admin/meetingFiles", text: 'Файлы заседание', className: isDisabled ? 'disabled' : ''},
    ];

    const createNavItem = ({href, text, className}) => (
        <NavItem>
            <NavLink to={href} className={"nav-link mx-2 " + className}>{text}</NavLink>
        </NavItem>
    )

    function onChange(value) {
        history.push(value)
    }

    return (
        <>
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
                        <h3 style={{color: '#132E85'}}>{pathname === '/admin/addOrEditMeeting/create' ? 'Создание заседание наб.совета' : 'Редактирование заседание'}</h3>
                    </div>
                </Col>
                <div className="form-group text-center">
                    <Select
                        className="setting_input w-100"
                        optionFilterProp="children"
                        onChange={onChange}
                        value={pathname}
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
        </>
    )
}
