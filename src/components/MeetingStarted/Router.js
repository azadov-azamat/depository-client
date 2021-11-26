import React from 'react';
import {Col, Row} from "reactstrap";
import {Link} from "react-router-dom";
import {AiOutlineLeft, AiOutlineRight, FaArrowLeft} from "react-icons/all";
import {
    ACTIVE,
    CHAIRMAN,
    DEPOSITORY_ZOOM_MEETING_LINK,
    DEPOSITORY_ZOOM_MEETING_PASSWORD,
    EXTRAORDINARY,
    ORDINARY,
    PENDING,
    SECRETARY
} from "../../utils/contants";
import {RiTimeFill} from "react-icons/ri";

export default function Router({currentCompany, currentMeeting, userMemberType, zoomEnum, password_zoom}) {

    const style = {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whitespace: 'nowrap',
        width: '25%',
        height: '35px'
    }

    const styleMobile = {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whitespace: 'nowrap',
        height: '25px'
    }

    const styleCompany = {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whitespace: 'nowrap',
        width: '15%',
        height: '35px',
        color: "rgba(155,153,150,0.98)"
    }

    return (
        <>
            <Row className="d-none d-md-grid">
                <Col md={12}>
                    <div className="companyLogoMyMeeting">
                        <div style={{marginTop: '12vh'}}
                             className="organizationImg d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <Link to={'/issuerLegal/meetings/company_id/' + currentCompany?.id}
                                      className="text-dark"><FaArrowLeft/></Link>

                                <Link to={'/'} className="nav-link" style={{color: "rgba(155,153,150,0.98)"}}>Электронное
                                    голосование</Link>

                                <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>

                                <Link to={'/issuerLegal'} className="nav-link"
                                      style={{color: "rgba(155,153,150,0.98)"}}>Акционерное общества</Link>

                                <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>

                                <Link to={'/issuerLegal/meetings/company_id/' + currentCompany?.id} className="nav-link"
                                      style={styleCompany}>{currentCompany?.name}</Link>

                                <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>

                                <Link style={style} className="nav-link h5 disabled text-dark">{
                                    currentMeeting?.typeEnum === ORDINARY ? 'Внеплановое заседание наблюдательного совета' : '' ||
                                    currentMeeting?.typeEnum === EXTRAORDINARY ? 'Плановое заседание наблюдательного совета' : ''
                                }</Link>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="d-md-none">
                <Col md={12}>
                    <div style={{marginTop: '4em'}} className="d-flex justify-content-between align-items-center">
                        <Link to={'/issuerLegal/meetings/company_id/' + currentCompany?.id}
                              className="nav-link text-dark"><AiOutlineLeft className="h3"/></Link>
                        <div style={styleMobile} className='h5 float-end text-center'>{
                            currentMeeting?.typeEnum === ORDINARY ? 'Внеплановое заседание наблюдательного совета' : '' ||
                            currentMeeting?.typeEnum === EXTRAORDINARY ? 'Плановое заседание наблюдательного совета' : ''
                        }</div>
                    </div>
                </Col>
            </Row>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center my-3">
                <div className='d-none d-md-block'>
                    <b>{
                        currentMeeting?.typeEnum === ORDINARY ? 'Внеплановое заседание наблюдательного совета' : '' ||
                        currentMeeting?.typeEnum === EXTRAORDINARY ? 'Плановое заседание наблюдательного совета' : ''
                    }</b>
                </div>
                <div>
                    {
                        currentMeeting?.status === PENDING ?
                            <>
                                Начата регистрация на засидания <span className="text-success text-2xl "><RiTimeFill
                                fontSize={23}/></span>
                            </> : "" ||
                            currentMeeting?.status === ACTIVE ?
                                userMemberType === CHAIRMAN || userMemberType === SECRETARY ?
                                    localStorage.getItem(DEPOSITORY_ZOOM_MEETING_PASSWORD) ?
                                        <div className="d-flex justify-content-end align-items-center"
                                             style={{width: "60vh"}}>
                                            <span>Zoom password: <code>{localStorage.getItem(DEPOSITORY_ZOOM_MEETING_PASSWORD)}</code></span>
                                        </div>
                                        :
                                        <a href="#" onClick={() => zoomEnum(ACTIVE)}>Создать конференцию</a>
                                    :
                                    password_zoom ?
                                        <div className="d-flex justify-content-between" style={{width: "57vh"}}>
                                            <span>Zoom password: <code>{localStorage.getItem(DEPOSITORY_ZOOM_MEETING_PASSWORD)}</code></span>
                                        </div>
                                        :
                                        <>
                                            Начата регистрация на засидания <span
                                            className="text-success text-2xl "><RiTimeFill
                                            fontSize={23}/></span>
                                        </>
                                :
                                <>
                                    Начата регистрация на засидания <span className="text-success text-2xl "><RiTimeFill
                                    fontSize={23}/></span>
                                </>
                    }
                </div>
            </div>
        </>
    );
}
