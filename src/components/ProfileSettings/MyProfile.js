import React, {useEffect, useState} from "react";
import {Container} from "reactstrap";
import ProfileRoute from "../../routes/ProfileRoute";
import {Route, Switch, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as companyAction from "../../redux/actions/CompanyAction";
import {DEPOSITORY_USER} from "../../utils/contants";
import ProfileUser from "./components/ProfileUser";
import OrganizationUser from "./components/OrganizationUser";
import ActiveNab from "./components/ActiveNab";
import {useTranslation} from "react-i18next";
import {getUserById} from "../../redux/actions/UsersAction";
import {List} from "../userPages/component/List";
import {ListMeeting} from "./components/ListMeeting";

export default function MyProfile() {

    const {id} = useParams();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const reducers = useSelector(state => state)
    const {currentUser, loading} = reducers.users
    const {companiesByUserId} = reducers.company

    const [booleanMy, setBooleanMy] = useState(false);
    // const ID = parseInt(localStorage.getItem(DEPOSITORY_USER))

    console.log(currentUser)

    useEffect(() => {
        // dispatch(companyAction.getCompanyByUserId({currentUserId: ID}))
        // dispatch(getUserById({ID: ID}))
    }, [id])

    const userCompanies = [];
    const userMeetings = [];

    useEffect(() => {
        setBooleanMy(
            companiesByUserId?.some(element => element.chairmanId === currentUser.id || element.secretaryId === currentUser.id));
    }, [booleanMy, companiesByUserId])

    // companiesByUserId && companiesByUserId.forEach(element => {
    //     if (element.chairmanId === currentUser.id || element.secretaryId === currentUser.id) {
    //         userCompanies.push(element)
    //         setBooleanMy(true)
    //         element.meetings.forEach(meet => {
    //             userMeetings.push(meet)
    //         })
    //     }
    // })

    const styleCursor = {
        cursor: 'wait'
    }

    return (
        <div style={loading ? styleCursor : {}}>
            <Container>
                <ProfileRoute lang={t} booleanComp={!booleanMy}/>
                <Switch>
                    <Route path={"/supervisory/profile/user"} exact>
                        <ProfileUser lang={t} loading={loading} currentUser={currentUser}/>
                    </Route>
                    <Route path={"/supervisory/profile/organization"}>
                        <OrganizationUser lang={t} userCompanies={userCompanies}/>
                    </Route>
                    <Route path={"/supervisory/profile/meetings"}>
                        <ListMeeting lang={t} userMeetings={userMeetings}/>
                    </Route>
                </Switch>
            </Container>
        </div>
    )
}
