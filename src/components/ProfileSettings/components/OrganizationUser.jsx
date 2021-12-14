import React, {useEffect, useState} from "react";
import {Col, Row, Table} from "reactstrap";
import "../../Dashboard/styles/Profile.scss";
import * as companyAction from "../../../redux/actions/CompanyAction";
import {getUserById} from "../../../redux/actions/UsersAction";
import {Link, useHistory, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {FaCheck, FaPen, FaTimes, FaTrash} from "react-icons/fa";
import {BASE_URL} from "../../../utils/config";
import {api} from "../../../api/api";
import Text from "antd/es/typography/Text";
import {AiOutlineDoubleRight} from "react-icons/all";
import PaginationDashboard from "../../Dashboard/PaginationDashboard";
import usePagination from "../../Dashboard/Pagination";
import {Pagination} from "@material-ui/lab";

export default function OrganizationUser({lang, ID}) {

    const {id} = useParams();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const reducers = useSelector(state => state)
    const {loading} = reducers.users
    const {companiesByUserId} = reducers.company

    const [page, setPage] = useState(1);
    const size = 8;

    // const payload = companiesByUserId.length
    //
    // const count = Math.ceil(payload / size);
    // const _DATA = usePagination(companiesByUserId && companiesByUserId, size);
    //
    // const startIndex = (page - 1) * size;
    // const lastIndex = startIndex + (payload);

    useEffect(() => {
        dispatch(companyAction.getCompanyByUserId({currentUserId: ID}))
        dispatch(getUserById({ID: ID}))
    }, [ID])

    // const handleChange = (e, p) => {
    //     setPage(p);
    //     _DATA.jump(p);
    // };

    const styleLink = {
        cursor: 'pointer'
    }

    return (
        <div className="container-fluid">
            <Row className='mt-4 mt-md-0 px-3'>
                <Table className="usersList" hover>
                    <thead>
                    <tr>
                        <th style={{width: '15px'}} className="text-center"/>
                        <th style={{width: '170px'}}
                            className='text-center '>{t("meetingsList.nameCompany")}</th>
                        <th style={{width: '140px'}}
                            className='text-center '>{t("companiesList.webSite")}</th>
                        <th style={{width: '135px'}}
                            className='text-center '>Коментарии
                        </th>
                        <th style={{width: '123px'}}
                            className='text-center '>{t("clientPage.countMeeting")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {companiesByUserId && companiesByUserId.map((company, i) => (
                        <tr>
                            <td scope="row" className=' text-center'>
                                <b style={styleLink}>IMG</b>
                            </td>
                            <td className="text-center">
                                {company.name}
                            </td>
                            <td className="text-center">
                                {company.webPage}
                            </td>
                            <td className="text-center">
                                {company.description}
                            </td>
                            <td className="text-center">
                                <b style={styleLink}
                                   className="d-flex align-items-center justify-content-center">{company.meetingCount}
                                    <AiOutlineDoubleRight onClick={()=> history.push("/supervisory/profile/meetings?company_id=" + company.id)}/>
                                </b>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                {/*<div className="d-none d-md-flex justify-content-between align-items-center position-fixed"*/}
                {/*     style={{width: '80%', bottom: '4px'}}*/}
                {/*>*/}
                {/*    <Pagination*/}
                {/*        count={count}*/}
                {/*        size="large"*/}
                {/*        page={page}*/}
                {/*        color="primary"*/}
                {/*        variant="outlined"*/}
                {/*        shape="rounded"*/}
                {/*        className={payload === 0 ? 'd-none' : ''}*/}
                {/*        onChange={handleChange}*/}
                {/*        showFirstButton showLastButton*/}
                {/*    />*/}
                {/*    <p className="d-none d-lg-flex align-items-center justify-content-end users_count text-black">*/}
                {/*        {payload === 0 ?*/}
                {/*            lang("companiesList.accountCount") + ' - 0' :*/}
                {/*            lang("companiesList.accountCount") + " " + (startIndex + 1) + ' - ' + lastIndex + " " + lang("companiesList.from") + " " + (payload)*/}
                {/*        }*/}
                {/*    </p>*/}
                {/*</div>*/}
            </Row>
        </div>
    )
}
