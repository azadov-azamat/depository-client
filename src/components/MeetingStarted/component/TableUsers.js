import React, {useEffect, useState} from "react";
import {Modal, ModalBody, ModalHeader, Table} from "reactstrap";
import {AiOutlineSetting, BiCheckDouble, FiSettings, RiDeleteBinLine} from "react-icons/all";
import {CHAIRMAN, SECRETARY, SIMPLE, SPEAKER, WATCHER} from "../../../utils/contants";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import {useDispatch, useSelector} from "react-redux";
import StatusMembers from "./components/StatusMembers";

export default function TableUsers({meetingId, lang}) {

    const dispatch = useDispatch();
    const [count, setCount] = useState(0);
    const reducers = useSelector(state => state)
    const {memberManagerState, onlineMemberManager} = reducers.meeting
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        dispatch(meetingActions.getMemberByMeetingId({meetingId: meetingId, fromReestr: true}))
    }, [meetingId])

    return (
        <>
            <div className="d-flex justify-content-center" style={{overflowY: 'scroll', height: '57vh'}}>
                <div className="w-100">
                    <Table className="usersList" hover>
                        <thead className="navUsers">
                        <tr>
                            <th scope="col" style={{width: '0'}}>#</th>
                            <th scope="col" className='w-25'>Ф.И.О.</th>
                            <th scope="col" className='w-25'>Телефон</th>
                            <th scope="col" className='w-25'>Онлайн</th>
                            <th scope="col" className='w-25'>Роль</th>
                            <th scope="col" style={{width: '0'}}>
                                <BiCheckDouble fontSize={25} color={"green"}/>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {onlineMemberManager.length !== 0
                            ? onlineMemberManager.map((user, index) =>
                                <StatusMembers member={user} index={index} lang={lang}/>
                            ) :
                            <tr className='text-center'>
                                <th colSpan="5">{lang("meetingCreated.emptyList")}</th>
                            </tr>
                        }
                        </tbody>
                    </Table>
                </div>
            </div>
        </>

    )
}
