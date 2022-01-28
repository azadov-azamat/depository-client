// import { useState } from 'react';
// import { useIMask } from 'react-imask';
//
// export default function Example () {
//     const [ opts, setOpts ] = useState({ mask: Number});
//     const { ref, maskRef } = useIMask(opts);
//
//     return (
//         <input ref={ref} />
//     );
// }

// import React from "react";
// // import MuiPhoneNumber from 'material-ui-phone-number';
// import TextField from '@mui/material/TextField';
//
// export default function Example(){
//     const inputProps = {
//         step: 300,
//     };
//     return(
//         <>
//             {/*<MuiPhoneNumber defaultCountry={'us'}/>,*/}
//             <TextField id="time" type="time" inputProps={inputProps} />;
//         </>
//     )
// }

import 'react-phone-number-input/style.css'
import {Col, Container, Input, NavItem, Row} from "reactstrap";
import Text from "antd/es/typography/Text";
import {NavLink} from "react-router-dom";
import React from "react";
import {Close, SquareFoot} from "@material-ui/icons";
import {BiMinus, BsArrowLeftSquare} from "react-icons/all";

export default function Example() {

    const style = {
        width: '100%',
        height: '40px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    }


    const link = [
        {
            id: 1,
            text: "Общие",
            link: "/test",
            className: 'nav-link'
        },
        {
            id: 2,
            text: "Екран",
            link: "/test/av",
            onClick: "clicked",
            className: 'nav-link'
        },
        {
            id: 3,
            text: "Локальные ресурсы",
            link: "/test/ad",
            onClick: "clicked",
            className: 'nav-link'
        },
        {
            id: 4,
            text: "Взаимодействие",
            link: "/test/as",
            onClick: "clicked",
            className: 'nav-link'
        },
        // {
        //     id: 5,
        //     text: lang("meetingStarted.navbar.zoom"),
        //     link: "/issuerLegal/meeting/" + id + "/zoom-meeting?companyId=" + companyId + "&memberId=" + memberId,
        //     onClick: clicked,
        //     className: !archiveBoolean ? 'd-none' : 'nav-link'
        // },
    ]

    const linkMap = ({id, text, link, onClick, className}) => (
        <Text key={id}>
            <NavItem>
                <NavLink to={link} className={className}>{text}</NavLink>
            </NavItem>
        </Text>
    )

    return (
        <Container>
            <Row>
                <Col md={12}>
                    <div className="w-50 border">
                        <div className="header bg-dark text-white d-flex justify-content-between align-items-center"
                             style={{height: "30px"}}>
                            <div className="title">
                                <img style={{
                                    width: "30px"
                                }}
                                     src="https://play-lh.googleusercontent.com/SH5g2hL7KtShsFcDteWieAQH1Uz3UbZE_gwxWJHmoOsnZlN7SRe0UIxsii34NSFxvwE"
                                     alt="hdb"/>
                                <span> Подключение к удаленному рабочему столу</span>
                            </div>
                            <div className="icon d-flex align-items-center">
                               <BiMinus/>
                                <BsArrowLeftSquare className="mx-2"/>
                                <Close/>
                            </div>
                        </div>
                        <div className="body">
                            <div className="svg-header d-flex align-items-center">
                                <img style={{
                                    width: "90px"
                                }}
                                     src="https://play-lh.googleusercontent.com/SH5g2hL7KtShsFcDteWieAQH1Uz3UbZE_gwxWJHmoOsnZlN7SRe0UIxsii34NSFxvwE"
                                     alt="hdb"/>
                                <h2>Подключение к удаленному <b>рабочему столу</b></h2>
                            </div>
                            <div className="links">
                                <div className="car border">
                                    <div className="m-2">
                                        <ul className="nav nav-tabs d-md-flex">
                                            {link.map(linkMap)}
                                        </ul>
                                        <form action="">
                                            <fieldset className="card-body border m-2">
                                                <legend>Параметры</legend>
                                                <div
                                                    className="d-flex justify-content-center align-items-center container">
                                                    <form action="">
                                                        <div className="d-flex align-items-center">
                                                            <label htmlFor="computer">Комютер:</label>
                                                            <input type="text" className="mx-2" size={23}/>
                                                        </div>
                                                        <div className="d-flex align-items-center mt-2">
                                                            <label htmlFor="computer">Пользватель:</label>
                                                            <input type="text" className="mx-2"/>
                                                        </div>
                                                        <div className="">
                                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                                            Alias
                                                            dolore necessitatibus nobis.
                                                        </div>
                                                    </form>
                                                </div>
                                            </fieldset>
                                            <fieldset className="card-body border m-2">
                                                <legend>Параметры подключение</legend>
                                                <div className="d-flex">
                                                    <img style={{width: '45px', height: "45px"}}
                                                         src="https://play-lh.googleusercontent.com/SH5g2hL7KtShsFcDteWieAQH1Uz3UbZE_gwxWJHmoOsnZlN7SRe0UIxsii34NSFxvwE"
                                                         alt="hdb"/>
                                                    <div className="">
                                                        <div>
                                                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis culpa cumrferendis, unde vel.</p>
                                                        </div>
                                                        <div className="buttons d-flex justify-content-start">
                                                            <button className="btn btn-warning">Сохранить</button>
                                                            <button className="btn btn-warning mx-2">Сохранить как</button>
                                                            <button className="btn btn-warning">Открыть</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
