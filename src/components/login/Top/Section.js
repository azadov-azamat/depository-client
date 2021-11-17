import React, {useState} from 'react';
import {Nav, NavItem, TabContent, TabPane} from 'reactstrap';
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import TabOpen1 from "./TabOpen1";
import TabOpen2 from "./TabOpen2";
// import emizoo from "./eImzo/eimzoo"
import {useTranslation} from "react-i18next";


export default function Section() {

    const {t} = useTranslation();

    const [state, setState] = useState({
        myTab: "1",
        active1: "activeTab1",
        active2: "none",
        active3: "none",
    })

    const activeTab = (tab) => {
        setState({...state, myTab: tab})
    };

    const activeTab2 = () => {
        if (state.myTab === "1") {
            setState({...state, active1: "activeTab1", active2: "none", active3: "none",})
        } else if (state.myTab === "2") {
            setState({...state, active1: "none", active2: "activeTab1", active3: "none",})
        } else {
            setState({...state, active1: "none", active2: "none", active3: "activeTab1",})
        }
    };
    return (
        <div className="Section">

            <div className="left-content">
                <h1 data-aos="zoom-in" style={{marginTop: '10em'}}>{t("authorization")}</h1>
                <Nav tabs>
                    <NavItem className={state.active1} onMouseOver={activeTab2} onClick={() => {
                        activeTab('1')
                    }}>
                        <Tab1 lang={t}/>
                    </NavItem>
                    <div className="clear"></div>
                    <NavItem className={state.active2} onMouseOver={activeTab2} onClick={() => activeTab('2')}>
                        <Tab2 lang={t}/>
                    </NavItem>
                    <div className="clear"></div>
                    {/*<NavItem className={state.active3} onMouseOver={activeTab2} onClick={() => activeTab('3')}>*/}
                    {/*    <Tab3 lang={t}/>*/}
                    {/*</NavItem>*/}
                </Nav>
            </div>


            <div data-aos="flip-right" className="right-content">
                <TabContent activeTab={state.myTab}>
                    <TabPane tabId="1">
                        <TabOpen1 lang={t}/>
                    </TabPane>

                    <TabPane tabId="2">
                        <TabOpen2 lang={t}/>
                    </TabPane>
                </TabContent>
            </div>

        </div>
    );
}
