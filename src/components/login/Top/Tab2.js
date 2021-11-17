import React from 'react';
import {useTranslation} from "react-i18next";

export default function Tab2({lang}) {
    const {t} = useTranslation();
    return (
        <div data-aos="fade-right" className="tab-2">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="500.000000pt"
                 height="500.000000pt" viewBox="0 0 500.000000 500.000000"
                 preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)" stroke="none">
                    <path d="M1095 3850 c-119 -19 -246 -74 -316 -137 l-40 -37 3 -350 3 -351 28
                                    -78 c30 -86 60 -138 114 -197 35 -40 35 -40 23 -86 -7 -25 -22 -52 -34 -59
                                    -12 -7 -113 -53 -226 -101 -113 -48 -211 -92 -218 -98 -8 -5 -31 -45 -53 -88
                                    l-39 -78 0 -520 0 -520 70 0 70 0 0 498 0 497 28 49 27 50 180 78 c99 43 188
                                    81 199 84 14 5 44 -19 127 -102 l109 -109 0 -187 0 -188 70 0 70 0 0 188 0
                                    187 109 109 110 109 197 -86 198 -86 27 -53 28 -53 1 -492 0 -493 70 0 70 0
                                    -1 518 0 517 -43 85 -44 85 -233 101 -234 101 -17 53 -18 53 50 53 c27 30 60
                                    78 74 108 51 107 56 153 56 523 l0 342 -47 36 c-60 46 -151 89 -228 109 -77
                                    19 -243 28 -320 16z m305 -164 c25 -9 69 -28 98 -43 l52 -26 0 -144 c0 -89 -4
                                    -143 -10 -143 -17 0 -50 39 -50 60 0 11 -9 29 -20 40 -19 19 -33 20 -254 20
                                    l-235 0 -20 -26 c-12 -15 -21 -35 -21 -45 0 -17 -34 -49 -52 -49 -5 0 -7 64
                                    -6 143 l3 142 74 37 c41 20 95 41 120 47 67 15 266 7 321 -13z m2 -430 c40
                                    -42 65 -58 102 -68 l49 -13 -6 -90 c-14 -225 -125 -361 -302 -373 -212 -13
                                    -339 121 -360 384 l-7 81 39 6 c47 8 118 57 141 98 l17 29 137 0 138 0 52 -54z
                                    m-251 -688 c66 -10 161 -3 210 17 13 5 20 -2 29 -31 l12 -36 -91 -92 -91 -91
                                    -94 94 c-93 93 -93 93 -83 127 7 24 15 33 25 29 8 -3 45 -10 83 -17z"></path>
                    <path d="M1890 3380 l0 -70 1045 0 1045 0 0 -200 0 -200 -1045 0 -1045 0 0
                                    -70 0 -70 1368 0 c1313 0 1370 1 1385 18 15 16 17 54 17 325 0 305 0 306 -22
                                    321 -20 14 -168 16 -1385 16 l-1363 0 0 -70z m2630 -270 l0 -200 -200 0 -200
                                    0 0 200 0 200 200 0 200 0 0 -200z"></path>
                    <path d="M1890 3110 l0 -70 950 0 950 0 0 70 0 70 -950 0 -950 0 0 -70z"></path>
                    <path d="M2290 2500 l0 -70 845 0 845 0 0 -200 0 -200 -845 0 -845 0 0 -70 0
                                    -70 1168 0 c1120 0 1170 1 1185 18 15 16 17 54 17 324 0 283 -1 306 -18 321
                                    -17 16 -114 17 -1185 17 l-1167 0 0 -70z m2230 -270 l0 -200 -200 0 -200 0 0
                                    200 0 200 200 0 200 0 0 -200z"></path>
                    <path d="M2290 2230 l0 -70 750 0 750 0 0 70 0 70 -750 0 -750 0 0 -70z"></path>
                    <path d="M2290 1555 l0 -75 75 0 75 0 0 75 0 75 -75 0 -75 0 0 -75z"></path>
                    <path d="M2560 1555 l0 -75 1020 0 1020 0 0 75 0 75 -1020 0 -1020 0 0 -75z"></path>
                    <path d="M670 1355 l0 -205 75 0 75 0 0 205 0 205 -75 0 -75 0 0 -205z"></path>
                    <path d="M1620 1355 l0 -205 70 0 70 0 0 205 0 205 -70 0 -70 0 0 -205z"></path>
                    <path d="M2290 1285 l0 -75 815 0 815 0 0 75 0 75 -815 0 -815 0 0 -75z"></path>
                    <path d="M4050 1285 l0 -75 70 0 70 0 0 75 0 75 -70 0 -70 0 0 -75z"></path>
                </g>
            </svg>
            <div className="vertical_center">
                {lang("text.tab2")}
            </div>
        </div>
    );
}
