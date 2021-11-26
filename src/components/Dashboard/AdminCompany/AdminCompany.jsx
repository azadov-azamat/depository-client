import React, {useEffect, useState} from 'react'
import '../styles/users.css'
import {useDispatch, useSelector} from 'react-redux'
import {Table} from "reactstrap";
import Form from "../Form";
import * as adminCompanyAction from "../../../redux/actions/CompanyAction";
import usePagination from "../Pagination";
import {Pagination} from "@material-ui/lab";
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
    const {loading} = reducers.company
    const companies = reducers.company.companies;
    const {payload} = reducers.auth.totalCount

    const [name, setName] = useState('');
    const [page, setPage] = useState(1);

    const size = 6;

    const count = Math.ceil(payload && payload[0] / 6);
    const _DATA = usePagination(companies && companies, size);

    const startIndex = (page - 1) * 6;
    const lastIndex = startIndex + (payload && payload[1]);

    const handleChange = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    useEffect(() => {
        if (!name) {
            dispatch(adminCompanyAction.getCompanyList({page, size}));
        }
        dispatch({
            type: 'updateState',
            payload: {
                currentCompany: '',
                users: '',
                loading: false,
                createCompanyLoading: false
            }
        });
    }, [page, name])

    const getName = (value, index) => {
        setName(value)
        const NAME = 'NAME'
        const EMAIL = 'EMAIL'
        const INN = 'INN'
        const PHONE_NUMBER = 'PHONE_NUMBER'
        const WEB_PAGE = 'WEB_PAGE'
        let field = ''

        if (index === 0) {
            field = NAME
        } else if (index === 1) {
            field = EMAIL
        } else if (index === 2) {
            field = PHONE_NUMBER
        } else if (index === 3) {
            field = WEB_PAGE
        } else if (index === 4) {
            field = INN
        }
        if (value.length >= 3) {
            dispatch(adminCompanyAction.getCompanyFilter({value, field}));
        }
    }

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
                    <RouteByDashboard disabled={false} link={'/admin/company/create'} cardName={t("routes.controlPage.company")}
                                      startIndex={startIndex} lang={t}
                                      lastIndex={lastIndex} payload={payload}/>
                    <div className="minWidth w-100 d-flex justify-content-center align-items-center">
                        <div className="list_wrapper">
                            <Table className="usersList" hover={!loading}>
                                <thead>
                                <tr>
                                    <th style={{width: '15px'}}/>
                                    <th style={{width: '170px'}} className='text-center'>{t("companiesList.nameCompany")}</th>
                                    <th style={{width: '140px'}} className='text-center'>{t("companiesList.email")}</th>
                                    <th style={{width: '135px'}} className='text-center'>{t("companiesList.phoneNumber")}</th>
                                    <th style={{width: '123px'}} className='text-center'>{t("companiesList.webSite")}</th>
                                    <th style={{width: '135px'}} className='text-center'>{t("companiesList.inn")}</th>
                                    <th style={{width: '15px'}}/>
                                    <th style={{width: '15px'}}/>
                                </tr>
                                </thead>
                                <tbody>
                                <Form getName={getName}/>
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
