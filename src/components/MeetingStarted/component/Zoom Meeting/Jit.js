import React, {useState} from 'react';
import {Jutsu} from 'react-jutsu';
import importScript from "./importScript";
import {Col, Container, Row} from "reactstrap";
import {DEPOSITORY_ZOOM_MEETING_LINK, DEPOSITORY_ZOOM_MEETING_PASSWORD, PENDING} from "../../../../utils/contants";

const Jit = (props) => {

    importScript("https://meet.jit.si/external_api.js");

    const {userName, roomName, handleStartMeeting, handleClose, zoomEnum} = props;

    const [call, setCall] = useState(false)
    const [password, setPassword] = useState('')
    const [close, setClose] = useState(false)
    const link = 'https://meet.jit.si/' + roomName;

    const handleClick = event => {
        event.preventDefault()
        if (roomName && userName && link) setCall(true)
        handleStartMeeting(roomName, userName, password, link);
        localStorage.setItem(DEPOSITORY_ZOOM_MEETING_PASSWORD, password)
        localStorage.setItem(DEPOSITORY_ZOOM_MEETING_LINK, link)
    }

    const onCloseButton = () => {
        handleClose()
        setPassword('')
        setCall(false);
        setClose(true);
        localStorage.removeItem(DEPOSITORY_ZOOM_MEETING_PASSWORD)
        localStorage.removeItem(DEPOSITORY_ZOOM_MEETING_LINK)
        zoomEnum(PENDING)
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(link).then(() => alert("Copied link: " + link))
    }

    return call ? (
        <Container>
            <Row>
                <Col md={12} className="d-flex flex-column justify-content-center text-center align-items-center">
                    <div aria-hidden={close}>
                        <Jutsu
                            roomName={roomName}
                            containerStyles={{width: '739px', height: '377px'}}
                            displayName={userName}
                            password={password}
                            onMeetingEnd={() => onCloseButton()}
                            loadingComponent={<p>loading ...</p>}
                            errorComponent={<p>Oops, something went wrong</p>}
                            configOverwrite={{
                                prejoinPageEnabled: false,
                                startWithAudioMuted: true,
                                startWithVideoMuted: true
                            }}
                        />
                    </div>
                </Col>
            </Row>
        </Container>

    ) : (
        <Container>
            <Row>
                <Col md={12} className="d-flex flex-column justify-content-center text-center align-items-center w-100 mt-4">
                    <h2>Zoom Meeting</h2>
                    <form>
                        <input
                            className="form-control"
                            id='password' type='text'
                            placeholder='Password (optional)'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}/>
                        <button className="create py-2 px-3 mt-2" onClick={handleClick} type='submit'>Start
                            video-meeting
                        </button>
                    </form>
                </Col>
            </Row>
        </Container>
    )
}

export default Jit;
