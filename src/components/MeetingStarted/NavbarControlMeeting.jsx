import React from 'react'
import {NavItem} from "reactstrap";
import {NavLink, useHistory, useLocation} from "react-router-dom";
import {Select} from "antd";
import {ACTIVE, CHAIRMAN, DEPOSITORY_ZOOM_MEETING_PASSWORD, SECRETARY} from "../../utils/contants";
import {Badge} from "@material-ui/core";
import {useDispatch} from "react-redux";

const {Option} = Select;

export const NavbarControlMeeting = ({roleMember, statusMeeting, zoomEnum, countBadge, password_zoom}) => {

    const history = useHistory();
    const location = useLocation();
    const {pathname} = location;

    const link = [
        {id: 1, text: 'Повестка дня', link: '/issuerLegal/meetingSetting'},
        {id: 2, text: 'Вопросы', link: '/issuerLegal/meetingSetting/question'},
        {id: 3, text: 'Комментирование', link: '/issuerLegal/meetingSetting/comment-by-meeting'},
        {id: 4, text: 'Управлять', link: '/issuerLegal/meetingSetting/control-meeting'},
        // {text: 'Zoom', link: '/issuerLegal/meetingSetting/zoom_meeting'},
    ]

    const linkMap = ({id, text, link}) => (
        id === 2 ?
            <NavItem>
                <Badge badgeContent={countBadge} color="secondary">
                    <NavLink to={link} className={"nav-link"}
                             style={roleMember === SECRETARY ? {paddingLeft: "6px", paddingRight: '6px'} : {}}>{text}
                    </NavLink>
                </Badge>
            </NavItem> :
            <NavItem>
                <NavLink to={link} className={"nav-link"}
                         style={roleMember === SECRETARY ? {
                             paddingLeft: "6px",
                             paddingRight: '6px'
                         } : {}}>{text}</NavLink>
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
                        roleMember === CHAIRMAN || roleMember === SECRETARY ?
                            <NavItem>
                                <NavLink to={'/issuerLegal/meetingSetting/zoom_meeting'}
                                         className={"nav-link"}>Zoom</NavLink>
                            </NavItem> :
                        localStorage.getItem(DEPOSITORY_ZOOM_MEETING_PASSWORD) ?
                            <NavItem>
                                <NavLink to={'/issuerLegal/meetingSetting/zoom_meeting'}
                                         className={"nav-link"}>Zoom</NavLink>
                            </NavItem> : ""
                        : ""
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
                        {link.map((value, index) =>
                            <Option key={index} value={value.link}>{value.text}</Option>
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
