import React from "react";
import {FaCheck, FaPen, FaTimes, FaTrash} from "react-icons/fa";
import {ACTIVE, CANCELED, DISABLED, FINISH, PENDING} from "../../../utils/contants";
import FindCity from './component/FindCity'
import {REQUEST_CREATE_MEETING} from "../../../redux/actionTypes/MeetingActionTypes";
import {useDispatch} from "react-redux";
import {confirmAlert} from "react-confirm-alert";
import * as adminMeetingAction from "../../../redux/actions/MeetingAction";
import {useHistory} from "react-router-dom";

export default function TableMeetings({meetings}) {

    const dispatch = useDispatch();
    const history = useHistory();

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
                {(date.getHours().toString().length === 1 ? ("0" + date.getHours()) : date.getHours()) + ":" + (date.getMinutes().toString().length === 1 ? ("0" + date.getMinutes()) : date.getMinutes()) + " " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()}
            </>
        )
    }

    const updateMeeting = (currentMeeting) => {
        dispatch({
            type: REQUEST_CREATE_MEETING,
            payload: currentMeeting
        })
        history.push("/supervisory/addOrEditMeeting/meeting?type=update&meeting_id=" + currentMeeting.id)
    }

    const deleteById = (id) => {
        confirmAlert({
            title: 'Удалить',
            message: 'Вы действительно хотите удалить в компанию?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => {
                        dispatch(adminMeetingAction.deleteMeetingById(id))
                    }
                },
                {
                    label: 'Нет',
                }
            ]
        });
    };

    return (
        <>
            {meetings?.map(element => (
                <tr key={element.id}>
                    <th scope="row" className=' text-center'>
                        <button onClick={() => updateMeeting(element)}
                                className='text-warning bg-transparent border-0 m-0 p-0'>
                            <FaPen/>
                        </button>
                    </th>
                    <td className="text-center company" style={style}>
                        <p style={style}>
                            {element.companyName}
                        </p></td>
                    <td className="text-center company" style={style}>{status(element.status)}</td>
                    <td className="text-center company" style={style}>{getDate(element.startDate)}</td>
                    <td className="text-center company" style={style}>{getDate(element.startRegistration)}</td>
                    <td className="text-center company" style={style}>
                        <p style={style}>
                            {element.address}
                            {/*<FindCity cityId={element.cityId}/>*/}
                        </p>
                    </td>
                    <td className="text-center">{element.status === ACTIVE || element.status === PENDING ?
                        <span className="text-success  m-0 p-0"> <FaCheck/></span> :
                        <span className="text-danger  m-0 p-0"><FaTimes/></span>}
                    </td>
                    <td className="text-center">
                        <div style={{marginTop: '-10px'}} className="btn text-danger  m-0 p-0"
                             onClick={() => deleteById(element.id)}>
                            <FaTrash style={{marginTop: '4px'}}/></div>
                    </td>
                </tr>
            ))}
        </>
    )
}
