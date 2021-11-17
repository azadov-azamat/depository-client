import React, {useEffect} from 'react'
import { Container, Row, Col } from 'reactstrap';
import 'aos/dist/aos.css';
import "aos/dist/aos"
import AOS from "aos";
import {useTranslation} from "react-i18next";

export default function SectionTwo({lang}){
    useEffect(() => {
        AOS.init({
            duration : 1000
        });
    },[])

        return (
            <div>
                <Container className="section-2">
                    <Row>
                        <Col md="12">
                            <div  data-aos="fade-up" className="title">
                                <h1>{lang("serviceMain")}</h1>
                            </div>
                        </Col>
                    </Row>
                    <Row className="cards">
                        <div  data-aos="fade-up" className="card1">
                            <h6>
                                {lang("text.serviceMainText1")}
                            </h6>
                        </div>
                        <div data-aos="fade-up" className="card2">
                            <h6>
                                {lang("text.serviceMainText2")}
                            </h6>
                        </div>
                        <div data-aos="fade-up" className="card3">
                            <h6>
                                {lang("text.serviceMainText3")}
                            </h6>
                        </div>
                        <div data-aos="fade-up" className="card4">
                                <h6>
                                    {lang("text.serviceMainText4")}
                                </h6>
                        </div>
                        <div data-aos="fade-up" className="card5">
                            <h6>
                                {lang("text.serviceMainText5")}
                            </h6>
                        </div>
                        <div data-aos="fade-up" className="card6">
                                <h6>
                                    {lang("text.serviceMainText6")}
                                </h6>
                        </div>
                    </Row>
                </Container>
            </div>
        )
    }
