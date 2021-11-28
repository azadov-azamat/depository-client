import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "reactstrap";
import {useHistory} from "react-router-dom";
import {BsBookmarkPlus} from "react-icons/all";
import {useDispatch, useSelector} from "react-redux";
import NabLists from "./NabLists";
import * as companyAction from "../../redux/actions/CompanyAction";
import {useTranslation} from "react-i18next";
import {
    DEPOSITORY_CURRENT_COMPANY,
    DEPOSITORY_CURRENT_MEETING,
    DEPOSITORY_CURRENT_MEMBER,
    DEPOSITORY_MEMBER_TYPE_USER,
    DEPOSITORY_USER
} from "../../utils/contants";

export default function NabPage() {

    const history = useHistory();
    const dispatch = useDispatch()
    const {t} = useTranslation();
    const reducers = useSelector(state => state)
    const {currentUser} = reducers.auth
    const {companiesByUserId, loading} = reducers.company
    const [booleanMy, setBooleanMy] = useState(false);


    useEffect(() => {
        dispatch(companyAction.getCompanyByUserId({currentUserId: parseInt(localStorage.getItem(DEPOSITORY_USER))}))
        companiesByUserId && companiesByUserId.forEach(element => {
            if (element.chairmanId === currentUser.id || element.secretaryId === currentUser.id) {
                setBooleanMy(true)
            }
        })
        dispatch({
            type: 'REQUEST_GET_MEETING_SUCCESS',
            payload: []
        });
        localStorage.removeItem(DEPOSITORY_CURRENT_MEETING)
        localStorage.removeItem(DEPOSITORY_CURRENT_COMPANY)
        localStorage.removeItem(DEPOSITORY_CURRENT_MEMBER)
        localStorage.removeItem(DEPOSITORY_MEMBER_TYPE_USER)

    }, [booleanMy])

    return (
        <div className="allCss">
            <Container>
                <Row>
                    <Col md={6}>
                        <div className="nab d-flex justify-content-between align-items-center"
                             style={{marginTop: '5em'}}>
                            <div
                                className="nav-link   nabLists d-flex justify-content-center align-items-center">
                                <span>Акционерное общества</span>
                            </div>
                            {booleanMy ?
                                <div className="d-md-none">
                                    <div
                                        className="nabAdd d-flex justify-content-center align-items-center align-content-center mt-2">
                                        <div
                                            className="btnAdd border d-flex justify-content-center text-center">
                                            <button className="btn"
                                                    onClick={() => history.push("/admin/addOrEditMeeting/create")}>
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
                                                onClick={() => history.push("/supervisory/addOrEditMeeting")}>
                                            <BsBookmarkPlus style={{fontSize: '25px'}}/>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </Col> : ""
                    }
                </Row>
                {loading ?
                    "WAITING" :
                    companiesByUserId && companiesByUserId.length === 0 ?
                        <div className='d-flex flex-column justify-content-center align-items-center' style={{
                            width: '100%',
                            height: '70vh'
                        }}>
                            <h2 className="mt-3">{t('electronVoice')}</h2>
                            <h3>ma`lumotlar yo`q</h3>
                        </div>
                        :
                        companiesByUserId && companiesByUserId.map((value, index) =>
                            <NabLists company={value} key={index}/>
                        )
                }
            </Container>
        </div>
    )
}
