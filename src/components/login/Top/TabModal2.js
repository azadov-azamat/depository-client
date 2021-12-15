import React, {Component, useState} from 'react';
import {Modal} from 'reactstrap';
import Text from "antd/es/typography/Text";

export default function TabModal2({lang}) {

    const [modal, setModal] = useState(false);

    const ButToggle = () => {
        setModal(!modal);
    };

    return (
        <div>
            <a onClick={ButToggle} className="text-decoration-none" href="#model"
               id="id-gov-callback">{lang("text.tabOpenModal21")}</a>
            <Modal isOpen={modal}>
                <div className="modal-body2">
                    <h1 id="status_change_message" className="text-center">
                        {lang("text.tabOpenModal2")}<br/><br/>
                        <Text>+998900094488 </Text>
                        <Text>+998900067744 </Text>
                    </h1>
                    <button className="TabModalBut butdes2" onClick={ButToggle}>OK</button>
                </div>
            </Modal>
        </div>
    );
}
