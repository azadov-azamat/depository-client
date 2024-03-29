import React, {useEffect, useState} from "react";
import {Button, Col, Label, Row, Table} from "reactstrap";
import {AvForm, AvGroup, AvInput} from "availity-reactstrap-validation";
import {FaDownload} from "react-icons/all";
import {FaCheck} from "react-icons/fa";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import * as meetingActions from "../../../redux/actions/MeetingAction";
import {BASE_URL} from "../../../utils/config";
import {api} from "../../../api/api";
import {CHAIRMAN} from "../../../utils/contants";
import Loader from "react-loader-spinner";
import {confirmAlert} from "react-confirm-alert";

export default function MeetingReestr({currentMeeting, lang}) {

    const dispatch = useDispatch()
    const reducers = useSelector(state => state)
    const {loadingReestr, currentReestr, memberManagerState} = reducers.meeting
    const [excelFile, setExcelFile] = useState({
        currentFileName: null,
        currentFile: [],
    });

    useEffect(() => {

        dispatch(meetingActions.getMemberByMeetingId({meetingId: currentMeeting?.id, fromReestr: true}))

        return () => {
            dispatch({
                type: 'REQUEST_GET_MEMBER_LIST_SUCCESS',
                payload: []
            })
        }
    }, [currentMeeting?.id])

    const hiddenFileInput1 = React.useRef(null);

    const handleClick1 = event => {
        hiddenFileInput1.current.click();
    };


    function downloadSetFile(v) {
        if (excelFile.currentFileName === "") {
            toast.warning(lang("toast.warning"))
        } else {
            const data = new FormData();
            data.append('file', v);
            data.append('meetingId', currentMeeting.id);
            dispatch(meetingActions.addReestrByMeetingAction({data, toast, meetingId: currentMeeting.id}))
            setChecked(false)
        }
    }

    function responseReestr() {
        if (loadingReestr === 'loading') {
            return (<p>{lang("meetingCreated.reestr.loading")}</p>)
        } else if (loadingReestr === 'download') {
            return (
                <a href={BASE_URL + api.getReestrByMeetingUrl + '?meetingId=' + currentMeeting.id}>{excelFile.currentFileName ? excelFile.currentFileName : lang("meetingCreated.reestr.uploadFile")}</a>)
        } else if (loadingReestr === 'error') {
            return (<p>{lang("meetingCreated.reestr.errorFile")}</p>)
        } else if (!currentReestr) {
            return (<p>{lang("meetingCreated.reestr.uploadFile")}</p>)
        }
    }

    const [myBoolean, setMyBoolean] = useState(false)
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        setMyBoolean(memberManagerState && memberManagerState.some(element => element.memberTypeEnum === CHAIRMAN));
    }, [memberManagerState])

    function electChairmanForMeeting(memberId) {

        confirmAlert({
            title: lang("alert.selectChairman"),
            message: lang("alert.chairmanMsg"),
            buttons: [
                {
                    label: lang("alert.yes"),
                    onClick: () => {
                        setChecked(true)
                        dispatch(meetingActions.addedChairmanFromReestrPageAction({memberId, setMyBoolean}))
                    }

                },
                {
                    label: lang("alert.no"),
                    onClick: () => {
                        setChecked(false)
                    }
                }
            ]
        });
    }

    return (
        <>
            <AvForm onValidSubmit={() => downloadSetFile(excelFile.currentFile)}>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={4} sm={6}>
                        <AvGroup>
                            <Label for={"fileInput"} className='required_fields'>{lang("meetingCreated.reestr.addReestr")}</Label>
                            <AvInput id={"fileInput"}
                                     type="text" value={excelFile.currentFileName}
                                     name={"fileName1"}
                                     onClick={handleClick1}
                                     style={{backgroundColor: '#FFFFFF'}}
                                     onChange={handleClick1}
                                     placeholder={lang("meetingCreated.placeholders.selectFileReestr")}
                            />
                            <div className="custom-file">
                                <Button color={"link"} onClick={handleClick1}
                                        className=" float-end">
                                    <FaDownload/>
                                </Button>
                                <input type="file" className="custom-file-input file-chosen"
                                       onChange={(e) =>
                                           setExcelFile({
                                               ...excelFile,
                                               currentFileName: e.target.files[0].name,
                                               currentFile: e.target.files[0]
                                           })
                                       }
                                       id="inputGroupFile04"
                                       ref={hiddenFileInput1}
                                       name="file"
                                       accept=".xltx, .xlsb, .xlsm, .xlsx"
                                />
                            </div>
                        </AvGroup>
                    </Col>
                    <Col md={3} sm={6}>
                        {loadingReestr === "loading" ?
                            <div className="d-flex align-items-center justify-content-center" style={{
                                width: '8em', height: '44px', background: '#133B88', borderRadius: '6px',
                                marginTop: '5vh'
                            }}>
                                <Loader
                                    type="ThreeDots"
                                    color="white"
                                    height={30}
                                    width={30}
                                />
                            </div> :
                            <button className={"btn create mt-4 px-3 py-2"}>{lang("meetingCreated.reestr.download")}</button>
                        }
                    </Col>
                </Row>
                <div className="">
                    {responseReestr()}
                </div>
            </AvForm>
            <Row>
                <Col md={12} sm={12}>
                    <div className="d-flex justify-content-center mb-5">
                        <Table hover className="table-bordered">
                            <thead className="navUsers">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">{lang("AdminUser.fullName")}</th>
                                <th scope="col">{lang("AdminUser.pinfl")}</th>
                                <th scope="col">{lang("meetingCreated.reestr.typeDoc")}</th>
                                <th scope="col">{lang("meetingCreated.reestr.numberDoc")}</th>
                                <th scope="col">{lang("phoneNumber")}</th>
                                <th scope="col">{lang("email")}</th>
                                <th scope="col">{lang("meetingCreated.reestr.position")}</th>
                                <th scope="col">{lang("chairMan")}</th>
                            </tr>
                            </thead>
                            <tbody className="">
                            {memberManagerState.length !== 0 ?
                                memberManagerState.map((element, index) =>
                                    <tr key={index}>
                                        <td className="text-center">{index + 1}</td>
                                        <td className="text-center">{element.user.fullName}</td>
                                        <td className="text-center">{element.user.pinfl}</td>
                                        <td className="text-center">{element.hldIt}</td>
                                        <td className="text-center">{element.user.passport}</td>
                                        <td className="text-center">{element.user.phoneNumber}</td>
                                        <td className="text-center">{element.user.email}</td>
                                        <td className="text-center">{element.position}</td>
                                        <td className="text-center">
                                            {element.memberTypeEnum === CHAIRMAN ?
                                                <FaCheck/>
                                                :
                                                <div>
                                                    <input
                                                        type="radio" id="huey" name="drone" value="huey"
                                                        className={myBoolean ? "d-none" : ""}
                                                        onClick={() => electChairmanForMeeting(element.id)}
                                                        checked={checked}/>
                                                </div>

                                            }
                                        </td>
                                    </tr>
                                ) :
                                <tr className='text-center'>
                                    <th colSpan="9">{lang("meetingCreated.emptyList")}</th>
                                </tr>
                            }
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </>
    )
}
