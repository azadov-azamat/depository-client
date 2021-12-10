import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "reactstrap";
import {useHistory} from "react-router-dom";
import {BsBookmarkPlus} from "react-icons/all";
import {useDispatch, useSelector} from "react-redux";
import NabLists from "./component/NabLists";
import * as companyAction from "../../redux/actions/CompanyAction";
import {useTranslation} from "react-i18next";
import {DEPOSITORY_MEMBER_TYPE_USER} from "../../utils/contants";
import Loader from "react-loader-spinner";

export default function CompaniesPage() {

    const history = useHistory();
    const dispatch = useDispatch()
    const {t} = useTranslation();
    const reducers = useSelector(state => state)
    const {currentUser} = reducers.auth
    const {companiesByUserId, loading} = reducers.company
    const [booleanMy, setBooleanMy] = useState(false);

    useEffect(() => {
        setBooleanMy(companiesByUserId && companiesByUserId.some(element => element.chairmanId === currentUser.id || element.secretaryId === currentUser.id));
    }, [booleanMy, companiesByUserId])

    useEffect(() => {
        dispatch(companyAction.getCompanyByUserId({currentUserId: (currentUser && currentUser.id)}))
        dispatch({
            type: 'REQUEST_GET_MEETING_SUCCESS',
            payload: []
        });
        dispatch({
            type: 'REQUEST_GET_MEETING_BY_COMPANY_ID',
            payload: []
        });
        localStorage.removeItem(DEPOSITORY_MEMBER_TYPE_USER)

    }, [currentUser])

    return (
        <div className="allCss">
            <Container>
                <Row>
                    <Col md={6}>
                        <div className="nab d-flex justify-content-between align-items-center"
                             style={{marginTop: '5em'}}>
                            <div
                                className="nav-link   nabLists d-flex justify-content-center align-items-center">
                                <span>{t("routes.controlPage.clientPage")}</span>
                            </div>
                            {booleanMy ?
                                <div className="d-md-none">
                                    <div
                                        className="nabAdd d-flex justify-content-center align-items-center align-content-center mt-2">
                                        <div
                                            className="btnAdd border d-flex justify-content-center text-center">
                                            <button className="btn"
                                                    onClick={() => history.push("/supervisory/addOrEditMeeting/meeting?type=create")}>
                                                <BsBookmarkPlus style={{fontSize: '25px'}}/>
                                            </button>
                                        </div>
                                    </div>
                                </div> : ""}
                        </div>
                    </Col>
                    {booleanMy ?
                        <Col md={6}>
                            <div className="nab d-none d-md-grid justify-content-end" style={{marginTop: '7em'}}>
                                <div
                                    className="nabAdd d-flex justify-content-center align-items-center align-content-center ">
                                    <span>Создать заседание</span>
                                    <div className="btnAdd border mx-3 d-flex justify-content-center text-center">
                                        <button className="btn"
                                                onClick={() => history.push("/supervisory/addOrEditMeeting/meeting?type=create")}>
                                            <BsBookmarkPlus style={{fontSize: '25px'}}/>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </Col> : ""
                    }
                </Row>
                {loading ?
                    <div style={{width: "100%", height: '60vh'}} className="d-flex justify-content-center align-items-center">
                        <Loader
                            type="ThreeDots"
                            color="#132E85"
                            height={100}
                            width={100}
                            timeout={13000}
                        />
                    </div>
                    :
                    companiesByUserId && companiesByUserId.length === 0 ?
                        <div className='d-flex flex-column justify-content-center align-items-center' style={{
                            width: '100%',
                            height: '60vh'
                        }}>
                            <h2 className="mt-3">{t('electronVoice')}</h2>
                            <h3>{t("meetingCreated.emptyList")}</h3>
                        </div>
                        :
                        companiesByUserId && companiesByUserId.map(value =>
                            <NabLists company={value} lang={t} key={value.id}/>
                        )
                }
            </Container>
        </div>
    )
}
