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

    function getDate(currentDate) {
        let date = new Date(currentDate);
        return (
            <>
                {(date.getHours().toString().length === 1 ? ("0" + date.getHours()) : date.getHours()) + ":" + (date.getMinutes().toString().length === 1 ? ("0" + date.getMinutes()) : date.getMinutes()) + " " +date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()}
            </>
        )
    }

    console.log(meeting)

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
            <td className="text-center company" style={style}>{getDate(meeting.startDate)}</td>
            <td className="text-center company" style={style}>{getDate(meeting.startRegistration)}</td>
            <td className="text-center company" style={style}>
                <p style={style}>
                    <FindCity cityId={meeting.cityId}/>
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
