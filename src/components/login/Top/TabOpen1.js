import React, {useEffect, useState} from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import * as eimzoService from "../../../eImzo/services/eimzo";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import * as authAction from '../../../redux/actions/AuthActions';
import {useHistory} from "react-router-dom";

export default function TabOpen1({lang}) {

    const dispatch = useDispatch();
    const history = useHistory();
    const reducers = useSelector(state => state)
    const {uuidFromBack} = reducers.auth

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    const [open, setIsOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState(null);
    const [keys, setKeys] = useState([]);

    const [result, setresult] = useState("");

    useEffect(() => {
        eimzoService.startApi();
    }, []);

    useEffect(() => {
        eimzoService.getAllCertificates().then((res) => {
            setKeys(res);
            if (res.length === 1) {
                setSelectedKey(res[0]);
            }
            dispatch(authAction.loginEds(selectedKey?.serialNumber))
        });
    }, [selectedKey])

    const sign = async () => {
        setresult("");
        const keyId = await eimzoService.preLoadKey(keys.find(item =>
            item?.serialNumber === selectedKey?.serialNumber));
        eimzoService.postLoadKey(keyId, uuidFromBack?.hash).then((res) => {
                const data = {
                    pinfl: selectedKey.parsedAlias['1.2.860.3.16.1.2'],
                    fullName: selectedKey.parsedAlias.cn,
                    inn: selectedKey.inn,
                    serialnumber: selectedKey.serialNumber
                }
                dispatch(authAction.postPks7FileAction({data, history}));
            }
        ).catch(err => {
            toast(err)
        });
    }

    return (
        <div className="TabOpen1 allCss">
            <div className="eimzoModal">
                <div toggle={() => setIsOpen(!open)} className="d-flex align-items-center">
                    <div className="d-flex align-items-center eimzo">
                        <img src="../logo.png" className="openLock2"/>
                        <span className="text-white etp2">Вход с помощью ЭЦП</span>
                    </div>
                </div>

                <div className="d-flex justify-content-center">
                    <div className="App">
                        <div className="group d-flex align-items-center">
                            <span className='etp'>ЭЦП</span>
                            <Dropdown isOpen={dropdownOpen} toggle={toggle} className="drop">
                                <DropdownToggle
                                    className="dropToggle d-flex justify-content-between align-items-center">
                                    <span className="dropToggle2">
                                        {
                                            keys.length > 0
                                                ?
                                                selectedKey !== null
                                                    ?
                                                    selectedKey?.inn + " - " + selectedKey?.parsedAlias.cn.toUpperCase()
                                                    :
                                                    "Выберите ключ"
                                                :
                                                "Выберите ключ"
                                        }
                                    </span>
                                    <img src="../down2.png" className="toggleImg"/>
                                </DropdownToggle>
                                <DropdownMenu className="dropMenu">

                                    {keys.map((item, i) => (
                                        <DropdownItem className="dropItem" key={i} onClick={() => setSelectedKey(item)}>
                                            <div className="d-flex align-items-center">
                                                <img src="../etp.png"/>
                                                <b className="textB">№ СЕРТИФИКАТА:</b>
                                                <span className="textB">{item.serialNumber}</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <b>PINFL: </b>
                                                <span className="textB">{item?.parsedAlias['1.2.860.3.16.1.2']}</span>
                                                <b className="textB">{item.parsedAlias.uid ? "ФИЗИЧЕСКОE ЛИЦО" : "ЮРИДИЧЕСКОE ЛИЦО"}</b>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <b>Ф.И.О.: </b>
                                                <span className="textB">{item?.parsedAlias?.cn?.toUpperCase()}</span>
                                            </div>
                                            <div className="d-flex align-items-center srok">
                                                <b>Срок дествия сертификата:&nbsp;</b>
                                                <span
                                                    className="">{item.parsedAlias.validfrom} - {item.parsedAlias.validto}</span>
                                            </div>
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div className="group">
                            <button className="d-flex align-items-center bg-white signEtp" onClick={sign}
                                    disabled={!selectedKey}>
                                <img src="../signin.jpg" className="openLock"/>
                                <span className="imzolash text-black">Kirish</span>
                            </button>
                        </div>
                        {result !== "" && (
                            <div className="group">
                                <textarea style={{height: "500px"}}>{result}</textarea>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
