import React, {useState} from "react";
import {CHAIRMAN, SECRETARY, SIMPLE, SPEAKER, WATCHER} from "../../../utils/contants";
import {FiSettings} from "react-icons/all";
import {Modal, ModalBody, ModalHeader} from "reactstrap";

export default function StatusMembers({member, index, lang}){

    const style = {
        cursor: 'pointer',
        zIndex: '1000'
    }

    const [openModal, setOpenModal] = useState(false);

    return(
        <tr className="text-center">
            <td>{index + 1}</td>
            <td>{member.user.fullName}</td>
            <td>{member.user.phoneNumber} </td>
            <td style={member.isInvolved === true ? {backgroundColor: '#F1FFE3'} : {backgroundColor: '#FFECEE'}}>
                {
                    member.isInvolved === true ? <text className="text-success">online</text> :
                        <text className="text-danger">offline</text>
                }
            </td>
            <td>{
                member.memberTypeEnum === SPEAKER ? lang("meetingCreated.roles.speaker") : '' ||
                member.memberTypeEnum === WATCHER ? lang("meetingCreated.roles.watcher") : '' ||
                member.memberTypeEnum === SECRETARY ? lang("meetingCreated.roles.secretary") : '' ||
                member.memberTypeEnum === CHAIRMAN ? lang("meetingCreated.roles.chairman") : '' ||
                member.memberTypeEnum === SIMPLE ? "Член наб. совета" : ''
                // member.memberTypeEnum === SIMPLE ? lang("meetingCreated.roles.simple") : ''
            }</td>
            <td className="text-center">
                <text style={style}>
                    <FiSettings fontSize={20} style={{color: "#133B88"}} onClick={()=> setOpenModal(true)}/>
                </text>
            </td>
            <Modal isOpen={openModal} className="modal-dialog modal-lg">
                <ModalHeader toggle={() => setOpenModal(!openModal)} className="d-flex align-items-center"/>
                <ModalBody>
                    Full name: {member.user.fullName} <br/>
                    Pinfl: {member.user.pinfl}
                </ModalBody>
            </Modal>
        </tr>
    )
}
