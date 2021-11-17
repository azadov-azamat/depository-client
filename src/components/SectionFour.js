import React, {Component, useEffect} from 'react'
import { Container, Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import AOS from "aos";
import {useTranslation} from "react-i18next";


export default function SectionFour({lang}){
    useEffect(() => {
        AOS.init({
            duration : 1000
        });
    },[])

    return (
            <div>
                <Container className="section-3 mt-3">
                    <Row>
                        <Col md="12" className="d-flex justify-content-center ">
                            <div  data-aos="fade-up" className="title mt-5 mb-4">
                                {lang("chairMan")}
                            </div>
                        </Col>
                    </Row>
                    <Row  data-aos="fade-up">
                        <Col md="12" className="d-flex">
                            <Card>
                                <CardHeader className="d-flex">
                                    <img className="img-fluid" src="/check-mark.png" alt=""/>
                                    <div>{lang("levelCorporate")}</div>
                                </CardHeader>
                                <CardBody>
                                    <div className="text">
                                        {lang("text.serviceMainText10")}
                                    </div>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader className="d-flex">
                                    <img className="img-fluid" src="/check-mark.png" alt=""/>
                                    <div>{lang("ownerEngagement")}</div>
                                </CardHeader>
                                <CardBody>
                                    <div className="text">
                                        {lang("text.serviceMainText11")}
                                    ценных бумаг в процесс голосования и, соответственно, повышение их активности в управлении обществом.
                                    </div>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader className="d-flex">
                                    <img className="img-fluid" src="/check-mark.png" alt=""/>
                                    <div>{lang("realTime")}</div>
                                </CardHeader>
                                <CardBody>
                                    <div className="text">
                                        {lang("text.serviceMainText12")}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row  data-aos="fade-up" className="mt-5 mb-4">
                    <Card>
                                <CardHeader className="d-flex">
                                    <img className="img-fluid" src="/check-mark.png" alt=""/>
                                    <div>{lang("text.serviceMainText13")}</div>
                                </CardHeader>

                            </Card>
                            <Card>
                                <CardHeader className="d-flex">
                                    <img className="img-fluid" src="/check-mark.png" alt=""/>
                                    <div>{lang("text.serviceMainText14")}</div>
                                </CardHeader>
                            </Card>
                    </Row>
                    <Row  data-aos="fade-up">
                        <Col md="12" className="d-flex justify-content-center mb-4">
                            <div className="document">
                                <a href="/file/document.pdf">{lang("documentation")}</a>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
