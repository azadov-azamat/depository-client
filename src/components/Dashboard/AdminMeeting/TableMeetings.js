import React from "react";
import {FaCheck, FaPen, FaTimes, FaTrash} from "react-icons/fa";
import {ACTIVE, CANCELED, DISABLED, FINISH, PENDING} from "../../../utils/contants";
import FindCity from './component/FindCity'

export default function TableMeetings({meeting, deleteById, updateMeeting}) {
    const style = {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whitespace: 'nowrap',
        width: '13em',
        height: '20px'
    }

    function status(status) {
        if (status === ACTIVE) {
            return 'Активно по распиванию'
        } else if (status === PENDING) {
            return "Ожидает запуска"
        } else if (status === FINISH) {
            return 'Завершено (в архиве)'
        } else if (status === CANCELED) {
            return 'Отменено (в архиве)'
        } else if (status === DISABLED) {
            return 'Неактивно'
        }
    }

    return (
        <tr>
            <th scope="row" className=' text-center'>
                <button onClick={() => updateMeeting(meeting)} className='text-warning bg-transparent border-0 m-0 p-0'>
                    <FaPen/>
                </button>
            </th>
            <td className="text-center company" style={style}>
                <p style={style}>
                    {meeting.companyName}
                </p></td>
            <td className="text-center company" style={style}>{status(meeting.status)}</td>
            <td className="text-center company" style={style}>{
                meeting.startDate.substr(0, 10) + " " + meeting.startDate.substr(11, 5)
            }</td>
            <td className="text-center company" style={style}>{
                meeting.startRegistration.substr(0, 10) + " " + meeting.startRegistration.substr(11, 5)
            }</td>
            <td className="text-center company" style={style}>
                <p style={style}>
                    {meeting.address}
                </p>
            </td>
            <td className="text-center">{meeting.status === ACTIVE || meeting.status === PENDING ?
                <span className="text-success  m-0 p-0"> <FaCheck/></span> :
                <span className="text-danger  m-0 p-0"><FaTimes/></span>}
            </td>
            <td className="text-center">
                <div style={{marginTop: '-10px'}} className="btn text-danger  m-0 p-0"
                     onClick={() => deleteById(meeting.id)}>
                    <FaTrash style={{marginTop: '4px'}}/></div>
            </td>
        </tr>
    )
}
