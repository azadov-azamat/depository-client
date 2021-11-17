import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {List} from './List'
import {NavbarMeeting} from './NavbarMeeting'
import {Col, Container, Row} from "reactstrap";
import {useHistory, useLocation, useParams} from "react-router-dom";
import MeetingHeading from "./MeetingHeading";
import {useTranslation} from "react-i18next";
import * as adminCompanyAction from "../../redux/actions/CompanyAction";
import * as companyAction from "../../redux/actions/CompanyAction";
import {DEPOSITORY_USER} from "../../utils/contants";

export const ArchiveMeetings = () => {

    const {id} = useParams();
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch()

    const reducers = useSelector(state => state)
    const {companiesByUserId, currentCompany} = reducers.company
    const [meeting, setMeeting] = useState([]);
    const company = companiesByUserId && companiesByUserId.find(element => element.id === parseInt(id))

    useEffect(() => {
        setMeeting(company && company.meetings)
        dispatch(companyAction.getCompanyByUserId({currentUserId: localStorage.getItem(DEPOSITORY_USER)}))
    }, [meeting, id, company])

    return (
        <div className="allCss">
            <MeetingHeading company={company}/>
            <div className="container">
                <Row>
                    <Col md={12}>
                        <List meetings={meeting} pathname={'archive'}/>
                    </Col>
                </Row>

            </div>
        </div>
    )
}
