import React, {useEffect, useState} from "react";
import {Container} from "reactstrap";
import ProfileRoute from "../../routes/ProfileRoute";
import {Route, Switch, useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as companyAction from "../../redux/actions/CompanyAction";
import {DEPOSITORY_USER} from "../../utils/contants";
import ProfileUser from "./components/ProfileUser";
import OrganizationUser from "./components/OrganizationUser";
import ActiveNab from "./components/ActiveNab";
import {useTranslation} from "react-i18next";
import {getUserById} from "../../redux/actions/UsersAction";

export default function MyProfile() {

    const {id} = useParams();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const reducers = useSelector(state => state)
    const {currentUser, loading} = reducers.users
    const {companiesByUserId} = reducers.company

    const [booleanMy, setBooleanMy] = useState(false);
    const ID = parseInt(localStorage.getItem(DEPOSITORY_USER))

    useEffect(() => {
        dispatch(companyAction.getCompanyByUserId({currentUserId: ID}))
        dispatch(getUserById({ID: ID}))
    }, [id])

    const userCompanies = [];
    const userMeetings = [];

    companiesByUserId && companiesByUserId.forEach(element => {
        if (element.chairmanId === currentUser.id || element.secretaryId === currentUser.id) {
            userCompanies.push(element)
            setBooleanMy(true)
            element.meetings.forEach(meet => {
                userMeetings.push(meet)
            })
        }
    })

    const styleCursor = {
        cursor: 'wait'
    }

    console.log(booleanMy)
    console.log(userCompanies)
    console.log(userMeetings)

    return (
        <div style={loading ? styleCursor : {}}>
            <Container>
                <ProfileRoute lang={t} booleanComp={booleanMy}/>
                <Switch>
                    <Route path={"/supervisory/personalData/currentUser"} exact>
                        <ProfileUser lang={t} loading={loading} currentUser={currentUser}/>
                    </Route>
                    <Route path={"/supervisory/organization/currentUser/" + ID}>
                        <OrganizationUser lang={t} userCompanies={userCompanies}/>
                    </Route>
                    <Route path={"/supervisory/activeMeeting/currentUser/" + ID}>
                        <ActiveNab lang={t} userMeetings={userMeetings}/>
                    </Route>
                </Switch>
            </Container>
        </div>
    )
}
