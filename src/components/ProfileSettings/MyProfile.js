import React, {useEffect, useState} from "react";
import ProfileRoute from "../../routes/ProfileRoute";
import {Route, Switch, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import ProfileUser from "./components/ProfileUser";
import OrganizationUser from "./components/OrganizationUser";
import {useTranslation} from "react-i18next";
import MeetingsListByUser from "./MeetingsListByUser";
import * as companyAction from "../../redux/actions/CompanyAction";
import {getUserById} from "../../redux/actions/UsersAction";

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function MyProfile() {

    const {t} = useTranslation();
    const dispatch = useDispatch();
    const reducers = useSelector(state => state)
    let query = useQuery();
    const {currentUser} = reducers.auth
    const {loading, currentForUser} = reducers.users
    const {companiesByUserId} = reducers.company

    const [booleanMy, setBooleanMy] = useState(false);

    const userId = parseInt(query.get("ID"));

    useEffect(() => {
        setBooleanMy(
            companiesByUserId?.some(element => element.chairmanId === userId || element.secretaryId === userId));
    }, [companiesByUserId])

    useEffect(() => {
        if (userId) {
            dispatch(companyAction.getCompanyByUserId({currentUserId: userId}))
        }
        dispatch(getUserById({userId}))
    },[userId])

    const styleCursor = {
        cursor: 'wait'
    }

    return (
        <div style={loading ? styleCursor : {}}>
            <ProfileRoute lang={t}/>
            <Switch>
                <Route path={"/supervisory/profile/user"} exact>
                    <ProfileUser lang={t} loading={loading} currentUser={currentForUser} boolean={booleanMy}/>
                </Route>
                <Route path={"/supervisory/profile/organization"}>
                    <OrganizationUser lang={t} ID={currentUser?.id}/>
                </Route>
                <Route path={"/supervisory/profile/meetings"}>
                    <MeetingsListByUser lang={t} ID={currentUser?.id}/>
                </Route>
            </Switch>
        </div>
    )
}
