import React, {useEffect} from "react";
import {Row, Table} from "reactstrap";
import "../../Dashboard/styles/Profile.scss";
import * as companyAction from "../../../redux/actions/CompanyAction";
import {getUserById} from "../../../redux/actions/UsersAction";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AiOutlineDoubleRight} from "react-icons/all";

export default function OrganizationUser({lang, ID}) {

    const dispatch = useDispatch();
    const history = useHistory();
    const reducers = useSelector(state => state)
    const {companiesByUserId} = reducers.company

    useEffect(() => {
        dispatch(companyAction.getCompanyByUserId({currentUserId: ID}))
        dispatch(getUserById({ID: ID}))
    }, [ID])

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
                            className='text-center '>{lang("meetingsList.nameCompany")}</th>
                        <th style={{width: '140px'}}
                            className='text-center '>{lang("companiesList.webSite")}</th>
                        <th style={{width: '135px'}}
                            className='text-center '>{lang("pages.company.comment")}
                        </th>
                        <th style={{width: '123px'}}
                            className='text-center '>{lang("clientPage.countMeeting")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {companiesByUserId?.map((company, i) => (
                        <tr key={i}>
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
                                    <AiOutlineDoubleRight
                                        onClick={() => history.push("/supervisory/profile/meetings?company_id=" + company.id)}/>
                                </b>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Row>
        </div>
    )
}
