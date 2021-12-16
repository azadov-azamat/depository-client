import React from 'react'
import {Link, useHistory} from "react-router-dom";
import {AiOutlineRight, BsBookmarkPlus, FaArrowLeft} from "react-icons/all";


export default function RouteByDashboard({
                                             startIndex,
                                             lastIndex,
                                             payload,
                                             cardName,
                                             link,
                                             disabled,
                                             link2,
                                             statusName,
                                             lang
                                         }) {

    const history = useHistory();

    const createUser = () => {
        history.push(link)
    }

    return (
        <>
            <div className="py-1 d-sm-flex justify-content-between align-items-center" style={{marginTop: '49px'}}>
                <div className="d-lg-inline-flex align-items-center d-none">
                    <Link to="/admin" className="nav-link text-dark"><FaArrowLeft/></Link>
                    <Link to={'/'} className="nav-link"
                          style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.electronVoting")}</Link>
                    <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                    <Link to={'/admin'} className="nav-link"
                          style={{color: "rgba(155,153,150,0.98)"}}>{lang("routes.menu")}</Link>
                    <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                    {disabled ?
                        <div className='d-flex align-items-center'>
                            <Link to={link2} className={`nav-link`}
                                  style={{
                                      color: "rgba(155,153,150,0.98)",
                                      fontSize: '17px'
                                  }}>{lang("routes.controlPage.control")} {cardName}</Link>
                            <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                            <Link to={'#'}
                                  className="nav-link text-dark h5">{statusName}</Link>
                        </div>
                        :
                        <Link to={`#`} className={`h4 nav-link disabled`}
                              style={{color: "#3D5398"}}>{lang("routes.controlPage.control")} {cardName}</Link>
                    }
                </div>
                <div className={disabled ? `d-none` : `heading_section d-md-none d-block text-center`}><p
                    className="text-uppercase heading_text">{lang("routes.controlPage.control")} {cardName}</p></div>
                <div className={disabled ? `d-none` : `d-flex flex-column align-items-center justify-content-center`}>
                    <button onClick={createUser}
                            className='btn-create py-2 px-3 mx-2'>{lang("createButton")}<BsBookmarkPlus
                        style={{fontSize: '18px'}}/></button>
                    <p className="d-flex d-md-none users_count mt-2">
                        {payload && payload[0] === '0' ?
                            lang("companiesList.accountCount") + '  - 0' :
                            lang("companiesList.accountCount") + " " + (startIndex + 1) + ' - ' + lastIndex + " " + lang("companiesList.from") + " " + (payload && payload[0])
                        }
                    </p>
                </div>
            </div>
            <div className="d-block d-md-none text-center">
                <h3>{statusName}</h3>
            </div>
        </>
    )
}
