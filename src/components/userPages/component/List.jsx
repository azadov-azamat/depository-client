import React, {useEffect, useState} from 'react'
import '../../SomeStyle.css';
import {ACTIVE, CANCELED, DISABLED, EXTRAORDINARY, FINISH, ORDINARY, PENDING} from "../../../utils/contants";
import ButtonValue from "./ButtonValue";
import Text from "antd/es/typography/Text";

export const List = ({meetings, type, companyId, lang, history}) => {

    const [statusMeet, setStatusMeet] = useState({success: FINISH, cancel: CANCELED, active: DISABLED})

    useEffect(() => {
        if (type === 'archive') {
            setStatusMeet({...statusMeet, success: PENDING, cancel: ACTIVE, active: "ACTIVATED"})
        } else if (type === 'active') {
            setStatusMeet({...statusMeet, success: FINISH, cancel: CANCELED, active: DISABLED})
        }
    }, [type])

    function status(status) {
        if (status === ACTIVE) {
            return lang("meetingCreated.meetingStatus.active")
        } else if (status === PENDING) {
            return lang("meetingCreated.meetingStatus.pending")
        } else if (status === FINISH) {
            return lang("meetingCreated.meetingStatus.finish")
        } else if (status === CANCELED) {
            return lang("meetingCreated.meetingStatus.canceled")
        } else if (status === DISABLED) {
            return lang("meetingCreated.meetingStatus.disabled")
        } else if (status === EXTRAORDINARY) {
            return lang("meetingCreated.meetingStatus.extraordinary")
        } else if (status === ORDINARY) {
            return lang("meetingCreated.meetingStatus.ordinary")
        }
    }

    function getDate(currentDate) {
        return (
            <>
                {currentDate.substr((currentDate) - 1, 10)}{"  "}{currentDate.substr(11, 5)}
            </>
        )
    }

    return (
        <>
            {meetings?.map(userMeeting => {
                return (
                    userMeeting.status === statusMeet.success || userMeeting.status === statusMeet.cancel || userMeeting.status === statusMeet.active ? " " :
                        <div className="shadow p-3 my-3" key={userMeeting?.id}>
                            <div className="row">
                                <div className="col-12 d-block d-md-none text-center">
                                    <p style={{fontSize: '18px'}}><b>{status(userMeeting.typeEnum)}</b></p>
                                    <Text>{lang("clientPage.statusNameMeeting")}: <b>{status(userMeeting.status)}</b></Text>
                                    <br/>
                                    <Text>{lang("clientPage.infoStartMeeting")}:</Text>
                                    <br/>
                                    <Text>
                                        <b>{getDate(userMeeting.startRegistration)}</b>
                                    </Text>
                                </div>
                                <div className="col-md-4 d-flex justify-content-center align-items-center d-md-none">
                                    {/*{statusMeet.success !== FINISH && statusMeet.cancel !== CANCELED ?*/}
                                    {/*    btnValue(userMeeting.id) :*/}
                                        <ButtonValue meetingId={userMeeting.id}
                                                     companyId={companyId} successStatus={statusMeet.success} cancelStatus={statusMeet.cancel}/>

                                </div>

                                <div className="col-md-7 d-none d-md-block mx-3 pt-2">
                                    <p style={{fontSize: '21px'}}><b>{status(userMeeting.typeEnum)}</b></p>
                                    <Text>{lang("clientPage.statusNameMeeting")}: <b>{status(userMeeting.status)}</b></Text>
                                    <br/>
                                    <Text>{lang("clientPage.infoStartMeeting")}: <b>{getDate(userMeeting.startRegistration)}</b>
                                    </Text>
                                </div>

                                <div className="col-md-4 d-md-flex justify-content-center align-items-center d-none">
                                        <ButtonValue meetingId={userMeeting.id}
                                                     companyId={companyId} lang={lang}  successStatus={statusMeet.success} cancelStatus={statusMeet.cancel}/>
                                </div>
                            </div>
                        </div>
                )
            })}
        </>
    )
}
