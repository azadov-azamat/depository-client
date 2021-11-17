import React from "react";
import {Col, Container, Row} from "reactstrap";
import Image from '../images/img/lgo.png'
import {useTranslation} from "react-i18next";
export default function NotFound(){
    const {t} = useTranslation();
    return(
        <Container>
            <Row>
                <Col md={12}>
                    <div className="d-grid justify-content-center align-items-center text-center mb-5">
                        <img src={Image} alt="" style={{width:'30em', marginTop: '8em'}}/>
                        <h2 className="mt-3">{t('electronVoice')}</h2>
                        <h3>404 Not Found Page</h3>
                    </div>
                </Col>
            </Row>
        </Container>

    )
}
