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
import Socket from "../MeetingStarted/Socket";
import {subscribe, unsubscribe} from "../../redux/actions/socketActions";

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
    const companyId = query.get("company_id");

    const {currentCompany} = reducers.company
    const {meetings} = reducers.meeting;

    const socketClient = useSelector((state) => state.socket.client);

    useEffect(() => {
        dispatch(subscribe('/topic/getMember'));
        return () => {
            dispatch(unsubscribe('/topic/getMember'));
        }
    }, [dispatch])

    useEffect(() => {
        dispatch(adminMeetingAction.getMeetingByCompanyId({companyId: parseInt(companyId)}))
        dispatch(adminCompanyAction.getCompanyByIdAction({companyId: parseInt(companyId), history}))
    }, [companyId])

    function setStatusOnline(memberId) {
        console.log(memberId)
        const data = {
            memberId: memberId,
            online: true
        }

        socketClient.sendMessage('/topic/setStatus', JSON.stringify(data));
    }

    return (
        <div className="allCss">
            <MeetingHeading company={currentCompany}/>
            <div className="container">
                <Row>
                    <Col md={12}>
                        <Switch>
                            <Route path={"/issuerLegal/meetings"}>
                                <List meetings={meetings} setStatusOnlineUser={setStatusOnline}/>
                            </Route>
                        </Switch>
                    </Col>
                </Row>
            </div>
            <Socket />
        </div>
    )
}
