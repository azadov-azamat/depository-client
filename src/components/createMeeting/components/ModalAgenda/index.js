import React from "react";
import {Button, Card, CardBody, CardHeader, Col, Label, Modal, ModalBody, Row} from "reactstrap";
import {AvField, AvForm} from "availity-reactstrap-validation";
import {Select} from "antd";
import {SPEAKER} from "../../../../utils/contants";
import * as meetingActions from "../../../../redux/actions/MeetingAction";

const {Option} = Select;

export default ({
                    openModal,
                    editAgenda,
                    currentAgenda,
                    setCurrentSpeaker,
                    currentSpeaker,
                    onSearch,
                    memberManagerState,
                    setCurrentTime,
                    currentTime,
                    timer,
                    currentDebut,
                    setCurrentDebut,
                    currentStatus,
                    setCurrentStatus,
                    currentVariants,
                    deleteVoting, handleAddClickEdit, toInputUppercase, currentMeetingId, lang, setOpenModal, dispatch
                }) => {
    return (
        <Modal isOpen={openModal} className="modal-dialog modal-lg container">
            <ModalBody>
                <AvForm onValidSubmit={editAgenda}>
                    <Row>
                        <Col md={6}>
                            <div className="form-group">
                                <Label className='required_fields'>{lang("pages.agenda.question")}</Label>
                                <AvField
                                    type="text"
                                    name="subject"
                                    value={currentAgenda?.subject}
                                    placeholder={'Ваш вопрос'}
                                    style={{backgroundColor: '#FFFFFF'}}
                                    required
                                />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="form-group">
                                <Label for="companySecretary">{lang("companiesList.accountCount")}</Label>
                                <Select
                                    className="setting_input w-100"
                                    showSearch
                                    allowClear={true}
                                    placeholder="Выберите учетная запись"
                                    optionFilterProp="children"
                                    onChange={(value) => setCurrentSpeaker(value)}
                                    defaultValue={currentAgenda?.speakerId}
                                    value={currentSpeaker}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {memberManagerState?.map((username, index) =>
                                        username.memberTypeEnum === SPEAKER ?
                                            <Option key={index}
                                                    value={username.id}>{username.user.fullName + " - " + username.user.pinfl}</Option> : ''
                                    )}
                                </Select>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className="d-md-inline-flex d-flex">
                            <div className=" col-4">
                                <div className="form-group">
                                    <Label className='required_fields'>{lang("pages.agenda.time")}</Label>
                                    <Select
                                        className="setting_input w-100"
                                        placeholder="Выберите время"
                                        optionFilterProp="children"
                                        onChange={(value) => setCurrentTime(value)}
                                        defaultValue={currentAgenda?.speakTimeEnum}
                                        value={currentTime}
                                    >
                                        {timer.map((element, index) =>
                                            <Option key={index} value={element.value}>{element.text}</Option>
                                        )}
                                    </Select>
                                </div>
                            </div>
                            <div className="col-4  px-3">
                                <div className="form-group">
                                    <Label className='required_fields'>{lang("pages.agenda.debut")}</Label>
                                    <Select
                                        className="setting_input w-100"
                                        placeholder="Выберите прения"
                                        optionFilterProp="children"
                                        onChange={(value) => setCurrentDebut(value)}
                                        defaultValue={currentAgenda?.debateEnum}
                                        value={currentDebut}
                                    >
                                        {timer.map((element, index) =>
                                            <Option key={index} value={element.value}>{element.text}</Option>
                                        )}
                                    </Select>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="form-group">
                                    <Label className='required_fields'>{lang("pages.agenda.status")}</Label>
                                    <Select
                                        className="setting_input w-100"
                                        placeholder="Выберите состояние"
                                        optionFilterProp="children"
                                        onChange={(value) => setCurrentStatus(value)}
                                        defaultValue={currentAgenda?.active}
                                        value={currentStatus}
                                        disabled={true}
                                    >
                                        <Option value={true}>{lang("pages.agenda.active")}</Option>
                                        <Option value={false}>{lang("pages.agenda.noActive")}</Option>
                                    </Select>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} sm={12} className="mt-3">
                            <Card>
                                <CardHeader>
                                    <div className="form-group">
                                        <Label className='required_fields'>{lang("pages.agenda.answersList")}</Label>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <Row className="d-flex align-items-center">
                                        {currentVariants.map((voting, index) =>
                                            <div key={index} className="d-flex flex-row">
                                                <Col md={8} className=''>
                                                    <AvField
                                                        name={"variant/" + voting.id}
                                                        label={index + 1 + " - " + lang("pages.agenda.answer")}
                                                        value={voting.votingText}
                                                        onInput={toInputUppercase}
                                                        // onChange={
                                                        //     e => handleInputChange(e, i)}
                                                        className="variantAddedInput border border"
                                                        style={{backgroundColor: '#FFFFFF', fontWeight: "bold"}}
                                                        required
                                                    />
                                                </Col>
                                                <Col md={4} className=''>
                                                    <div className="float-end mt-4">
                                                        {currentVariants.length - 1 === index &&
                                                        <Button type="button" onClick={handleAddClickEdit}
                                                                className="btn create">+</Button>}
                                                        {currentVariants.length !== 1 &&
                                                        <button type="button"
                                                                onClick={() => deleteVoting(voting.id, index)}
                                                                className="btn cancel mx-2">-</button>}
                                                    </div>
                                                </Col>
                                            </div>
                                        )}
                                    </Row>
                                </CardBody>
                            </Card>
                            <button type={"submit"}
                                    className="btn py-2 px-5 create">{lang("settings")}
                            </button>
                            <button className="btn btnAll m-2 cancel" type={"button"}
                                    onClick={() => {
                                        dispatch(meetingActions.getAgendaByMeetingId({meetingId: currentMeetingId}))
                                        setOpenModal(false)
                                    }}>{lang("user.otmena")}</button>
                        </Col>
                    </Row>
                </AvForm>
            </ModalBody>
        </Modal>
    )
}
