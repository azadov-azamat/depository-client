import React from 'react'
import {Link, useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";

function useQuery() {
    const {search} = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const NavbarMeeting = () => {

    let query = useQuery();
    const companyId = query.get("company_id");
    const {t} = useTranslation();

    const link = [
        {
            id: 1,
            text: t("clientPage.allActiveMeetings"),
            link: '/issuerLegal/meetings?company_id=' + companyId + "&type=active",
            type: 'active'
        },
        {
            id: 2,
            text: t("clientPage.allArchiveMeetings"),
            link: '/issuerLegal/meetings?company_id=' + companyId + "&type=archive",
            type: 'archive'
        },
    ]

    const linkMap = ({id, text, link, type}) => (
        <h4 key={id} className={query.get("type") === type ? 'border-bottom' : ''}>
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
