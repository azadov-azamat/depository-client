import React, {useEffect, useState} from 'react'
import '../styles/users.css'
import {useDispatch, useSelector} from 'react-redux';
import {Table} from "reactstrap";
import FormForUser from "./FormForUser";
import {useHistory} from "react-router-dom";
import usePagination from "../Pagination";
import {confirmAlert} from "react-confirm-alert";
import {useTranslation} from "react-i18next";
import RouteByDashboard from "../RouteByDashboard";
import PaginationDashboard from "../PaginationDashboard";
import * as adminUserAction from "../../../redux/actions/UsersAction";
import TableUsers from "./TableUsers";
import * as types from "../../../redux/actionTypes/UsersActionTypes";


export default function AdminUsers() {

    const dispatch = useDispatch();
    const {t} = useTranslation();

    const reducers = useSelector(state => state);

    const {loading, users} = reducers.users
    const {payload} = reducers.auth.totalCount

    const [name, setName] = useState('');
    const [page, setPage] = useState(1);

    const size = 8;

    const count = Math.ceil(payload && payload[0] / size);
    const _DATA = usePagination(users && users, size);

    const startIndex = (page - 1) * size;
    const lastIndex = startIndex + (payload && payload[1]);

    const [dataFilter, setDataFilter] = useState({
        fullName: null,
        email: null,
        groupEnum: null,
        phoneNumber: null,
        pinfl: null,
    })

    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    useEffect(() => {
        dispatch(adminUserAction.getUserSpecFilterAction({dataFilter, page, size}));
        return () => {
            dispatch({
                type: "TOTAL_COUNT_PAGE",
                payload: [0, 0]
            })
        }
    }, [dataFilter, page])

    useEffect(() => {
        dispatch({
            type: types.REQUEST_GET_USER_SUCCESS,
            payload: []
        })
    }, [page, name])

    const del = (userId) => {

        confirmAlert({
            title: 'Удалить',
            message: 'Вы действительно хотите удалить пользователя?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => dispatch(adminUserAction.deleteUserAction({userId, page}))
                },
                {
                    label: 'Нет',
                    // onClick: () => dispatch(adminUserAction.deleteUserAction(userId))
                }
            ]
        });
    }

    const SearchUserSpecFilter = (value, fieldName) => {
        if (fieldName !== "groupEnum") {
            if (value.length >= 3 || value.length === 0) {
                setDataFilter(prev => ({
                    ...prev,
                    [fieldName]: value
                }))
            }
        } else {
            setDataFilter(prev => ({
                ...prev,
                [fieldName]: value
            }))
        }
    }

    return (
        <div className="dashboard p-3">
            <div className="container-fluid">
                <div className="users">
                    <RouteByDashboard link={'/admin/users/create'} cardName={t("routes.controlPage.user")}
                                      startIndex={startIndex} lastIndex={lastIndex} payload={payload} lang={t}/>
                    <div className="minWidth w-100 d-flex justify-content-center align-items-center">
                        <div className="list_wrapper">
                            <Table className="usersList" hover={!loading}>
                                <thead>
                                <tr>
                                    <th style={{width: '15px'}}/>
                                    <th style={{width: '170px'}}
                                        className='text-center'>{t('AdminUser.fullName')}</th>
                                    <th style={{width: '140px'}} className='text-center'>{t('AdminUser.email')}</th>
                                    <th style={{width: '135px'}}
                                        className='text-center'>{t('AdminUser.number')}</th>
                                    <th style={{width: '123px'}} className='text-center'>{t('AdminUser.group')}</th>
                                    <th style={{width: '135px'}} className='text-center'>{t('AdminUser.pinfl')}</th>
                                    <th style={{width: '15px'}}/>
                                    <th style={{width: '15px'}}/>
                                </tr>
                                </thead>
                                <tbody>
                                <FormForUser getName={SearchUserSpecFilter} t={t}/>
                                {
                                    users && users.map((user, i) =>
                                        <TableUsers deleteById={del} user={user} key={i} t={t}/>
                                    )
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
