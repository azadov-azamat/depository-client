import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {List} from './component/List'

import "../MeetingStarted/meeting.css"
import {Col, Row} from "reactstrap";
import {Route, Switch, useHistory, useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";
import MeetingHeading from "./component/MeetingHeading";
import * as adminCompanyAction from "../../redux/actions/CompanyAction";
import * as adminMeetingAction from "../../redux/actions/MeetingAction";

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const MeetingLists = () => {

    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch()

    let query = useQuery();
    const reducers = useSelector(state => state)
    const companyId = parseInt(query.get("company_id"));
    const status = query.get("type");

    const {currentCompany} = reducers.company
    const {meetingByUser} = reducers.meeting;
    const {currentUser} = reducers.auth

    useEffect(() => {
        dispatch(adminMeetingAction.getMeetingByUserIdAndCompanyIdAction({
            userId: (currentUser && currentUser.id),
            companyId: companyId
        }))
    }, [companyId, currentUser])

    useEffect(() => {
        dispatch(adminCompanyAction.getCompanyByIdAction({companyId: companyId, history}));

        return () => {
            dispatch({
                type: 'REQUEST_SUCCESS_MEETING_BY_USER_AND_COMPANY',
                payload: []
            });
        }
    }, [companyId])

    return (
        <div className="allCss">
            <MeetingHeading company={currentCompany} lang={t}/>
            <div className="container">
                <Row>
                    <Col md={12}>
                        <Switch>
                            <Route path={"/issuerLegal/meetings"}>
                                <List meetings={meetingByUser} companyId={companyId} type={status} lang={t}/>
                            </Route>
                        </Switch>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
