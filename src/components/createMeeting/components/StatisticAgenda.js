import React, {useEffect} from "react";
import {Container, Row, Table} from "reactstrap";
import {useTranslation} from "react-i18next";
import {useHistory, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as meetingActions from "../../../redux/actions/MeetingAction"
import {AGAINST, FOR, REFRAIN} from "../../../utils/contants";

function useQuery() {
    const {search} = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function StatisticAgenda() {

    const {t} = useTranslation();
    const dispatch = useDispatch();

    let query = useQuery();
    const votingId = query.get("voting_id");
    const agendaId = query.get("agenda_id");

    const reducers = useSelector(state => state)
    const {voting_details, currentAgenda} = reducers.meeting

    useEffect(() => {
        dispatch(meetingActions.get_voting_details_action(parseInt(votingId)))
    }, [votingId])

    useEffect(() => {
        dispatch(meetingActions.getAgendaById({agendaId: parseInt(agendaId)}))
    }, [agendaId])

    return (
        <Container>
            <Row>
                <div className="" style={{marginTop: '6em'}}>
                    <Table bordered hover className="mb-4">
                        <>
                            <thead className="navUsers">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Вопрос повестка дня</th>
                                <th scope="col">Пользватель</th>
                            </tr>
                            </thead>
                            <tbody className="">
                            <tr>
                                <td className={"text-center"}>
                                    <text
                                        className='text-center'>
                                        1
                                    </text>
                                </td>
                                <td className="text-center">{currentAgenda.subject}</td>
                                <td className="text-center">{currentAgenda.speakerStatus !== null ? currentAgenda.speakerStatus ? "дистанционно" : "очно" : "-"}</td>
                            </tr>
                            </tbody>
                        </>
                    </Table>
                    <Table bordered hover>
                        <>
                            <thead className="navUsers">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">F.I.O</th>
                                <th scope="col">PINFL</th>
                                <th scope="col">За</th>
                                <th scope="col">Против</th>
                                <th scope="col">Ваздержались</th>
                            </tr>
                            </thead>
                            <tbody className="">
                            {voting_details && voting_details.length !== 0 ?
                                voting_details?.map((voting, index) => (
                                    <tr key={index}>
                                        <td className={"text-center"}>
                                            <text
                                                className='text-center'>
                                                {index + 1}
                                            </text>
                                        </td>
                                        <td className="text-center">{voting.username}</td>
                                        <td className="text-center">{voting.pinfl}</td>
                                        <td className="text-center">{voting.options === FOR ? "1" : "-"}</td>
                                        <td className="text-center">{voting.options === REFRAIN ? "1" : "-"}</td>
                                        <td className="text-center">{voting.options === AGAINST ? "1" : "-"}</td>
                                    </tr>
                                ))
                                :
                                <tr className='text-center'>
                                    <th colSpan="7">{t("meetingCreated.emptyList")}</th>
                                </tr>
                            }
                            </tbody>
                        </>
                    </Table>
                </div>
            </Row>
        </Container>
    )
}
