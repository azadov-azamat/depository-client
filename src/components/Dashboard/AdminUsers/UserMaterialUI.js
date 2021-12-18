import React from "react";
import {Box, Button, TextField} from "@material-ui/core";
import RouteByDashboard from "../RouteByDashboard";
import {useDispatch} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Col, Row} from "reactstrap";
// import SendIcon from '@mui/icons-material/Send';

export default function UserMaterialUI() {
    const dispatch = useDispatch()
    const history = useHistory()
    const {id} = useParams();
    const {t} = useTranslation();

    return (
        <div className="settings p-3">
            <div className="container-fluid" style={{marginTop: '12vh'}}>
                <RouteByDashboard lang={t} cardName={t("routes.controlPage.user")} disabled={true}
                                  link2={`/admin/users`}
                                  statusName={id ? t("routes.addOrEditPage.editUser") : t("routes.addOrEditPage.addUser")}/>
            </div>
            <div className="container">
                <Box
                    component="form"
                    sx={{
                        // '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Row>
                        <Col md={6}>
                            <TextField
                                id="fullName"
                                label={t("AdminUser.fullName")}
                                name="fullName"
                                required className="w-100"
                            />
                            {/*<TextField id="standard-basic" type='email' label={t("AdminUser.email")} variant="standard" required/>*/}
                        </Col>
                    </Row>
                    {/*<Button variant="contained">*/}
                    {/*    Send*/}
                    {/*</Button>*/}
                </Box>
            </div>
        </div>
    )
}
