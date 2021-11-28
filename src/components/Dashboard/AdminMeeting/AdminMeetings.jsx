import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import '../styles/users.css'
import {Table} from "reactstrap";
import * as adminMeetingAction from "../../../redux/actions/MeetingAction";
import {confirmAlert} from "react-confirm-alert";
import TableMeetings from "./TableMeetings";
import usePagination from "../Pagination";
import FormForMeeting from "./FormForMeeting";
import {useHistory} from "react-router-dom";
import {REQUEST_CREATE_MEETING} from "../../../redux/actionTypes/MeetingActionTypes";
import RouteByDashboard from "../RouteByDashboard";
import PaginationDashboard from "../PaginationDashboard";
import {DEPOSITORY_CURRENT_MEETING} from "../../../utils/contants";
import {useTranslation} from "react-i18next";

function AdminMeetings() {

    const dispatch = useDispatch();
    const history = useHistory();
    const {t} = useTranslation();

    const reducers = useSelector(state => state);

    // const companies = reducers.company.companies;
    const {payload} = reducers.auth.totalCount
    const {meetings} = reducers.meeting

    const [name, setName] = useState('');

    const [page, setPage] = useState(1);
    const size = 6;

    const count = Math.ceil(payload && payload[0] / size);
    const _DATA = usePagination(meetings && meetings, size);

    const startIndex = (page - 1) * size;
    const lastIndex = startIndex + (payload && payload[1]);

    useEffect(() => {
        if (!name) {
            dispatch(adminMeetingAction.getMeetingList({page: page, size: size}));
        }

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
        localStorage.removeItem(DEPOSITORY_CURRENT_MEETING)
    }, [page, name])

    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    const submit = (id) => {
        confirmAlert({
            title: 'Удалить',
            message: 'Вы действительно хотите удалить в компанию?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => {
                        dispatch(adminMeetingAction.deleteMeetingById(id))
                    }
                },
                {
                    label: 'Нет',
                }
            ]
        });
    };

    const getName = (value, index) => {
        setName(value)
        let field = ''
        if (index === 0) {
            field = 'COMPANY'
        } else if (index === 1) {
            field = 'STATUS'
        } else if (index === 2) {
            field = 'START_DATE'
        }

        if (value.length >= 3) {
            dispatch(adminMeetingAction.getMeetingFilter({value, field}));
        } else if (index === 1) {
            dispatch(adminMeetingAction.getMeetingFilter({value, field}));
        }
    }

    const updateMeeting = (currentMeeting) => {
        dispatch({
            type: REQUEST_CREATE_MEETING,
            payload: currentMeeting
        })
        history.push('/supervisory/addOrEditMeeting/' + currentMeeting.id)
        localStorage.setItem(DEPOSITORY_CURRENT_MEETING, currentMeeting.id)
    }

    return (
        <div className="dashboard p-3">
            <div className="container-fluid">
                <div className="users">
                    <RouteByDashboard link={'/supervisory/addOrEditMeeting/create'} cardName={t("routes.controlPage.meeting")}
                                      startIndex={startIndex} lastIndex={lastIndex} payload={payload} lang={t}/>
                    <div className="minWidth d-flex justify-content-center align-items-center">
                        <div className="list_wrapper">
                            <Table className="usersList" hover>
                                <thead>
                                <tr>
                                    <th style={{width: '15px'}}/>
                                    <th style={{width: '170px'}} className='text-center '>Компания</th>
                                    <th style={{width: '140px'}} className='text-center '>Статус заседание</th>
                                    <th style={{width: '135px'}} className='text-center '>Начало регистрации</th>
                                    <th style={{width: '123px'}} className='text-center '>Начало засидание</th>
                                    <th style={{width: '135px'}} className='text-center  '>Город/область</th>
                                    <th style={{width: '15px'}}/>
                                    <th style={{width: '15px'}}/>
                                </tr>
                                </thead>
                                <tbody>
                                <FormForMeeting getName={getName}/>
                                {
                                    meetings && meetings.map((meeting, index) => (
                                        <TableMeetings meeting={meeting} deleteById={submit} key={index}
                                                       updateMeeting={updateMeeting}/>
                                    ))
                                }
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
