import React from "react";
import {Link} from "react-router-dom";
import {FaCheck, FaPen, FaTimes, FaTrash} from "react-icons/fa";

export default function TableCompany({company, deleteById, updateCompany}) {

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
        <tr>
            <th scope="row" className=' text-center'>
                <Link onClick={() => updateCompany(company.id)} to={`/admin/company/update/${company.id}`}
                      className='text-warning'><FaPen/>
                </Link>
            </th>
            <td className="text-center" style={style}>
                    {company.name}
            </td>
            <td className="text-center" style={style}>
                    {company.email}
            </td>
            <td className="text-center" style={style}>
                {company.phoneNumber}
            </td>
            <td className="text-center" style={style}>
                    <b>{company.webPage}</b>
            </td>
            <td className="text-center" style={style}>{company.inn}</td>
            <td className="text-center">{company?.active ? <span className="text-success"> <FaCheck/></span> :
                <span className="text-danger"><FaTimes/></span>}</td>
            <td className="text-center">
                <text style={styleBtn} className="text-danger"
                     onClick={() => deleteById(company.id)}>
                    <FaTrash/>
                </text>
            </td>
        </tr>
    )
}
