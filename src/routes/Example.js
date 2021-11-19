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
            dispatch({type: types.REQUEST_GET_USERS_LIST_SUCCESS, payload: []})
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
                            <AvForm className={"d-flex justify-content-center"}>
                                {users && users.length === 0 ?
                                    <AvField type={'text'}
                                             name="select2"
                                             label="Option"
                                             style={{width: '20vh'}}
                                             onChange={(e) => onChange(e.target.value)}
                                    /> :
                                    <AvField type={'select'}
                                             name="select"
                                             label="Option"
                                             style={{width: '20vh'}}
                                    >
                                        {users && users.map((value, index) =>
                                            <option key={index} value={value.id}>{value.fullName}</option>
                                        )}
                                    </AvField>
                                }
                            </AvForm>
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
