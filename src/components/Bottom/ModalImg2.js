import React, {useState} from 'react';
import {Modal} from 'reactstrap';

export default function ModalImg2() {

    const [openModal, setOpenModal] = useState(false);

    function ButToggle() {
        setOpenModal(!openModal);
    }

    return (
        <div className="ModalImg3">
            <img onClick={ButToggle} className="preview-image" src="/rasm2.jpg" alt=""/>
            <Modal isOpen={openModal}>
                <div className="modal-body2 p-0">
                    <iframe className="video" src="https://www.youtube.com/embed/3eqwlXWwVw8" frameBorder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen=""/>
                </div>
                <button className="TabModalBut position-relative butdes2" onClick={ButToggle}>OK</button>
            </Modal>
        </div>
    );
}
