import React from "react";
import {FaCheck, FaPen, FaTimes, FaTrash} from "react-icons/fa";
import {ACTIVE, CANCELED, DISABLED, FINISH, PENDING} from "../../../utils/contants";
import {REQUEST_CREATE_MEETING} from "../../../redux/actionTypes/MeetingActionTypes";
import {useDispatch} from "react-redux";
import {confirmAlert} from "react-confirm-alert";
import * as adminMeetingAction from "../../../redux/actions/MeetingAction";
import {useHistory} from "react-router-dom";

export default function TableMeetings({meetings, lang}) {

    const dispatch = useDispatch();
    const history = useHistory();

    const language = localStorage.getItem('i18nextLng');

    const style = {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whitespace: 'nowrap',
        width: '13em',
        height: '20px'
    }

    function status(status) {
        if (status === ACTIVE) {
            return (
                <text style={style}>
                    {lang("meetingCreated.meetingStatus.active")}
                </text>
            )
        } else if (status === PENDING) {
            return (
                <text style={style}>
                    {lang("meetingCreated.meetingStatus.pending")}
                </text>
            )
        } else if (status === FINISH) {
            return (
                <text style={style}>
                    {lang("meetingCreated.meetingStatus.finish")}
                </text>
            )
        } else if (status === CANCELED) {
            return (
                <text style={style}>
                    {lang("meetingCreated.meetingStatus.canceled")}
                </text>
            )
        } else if (status === DISABLED) {
            return (
                <text style={style}>
                    {lang("meetingCreated.meetingStatus.disabled")}
                </text>
            )
        }
    }

    function getDate(currentDate) {
        let date = new Date(currentDate);
        return (
            <>
                {
                    (date.getHours().toString().length === 1 ? ("0" + date.getHours()) : date.getHours()) + ":" +
                    (date.getMinutes().toString().length === 1 ? ("0" + date.getMinutes()) : date.getMinutes()) + " " +
                    (date.getDate().toString().length === 1 ? ("0" + date.getDate()) : date.getDate()) + "/" +
                    (date.getMonth().toString().length === 1 ? ("0" + date.getMonth()) : date.getMonth()) + "/" + date.getFullYear()}
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

    function getCityName(city) {
        if (language === "uz") {
            return city.nameUz
        }
        if (language === "ru") {
            return city.nameRu
        }
        if (language === "en") {
            return city.nameEn
        }
    }

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
                            {element.companyName}
                    </td>
                    <td className="text-center company" style={style}>
                        {status(element.status)}
                    </td>
                    <td className="text-center company" style={style}>{getDate(element.startDate)}</td>
                    <td className="text-center company" style={style}>{getDate(element.startRegistration)}</td>
                    <td className="text-center company" style={style}>
                            {getCityName(element.city)}
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
