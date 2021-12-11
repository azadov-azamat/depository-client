import React from "react";
import {FaCheck, FaPen, FaTimes, FaTrash} from "react-icons/fa";
import {Link} from "react-router-dom";
import {ENTITY, FOREIGNER, INDIVIDUAL} from "../../../utils/contants";

export default function TableUsers({user, t, deleteById}) {

    function status(status) {
        if (status === INDIVIDUAL) {
            return t("user.jismoniy")
        } else if (status === ENTITY) {
            return t("user.yuridik")
        } else if (status === FOREIGNER) {
            return t("user.chetel")
        }
    }

    const style = {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whitespace: 'nowrap',
        width: '13em',
        height: '20px'
    }

    const styleBtn = {
        // background: "#FFFFFF",
        cursor: 'pointer',
        zIndex: '1000'
    }

    return (
        <>
            <tr className=''>
                <th scope="row" className=' text-center'>
                    <Link to={`/admin/users/${user.id}`}
                          className='text-warning'><FaPen/></Link>
                </th>
                <td className='text-center' style={style}>
                    {user.fullName}
                </td>
                <td className='text-center' style={style}>
                    {user.email}
                </td>
                <td className='text-center' style={style}>
                    {user.phoneNumber}
                </td>
                <td className='text-center' style={style}>
                    {status(user.groupEnum)}
                </td>
                <td className='text-center' style={style}>
                    {user.pinfl}
                </td>
                <td className='text-center'>
                    {user.activated ? <span className="text-success">
                                <FaCheck/></span> :
                        <span className="text-danger"><FaTimes/></span>}
                </td>
                <td className='text-center'>
                    <text className="text-danger" style={styleBtn}
                          onClick={() => deleteById(user.id)}><FaTrash/></text>
                </td>
            </tr>
        </>
    )
}
