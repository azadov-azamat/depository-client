// import { useState } from 'react';
// import { useIMask } from 'react-imask';
//
// export default function Example () {
//     const [ opts, setOpts ] = useState({ mask: Number});
//     const { ref, maskRef } = useIMask(opts);
//
//     return (
//         <input ref={ref} />
//     );
// }

// import React from "react";
// // import MuiPhoneNumber from 'material-ui-phone-number';
// import TextField from '@mui/material/TextField';
//
// export default function Example(){
//     const inputProps = {
//         step: 300,
//     };
//     return(
//         <>
//             {/*<MuiPhoneNumber defaultCountry={'us'}/>,*/}
//             <TextField id="time" type="time" inputProps={inputProps} />;
//         </>
//     )
// }

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import {useState} from "react";

export default function Example() {
    // `value` will be the parsed phone number in E.164 format.
    // Example: "+12133734253".
    const [value, setValue] = useState()
    return (
        <PhoneInput
            placeholder="Enter phone number"
            value={value}
            onChange={setValue}/>
    )
}
