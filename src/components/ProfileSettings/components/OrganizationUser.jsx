import React, {useEffect} from "react";
import {Col, Row} from "reactstrap";
import "../../Dashboard/styles/Profile.scss";
import * as companyAction from "../../../redux/actions/CompanyAction";
import {getUserById} from "../../../redux/actions/UsersAction";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";

export default function OrganizationUser({lang, ID}) {

    const {id} = useParams();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const reducers = useSelector(state => state)
    const {currentUser, loading} = reducers.users
    const {companiesByUserId} = reducers.company

    useEffect(() => {
        dispatch(companyAction.getCompanyByUserId({currentUserId: ID}))
        dispatch(getUserById({ID: ID}))
    }, [id])

    return (
        <Row className='mt-4 mt-md-0'>
            {companiesByUserId && companiesByUserId.map((value, i) => (
                value.id % 2 !== 0 ?
                    <Col md={6}>
                        <div key={i} className="organization d-flex align-items-center mb-4">
                            <div className="organizationImg d-flex justify-content-center align-items-center">
                                    <span>
                                           {value.imageUrl ?
                                               <img src={value.imageUrl} alt=""
                                                    style={{
                                                        width: '4em',
                                                        height: '4em',
                                                        borderRadius: '50%'
                                                    }}/> :
                                               "IMG"}
                                    </span>
                            </div>
                            <div className="d-flex flex-column">
                                <h5>
                                    {value.name}
                                </h5>
                                <p>
                                    {value.description}
                                </p>
                            </div>
                        </div>
                    </Col>
                    :
                    <Col md={6}>
                        <div className="organization d-flex align-items-center mb-4">
                            <div className="organizationImg d-flex justify-content-center align-items-center">
                                    <span>
                                           {value.imageUrl ?
                                               <img src={value.imageUrl} alt=""
                                                    style={{
                                                        width: '4em',
                                                        height: '4em',
                                                        borderRadius: '50%'
                                                    }}/> :
                                               "IMG"}
                                    </span>
                            </div>
                            <div className="d-flex flex-column">
                                <h5>
                                    {value.name}
                                </h5>
                                <p>
                                    {value.description}
                                </p>
                            </div>
                        </div>
                    </Col>
            ))}
        </Row>
    )
}
