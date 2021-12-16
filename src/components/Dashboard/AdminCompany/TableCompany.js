import React from "react";
import {Link} from "react-router-dom";
import {FaCheck, FaPen, FaTimes, FaTrash} from "react-icons/fa";

export default function TableCompany({company, deleteById, updateCompany}) {

    const style = {
        whiteSpace: 'nowrap',
        width: '13em',
        height: '20px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        padding: '0',
        margin: '0'
    }

    const styleBtn = {
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
            <td className="text-center">
               <p style={style}>{company.name}</p>
            </td>
            <td className="text-center">
            <p style={style}>{company.email}</p>
            </td>
            <td className="text-center">
               <p style={style}>{company.phoneNumber}</p>
            </td>
            <td className="text-center">
                <p style={style}><b>{company.webPage}</b></p>
            </td>
            <td className="text-center">
                <p style={style}>{company.inn}</p>
            </td>
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
