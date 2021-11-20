import React, {useEffect, useState} from "react";
import {Button, Col, Label, Row, Table} from "reactstrap";
import {AvForm, AvGroup, AvInput} from "availity-reactstrap-validation";
import {FaDownload, FaEye} from "react-icons/all";
import {FaCheck, FaTimes, FaTrash} from "react-icons/fa";
import {useHistory} from "react-router-dom";

import {useDispatch, useSelector} from "react-redux";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import {Select} from "antd";
import {confirmAlert} from "react-confirm-alert";
import {BASE_URL} from "../../../utils/config";
import {api} from "../../../api/api";

const {Option} = Select;

export default function MeetingFiles({currentMeeting}) {

    const history = useHistory();
    const dispatch = useDispatch();

    const reducers = useSelector(state => state)
    const {agendaState, meetingFile} = reducers.meeting

    const [addFile, setAddFile] = useState({fileName: "", file: []});
    const [selectAgenda, setSelectAgenda] = useState();

    const hiddenFileInput = React.useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();

    };


    useEffect(() => {
        dispatch(meetingActions.getAgendaByMeetingId({meetingId: currentMeeting?.id}))
        dispatch(meetingActions.getMeetingFilesByMeetingIdAction({meetingId: currentMeeting?.id}))
    }, [currentMeeting])


    function downloadSetFile(e, v) {

        const data = new FormData();
        data.append('agendaId', selectAgenda);
        data.append('file', addFile.file);
        data.append('meetingId', currentMeeting.id);
        dispatch(meetingActions.addAgendaAndMeetingFile({data, history}))
    }

    const deleteUser = (id) => {
        confirmAlert({
            title: 'Удалить',
            message: 'Вы действительно хотите удалить в компанию?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => {
                        dispatch(meetingActions.deleteMeetingFileAction({id: id, meetingId: currentMeeting?.id}))
                    }

                },
                {
                    label: 'Нет',
                }
            ]
        });
    };

    const download = (id) => {
        dispatch(meetingActions.downloadByIdMeetingFiles(id))
    }

    function forAgenda(value) {
        setSelectAgenda(value)
    }

    return (
        <>
            <AvForm onValidSubmit={downloadSetFile}>
                <Row>
                    <Col md={6}>
                        <div className="form-group">
                            <Label for="companySecretary">Связанные голосование</Label>
                            <Select
                                className="setting_input w-100"
                                showSearch
                                placeholder="Выберите голосование"
                                optionFilterProp="children"
                                onChange={forAgenda}
                                // onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {agendaState && agendaState.map((agenda =>
                                        <Option
                                            value={agenda.id}>{agenda.subject}</Option>
                                ))}
                            </Select>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="app-required-select d-inline">
                            <AvGroup>
                                <Label for={"fileInput"}>Загрузить файлы заседание</Label>
                                <AvInput id={"fileInput"}
                                         type="text" value={addFile.fileName}
                                         name={"fileName"}
                                         onClick={handleClick}
                                         className=""
                                         onChange={handleClick}
                                         placeholder={"Select file"}
                                         required
                                />
                                <div className="custom-file float-end">
                                    <Button color={"link"} onClick={handleClick}
                                            className=" float-end">
                                        <FaDownload/>
                                    </Button>
                                    <input type="file" className="custom-file-input d-none"
                                           onChange={(e) => {
                                               const file = e.target.files[0];
                                               setAddFile({
                                                   ...addFile,
                                                   fileName: e.target.files[0].name,
                                                   file: e.target.files[0]
                                               })
                                           }}
                                           id="inputGroupFile04"
                                           ref={hiddenFileInput}
                                           name="meetingFile"
                                    />
                                </div>
                            </AvGroup>
                            <div
                                className={"d-flex justify-content-md-end justify-content-center"}>
                                <button type={"submit"} className={"btn create mt-2"}>Загрузить</button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </AvForm>
            <Row>
                <Col md={12} sm={12}>
                    <div className="d-flex justify-content-center ">
                        <Table hover>
                            <>
                                <thead className="navUsers">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Имя файля</th>
                                    <th scope="col">Связанное голосование</th>
                                    <th scope="col"><FaCheck/></th>
                                    <th scope="col"><FaTimes/></th>
                                </tr>
                                </thead>
                                <tbody className="navUsers">
                                {meetingFile && meetingFile.length !== 0 ?
                                    meetingFile && meetingFile.map((element, index) =>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{element.agendaSubject}</td>
                                            <td>{element.originalFileName}</td>
                                            <td style={{width: '0'}}>
                                                <a href={BASE_URL + api.downloadFile + element.id} download
                                                   className='text-dark'><FaEye/></a>
                                            </td>
                                            <td style={{width: '0'}}>
                                                <button className='btn' onClick={() => deleteUser(element.id)}>
                                                    <FaTrash className='text-danger'/>
                                                </button>
                                            </td>
                                        </tr>) :
                                    <tr className='text-center'>
                                        <th colSpan="4">Ничего не найдена</th>
                                    </tr>
                                }
                                </tbody>
                            </>
                        </Table>
                    </div>
                </Col>
            </Row>
        </>
    )
}
