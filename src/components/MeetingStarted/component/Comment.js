import React from 'react'
import {AvField, AvForm} from 'availity-reactstrap-validation'
import Loader from "react-loader-spinner";

export default function Comment({comment, loading}) {
    return (
        <AvForm onValidSubmit={comment} style={{height: '57vh'}}>
            <AvField
                type="textarea"
                name="loggingText"
                label="Комментирование"
                className="border"
                style={{backgroundColor: '#FFFFFF', resize: 'none', height: '30vh'}}
            />
            {loading ?
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
                <button className="btn create mt-2">Комментировать</button>
            }
        </AvForm>
    )
}