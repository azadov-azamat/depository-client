import React from "react";
import {FaCheck, FaPen, FaTimes} from "react-icons/fa";
import {ACTIVE, CANCELED, DISABLED, FINISH, PENDING} from "../../../utils/contants";
import {REQUEST_CREATE_MEETING} from "../../../redux/actionTypes/MeetingActionTypes";
import {useDispatch} from "react-redux";
import {confirmAlert} from "react-confirm-alert";
import * as adminMeetingAction from "../../../redux/actions/MeetingAction";
import {useHistory} from "react-router-dom";

export default function TableMeeting({meetings, lang}) {

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

    const styleBtn = {
        cursor: 'pointer',
        zIndex: '1000'
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

        return (
            <>
                {currentDate.substr((currentDate) - 1, 10)}{"  "}{currentDate.substr(11, 5)}
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
                    <th scope="row" className='text-center'>
                        <text onClick={() => updateMeeting(element)} style={styleBtn}
                              className='text-warning text-center'>
                            <FaPen/>
                        </text>
                    </th>
                    <td className="text-center company" style={style}>
                        {element.companyName}
                    </td>
                    <td className="text-center company" style={style}>
                        {status(element.status)}
                    </td>
                    <td className="text-center company" style={style}>{getDate(element.startRegistration)}</td>
                    <td className="text-center company" style={style}>{getDate(element.startDate)}</td>
                    <td className="text-center company" style={style}>
                        {getCityName(element.city)}
                    </td>
                    <td className="text-center">{element.status === ACTIVE || element.status === PENDING ?
                        <span className="text-success  m-0 p-0"> <FaCheck/></span> :
                        <span className="text-danger  m-0 p-0"><FaTimes/></span>}
                    </td>
                </tr>
            ))}
        </>
    )
}
