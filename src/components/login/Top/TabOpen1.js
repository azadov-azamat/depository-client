import React, {useEffect, useState} from 'react';
// import {Dropdown,Button, Col, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {FaDownload} from "react-icons/all";
import {AvForm, AvGroup, AvInput} from "availity-reactstrap-validation";
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import * as eimzoService from "../../../eImzo/services/eimzo";
import mapStateToProps from "react-redux/lib/connect/mapStateToProps";
import data from "bootstrap/js/src/dom/data";
// import "./eimzo.css"
export default function TabOpen1({lang}) {

    // new dropdown page
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);
    /////////
    const [isOpen, setOpen] = useState(false);
    const [addFile, setAddFile] = useState({fileName: "", file: []});

    const hiddenFileInput = React.useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
        console.log(event)
    };

    function downloadSetFile(e, v) {
        e.preventDefault();
        console.log(v)
        setOpen(!isOpen)
    }

    // New e imzo function

    const [keys, setKeys] = useState([]);
    const [selectedKey, setselectedKey] = useState(null);
    const [obj, setobj] = useState("elektron kalit");

    const [result, setresult] = useState("");

    useEffect( ()=>{
        eimzoService.startApi();
        eimzoService.getAllCertificates().then((res) => {
            console.log(res)
            setKeys(res);
            setselectedKey(res[0]?.serialNumber);
        });
    }, []);

    const sign = async () => {
        setresult("");
        const keyId = await eimzoService.preLoadKey(keys.find(item => item?.serialNumber === selectedKey));
        eimzoService.postLoadKey(keyId, obj).then((res) => setresult(res));
    }
    return (
        <div className="TabOpen1 allCss">

            <div className="eimzoModal" isOpen={isOpen} toggle={() => setOpen(!isOpen)}>
                <div toggle={() => setOpen(!isOpen)} className="d-flex align-items-center">
                    <div className="d-flex align-items-center eimzo">
                        {/*<img src="../padlock_open.png" className="openLock"/>*/}
                        {/*<img src="../lockWhite.png" className="openLock"/>*/}
                        {/*<span>Elektron kalit bilan kirish</span>*/}
                        <img src="../logo.png" className="openLock2"/>
                        <span className="text-white etp2">Вход с помощью ЭЦП</span>
                    </div>
                </div>

                <div className="d-flex justify-content-center">
                    <div className="App">
                        <div className="group d-flex align-items-center">
                            <span className='etp'>ЭЦП</span>

                            {/*    <select className="selecteKey" onChange={e => setselectedKey(e.target?.value)}>*/}
                            {/*    {keys.map((item, i) => (*/}
                            {/*            <option selected={i === 0} key={i} value={item?.serialNumber}>*/}
                            {/*                {item?.inn} - {item?.parsedAlias?.cn?.toUpperCase()}*/}
                            {/*            </option>*/}
                            {/*    ))}*/}
                            {/*</select>*/}

                            {/*new dropdown page*/}
                            <Dropdown isOpen={dropdownOpen} toggle={toggle} className="drop">

                                <DropdownToggle className="dropToggle d-flex justify-content-between align-items-center">
                                    <span className="dropToggle2">
                                        {keys.length == 1 ? keys[0].inn+ " - " + keys[0].parsedAlias.cn.toUpperCase() : "Выберите ключ" }
                                    </span>
                                     <img src="../down2.png" className="toggleImg"/>
                                </DropdownToggle>
                                <DropdownMenu className="dropMenu">

                                    {keys.map((item, i) => (
                                        <DropdownItem className="dropItem">
                                            <div className="d-flex align-items-center">
                                                <img src="../etp.png"/>
                                                <b className="textB">№ СЕРТИФИКАТА:</b>
                                                <span className="textB">{item.serialNumber}</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <b>INN: </b>
                                                <span className="textB">{item?.inn}</span>
                                                <b className="textB">{item.parsedAlias.uid? "ФИЗИЧЕСКОE ЛИЦО" : "ЮРИДИЧЕСКОE ЛИЦО"}</b>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <b>Ф.И.О.: </b>
                                                <span className="textB">{item?.parsedAlias?.cn?.toUpperCase()}</span>
                                            </div>
                                            <div className="d-flex align-items-center srok">
                                                <b>Срок дествия сертификата: </b>
                                                <span className="">{item.parsedAlias.validfrom} - {item.parsedAlias.validto}</span>
                                            </div>
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>

                        </div>
                        <div className="group d-none">
                            <textarea placeholder="text" onChange={e => setobj(e.target.value)}/>
                        </div>
                        <div className="group">
                            <button className="d-flex align-items-center bg-white signEtp" onClick={sign}
                                    disabled={!selectedKey || !obj}>
                                <img src="../signin.jpg" className="openLock"/>
                                <span className="imzolash text-black">Kirish</span>
                            </button>
                        </div>

                        {result !== "" && (
                            <div className="group">
                                <textarea style={{height: "500px"}}>{result}</textarea>
                            </div>
                        )}

                        {/*<ul className="dropdown-menu keysDropdownMenu" aria-labelledby="leDropdownMenu1">*/}
                        {/*  <li><a href="#" onClick="uiComboSelect('itm-77957EB8-0')"><img src="/src/assets/pfx.ico" alt="#"/> <b>SERTIFIKAT*/}
                        {/*    №:</b> 77957eb8<br/><b>STIR:</b> 490183397 <b>JISMONIY SHAXS</b><br/><b>F.I.Sh.:</b>AZIMOV BOBUR BAXRAMDJONOVICH<br/><font*/}
                        {/*    size="-2"><b>Sertifikatni amal qilish muddati:</b> 20.08.2021 - 20.08.2023</font>*/}
                        {/*    </a>*/}
                        {/*  </li>*/}
                        {/*</ul>*/}
                    </div>
                </div>
            </div>

            {/*<form method="get" style={{marginTop: "5em"}} action="">*/}
            {/*    <h1>{lang("electronVoice")}</h1>*/}
            {/*    <p>{lang("text.tabOpen1")}</p>*/}
            {/*    <input onClick={() => setOpen(!isOpen)} type="button" className="butdes2" name="auth_to_oneid"*/}
            {/*           value={lang("signInONEID")}/>*/}
            {/*</form>*/}

            {/*            <Modal className="eimzoModal" isOpen={isOpen} toggle={() => setOpen(!isOpen)}>*/}
            {/*                <ModalHeader toggle={() => setOpen(!isOpen)} className="d-flex align-items-center">*/}
            {/*                 <div className="d-flex align-items-center eimzo">*/}
            {/*                     /!*<img src="../padlock_open.png" className="openLock"/>*!/*/}
            {/*                     /!*<span>Elektron kalit bilan kirish</span>*!/*/}
            {/*                     <img src="../logo.png" className="openLock2"/>*/}
            {/*                     <span>Вход с помощью ЭЦП</span>*/}
            {/*                 </div>*/}
            {/*                </ModalHeader>*/}

            {/*<ModalBody className="d-flex justify-content-center">*/}
            {/*    <div className="App">*/}
            {/*        <div className="group d-flex align-items-center">*/}
            {/*           <span className='etp'>ЭЦП</span>*/}

            {/*            <select className="selecteKey" onChange={e => setselectedKey(e.target?.value)}>*/}
            {/*                {keys.map((item, i) => (*/}
            {/*                    <option selected={i === 0} key={i} value={item?.serialNumber}>*/}
            {/*                        {item?.inn} - {item?.parsedAlias?.cn?.toUpperCase()}</option>*/}
            {/*                ))}*/}
            {/*            </select>*/}
            {/*        </div>*/}
            {/*        <div className="group">*/}
            {/*            <textarea placeholder="text" onChange={e => setobj(e.target.value)}/>*/}
            {/*        </div>*/}
            {/*        <div className="group">*/}
            {/*            <button className="d-flex align-items-center" onClick={sign} disabled={!selectedKey || !obj}>*/}
            {/*                <img src="../lockWhite.png" className="openLock"/>*/}
            {/*                <span className="imzolash">Kirish</span>*/}
            {/*            </button>*/}
            {/*        </div>*/}

            {/*        {result !== "" && (*/}
            {/*            <div className="group">*/}
            {/*                <textarea style={{height: "500px"}}>{result}</textarea>*/}
            {/*            </div>*/}
            {/*        )}*/}

            {/*        /!*<ul className="dropdown-menu keysDropdownMenu" aria-labelledby="leDropdownMenu1">*!/*/}
            {/*        /!*  <li><a href="#" onClick="uiComboSelect('itm-77957EB8-0')"><img src="/src/assets/pfx.ico" alt="#"/> <b>SERTIFIKAT*!/*/}
            {/*        /!*    №:</b> 77957eb8<br/><b>STIR:</b> 490183397 <b>JISMONIY SHAXS</b><br/><b>F.I.Sh.:</b>AZIMOV BOBUR BAXRAMDJONOVICH<br/><font*!/*/}
            {/*        /!*    size="-2"><b>Sertifikatni amal qilish muddati:</b> 20.08.2021 - 20.08.2023</font>*!/*/}
            {/*        /!*    </a>*!/*/}
            {/*        /!*  </li>*!/*/}
            {/*        /!*</ul>*!/*/}
            {/*    </div>*/}
            {/*</ModalBody>*/}
            {/*            </Modal>*/}
        </div>
    );
}
