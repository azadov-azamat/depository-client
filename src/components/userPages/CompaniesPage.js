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
import Text from "antd/es/typography/Text";
import Logo from '../../images/companyLogo.png';

export default function CompaniesPage() {

    const history = useHistory();
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const reducers = useSelector(state => state)
    const {currentUser} = reducers.auth
    const {companiesByUserId, loading} = reducers.company
    const [booleanMy, setBooleanMy] = useState(false);

    const userId = currentUser?.id;

    useEffect(() => {
        setBooleanMy(
            companiesByUserId?.some(element => element.chairmanId === userId || element.secretaryId === userId));
    }, [booleanMy, companiesByUserId])

    useEffect(() => {

        if (userId) {
            dispatch(companyAction.getCompanyByUserId({currentUserId: userId}))
        }

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
                                    <span>{t("createButton")}</span>
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
                    <div style={{width: "100%", height: '60vh'}}
                         className="d-flex justify-content-center align-items-center">
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
                        companiesByUserId && companiesByUserId.map((value, index) =>
                            <Text key={index}>
                                <NabLists company={value} lang={t} logo={Logo}/>
                            </Text>
                        )
                }
            </Container>
        </div>
    )
}
