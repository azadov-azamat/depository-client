import React from 'react'
import {Link, useLocation, useParams} from "react-router-dom";

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const NavbarMeeting = ({companyId}) => {

    const {id} = useParams();
    const location = useLocation();
    const {pathname} = location;
    let query = useQuery();

    console.log(pathname)
    const link = [
        {text: 'Общее заседание', link: '/issuerLegal/meetings/company_id/' + id + "?type=active", type: 'active'},
        {text: 'Архив заседание', link: '/issuerLegal/meetings/company_id/' + id + "?type=archive", type: 'archive'},
    ]

    const linkMap = ({text, link, type}) => (
        <h4 className={query.get("type") === type ? 'border-bottom' : ''}>
            <Link to={link}
                  className={query.get("type") === type ? 'nav-link text-dark' : 'nav-link text-dark text-opacity-25'}>{text}</Link>
        </h4>
    )

    return (
        <ul className="nav">
            {link.map(linkMap)}
        </ul>
    )

}
