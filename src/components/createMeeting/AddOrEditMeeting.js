import React, {useEffect} from "react";
import {Container} from "reactstrap";
import './AzamatGlobal.scss';
import {Route, Switch, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import 'antd/dist/antd.css';
import * as meetingActions from '../../redux/actions/MeetingAction';
import MeetingSettingRoutes from "../../routes/MeetingSettingRoutes";
import NabMeetingJs from "./components/NabMeetingJs";
import MeetingMembers from "./components/MeetingMembers";
import MeetingAgenda from "./components/MeetingAgenda";
import MeetingReestr from "./components/MeetingReestr";
import MeetingFiles from "./components/MeetingFiles";
import Loader from "react-loader-spinner";
import {useTranslation} from "react-i18next";
import StatisticAgenda from "./components/StatisticAgenda";

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function AddOrEditMeeting() {

    const {t} = useTranslation();
    const dispatch = useDispatch();

    const reducers = useSelector(state => state)
    const {currentMeeting, loadingReestr} = reducers.meeting

    let query = useQuery();
    const typeMeeting = query.get("type");
    const meetingId = query.get("meeting_id");

    useEffect(() => {
        if (typeMeeting === "update") {
            dispatch(meetingActions.getMeetingByIdAction({meetingId: parseInt(meetingId)}))
        }
        return () => {
            dispatch({
                type: 'REQUEST_GET_MEETING_SUCCESS',
                payload: []
            });
        }
    }, [meetingId])

    return (
        <div className="allCss">
            <div style={{width: "100%", height: '100vh'}} className={loadingReestr === "loading" ?
                "d-flex justify-content-center align-items-center position-fixed bg-light opacity-75" : 'd-none'}>
                {loadingReestr === "loading"
                    ?
                    <>
                        <Loader
                            type="ThreeDots"
                            color="#132E85"
                            height={100}
                            width={100}
                            timeout={13000}
                        />
                    </> :
                    <>

                    </>
                }
            </div>
            <MeetingSettingRoutes lang={t} isDisabled={typeMeeting === "create" || loadingReestr === "loading"}
                                  id={meetingId}/>
            <Container>
                <Switch>
                    <Route path={"/supervisory/addOrEditMeeting/meeting"}>
                        <NabMeetingJs lang={t} id={meetingId} currentMeeting={currentMeeting}/>
                    </Route>
                    <Route path={"/supervisory/addOrEditMeeting/add_members"}>
                        <MeetingMembers lang={t} currentMeetingId={meetingId}/>
                    </Route>
                    <Route path={"/supervisory/addOrEditMeeting/add_agenda"}>
                        <MeetingAgenda lang={t} currentMeetingId={meetingId}/>
                    </Route>
                    <Route path={"/supervisory/addOrEditMeeting/add_reestr"}>
                        <MeetingReestr lang={t} currentMeeting={currentMeeting}/>
                    </Route>
                    <Route path={"/supervisory/addOrEditMeeting/add_files"}>
                        <MeetingFiles lang={t} currentMeeting={currentMeeting}/>
                    </Route>
                </Switch>
            </Container>
        </div>
    )
}
