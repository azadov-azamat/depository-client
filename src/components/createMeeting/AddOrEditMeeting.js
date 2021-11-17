import React, {useEffect, useState} from "react";
import {Col, Container, Label, Row} from "reactstrap";
import './AzamatGlobal.scss';
import {AvField, AvForm, AvGroup, AvInput} from 'availity-reactstrap-validation';
import {Route, Switch, useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    ACTIVE,
    CANCELED, DEPOSITORY_CURRENT_MEETING,
    DEPOSITORY_ROLE,
    DISABLED,
    EXTRAORDINARY,
    FINISH,
    ORDINARY,
    PENDING
} from "../../utils/contants";
import {Select} from 'antd';
import 'antd/dist/antd.css';
import * as adminCompanyAction from "../../redux/actions/CompanyAction";
import * as companyAction from "../../redux/actions/CompanyAction";
import axios from "axios";
import {BASE_URL} from "../../utils/config";
import {api} from "../../api/api";
import {toast} from "react-toastify";
import * as meetingActions from '../../redux/actions/MeetingAction';
import MeetingSettingRoutes from "../../routes/MeetingSettingRoutes";
import NabMeetingJs from "./components/NabMeetingJs";
import MeetingMembers from "./components/MeetingMembers";
import MeetingAgenda from "./components/MeetingAgenda";
import MeetingReestr from "./components/MeetingReestr";
import MeetingFiles from "./components/MeetingFiles";

const {Option} = Select;

export default function AddOrEditMeeting() {

    const {id} = useParams();
    const history = useHistory();
    const dispatch = useDispatch();

    const reducers = useSelector(state => state)
    const {currentMeeting} = reducers.meeting
    const [currentMeetingId, setCurrentMeetingId] = useState();

    useEffect(() => {
        if (localStorage.getItem(DEPOSITORY_CURRENT_MEETING)){
            dispatch(meetingActions.getMeetingByIdAction({meetingId: parseInt(localStorage.getItem(DEPOSITORY_CURRENT_MEETING))}))
            setCurrentMeetingId(localStorage.getItem(DEPOSITORY_CURRENT_MEETING))
        }else {
            dispatch({
                type: "REQUEST_GET_MEETING_SUCCESS",
                payload: []
            })
        }
    }, [])

    console.log(currentMeetingId)
    console.log(currentMeeting)

    return (
        <div className="allCss">
            <MeetingSettingRoutes isDisabled={currentMeeting.length === 0} id={currentMeetingId}/>
            <Container>
                <Switch>
                    <Route
                        path={currentMeetingId ? ("/supervisory/addOrEditMeeting/" + currentMeetingId) : ("/supervisory/addOrEditMeeting")}
                        exact>
                        <NabMeetingJs id={currentMeetingId} currentMeeting={currentMeeting}/>
                    </Route>
                    <Route path={"/supervisory/addOrEditMeeting/" + currentMeetingId + "/member-by-meeting"}>
                        <MeetingMembers currentMeeting={currentMeeting}/>
                    </Route>
                    <Route path={"/supervisory/addOrEditMeeting/" + currentMeetingId + "/agenda-by-meeting"}>
                        <MeetingAgenda currentMeeting={currentMeeting}/>
                    </Route>
                    <Route path={"/supervisory/addOrEditMeeting/" + currentMeetingId + "/reestr-by-meeting"}>
                        <MeetingReestr currentMeeting={currentMeeting}/>
                    </Route>
                    <Route path={"/supervisory/addOrEditMeeting/" + currentMeetingId + "/files-by-meeting"}>
                        <MeetingFiles currentMeeting={currentMeeting}/>
                    </Route>
                </Switch>
            </Container>
        </div>
    )
}
