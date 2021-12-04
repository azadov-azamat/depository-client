import React, {useEffect, useState} from "react";
import {Container} from "reactstrap";
import './AzamatGlobal.scss';
import {Route, Switch, useHistory, useLocation, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {DEPOSITORY_CURRENT_MEETING} from "../../utils/contants";
import {Select} from 'antd';
import 'antd/dist/antd.css';
import * as meetingActions from '../../redux/actions/MeetingAction';
import MeetingSettingRoutes from "../../routes/MeetingSettingRoutes";
import NabMeetingJs from "./components/NabMeetingJs";
import MeetingMembers from "./components/MeetingMembers";
import MeetingAgenda from "./components/MeetingAgenda";
import MeetingReestr from "./components/MeetingReestr";
import MeetingFiles from "./components/MeetingFiles";
import Loader from "react-loader-spinner";

const {Option} = Select;

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function AddOrEditMeeting() {

    const {id} = useParams();
    const history = useHistory();
    const dispatch = useDispatch();

    const reducers = useSelector(state => state)
    const {currentMeeting, loadingReestr} = reducers.meeting

    let query = useQuery();
    const typeMeeting = query.get("type");
    const meetingId = query.get("meeting_id");

    useEffect(() => {
        if (typeMeeting === "update") {
            dispatch(meetingActions.getMeetingByIdAction({meetingId: parseInt(meetingId)}))
        } else {
            dispatch({
                type: "REQUEST_GET_MEETING_SUCCESS",
                payload: []
            })
        }
    }, [typeMeeting])

    useEffect(()=>{

    },[])


    return (
        <div className="allCss">
            <div style={{width: "100%", height: '100vh'}} className={loadingReestr === "loading" ?
                "d-flex justify-content-center align-items-center position-fixed bg-light opacity-75" : "d-none"}>
                <Loader
                    type="ThreeDots"
                    color="#132E85"
                    height={80}
                    width={80}
                    timeout={3000}
                />
            </div>
            <MeetingSettingRoutes isDisabled={typeMeeting === "create" || loadingReestr === "loading"} id={meetingId}/>
            <Container>
                <Switch>
                    <Route path={"/supervisory/addOrEditMeeting/meeting"}>
                        <NabMeetingJs id={meetingId} currentMeeting={currentMeeting}/>
                    </Route>
                    <Route path={"/supervisory/addOrEditMeeting/add_members"}>
                        <MeetingMembers currentMeetingId={meetingId}/>
                    </Route>
                    <Route path={"/supervisory/addOrEditMeeting/add_agenda"}>
                        <MeetingAgenda currentMeetingId={meetingId}/>
                    </Route>
                    <Route path={"/supervisory/addOrEditMeeting/add_reestr"}>
                        <MeetingReestr currentMeeting={currentMeeting}/>
                    </Route>
                    <Route path={"/supervisory/addOrEditMeeting/add_files"}>
                        <MeetingFiles currentMeeting={currentMeeting}/>
                    </Route>
                </Switch>
            </Container>
        </div>
    )
}
