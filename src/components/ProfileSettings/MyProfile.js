import React, {useEffect, useState} from "react";
import ProfileRoute from "../../routes/ProfileRoute";
import {Route, Switch} from "react-router-dom";
import {useSelector} from "react-redux";
import ProfileUser from "./components/ProfileUser";
import OrganizationUser from "./components/OrganizationUser";
import {useTranslation} from "react-i18next";
import MeetingsListByUser from "./MeetingsListByUser";

export default function MyProfile() {

    const {t} = useTranslation();
    const reducers = useSelector(state => state)
    const {currentUser} = reducers.auth
    const {loading} = reducers.users
    const {companiesByUserId} = reducers.company

    const [booleanMy, setBooleanMy] = useState(false);

    const userId = currentUser.id;

    useEffect(() => {
        setBooleanMy(
            companiesByUserId?.some(element => element.chairmanId === currentUser.id || element.secretaryId === currentUser.id));
    }, [booleanMy, companiesByUserId])

    const styleCursor = {
        cursor: 'wait'
    }

    return (
        <div style={loading ? styleCursor : {}}>
            <ProfileRoute lang={t} booleanComp={booleanMy}/>
            <Switch>
                <Route path={"/supervisory/profile/user"} exact>
                    <ProfileUser lang={t} loading={loading} currentUser={currentUser} boolean={booleanMy}/>
                </Route>
                <Route path={"/supervisory/profile/organization"}>
                    <OrganizationUser lang={t} ID={userId}/>
                </Route>
                <Route path={"/supervisory/profile/meetings"}>
                    <MeetingsListByUser lang={t} ID={userId}/>
                </Route>
            </Switch>
        </div>
    )
}
