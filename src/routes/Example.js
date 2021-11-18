import React, {useState} from "react";
import {Col, Container, Input, Row} from "reactstrap";
import {Dropdown} from 'react-bootstrap';
import * as actionUser from "../redux/actions/UsersAction";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AvField, AvForm} from 'availity-reactstrap-validation';
import * as types from ".././redux/actionTypes/UsersActionTypes";

export default function Example() {

    const history = useHistory()
    const dispatch = useDispatch();
    const reducers = useSelector(state => state)
    const {users} = reducers.users

    const [clicked, setClicked] = useState();

    function onChange(val) {
        console.log(val)
        const NAME = "FULL_NAME";
        if (val.length >= 3) {
            dispatch(actionUser.getUserFilter({value: val, field: NAME}));
        } else {
            dispatch({type: types.REQUEST_GET_USERS_LIST_SUCCESS, payload: ''})
        }
    }

    console.log(users)

    return (
        <>
            <Container>
                <Row>
                    <Col md={12}>
                        <div className="d-flex flex-column justify-content-center align-items-center"
                             style={{height: "100vh"}}>
                            <AvForm>
                                <AvField
                                    type={"text"}
                                    placeholder={"Search"}
                                    name={"test"}
                                    onChange={(e) => onChange(e.target.value)}
                                    value={clicked}
                                    />

                            </AvForm>
                            <div className="">
                                {users && users.map((value, index) =>
                                    <div onClick={() => setClicked(value.fullName)}
                                         style={{cursor: 'pointer'}}
                                         key={index}>
                                        {value.fullName}
                                    </div>
                                )}
                            </div>
                            {/*<Dropdown>*/}
                            {/*    <Dropdown.Toggle*/}
                            {/*        variant="secondary btn-sm"*/}
                            {/*        id="dropdown-basic">*/}
                            {/*        Language*/}
                            {/*    </Dropdown.Toggle>*/}

                            {/*    <Dropdown.Menu style={{backgroundColor:'#73a47'}}>*/}
                            {/*        <Dropdown.Item href="#" >Arabic</Dropdown.Item>*/}
                            {/*        <Dropdown.Item href="#">English</Dropdown.Item>*/}
                            {/*    </Dropdown.Menu>*/}
                            {/*</Dropdown>*/}
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
