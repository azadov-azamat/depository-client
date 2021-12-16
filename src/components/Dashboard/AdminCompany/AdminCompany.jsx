import React, {useEffect, useState} from 'react'
import '../styles/users.css'
import {useDispatch, useSelector} from 'react-redux'
import {Table} from "reactstrap";
import FormForCompany from "./FormForCompany";
import * as adminCompanyAction from "../../../redux/actions/CompanyAction";
import usePagination from "../Pagination";
import TableCompany from "./TableCompany";
import {confirmAlert} from "react-confirm-alert";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import RouteByDashboard from "../RouteByDashboard";
import PaginationDashboard from "../PaginationDashboard";

function AdminCompany() {

    const dispatch = useDispatch();
    const history = useHistory();
    const {t} = useTranslation();

    const reducers = useSelector(state => state)
    const {loading, companies} = reducers.company
    const {payload} = reducers.auth.totalCount

    const [page, setPage] = useState(1);
    const [dataFilter, setDataFilter] = useState({
        name: null,
        email: null,
        phoneNumber: null,
        webPage: null,
        inn: null,
    })

    const size = 8;

    const count = Math.ceil(payload && payload[0] / 6);
    const _DATA = usePagination(companies && companies, size);

    const startIndex = (page - 1) * size;
    const lastIndex = startIndex + (payload && payload[1]);

    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    useEffect(() => {
        dispatch({
            type: 'updateState',
            payload: {
                currentCompany: '',
                users: '',
                loading: false,
                createCompanyLoading: false
            }
        });
        dispatch({
            type: "REQUEST_API_SUCCESS_USERS",
            payload: []
        })
    }, [])

    const SearchCompanySpecFilter = (value, fieldName) => {
        if (value.length >= 3 || value.length === 0) {
            setDataFilter(prev => ({
                ...prev,
                [fieldName]: value
            }))
        }
    }

    useEffect(() => {
        dispatch(adminCompanyAction.getCompanySpecFilterAction({dataFilter, page, size}));
    }, [dataFilter, page])

    const submit = (id) => {
        confirmAlert({
            title: 'Удалить',
            message: 'Вы действительно хотите удалить в компанию?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => {
                        dispatch(adminCompanyAction.deleteByIdCompany(id))
                    }

                },
                {
                    label: 'Нет',
                }
            ]
        });
    };

    const updateCompany = (currentMeetingId) => {
        dispatch(adminCompanyAction.getCompanyByIdAction({companyId: currentMeetingId, history}))
    }

    return (
        <div className="dashboard p-3">
            <div className="container-fluid">
                <div className="users">
                    <RouteByDashboard disabled={false} link={'/admin/company/create'}
                                      cardName={t("routes.controlPage.company")}
                                      startIndex={startIndex} lang={t}
                                      lastIndex={lastIndex} payload={payload}/>
                    <div className="minWidth w-100 d-flex justify-content-center align-items-center">
                        <div className="list_wrapper">
                            <Table className="usersList" hover={!loading}>
                                <thead>
                                <tr>
                                    <th style={{width: '15px'}}/>
                                    <th style={{width: '170px'}}
                                        className='text-center'>{t("companiesList.nameCompany")}</th>
                                    <th style={{width: '140px'}} className='text-center'>{t("companiesList.email")}</th>
                                    <th style={{width: '135px'}}
                                        className='text-center'>{t("companiesList.phoneNumber")}</th>
                                    <th style={{width: '123px'}}
                                        className='text-center'>{t("companiesList.webSite")}</th>
                                    <th style={{width: '135px'}} className='text-center'>{t("companiesList.inn")}</th>
                                    <th style={{width: '15px'}}/>
                                    <th style={{width: '15px'}}/>
                                </tr>
                                </thead>
                                <tbody>
                                <FormForCompany getName={SearchCompanySpecFilter}/>
                                {
                                    companies && companies.map((company, i) =>
                                        <TableCompany deleteById={submit} company={company} key={i}
                                                      updateCompany={updateCompany}/>
                                    )
                                }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <PaginationDashboard payload={payload} lastIndex={lastIndex} startIndex={startIndex} count={count}
                                         page={page} handleChange={handleChange} lang={t}/>
                </div>
            </div>
        </div>
    )
}

export default AdminCompany
