import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import * as adminMeetingAction from "../../../../redux/actions/MeetingAction";

export default function FindCity({cityId}) {

    const dispatch = useDispatch();
    const history = useHistory();

    const reducers = useSelector(state => state);
    const {currentCity} = reducers.meeting

    const language = localStorage.getItem('i18nextLng');

    useEffect(() => {
        dispatch(adminMeetingAction.getCityByIdAction({cityId}));
    }, [cityId])

    console.log(cityId)
    console.log(currentCity)

    return (
        language && language === 'uz' || language === 'en' ?
            currentCity?.nameUz : currentCity?.nameRu
    )
}
