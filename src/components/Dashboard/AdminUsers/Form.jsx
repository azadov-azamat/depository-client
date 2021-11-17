import React, {useState} from 'react'
import {RiUserSearchLine} from "react-icons/all";
import {Input} from "reactstrap";
import {connect} from "react-redux";
import {Filter, getUser, getUserList} from "../../../redux/actions/userAction";
import {FaCheck, FaTrash} from "react-icons/fa";
import {useTranslation} from "react-i18next";

const  Form = (props) => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const {t} = useTranslation();

    const Name = (value, field) => {

        const data = {
            field: field,
            value: value
        };
        // if (value?.length >= 3) {
        props.Filter(data);
        // }
    };
    const EMAIL = "EMAIL";
    const FULL_NAME = "FULL_NAME";
    const GROUP = "GROUP";
    const PHONE_NUMBER = "PHONE_NUMBER";
    const PINFL = "PINFL";

    return (
        <>
            <tr className=''>
                <th scope="row" className=""><RiUserSearchLine className='mt-2'/></th>
                <td><Input className="input input-group-sm" type="text" name="name" id="name"
                           onChange={e => Name(e.target.value , FULL_NAME)}/></td>
                <td><Input className="input input-group-sm" type="text" name="name" id="name"
                           onChange={e => Name(e.target.value , EMAIL)}/></td>
                <td><Input className="input input-group-sm" type="text" name="name" id="name"
                           onChange={e => Name(e.target.value , PHONE_NUMBER)}/></td>
                <td><Input className="input input-group-sm" type="select" name="name" id="name"
                           onChange={e => Name(e.target.value , GROUP)} >
                    <option onChange={() => getUserList(1,6)} value="ALL">{t("user.all")}</option>
                    <option value="INDIVIDUAL">{t("user.jismoniy")}</option>
                    <option value="ENTITY">{t("user.yuridik")}</option>
                    <option value="FOREIGNER">{t("user.chetel")}</option>
                    {/*<option value="ADMIN">{t("user.admin")}</option>*/}
                </Input>
                </td>
                <td><Input className="input input-group-sm" type="text" name="name" id="name"
                           onChange={e => Name(e.target.value , PINFL)}/></td>
                <td><FaCheck className="mt-2" style={{color: '#132E85'}}/></td>
                <td><FaTrash className='mt-2 m-lg-2' style={{color: '#132E85'}}/></td>
            </tr>
        </>
    )
}

export default connect(null,{Filter,getUser})(Form);