import React from 'react'
import {Link, useHistory} from "react-router-dom";
import {AiOutlineRight, BsPersonPlus, FaArrowLeft} from "react-icons/all";
import {connect} from "react-redux";
import {updateState} from "../../../redux/actions/userAction";
import {SELECTED_ITEM} from "../../../redux/actionTypes/UsersActionTypes";

function UsersHeading(props) {

    const history = useHistory();

    const createUser = () => {
        history.push('/admin/users/:id');
        props.updateState({selectedItem : {}});
        localStorage.setItem(SELECTED_ITEM, JSON.stringify({}));
    };

    return (
        <div className=" d-sm-flex justify-content-between" style={{marginTop: '5em'}}>
            <div className="d-lg-inline-flex d-none">
                <Link to="/admin" className="nav-link text-dark"><FaArrowLeft/></Link>
                <Link to={'/'} className="nav-link" style={{color: "rgba(155,153,150,0.98)"}}>Электронное
                    голосование</Link>
                <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                <Link to={'/admin'} className="nav-link" style={{color: "rgba(155,153,150,0.98)"}}>Щиток приборов</Link>
                <Link to={'#'} className="nav-link disabled"><AiOutlineRight/></Link>
                <Link to={'#'} className="nav-link h4 disabled" style={{color: "#3D5398"}}>Управление пользователями</Link>
            </div>
            <div className="heading_section d-md-none d-block text-center"><p className="text-uppercase heading_text">
                Управление пользователями</p></div>
            <div className="text-center">
                <button
                    onClick={createUser} className='btn-create py-2 px-3 mx-2'>
                    Создать Пользователь | <BsPersonPlus style={{fontSize: '18px'}}/>
                </button>
            </div>
        </div>
    )
}

const mapStateToProps = (state) =>{
    return{
        selectedItem: state.user.selectedItem
    }
}
export default connect(null,{updateState})(UsersHeading);
