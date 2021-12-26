import React from 'react'
import {NavItem} from "reactstrap";
import {NavLink, useHistory, useLocation, useParams} from "react-router-dom";
import {Select} from "antd";
import {CHAIRMAN, SECRETARY} from "../../utils/contants";
import {Badge} from "@material-ui/core";
import Text from "antd/es/typography/Text";

const {Option} = Select;

export const NavbarControlMeeting = ({
                                         roleMember,
                                         companyId,
                                         memberId,
                                         countBadge,
                                         clicked,
                                         fromReestr,
                                         archiveBoolean
                                     }) => {

    const {id} = useParams();
    const history = useHistory();
    const location = useLocation();
    const {pathname} = location;


    const link = [
        {
            id: 1,
            text: 'Повестка дня',
            link: "/issuerLegal/meeting/" + id + "/agenda?companyId=" + companyId + "&memberId=" + memberId,
            onClick: clicked,
            className: 'nav-link'
        },
        {
            id: 2,
            text: 'Вопросы',
            link: "/issuerLegal/meeting/" + id + "/question?companyId=" + companyId + "&memberId=" + memberId,
            onClick: clicked,
            className: 'nav-link'
        },
        {
            id: 3,
            text: 'Комментирование',
            link: "/issuerLegal/meeting/" + id + "/addComment?companyId=" + companyId + "&memberId=" + memberId,
            onClick: clicked,
            className: !archiveBoolean ? 'd-none' : 'nav-link'
        },
        {
            id: 4,
            text: 'Управлять',
            link: "/issuerLegal/meeting/" + id + "/controlMeeting?companyId=" + companyId + "&memberId=" + memberId,
            onClick: clicked,
            className: 'nav-link'
        },
        {
            id: 5,
            text: 'Видео Конфереция',
            link: "/issuerLegal/meeting/" + id + "/zoom-meeting?companyId=" + companyId + "&memberId=" + memberId,
            onClick: clicked,
            className: !archiveBoolean ? 'd-none' : 'nav-link'
        },
    ]

    const linkMobileClient = [
        {
            id: 1,
            text: 'Повестка дня',
            link: "/issuerLegal/meeting/" + id + "/agenda?companyId=" + companyId + "&memberId=" + memberId,
            onClick: clicked,
            className: 'nav-link'
        },
        {
            id: 2,
            text: 'Видео Конфереция',
            link: "/issuerLegal/meeting/" + id + "/zoom-meeting?companyId=" + companyId + "&memberId=" + memberId,
            onClick: clicked,
            className: !archiveBoolean ? 'd-none' : 'nav-link'
        },
    ]

    const linkMap = ({id, text, link, onClick, className}) => (
        <Text key={id}>
            {
                id === 2 ?
                    <NavItem>
                        <Badge badgeContent={countBadge} color="secondary" onClick={onClick}>
                            <NavLink to={link} className={className}
                                     style={roleMember === SECRETARY ? {
                                         paddingLeft: "6px",
                                         paddingRight: '6px'
                                     } : {}}>{text}
                            </NavLink>
                        </Badge>
                    </NavItem> :
                    <NavItem>
                        <NavLink to={link} className={className} onClick={onClick}
                                 style={roleMember === SECRETARY ? {
                                     paddingLeft: "6px",
                                     paddingRight: '6px'
                                 } : {}}>{text}</NavLink>
                    </NavItem>
            }
        </Text>
    )

    return (
        <>{
            roleMember === CHAIRMAN ?
                fromReestr ?
                    <>
                        <ul className="nav nav-tabs d-none d-md-flex">
                            <NavItem>
                                <NavLink
                                    to={"/issuerLegal/meeting/" + id + "/agenda?companyId=" + companyId + "&memberId=" + memberId}
                                    onClick={clicked}
                                    className={"nav-link"}>Повестка дня</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={clicked}
                                         to={"/issuerLegal/meeting/" + id + "/zoom-meeting?companyId=" + companyId + "&memberId=" + memberId}
                                         className={!archiveBoolean ? "d-none" : "nav-link"}>Видео Конфереция</NavLink>
                            </NavItem>
                        </ul>
                        <div className="form-group text-center d-flex d-md-none">
                            <Select
                                optionFilterProp="children"
                                className={"setting_input w-100"}
                                onChange={(value) => history.push(value)}
                                value={pathname + "?companyId=" + companyId + "&memberId=" + memberId}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {linkMobileClient.map((value, index) =>
                                    <Option className={value.className} key={index} value={value.link}
                                            onClick={clicked}>{value.text}</Option>
                                )}
                            </Select>
                        </div>
                    </> // 2 ta kalonka
                    :
                    <div>
                        <ul className="nav nav-tabs d-none d-md-flex">
                            {link.map(linkMap)}
                        </ul>
                        <div className="form-group text-center d-flex d-md-none">
                            <Select
                                className="setting_input w-100"
                                optionFilterProp="children"
                                onChange={(value) => history.push(value)}
                                value={pathname + "?companyId=" + companyId + "&memberId=" + memberId}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {link.map((value, index) =>
                                    <Option className={value.className} key={index} value={value.link}
                                            onClick={clicked}>{value.text}</Option>
                                )}
                                {/*{roleMember === SECRETARY ?*/}
                                {/*    <Option*/}
                                {/*        value={"/issuerLegal/meeting/" + id + "/all_users_list?companyId=" + companyId + "&memberId=" + memberId}*/}
                                {/*        className={"nav-link"}>Участники</Option> : ""*/}
                                {/*}*/}
                            </Select>
                        </div>
                    </div> // xamma kalonka predsedatel uchun
                :
                roleMember === SECRETARY ? // secretarni tekshiryabman
                    <div>
                        <ul className="nav nav-tabs d-none d-md-flex">
                            {link.map(linkMap)}
                            <NavItem>
                                <NavLink
                                    to={"/issuerLegal/meeting/" + id + "/all_users_list?companyId=" + companyId + "&memberId=" + memberId}
                                    className={"nav-link"}
                                    style={roleMember === SECRETARY ? {
                                        paddingLeft: "6px",
                                        paddingRight: '6px'
                                    } : {}}>Участники</NavLink>
                            </NavItem>
                        </ul>
                        <div className="form-group text-center d-flex d-md-none">
                            <Select
                                className="setting_input w-100"
                                optionFilterProp="children"
                                onChange={(value) => history.push(value)}
                                value={pathname + "?companyId=" + companyId + "&memberId=" + memberId}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {link.map((value, index) =>
                                    <Option className={value.className} key={index} value={value.link}
                                            onClick={clicked}>{value.text}</Option>
                                )}
                                <Option
                                    value={"/issuerLegal/meeting/" + id + "/all_users_list?companyId=" + companyId + "&memberId=" + memberId}
                                    className={"nav-link"}>Участники</Option>
                            </Select>
                        </div>
                    </div>
                    :
                    <>
                        <ul className="nav nav-tabs d-none d-md-flex">
                            <NavItem>
                                <NavLink
                                    to={"/issuerLegal/meeting/" + id + "/agenda?companyId=" + companyId + "&memberId=" + memberId}
                                    onClick={clicked}
                                    className={"nav-link"}>Повестка дня</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={clicked}
                                         to={"/issuerLegal/meeting/" + id + "/zoom-meeting?companyId=" + companyId + "&memberId=" + memberId}
                                         className={!archiveBoolean ? "d-none" : "nav-link"}>Видео Конфереция</NavLink>
                            </NavItem>
                        </ul>
                        <div className="form-group text-center d-flex d-md-none">
                            <Select
                                className="setting_input w-100"
                                optionFilterProp="children"
                                onChange={(value) => history.push(value)}
                                value={pathname + "?companyId=" + companyId + "&memberId=" + memberId}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {linkMobileClient.map((value, index) =>
                                    <Option className={value.className} key={index} value={value.link}
                                            onClick={clicked}>{value.text}</Option>
                                )}
                            </Select>
                        </div>
                    </> // oddiy user va doklatchiklarni tekshiryabman
        }</>
    )
}
