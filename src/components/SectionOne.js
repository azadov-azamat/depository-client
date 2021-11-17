import React, {useEffect} from 'react'
import { Container, Row, Col } from 'reactstrap';
import 'aos/dist/aos.css';
import "aos/dist/aos"
import AOS from "aos";
import {useTranslation} from "react-i18next";

export default function SectionOne({lang}){
    useEffect(() => {
        AOS.init({
            duration : 1000
        });
    },[])

        return (
            <div>
                <Container className="section-one pt-5">
                    <Row>
                        <Col md="12">
                            <div data-aos="fade-up" className="title">
                                <h1>{lang("electronVoice")}</h1>
                            </div>

                            <div data-aos="fade-up" className="text">
                                <p>
                                    {lang("text.aboutText")}
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
}
