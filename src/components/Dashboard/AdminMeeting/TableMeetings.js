import React from "react";
import {FaCheck, FaPen, FaTimes, FaTrash} from "react-icons/fa";
import {ACTIVE, CANCELED, DISABLED, FINISH, PENDING} from "../../../utils/contants";
import {useDispatch} from "react-redux";
import {confirmAlert} from "react-confirm-alert";
import * as adminMeetingAction from "../../../redux/actions/MeetingAction";
import {useHistory} from "react-router-dom";
import Text from "antd/es/typography/Text";

export default function TableMeetings({meetings, lang}) {

    const dispatch = useDispatch();
    const history = useHistory();

    const language = localStorage.getItem('i18nextLng');

    const style = {
        width: '12em',
        height: '20px',
        margin: '0',
        padding: '0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    }

    const styleBtn = {
        cursor: 'pointer',
        zIndex: '1000'
    }

    function status(status) {
        if (status === ACTIVE) {
            return (
                <Text style={style}>
                    {lang("meetingCreated.meetingStatus.active")}
                </Text>
            )
        } else if (status === PENDING) {
            return (
                <Text style={style}>
                    {lang("meetingCreated.meetingStatus.pending")}
                </Text>
            )
        } else if (status === FINISH) {
            return (
                <Text style={style}>
                    {lang("meetingCreated.meetingStatus.finish")}
                </Text>
            )
        } else if (status === CANCELED) {
            return (
                <Text style={style}>
                    {lang("meetingCreated.meetingStatus.canceled")}
                </Text>
            )
        } else if (status === DISABLED) {
            return (
                <Text style={style}>
                    {lang("meetingCreated.meetingStatus.disabled")}
                </Text>
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
                        <text onClick={() => updateMeeting(element)} style={styleBtn} className='text-warning'>
                            <FaPen/>
                        </text>
                    </th>
                    <td className="text-center">
                        <p style={style}>{element.companyName}</p>
                    </td>
                    <td className="text-center">
                        <p style={style}>{status(element.status)}</p>
                    </td>
                    <td className="text-center">
                        <p style={style}>{getDate(element.startRegistration)}</p>
                    </td>
                    <td className="text-center">
                        <p style={style}>{getDate(element.startDate)}</p>
                    </td>
                    <td className="text-center">
                        <p style={style}>{getCityName(element.city)}</p>
                    </td>
                    <td className="text-center">{element.status === ACTIVE || element.status === PENDING ?
                        <span className="text-success  m-0 p-0"> <FaCheck/></span> :
                        <span className="text-danger  m-0 p-0"><FaTimes/></span>}
                    </td>
                    <td className="text-center">
                        <text style={styleBtn} className="text-danger"
                              onClick={() => deleteById(element.id)}>
                            <FaTrash/></text>
                    </td>
                </tr>
            ))}
        </>
    )
}
