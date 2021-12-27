import React, {useEffect, useState} from "react";
import {CHAIRMAN, SECRETARY, SIMPLE, SPEAKER, WATCHER} from "../../../../utils/contants";
import {FiSettings} from "react-icons/all";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {useDispatch} from "react-redux";
import * as meetingAction from "../../../../redux/actions/MeetingAction";

export default function StatusMembers({member, index, lang}) {

    const dispatch = useDispatch();
    const [remotely, setRemotely] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const style = {
        cursor: 'pointer',
        zIndex: '1000'
    }

    const styleTable = {
        whiteSpace: 'nowrap',
        width: '13em',
        height: '20px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        padding: '0',
        margin: '0'
    }

    function isRemotelyFunc(memberId) {
        const data = {
            memberId,
            remotely
        }
        dispatch(meetingAction.IsRemotelyAction({data, setOpenModal}))
    }

    useEffect(() => {
        setRemotely(member?.isRemotely);
    }, [member])

    return (
        <tr className="text-center">
            <td>{index + 1}</td>
            <td>
                <p style={styleTable}>{member.user.fullName}</p>
            </td>
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
                member.memberTypeEnum === CHAIRMAN ? member.fromReestr ? "Член наб. совета" : lang("meetingCreated.roles.chairman") : '' ||
                member.memberTypeEnum === SIMPLE ? "Член наб. совета" : ''
            }</td>
            <td className="text-center">
                <text style={style}>
                    <FiSettings fontSize={20} style={{color: "#133B88"}} onClick={() => setOpenModal(true)}/>
                </text>
            </td>
            <Modal isOpen={openModal} toggle={false}>
                <ModalHeader toggle={() => {
                    setRemotely(member?.isRemotely)
                    setOpenModal(!openModal)
                }} className="d-flex align-items-center">
                    Вид участие в заседании
                </ModalHeader>
                <ModalBody>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadioDefault"
                               id="flexRadioDefault1"
                               checked={remotely === true}
                               onChange={(e) => setRemotely(true)}
                               value={member?.isRemotely}
                        />
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                            Дистанционно
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"
                               checked={remotely === false}
                               onChange={(e) => setRemotely(false)}
                               value={!member?.isRemotely}
                        />
                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                            Очно
                        </label>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="container d-flex justify-content-end">
                        <button className='btn create' onClick={() => isRemotelyFunc(member?.id)}>save</button>
                        <button className='btn cancel px-2 mx-2' onClick={() => {
                            setRemotely(member?.isRemotely)
                            setOpenModal(false)
                        }}>cancel
                        </button>
                    </div>
                </ModalFooter>
            </Modal>
        </tr>
    )
}
