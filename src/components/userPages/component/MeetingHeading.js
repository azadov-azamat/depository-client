import React, {useEffect} from 'react';
import {Col, Row} from "reactstrap";
import {Link, useHistory, useLocation} from "react-router-dom";
import {AiOutlineLeft, AiOutlineRight, FaArrowLeft} from "react-icons/all";
import {NavbarMeeting} from "./NavbarMeeting";
import {useDispatch, useSelector} from "react-redux";
import {BASE_URL} from "../../../utils/config";
import {api} from "../../../api/api";
import * as adminCompanyAction from '../../../redux/actions/CompanyAction';

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function MeetingHeading({company}) {

    const history = useHistory();
    const dispatch = useDispatch()
    const reducers = useSelector(state => state)
    const {currentCompany} = reducers.company;

    let query = useQuery();
    const companyId = query.get("company_id");

    useEffect(() => {
        dispatch(adminCompanyAction.getCompanyByIdAction({companyId: parseInt(companyId), history}))
    }, [companyId])

    const style = {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whitespace: 'nowrap',
        width: '32vh',
        height: '30px'
    }

    return (
        <div className="container">
            <Row className="d-none d-md-grid">
                <Col md={12}>
                    <div className="companyLogoMyMeeting">
                        <div style={{marginTop: '7em'}}
                             className="organizationImg d-flex justify-content-between align-items-center">
                            <div className="d-flex flex-column">
                                <div className="d-flex">
                                    <Link to="/issuerLegal/companies"
                                          className="nav-link text-dark"><FaArrowLeft/></Link>
                                    <Link to={'/'} className="nav-link" style={{color: "rgba(155,153,150,0.98)"}}>Электронное
                                        голосование</Link>
                                    <Link className="nav-link disabled"><AiOutlineRight/></Link>
                                    <Link to={'/issuerLegal/companies'} className="nav-link"
                                          style={{color: "rgba(155,153,150,0.98)"}}>Акционерное общества</Link>
                                    <Link className="nav-link disabled"><AiOutlineRight/></Link>
                                    <Link className="nav-link h5 disabled text-dark">{company?.name}</Link>
                                </div>
                                <div className="d-flex justify-content-start">
                                    <NavbarMeeting companyId={company}/>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-center">
                                {currentCompany && currentCompany.imageUrl === "yes" ?
                                    <span>
                                        <img src={BASE_URL + api.getLogoByCompanyId + currentCompany.id} alt="bu rasm"
                                             style={{borderRadius: "50%", width: "4em", height: "4em"}}/>
                                    </span>
                                    :
                                    <div
                                        className="d-flex justify-content-center align-items-center m-2 border border-2"
                                        style={{
                                            borderRadius: "50%",
                                            width: "4em",
                                            height: "4em"
                                        }}>
                                        IMG
                                    </div>
                                }
                                <span className='mx-3'>{company?.name}</span>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="d-md-none">
                <Col md={12}>
                    <div style={{marginTop: '5em'}} className="d-flex justify-content-between align-items-center">
                        <Link to={'/issuerLegal/companies'} className="nav-link text-dark"><AiOutlineLeft
                            className="h3"/></Link>
                        <div className="d-flex align-items-center float-end">
                            <span style={style} className='h4 d-flex justify-content-end'>{company?.name} - </span>
                            {currentCompany && currentCompany.imageUrl === "yes" ?
                                <span>
                                        <img src={BASE_URL + api.getLogoByCompanyId + currentCompany.id} alt="bu rasm"
                                             style={{borderRadius: "50%", width: "8vh", height: "8vh"}}/>
                                    </span>
                                :
                                <div
                                    className="d-flex justify-content-center align-items-center m-2 border border-2"
                                    style={{
                                        borderRadius: "50%",
                                        width: "8vh",
                                        height: "8vh"
                                    }}>
                                    IMG
                                </div>
                            }
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="d-md-none">
                <Col md={12}>
                    <div className="d-flex flex-column align-items-center">
                        <NavbarMeeting companyId={company}/>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
