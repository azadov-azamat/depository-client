import React, {useEffect} from 'react'
import {Col, Container, Row} from 'reactstrap';
import AOS from "aos";
import developmentCompany from '../images/developmentNAPA.png'

export default function Footer({lang}) {
    useEffect(() => {
        AOS.init({
            duration: 1000
        });
    }, [])

    return (
        <div className="footer">
            <Container>
                <Row>
                    <Col md="12" className="d-flex align-items-center">
                        <div className="text">
                            <div>
                                {lang("text.serviceMainText15")}
                            </div>
                        </div>
                        <div className="logo-footer">
                            <a href="https://napaautomotive.uz/" target="_blank">
                                <img className="img-fluid" src={developmentCompany} alt=""/>
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
