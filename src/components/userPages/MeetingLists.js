import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {List} from './List'

import "../MeetingStarted/meeting.css"
import {Col, Row} from "reactstrap";
import {Route, Switch, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import MeetingHeading from "./MeetingHeading";
import * as companyAction from "../../redux/actions/CompanyAction";
import {DEPOSITORY_CURRENT_MEETING, DEPOSITORY_USER, SPEAKER} from "../../utils/contants";
import * as meetingActions from "../../redux/actions/MeetingAction";


export const MeetingLists = () => {

    const {id} = useParams();
    const {t} = useTranslation();
    const dispatch = useDispatch()
    const reducers = useSelector(state => state)
    const {companiesByUserId} = reducers.company
    const {memberManagerState} = reducers.meeting
    const [meeting, setMeeting] = useState([]);
    const company = companiesByUserId && companiesByUserId.find(element => element.id === parseInt(id))
    const [Watcher, setWatcher] = useState(false);

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
                            <Route exact path={"/issuerLegal/meetings/company_id/" + id + "/active"}>
                                <List meetings={meeting} watcher={Watcher}/>
                            </Route>
                            <Route path={"/issuerLegal/meetings/company_id/" + id + "/archive"}>
                                <List meetings={meeting} pathname={'archive'}/>
                            </Route>
                        </Switch>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
