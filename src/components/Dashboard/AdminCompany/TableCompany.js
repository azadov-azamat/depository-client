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

    return (
        <tr>
            <th scope="row" className=' text-center'>
                <Link onClick={() => updateCompany(company.id)} to={`/admin/company/update/${company.id}`}
                      className='text-warning'><FaPen/>
                </Link>
            </th>
            <td className="text-center">
                <p style={style}>
                    {company.name}
                </p>
            </td>
            <td className="text-center">
                <p style={style}>
                    {company.email}
                </p>
            </td>
            <td className="text-center">{company.phoneNumber}</td>
            <td className="text-center">
                <p style={style}>
                    <a style={style} href={company.webPage} target='_blank'
                       className='text-dark'><b>{company.webPage}</b></a>
                </p>
            </td>
            <td className="text-center" style={style}>{company.inn}</td>
            <td className="text-center">{company?.active ? <span className="text-success"> <FaCheck/></span> :
                <span className="text-danger"><FaTimes/></span>}</td>
            <td className="text-center">

                <div style={{marginTop: '-10px'}} className="btn user_inner text-danger"
                     onClick={() => deleteById(company.id)}><FaTrash style={{marginTop: '10px'}}/>
                </div>
            </td>
        </tr>
    )
}
