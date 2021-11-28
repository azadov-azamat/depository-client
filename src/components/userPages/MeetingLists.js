import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {List} from './component/List'

import "../MeetingStarted/meeting.css"
import {Col, Row} from "reactstrap";
import {Route, Switch, useLocation, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import MeetingHeading from "./component/MeetingHeading";
import * as companyAction from "../../redux/actions/CompanyAction";
import {DEPOSITORY_USER} from "../../utils/contants";


export const MeetingLists = () => {

    const {id} = useParams();
    const {t} = useTranslation();
    const location = useLocation();
    const {pathname} = location
    const dispatch = useDispatch()
    const reducers = useSelector(state => state)
    const {companiesByUserId} = reducers.company
    const {memberManagerState} = reducers.meeting
    const [meeting, setMeeting] = useState([]);
    const company = companiesByUserId && companiesByUserId.find(element => element.id === parseInt(id))

    useEffect(() => {
        setMeeting(company && company.meetings)
        dispatch(companyAction.getCompanyByUserId({currentUserId: localStorage.getItem(DEPOSITORY_USER)}))
    }, [meeting])

    return (
        <div className="allCss">
            <MeetingHeading company={company}/>
            <div className="container">
                <Row>
                    <Col md={12}>
                        <Switch>
                            <Route path={"/issuerLegal/meetings/company_id/:id"}>
                                <List meetings={meeting}/>
                            </Route>
                        </Switch>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
