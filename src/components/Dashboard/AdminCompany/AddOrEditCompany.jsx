import React, {useEffect, useState} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import {AvField, AvForm, AvInput} from 'availity-reactstrap-validation';
import {ImCancelCircle} from "react-icons/all";
import {useDispatch, useSelector} from 'react-redux';
import {Col, Label, Row} from "reactstrap";
import '../styles/settings.scss';
import {Select} from "antd";
import * as adminCompanyAction from '../../../redux/actions/CompanyAction';
import * as actionUser from '../../../redux/actions/UsersAction';
import Loader from "react-loader-spinner";
import {useTranslation} from "react-i18next";
import {BASE_URL} from "../../../utils/config";
import {api} from "../../../api/api";
import RouteByDashboard from "../RouteByDashboard";
import PhoneInput from "react-phone-number-input";
import {toast} from "react-toastify";

const {Option} = Select;

export default function AddOrEditCompany() {

    const {id} = useParams();
    const history = useHistory()
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const reducers = useSelector(state => state)
    const {currentCompany, createCompanyLoading} = reducers.company;
    const {users} = reducers.users

    const [file, setFile] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [selectUsers, setSelectUsers] = useState({
        secretary: null,
        chairman: null,
        active: null
    });

    const [phoneNumber, setPhoneNumber] = useState()
    const [inn, setInn] = useState();

    let $imagePreview = null;
    if (imagePreviewUrl) {
        $imagePreview = (
            <div className='d-flex'>
                <img src={imagePreviewUrl} style={{width: '92%', height: '20vh', textAlign: 'center'}}
                     alt={"bu yerda siz yuklagan rasm mavjud"}/>
                <ImCancelCircle onClick={upDataImg} className="text-danger position-absolute bg-transparent"
                                style={{
                                    zIndex: '1000', cursor: 'pointer',
                                    borderRadius: '50%',
                                    fontSize: '30px', marginTop: '-10px', marginLeft: '-10px'
                                }}/>
            </div>
        );
    }

    useEffect(() => {
        const current = parseInt(id);
        if (!isNaN(current)) {
            dispatch(adminCompanyAction.getCompanyByIdAction({companyId: parseInt(id), history}))
        }

        return () => {
            dispatch({
                type: "REQUEST_GET_COMPANY_BY_ID",
                payload: []
            })
        }
    }, [id])

    useEffect(() => {
        return () => {
            dispatch({
                type: "REQUEST_API_SUCCESS_USERS",
                payload: []
            })
        }
    }, [])

    useEffect(() => {
        setInn(currentCompany?.inn ? currentCompany?.inn : null)
        setPhoneNumber(currentCompany?.phoneNumber ? currentCompany?.phoneNumber : null)
        setSelectUsers({
            ...selectUsers,
            secretary: currentCompany.secretaryId,
            chairman: currentCompany.chairmanId,
            active: currentCompany.active === null ? true : currentCompany.active
        })

    }, [currentCompany])

    function onSearch(val) {
        if (val.length >= 3) {
            dispatch(actionUser.getUserSearch({value: val}));
        }
    }

    const addCompany = (e, v) => {
        if (phoneNumber !== null) {
            if (phoneNumber.toString().length !== 13) {
                return toast.error(t("toast.errorPhoneNumberLength"))
            }
            const data = {
                active: selectUsers.active === undefined ? false : selectUsers.active,
                chairmanId: selectUsers.chairman === undefined ? null : selectUsers.chairman,
                secretaryId: selectUsers.secretary === undefined ? null : selectUsers.secretary,
                imageUrl: file ? "yes" : 'no',
                image: file,
                phoneNumber: phoneNumber,
                inn: v.inn,
                webPage: ("https://" + v.webPage),
                ...v
            }
            dispatch(adminCompanyAction.createCompanyForAdmin({data, history}))
        } else {
            toast.warning(t("toast.warning"))
        }
    }


    const editCompany = (e, v) => {
        const data = {
            id: currentCompany.id,
            active: selectUsers.active,
            chairmanId: selectUsers.chairman === undefined ? null : selectUsers.chairman,
            secretaryId: selectUsers.secretary === undefined ? null : selectUsers.secretary,
            imageUrl: file ? "yes" : 'no',
            image: file,
            phoneNumber: phoneNumber,
            inn: inn,
            webPage: ("https://" + v.webPage),
            ...v
        }
        dispatch(adminCompanyAction.updateCompany({data, history}))
    }

    _handleImageChange = _handleImageChange.bind();

    function _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setFile(file)
            setImagePreviewUrl(reader.result);
        }

        reader.readAsDataURL(file)
    }

    function upDataImg() {
        setFile('')
        setImagePreviewUrl('');
    }

    return (
        <div className="settings p-3">
            <div className="container-fluid" style={{marginTop: '12vh'}}>
                <RouteByDashboard lang={t} cardName={t("routes.controlPage.company")} disabled={true}
                                  link2={`/admin/company`}
                                  statusName={currentCompany.length !== 0 ? t("routes.addOrEditPage.editCompany") : t("routes.addOrEditPage.addCompany")}/>
                <AvForm className="container_wrapper"
                        onValidSubmit={currentCompany.length !== 0 ? editCompany : addCompany}
                        enctype="multipart/form-data">
                    <Row>
                        <Col md={2} className="d-flex justify-content-center align-items-center">
                            {currentCompany && currentCompany.imageUrl === "yes" ?
                                <div className='currentCompanyLogo d-flex align-items-center'>
                                    <img className="w-100"
                                         src={BASE_URL + api.getLogoByCompanyId + "/" + currentCompany.id}
                                         alt=""/>
                                </div>
                                :
                                <div className="app-custom-file">
                                    <div className={imagePreviewUrl ? `d-none` : ` `}>
                                        <form method="post"
                                              encType="multipart/form-data">
                                            <input type="file" onChange={_handleImageChange} hidden={true} id="file"
                                                   accept="image/jpg, image/jpeg, image/png, .svg"/>
                                            <label htmlFor="file"
                                                   onChange={_handleImageChange}
                                                   className={`app-custom-label`}>
                                                <div className="app-custom-info">
                                                    <strong>LOGO</strong>
                                                </div>
                                            </label>
                                        </form>

                                    </div>
                                    <div>
                                        {$imagePreview}
                                    </div>
                                </div>
                            }
                        </Col>
                        <Col md={4}>
                            <div className="form-group">
                                <Label className='required_fields'>{t("pages.company.nameCompany")}</Label>
                                <AvField
                                    type="text"
                                    name="name"
                                    placeholder={t("meetingCreated.placeholders.enterNameCompany")}
                                    value={currentCompany.length !== 0 ? currentCompany.name : ""}
                                    style={{backgroundColor: "#ffffff"}}
                                    className="setting_input border"
                                    required
                                />
                            </div>
                            <Row>
                                <Col md={6}>
                                    <div className="form-group">
                                        <Label>{t("pages.company.status")}</Label>
                                        <Select
                                            className="setting_input w-100"
                                            placeholder={t("meetingCreated.placeholders.selectStatus")}
                                            optionFilterProp="children"
                                            onChange={(value => setSelectUsers({...selectUsers, active: value}))}
                                            defaultValue={currentCompany?.active}
                                            value={selectUsers.active}
                                        >
                                            <Option value={true}>{t("pages.agenda.active")}</Option>
                                            <Option value={false}>{t("pages.agenda.noActive")}</Option>
                                        </Select>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="form-group">
                                        <Label className='required_fields'>{t("pages.company.inn")}</Label>
                                        <AvInput
                                            placeholder={t("meetingCreated.placeholders.enterInn")}
                                            style={{backgroundColor: "#ffffff", paddingLeft: '6px'}}
                                            name="inn"
                                            value={currentCompany.length !== 0 ? currentCompany.inn : ""}
                                            minLength={9} maxLength={9}
                                            className="setting_input border w-100 form-control"
                                            required
                                            validate={{
                                                required: {value: true, errorMessage: 'Please enter a name'},
                                                pattern: {
                                                    value: '^[0-9]+$',
                                                    errorMessage: 'Your name must be composed only with letter and numbers'
                                                },
                                                maxLength: {
                                                    value: 9,
                                                    errorMessage: 'Your name must be between 6 and 16 characters'
                                                }
                                            }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <div className="">
                                <div className="form-group">
                                    <Label for="companySecretary">{t("pages.company.secretary")}</Label>
                                </div>
                                <Select
                                    className="setting_input w-100"
                                    showSearch
                                    allowClear={true}
                                    placeholder={t("meetingCreated.placeholders.selectUser")}
                                    optionFilterProp="children"
                                    defaultValue={currentCompany?.secretaryId}
                                    value={selectUsers.secretary}
                                    onChange={(value => setSelectUsers({...selectUsers, secretary: value}))}
                                    onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {users?.map(value =>
                                        <Option value={value.id} key={value.id}>{value.fullName}</Option>
                                    )}
                                </Select>
                            </div>
                            <div className="form-group">
                                <Label className='required_fields'>{t("companiesList.phoneNumber")}</Label>
                                <div className="setting_input border" style={{backgroundColor: "#ffffff"}}>
                                    <PhoneInput
                                        placeholder={t("meetingCreated.placeholders.enterPhone")}
                                        value={phoneNumber}
                                        onChange={setPhoneNumber}
                                        required={true}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="">
                                <div className="">
                                    <div className="form-group">
                                        <Label for="companySecretary">{t("pages.company.chairman")}</Label>
                                    </div>
                                    <Select
                                        className="setting_input w-100"
                                        showSearch
                                        allowClear={true}
                                        placeholder={t("meetingCreated.placeholders.selectUser")}
                                        optionFilterProp="children"
                                        defaultValue={currentCompany?.chairmanId}
                                        value={selectUsers.chairman}
                                        onChange={(value) => setSelectUsers({...selectUsers, chairman: value})}
                                        onSearch={onSearch}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {users?.map((value, index) =>
                                            <Option value={value.id} key={index}>{value.fullName}</Option>
                                        )}
                                    </Select>
                                </div>
                            </div>
                            <div className="form-group">
                                <Label className='required_fields'>{t("pages.company.mail")}</Label>
                                <AvField
                                    type="email"
                                    placeholder={t("meetingCreated.placeholders.enterEmail")}
                                    value={currentCompany?.email}
                                    label=""
                                    name="email"
                                    style={{backgroundColor: "#ffffff"}}
                                    className="setting_input border "
                                    required
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <div className="form-group">
                                <Label className='required_fields'>{t("pages.company.mailingAddress")}</Label>
                                <AvField
                                    type="text"
                                    placeholder={t("meetingCreated.placeholders.enterPostalAddress")}
                                    name="postalAddress"
                                    value={currentCompany?.postalAddress}
                                    style={{backgroundColor: "#ffffff"}}
                                    className="setting_input border "
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <Label className='required_fields'>{t("pages.company.legalAddress")}</Label>
                                <AvField
                                    type="text"
                                    label=""
                                    placeholder={t("meetingCreated.placeholders.enterLegalAddress")}
                                    name="legalAddress"
                                    value={currentCompany?.legalAddress}
                                    style={{backgroundColor: "#FFFFFF"}}
                                    className="setting_input border "
                                    required/>
                            </div>

                            <AvField
                                type="text"
                                placeholder={t("meetingCreated.placeholders.enterWebSite")}
                                label={t("companiesList.webSite")}
                                name="webPage"
                                value={currentCompany?.webPage}
                                style={{
                                    backgroundColor: "#ffffff",
                                    borderLeft: "1px",
                                }}
                                className="setting_input border"
                            />
                        </Col>
                        <Col md={6}>
                            <div className="form-group">
                                <Label className='required_fields'>{t("pages.company.comment")}</Label>
                                <AvField
                                    type="textarea"
                                    name="description"
                                    placeholder={t("meetingCreated.placeholders.enterDescription")}
                                    value={currentCompany?.description}
                                    style={{backgroundColor: "#ffffff", resize: "none"}}
                                    className="setting_input border "
                                    required
                                />
                            </div>
                        </Col>
                        <div className="d-inline-flex justify-content-end mt-1">
                            {createCompanyLoading ?
                                <div className="d-flex align-items-center justify-content-center" style={{
                                    width: '8em', height: '44px', background: '#133B88', borderRadius: '6px',
                                    marginTop: '4px'
                                }}>
                                    <Loader
                                        type="ThreeDots"
                                        color="white"
                                        height={30}
                                        width={30}
                                    />
                                </div>
                                :
                                <button type="submit"
                                        className="btn-save px-3 py-2 my-1 mx-2">{currentCompany.length !== 0 ? t("settings") : t("pages.company.addCompany")}</button>
                            }
                            <button className="btn-cancel  my-1 px-3 py-2 mx-2"><Link
                                to="/admin/company">{t("cancel")}</Link>
                            </button>
                        </div>
                    </Row>
                </AvForm>
            </div>
        </div>
    )
}
