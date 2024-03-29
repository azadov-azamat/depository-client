import React from "react";
import {Pagination} from "@material-ui/lab";

export default function PaginationDashboard({count, page, lang, handleChange, payload, startIndex, lastIndex}) {
    return (
        <>
            <div className="d-none d-md-flex justify-content-between align-items-center position-fixed"
                 style={{width: '96%', bottom: '4px', background: '#FFF'}}>
                <Pagination
                    count={count}
                    size="large"
                    page={page}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                    className={payload && payload[0] === '0' ? 'd-none' : ''}
                    onChange={handleChange}
                    showFirstButton showLastButton
                />
                <p className="d-none d-lg-flex align-items-center justify-content-end users_count">
                    {payload && payload[0] === '0' ?
                        lang("companiesList.accountCount") + ' - 0' :
                        lang("companiesList.accountCount") + " " + (startIndex + 1) + ' - ' + lastIndex + " " + lang("companiesList.from") + " " + (payload && payload[0])
                    }
                </p>
            </div>
            <div className="d-md-none d-flex justify-content-center align-items-center my-3">
                <Pagination
                    count={count}
                    size="large"
                    page={page}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                    onChange={handleChange}
                    showFirstButton showLastButton
                />
            </div>
        </>
    )
}
