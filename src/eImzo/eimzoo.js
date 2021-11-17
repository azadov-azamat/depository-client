import React, {useEffect, useState} from 'react';
import * as eimzoService from "./services/eimzo";
import "./eimzo.css";
const Eimzoo = () => {

    const [keys, setKeys] = useState([]);
    const [selectedKey, setselectedKey] = useState(null);
    const [obj, setobj] = useState(null);

    const [result, setresult] = useState("");

    useEffect(() => {
        eimzoService.startApi();
        eimzoService.getAllCertificates().then((res) => {
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
        <div className="App">
            <div className="group">
                <select onChange={e => setselectedKey(e.target?.value)}>
                    {keys.map((item, i) => (
                        <option selected={i === 0} key={i} value={item?.serialNumber}>
                            {item?.inn} - {item?.parsedAlias?.cn?.toUpperCase()}</option>
                    ))}
                </select>
            </div>
            <div className="group">
                <textarea onChange={e => setobj(e.target.value)}/>
            </div>
            <div className="group">
                <button onClick={sign} disabled={!selectedKey || !obj}>Imzolash</button>
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
    );
};

export default Eimzoo;