import React, {useEffect} from "react";
import {Link, useHistory} from "react-router-dom";
import AOS from "aos";
import {Button} from "reactstrap";
import {BASE_URL} from "../../../utils/config";
import {api} from "../../../api/api";

export default function NabLists({company}) {

    const history = useHistory();

    useEffect(() => {
        AOS.init({
            duration: 1000
        });
    }, [])

    const style = {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whitespace: 'nowrap',
        width: '13em',
        height: '32px'
    };

    return (
        <div className={"p-3 rounded my-3 NabList"}>
            <div className="row">
                <div className="col-12 col-md-2 justify-content-center align-items-center d-flex">
                    <div className="row justify-content-center align-items-center w-100">
                        <Link to={'/issuerLegal/meetings?company_id=' + company?.id + "&type=active"}
                              className="col-3 font-bold col-md-12 d-flex text-dark nav-link align-items-center justify-content-center">
                            {company && company.imageUrl === "yes" ?
                                <>
                                    <img className="d-flex d-md-none"
                                         src={BASE_URL + api.getLogoByCompanyId + company.id} alt="bu company logo"
                                         style={{
                                             width: '100%',
                                             height: "65px",
                                         }}/>
                                    <img className="d-md-block d-none"
                                         src={BASE_URL + api.getLogoByCompanyId + company.id} alt="bu company logo"
                                         style={{
                                             width: '86%',
                                             height: "89px",
                                         }}/>
                                </> :
                                <b>IMG</b>
                            }
                        </Link>
                        <div className="col-9 d-block d-md-none">
                            <h2>
                                {company.name}
                            </h2>
                            <p><b>
                                {company.description}
                            </b>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-12 d-md-none d-flex justify-content-between">
                    <p style={style}>
                        <a style={style} href={company.webPage} target='_blank'
                           className='text-dark nav-link'><b>{company.webPage}</b></a>
                    </p>
                    <Button
                        onClick={() => history.push('/issuerLegal/meetings?company_id=' + company?.id + "&type=active")}
                        className="create">
                        Всего заседаний - {company.meetingCount}
                    </Button>
                </div>
                <div className="col-md-6 d-none d-md-block"
                     onClick={() => history.push('/issuerLegal/meetings?company_id=' + company?.id + "&type=active")}>
                    <h3>{company.name}</h3>
                    <p>{company.description}</p>
                    <a href={company.webPage} target='_blank'
                       className='text-dark'><b>{company.webPage}</b></a>
                </div>
                <div className="col-md-4 d-flex  justify-content-center align-items-center">
                    <Link to={'/issuerLegal/meetings?company_id=' + company?.id + "&type=active"}
                          className="d-lg-inline-flex d-none align-items-center text-dark nav-link ">
                        <div
                            className="d-flex justify-content-center align-items-center m-2 border border-2"
                            style={{
                                borderRadius: "50%",
                                width: "4em",
                                height: "4em"
                            }}>
                            {company.meetingCount}
                        </div>
                        <span>Всего <br/> заседаний</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
