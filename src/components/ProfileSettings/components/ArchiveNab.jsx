import React, {useEffect} from "react";
import {Col, Container, Row} from "reactstrap";
import ProfileRoute from "../../../routes/ProfileRoute";
import {useHistory} from "react-router-dom";
import {List} from "../../userPages/component/List";
import {useDispatch, useSelector} from "react-redux";
import * as companyAction from "../../../redux/actions/CompanyAction";

export default function ArchiveNab({lang}) {
    const history = useHistory();
    const dispatch = useDispatch();
    const reducers = useSelector(state => state)
    const {currentUser} = reducers.users
    const {companiesByUserId} = reducers.company

    useEffect(() => {
        dispatch(companyAction.getCompanyByUserId({currentUserId: currentUser?.id}))
    }, [])

    const userMeetings = [];
    companiesByUserId && companiesByUserId.forEach(element => {
        if (element.chairmanId === currentUser.id || element.secretaryId === currentUser.id) {
            element.meetings.forEach(meet => {
                userMeetings.push(meet)
            })
        }
    })
    return (
        <>
            <Container>
                <ProfileRoute lang={lang} booleanComp={true} pagePath={'archiveMeetings'}/>
                <List pathname={'archive'} meetings={userMeetings}/>
            </Container>
        </>
    )
}
