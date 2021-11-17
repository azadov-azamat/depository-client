import React, {Component, useEffect} from 'react'
import { Container, Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import AOS from "aos";
import {useTranslation} from "react-i18next";


export default function SectionThree({lang}){
    useEffect(() => {
        AOS.init({
            duration : 1000
        });
    },[])

    return (
            <div>
                <Container className="section-3 mt-3">
                    <Row  data-aos="fade-up">
                        <Col md="12" className="d-flex justify-content-center ">
                            <div className="title">
                                {lang("shareHolders")}
                            </div>
                        </Col>
                    </Row>
                    <Row  data-aos="fade-up">
                        <Col md="12" className="d-flex">
                            <Card>
                                <CardHeader className="d-flex">
                                    <img className="img-fluid" src="/check-mark.png" alt=""/>
                                    <h4>{lang("comfortTable")}</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="text">
                                        {lang("text.serviceMainText7")}
                                    </div>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader className="d-flex">
                                    <img className="img-fluid" src="/check-mark.png" alt=""/>
                                    <h4>{lang("fast")}</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="text">
                                        {lang("text.serviceMainText8")}
                                    </div>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader className="d-flex">
                                    <img className="img-fluid" src="/check-mark.png" alt=""/>
                                    <h4>{lang("security")}</h4>
                                </CardHeader>
                                <CardBody>
                                    <div className="text">
                                        {lang("text.serviceMainText9")}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row  data-aos="fade-up">
                        <Col md="12" className="d-flex justify-content-center">
                            <div className="document">
                                <a href="/file/document.pdf">{lang("documentation")}</a>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
