import React from 'react';
import ModalImg3 from "./ModalImg3";
import ModalImg2 from "./ModalImg2";
import ModalImg1 from "./ModalImg1";
import {useTranslation} from "react-i18next";
import {Col, Container, Row} from "reactstrap";

export default function FooterImg(){
    const {t} = useTranslation();
        return (
           <Container>
               <div className="FooterImg">
                   <h1 data-aos="zoom-in" className="text-center">{t("InstructionalVideo")}</h1>
                   <Row className="d-flex justify-content-between text-center bg-dark align-items-center">
                       <Col md={4} className="pt-4 pb-4">
                           <ModalImg1/>
                       </Col>
                       <Col md={4} className="pb-4 pb-md-0">
                           <ModalImg2/>
                       </Col>
                       <Col md={4} className="pb-4 pb-md-0">
                           <ModalImg3/>
                       </Col>
                   </Row>
               </div>
           </Container>
        );
    }
