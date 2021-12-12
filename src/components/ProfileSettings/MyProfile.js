import React, {useEffect, useState} from "react";
import {Container} from "reactstrap";
import ProfileRoute from "../../routes/ProfileRoute";
import {Route, Switch, useLocation, useParams} from "react-router-dom";
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
import * as adminMeetingAction from "../../redux/actions/MeetingAction";

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function MyProfile() {

    const {id} = useParams();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    let query = useQuery();
    const reducers = useSelector(state => state)
    const {currentUser} = reducers.auth
    const {loading} = reducers.users
    const {companiesByUserId} = reducers.company
    const {meetings, meetingByUser} = reducers.meeting;

    const [booleanMy, setBooleanMy] = useState(false);
    const [userMeetings] = useState([]);

    const companyId = parseInt(query.get("company_id"));
    const userId = currentUser.id;

    useEffect(() => {
        dispatch(adminMeetingAction.getMeetingByUserIdAndCompanyIdAction({userId: userId, companyId: companyId}))
    }, [id])

    useEffect(() => {
        setBooleanMy(
            companiesByUserId?.some(element => element.chairmanId === currentUser.id || element.secretaryId === currentUser.id));
         }, [booleanMy, companiesByUserId])

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
                        <OrganizationUser lang={t} ID={userId}/>
                    </Route>
                    <Route path={"/supervisory/profile/meetings"}>
                        <ListMeeting lang={t} meetings={meetingByUser}/>
                    </Route>
                </Switch>
            </Container>
        </div>
    )
}
