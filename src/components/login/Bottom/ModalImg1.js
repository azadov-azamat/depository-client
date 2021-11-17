import React, {Component, useState} from 'react';
import {Modal} from 'reactstrap';
import MImg1 from '../img/rasm1.jpg'

export default function ModalImg1() {

    const [openModal, setOpenModal] = useState(false);

    function ButToggle() {
        setOpenModal(!openModal);
    }

    return (
        <div className="ModalImg3">
            <img onClick={ButToggle} className="preview-image" src={MImg1} alt="image-button"/>
            <Modal isOpen={openModal}>
                <div className="modal-body2 p-0">
                    <iframe title="video" className="video" src="https://www.youtube.com/embed/lvkX6pqtAfE"
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen=""></iframe>
                </div>
                <button className="TabModalBut position-relative butdes2" onClick={ButToggle}>OK</button>
            </Modal>
        </div>
    );
}
