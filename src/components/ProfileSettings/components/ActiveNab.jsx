import React from "react";
import {useLocation} from "react-router-dom";
import {List} from "../../userPages/component/List";

export default function ActiveNab({lang, userMeetings}) {
    const location = useLocation();
    const {pathname} = location;

    return (
        <List meetings={userMeetings} pathname={pathname}/>
    )
}
