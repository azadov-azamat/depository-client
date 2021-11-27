import React from 'react'
import sobraniya from "../../images/img/sobraniya.png"
import users from "../../images/img/users.png"
import company from "../../images/img/company.png"
import "./styles/dashboard.css"
import {Link} from 'react-router-dom'


export default function Dashboard({lang}) {

    return (
        <div className="dashboard" style={{background: '#e5e5e5'}}>
            <div className="container">
                <div className="wrapper d-flex  justify-content-center align-items-center">
                    <div
                        className="d-flex pt-md-5 flex-wrap w-100 h-100 align-items-center justify-content-center justify-content-md-center"
                        style={{marginTop: '7em'}}>
                        <div className='sections m-1 m-lg-3 d-flex align-items-center justify-content-center'>
                            <Link to='/admin/meetings'>
                                <div className="p-2">
                                    <div className="text-center mb-3">
                                        <img src={sobraniya} alt='upravleniya sobravniya'/>
                                    </div>
                                    <h3 className="text-center">{lang("meetingManagement")}</h3>
                                </div>
                            </Link>
                        </div>
                        <div
                            className='sections mt-3 mt-md-0 m-1 m-lg-5 d-flex align-items-center justify-content-center'>
                            <Link to="/admin/users">
                                <div className="p-2">
                                    <div className="text-center mb-3">
                                        <img src={users} alt='upravleniya polzavatel'/>
                                    </div>
                                    <h3 className="text-center">{lang("userManagement")}</h3>
                                </div>
                            </Link>
                        </div>
                        <div
                            className="sections mt-3 mt-md-0  m-1 m-lg-2 d-flex align-items-center mb-5 justify-content-center">
                            <Link to="/admin/company">
                                <div className="p-2">
                                    <div className="text-center mb-3">
                                        <img src={company} alt='upravleniya kompaniya'/>
                                    </div>
                                    <h3 className="text-center">{lang("companyManagement")}</h3>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
