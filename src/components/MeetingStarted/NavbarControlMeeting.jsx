import React from 'react'
import {NavItem} from "reactstrap";
import {NavLink, useHistory, useLocation} from "react-router-dom";
import {Select} from "antd";
import {ACTIVE, CHAIRMAN, SECRETARY} from "../../utils/contants";

const {Option} = Select;

export const NavbarControlMeeting = ({roleMember, statusMeeting, zoomEnum}) => {

    const history = useHistory();
    const location = useLocation();
    const {pathname} = location;

    const link = [
        {text: 'Повестка дня', link: '/issuerLegal/meetingSetting'},
        {text: 'Вопросы | +1', link: '/issuerLegal/meetingSetting/question'},
        {text: 'Комментирование', link: '/issuerLegal/meetingSetting/comment-by-meeting'},
        {text: 'Управлять', link: '/issuerLegal/meetingSetting/control-meeting'},
        // {text: 'Zoom', link: '/issuerLegal/meetingSetting/zoom_meeting'},
    ]

    const linkMap = ({text, link}) => (
        <NavItem>
            <NavLink to={link} className={"nav-link"}
                     style={roleMember === SECRETARY ? {paddingLeft: "6px", paddingRight: '6px'} : {}}>{text}</NavLink>
        </NavItem>
    )

    function onChange(value) {
        history.push(value)
    }

    return (
        roleMember === CHAIRMAN || roleMember === SECRETARY ?
            <div>
                <ul className="nav nav-tabs d-none d-md-flex">
                    {link.map(linkMap)}
                    {roleMember === SECRETARY ?
                        <NavItem>
                            <NavLink to={'/issuerLegal/meetingSetting/list_users'} className={"nav-link"}
                                     style={roleMember === SECRETARY ? {
                                         paddingLeft: "6px",
                                         paddingRight: '6px'
                                     } : {}}>Участники</NavLink>
                        </NavItem> : ""
                    }
                    {zoomEnum === ACTIVE ?
                        <NavItem>
                            <NavLink to={'/issuerLegal/meetingSetting/zoom_meeting'} className={"nav-link"}>Zoom</NavLink>
                        </NavItem> : ""
                    }
                </ul>
                <div className="form-group text-center d-flex d-md-none">
                    <Select
                        className="setting_input w-100"
                        optionFilterProp="children"
                        onChange={onChange}
                        value={pathname}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {link.map(value =>
                            <Option value={value.link}>{value.text}</Option>
                        )}
                        {roleMember === SECRETARY ?
                            <Option value={'/issuerLegal/meetingSetting/list_users'}>Участники</Option> : ""
                        }
                    </Select>
                </div>
            </div>
            :
            <ul className="nav nav-tabs d-none d-md-flex">
                <NavItem>
                    <NavLink to={"/issuerLegal/meetingSetting"} className={"nav-link"}>Повестка
                        дня</NavLink>
                </NavItem>
                {statusMeeting === ACTIVE ?
                    <NavItem>
                        <NavLink to={'/issuerLegal/meetingSetting/zoom_meeting'} className={"nav-link"}>Zoom</NavLink>
                    </NavItem> : ""
                }
            </ul>
    )
}
