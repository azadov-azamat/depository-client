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
import {DEPOSITORY_USER} from "../../../utils/contants";
import * as types from "../../../redux/actionTypes/UsersActionTypes";


export default function AdminUsers() {

    const dispatch = useDispatch();
    const history = useHistory();
    const {t} = useTranslation();

    const reducers = useSelector(state => state);

    const {loading, users} = reducers.users
    const {payload} = reducers.auth.totalCount

    const [name, setName] = useState('');
    const [page, setPage] = useState(1);

    const size = 6;

    const count = Math.ceil(payload && payload[0] / size);
    const _DATA = usePagination(users && users, size);

    const startIndex = (page - 1) * size;
    const lastIndex = startIndex + (payload && payload[1]);

    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    useEffect(() => {
        if (!name) {
            dispatch(adminUserAction.getUsersList({page, size}));
        }
        localStorage.removeItem("currentEditUser")
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

    const getName = (value, index) => {
        setName(value)
        const NAME = 'FULL_NAME'
        const EMAIL = 'EMAIL'
        const PHONE_NUMBER = 'PHONE_NUMBER'
        const GROUP = 'GROUP'
        const PINFL = 'PINFL'
        let field = ''

        if (index === 0) {
            field = NAME
        } else if (index === 1) {
            field = EMAIL
        } else if (index === 2) {
            field = PHONE_NUMBER
        } else if (index === 3) {
            field = GROUP
        } else if (index === 4) {
            field = PINFL
        }
        if (value === "ALL") {
            dispatch(adminUserAction.getUsersList({page, size}));
        }
        if (value.length >= 3) {
            dispatch(adminUserAction.getUserFilter({value, field}));
        }
    }

    const updateUser = (userId) => {
        dispatch(adminUserAction.getUserById({userId: userId, history}))
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
                                    <th style={{width: '170px'}} className='text-center'>{t('AdminUser.fullName')}</th>
                                    <th style={{width: '140px'}} className='text-center'>{t('AdminUser.email')}</th>
                                    <th style={{width: '135px'}} className='text-center'>{t('AdminUser.number')}</th>
                                    <th style={{width: '123px'}} className='text-center'>{t('AdminUser.group')}</th>
                                    <th style={{width: '135px'}} className='text-center'>{t('AdminUser.pinfl')}</th>
                                    <th style={{width: '15px'}}/>
                                    <th style={{width: '15px'}}/>
                                </tr>
                                </thead>
                                <tbody>
                                <FormForUser getName={getName} t={t}/>
                                {
                                    users && users.map((user, i) =>
                                        // user.authorities[0] === "ROLE_ADMIN" ? "" :
                                            <TableUsers deleteById={del} user={user} key={i}
                                                        updateUser={updateUser} t={t}/>
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
