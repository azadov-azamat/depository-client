import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as adminMeetingAction from "../../../../redux/actions/MeetingAction";

export default function FindCity({cityId}) {

    const dispatch = useDispatch();

    const reducers = useSelector(state => state);
    const {currentCity} = reducers.meeting

    const language = localStorage.getItem('i18nextLng');

    useEffect(() => {
        dispatch(adminMeetingAction.getCityByIdAction({cityId}));
    }, [cityId])

    if (language === "uz") {
        return (currentCity[cityId]?.nameUz)
    }

    if (language === "en") {
        return (currentCity[cityId]?.nameEn)
    }

    return (
        <>
            {currentCity[cityId]?.nameRu}
        </>
    )
}
