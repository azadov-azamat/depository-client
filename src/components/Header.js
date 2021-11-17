import React, {Component, useEffect} from 'react'
import {Container, Row, Col} from 'reactstrap';
import 'aos/dist/aos.css';
import "aos/dist/aos";
import AOS from "aos";
import {useTranslation} from "react-i18next";


export default function Header({lang}) {
    useEffect(() => {
        AOS.init({
            duration: 1000
        });
    }, [])

    return (
        <div>
            <header>
                <div className="bghead">
                    <Container>
                        <Row>
                            <Col data-aos="fade-up" md="12" className="d-flex align-items-center mt-5">
                                <div className="head-title">
                                    <h1>{lang("electronVoice")}</h1>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <div data-aos="fade-up" className="text-head">
                                    {lang("text.headerText")}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </header>
        </div>
    )
}
