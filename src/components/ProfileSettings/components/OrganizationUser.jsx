import React from "react";
import {Col, Row} from "reactstrap";
import "../../Dashboard/styles/Profile.scss";

export default function OrganizationUser({lang, userCompanies}) {

    return (
        <Row className='mt-4 mt-md-0'>
            {userCompanies && userCompanies.map((value, i) => (
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
