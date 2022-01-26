import React from "react";
import {Button, Col, Form, Input, InputGroup, Label, Row} from "reactstrap";
import {useFormik} from "formik";
import InputMask from 'react-input-mask'
import Search from "antd/es/input/Search";
import {ArrowLeft, ArrowRight} from "@material-ui/icons";
import * as Yup from 'yup'

export const AddressSchema = Yup.object().shape({
    cadastor_number: Yup.string().required("Iltmos, formani to'ldiring!"),
    address: Yup.string().required("Iltmos, formani to'ldiring!"),
    address_type: Yup.string().required("Iltmos, formani to'ldiring!"),
    phone: Yup.string().required("Iltmos, formani to'ldiring!"),
    email: Yup.string().email('Invalid email').required("Iltmos, formani to'ldiring!")
})

export default () => {

    const defaultValues = {
        cadastor_number: '',
        email: '',
        address_type: '',
        address: '',
        phone: ''
    }


    const formik = useFormik({
        initialValues: defaultValues,
        validationSchema: AddressSchema,
        onSubmit: values => {
            console.log(values)
            // dispatch(setUserInfo(values))
            // stepper.next()
        }
    })

    return (
        <div className="settings p-3">
            <div className="container-fluid" style={{marginTop: '12vh'}}>
            <Form onSubmit={formik.handleSubmit}>
                <div className='mt-2 mb-1'>
                    <Label for='numeral-formatting'>Kadastir raqami bo'yicha izlash</Label>
                    <InputGroup>
                        <Input name='cadastor_number' type="text" placeholder='00 00 00 00 00 00 0000 0000' type="text" mask="99 99 99 99 99 9999 9999 99"
                               maskChar=" "
                               tag={InputMask}
                               onChange={formik.handleChange}
                               onBlur={formik.handleBlur} />
                        <Button
                            className='btn-icon'
                            disabled={formik.values?.cadastor_number?.replace(/ /g, "").length !== 20}
                            color={formik.values?.cadastor_number?.replace(/ /g, "").length === 20 ? 'success' : 'secondary'}
                        >
                            <Search size={16} />
                        </Button>
                    </InputGroup>
                    {formik.errors.cadastor_number && formik.touched.cadastor_number && (
                        <span className='text-danger'>{formik.errors.cadastor_number}</span>
                    )}
                </div>
                <Row className='mb-1'>
                    <Col md='12' >
                        <Label className='form-label' for='address'>
                            Manzil
                        </Label>
                        <Input name='address' type="text" placeholder='98  Borough bridge Road, Birmingham' onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.errors.address && formik.touched.address && (
                            <span className='text-danger'>{formik.errors.address}</span>
                        )}
                    </Col>
                </Row>
                <Row className='mb-1'>
                    <Col md='6'>
                        <Label className='form-label'>
                            Ko'rsatilgan manzil turini tanlang
                        </Label>
                        <Row className='mt-1'>
                            <Col md='6'>
                                <Input name="address_type" type="radio" id="address_type_1" value="Xususiy" onChange={formik.handleChange} /> <Label className='form-label mr-1' for='address_type_1'>
                                Xususiy ko'chmas mulk manzili
                            </Label>
                            </Col>

                            <Col md='6'>
                                <Input name="address_type" type="radio" id="address_type_2" value="Ijara" onChange={formik.handleChange} />
                                <Label className='form-label mr-1' for='address_type_2'>
                                    Ijaraga olingan mulk manzili
                                </Label>
                            </Col>
                        </Row>
                        {formik.errors.address_type && formik.touched.address_type && (
                            <span className='text-danger'>{formik.errors.address_type}</span>
                        )}
                    </Col>
                    <Col md='6'>
                        <Label className='form-label' for='phone'>
                            Telfon Raqam
                        </Label>
                        <Input
                            onChange={formik.handleChange}
                            type="tel"
                            name="phone"
                            placeholder='+998 00 000 00 00'
                            mask="+\9\98 99 999 99 99"
                            maskChar=" "
                            onBlur={formik.handleBlur}
                            tag={InputMask} />
                        {formik.errors.phone && formik.touched.phone && (
                            <span className='text-danger'>{formik.errors.phone}</span>
                        )}
                    </Col>
                </Row>
                <Row className='mb-1'>
                    <Col md='12'>
                        <Label className='form-label' for='phone'>
                            Pochta manzili
                        </Label>
                        <Input name='email' type="email" placeholder='example@example.com' onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        {formik.errors.email && formik.touched.email && (
                            <span className='text-danger'>{formik.errors.email}</span>
                        )}
                    </Col>
                </Row>
                <div className='d-flex justify-content-between'>
                    <Button type='button' color='primary' className='btn-prev'>
                        <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                        <span className='align-middle d-sm-inline-block d-none'>Orqga</span>
                    </Button>
                    <Button type='submit' color='primary' className='btn-next'>
                        <span className='align-middle d-sm-inline-block d-none'>Keyingisi</span>
                        <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                    </Button>
                </div>
            </Form>
            </div>
        </div>
    )
}
