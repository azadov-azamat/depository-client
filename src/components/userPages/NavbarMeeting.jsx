import React from 'react'
import {NavItem} from "reactstrap";
import {NavLink, useParams} from "react-router-dom";

export const NavbarMeeting = ({companyId}) => {

    const {id} = useParams();

    const link = [
        {text: 'Общее заседание', link: '/issuerLegal/meetings/company_id/' + id},
        {text: 'Архив заседание', link: '/issuerLegal/archiveMeetings/company_id/' + id},
    ]

    const linkMap = ({text, link}) => (
        <NavItem>
            <NavLink to={link} className={"nav-link"}>{text}</NavLink>
        </NavItem>
    )

    return (
        <div>
            <ul className="nav nav-tabs">
                {link.map(linkMap)}
            </ul>
        </div>
    )
}
