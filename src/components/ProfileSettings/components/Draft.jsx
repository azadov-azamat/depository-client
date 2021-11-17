import React from "react";
import {Col, Container, Row} from "reactstrap";
import ProfileRoute from "../../../routes/ProfileRoute";
import "../../Dashboard/styles/Profile.scss";
import {useHistory} from "react-router-dom";

export default function Draft({lang}) {
    const history = useHistory();

    return (
        <>
            <Container>
                <ProfileRoute lang={lang} booleanComp={true} pagePath={'draft'}/>
                <Row>
                    <Col md={12}>
                        <div className='d-flex flex-column justify-content-center align-items-center' style={{height: '55vh'}}>
                            <h2 className="mt-3">{lang('electronVoice')}</h2>
                            <h3>ma`lumotlar yo`q</h3>
                        </div>
                    </Col>
                </Row>
            </Container>

        </>
    )
}
