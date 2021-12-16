import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import '../../../src/components/Dashboard/styles/users.css'
import {Table} from "reactstrap";
import * as adminMeetingAction from "../../redux/actions/MeetingAction";
import {useTranslation} from "react-i18next";
import TableMeeting from "./components/TableMeeting";
import usePagination from "../Dashboard/Pagination";
import RouteByDashboard from "../Dashboard/RouteByDashboard";
import PaginationDashboard from "../Dashboard/PaginationDashboard";
import {useLocation} from "react-router-dom";
import {VscFolderActive} from "react-icons/all";

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function MeetingsListByUser() {

    const dispatch = useDispatch();
    const {t} = useTranslation();
    let query = useQuery();

    const reducers = useSelector(state => state);

    const {payload} = reducers.auth.totalCount
    const {currentUser} = reducers.auth
    const {meetings, meetingByUser} = reducers.meeting

    const [page, setPage] = useState(1);
    const size = 8;

    const count = Math.ceil(payload && payload[0] / size);
    const _DATA = usePagination(meetings && meetings, size);

    const startIndex = (page - 1) * size;
    const lastIndex = startIndex + (payload && payload[1]);

    const companyId = parseInt(query.get("company_id"));

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
        dispatch(adminMeetingAction.getMeetingByUserIdAndCompanyIdAction({
            userId: (currentUser && currentUser.id),
            companyId: companyId
        }));
    }, [currentUser])

    // const SearchMeetingSpecFilter = (value, fieldName) => {
    //     setObjectData(prev => ({
    //         ...prev,
    //         [fieldName]: value
    //     }))
    // }

    console.log(meetingByUser)

    return (
        <div className="">
            <div className="container-fluid">
                <div className="users">
                    <div className="minWidth d-flex justify-content-center align-items-center">
                        <div className="list_wrapper">
                            <Table className="usersList" hover>
                                <thead>
                                <tr>
                                    <th style={{width: '15px'}} className="text-center">#</th>
                                    <th style={{width: '170px'}}
                                        className='text-center '>{t("meetingsList.nameCompany")}</th>
                                    <th style={{width: '140px'}}
                                        className='text-center '>{t("meetingsList.statusMeeting")}</th>
                                    <th style={{width: '135px'}}
                                        className='text-center '>{t("meetingsList.startRegister")}</th>
                                    <th style={{width: '123px'}}
                                        className='text-center '>{t("meetingsList.startMeeting")}</th>
                                    <th style={{width: '135px'}} className='text-center  '>{t("meetingsList.city")}</th>
                                    <th style={{width: '15px'}}><VscFolderActive fontSize={20}/></th>
                                </tr>
                                </thead>
                                <tbody>
                                <TableMeeting meetings={meetingByUser} lang={t}/>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    {/*<PaginationDashboard lang={t} payload={payload} lastIndex={lastIndex} startIndex={startIndex}*/}
                    {/*                     count={count} page={page} handleChange={handleChange}/>*/}
                </div>
            </div>
        </div>
    )
}
