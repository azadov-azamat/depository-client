import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import '../styles/users.css'
import {Table} from "reactstrap";
import * as adminMeetingAction from "../../../redux/actions/MeetingAction";
import TableMeetings from "./TableMeetings";
import usePagination from "../Pagination";
import FormForMeeting from "./FormForMeeting";
import RouteByDashboard from "../RouteByDashboard";
import PaginationDashboard from "../PaginationDashboard";
import {useTranslation} from "react-i18next";

function AdminMeetings() {

    const dispatch = useDispatch();
    const {t} = useTranslation();

    const reducers = useSelector(state => state);

    const {payload} = reducers.auth.totalCount
    const {meetings} = reducers.meeting

    const [page, setPage] = useState(1);
    const size = 6;

    const count = Math.ceil(payload && payload[0] / size);
    const _DATA = usePagination(meetings && meetings, size);

    const startIndex = (page - 1) * size;
    const lastIndex = startIndex + (payload && payload[1]);

    const [objectData, setObjectData] = useState({
        companyId: null,
        status: null,
        startRegistration: null,
        startDate: null,
        cityId: null
    })

    useEffect(() => {

        dispatch({
            type: 'updateState',
            payload: {
                currentCompany: '',
                currentMeeting: ''
            }
        });

        dispatch({
            type: 'REQUEST_GET_MEETING_SUCCESS',
            payload: []
        });
    }, [page])

    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    useEffect(() => {
        dispatch(adminMeetingAction.getMeetingSpecFilterAction({objectData, page, size}));
    }, [objectData, page])

    const SearchMeetingSpecFilter = (value, fieldName) => {
        setObjectData(prev => ({
            ...prev,
            [fieldName]: value
        }))
    }

    return (
        <div className="dashboard p-3">
            <div className="container-fluid">
                <div className="users">
                    <RouteByDashboard link={"/supervisory/addOrEditMeeting/meeting?type=create"}
                                      cardName={t("routes.controlPage.meeting")}
                                      startIndex={startIndex} lastIndex={lastIndex} payload={payload} lang={t}/>
                    <div className="minWidth d-flex justify-content-center align-items-center">
                        <div className="list_wrapper">
                            <Table className="usersList" hover>
                                <thead>
                                <tr>
                                    <th style={{width: '15px'}}/>
                                    <th style={{width: '170px'}}
                                        className='text-center '>{t("meetingsList.nameCompany")}</th>
                                    <th style={{width: '140px'}}
                                        className='text-center '>{t("meetingsList.statusMeeting")}</th>
                                    <th style={{width: '135px'}}
                                        className='text-center '>{t("meetingsList.startRegister")}</th>
                                    <th style={{width: '123px'}}
                                        className='text-center '>{t("meetingsList.startMeeting")}</th>
                                    <th style={{width: '135px'}} className='text-center  '>{t("meetingsList.city")}</th>
                                    <th style={{width: '15px'}}/>
                                    <th style={{width: '15px'}}/>
                                </tr>
                                </thead>
                                <tbody>
                                <FormForMeeting getName={SearchMeetingSpecFilter} lang={t}/>
                                <TableMeetings meetings={meetings} lang={t}/>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <PaginationDashboard lang={t} payload={payload} lastIndex={lastIndex} startIndex={startIndex}
                                         count={count} page={page} handleChange={handleChange}/>
                </div>
            </div>
        </div>
    )
}

export default AdminMeetings
