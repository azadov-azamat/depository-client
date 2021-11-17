import React from "react";
import Skeleton from "react-loading-skeleton";

export default function LoadingSkeleton() {
    return (
        <>
            <tr>
                <th scope="row" className=' text-center'>
                    <Skeleton
                        width={'15px'}
                        height={35}
                        color="#202020"
                        count={7}
                        duration={3}/>
                </th>
                <td className="text-center">
                    <Skeleton
                        width={"170px"}
                        height={35}
                        color="#202020"
                        count={7}
                        duration={3}/>
                </td>
                <td className="text-center">
                    <Skeleton
                        width={'140px'}
                        height={35}
                        color="#202020"
                        count={7}
                        duration={3}/>
                </td>
                <td className="text-center">
                    <Skeleton
                        width={'135px'}
                        height={35}
                        color="#202020"
                        count={7}
                        duration={3}/>
                </td>
                <td className="text-center">
                    <Skeleton
                        width={'125px'}
                        height={35}
                        color="#202020"
                        count={7}
                        duration={3}/>
                </td>
                <td className="text-center">
                    <Skeleton
                        width={'135px'}
                        height={35}
                        color="#202020"
                        count={7}
                        duration={3}/>
                </td>
                <td className="text-center">
                    <Skeleton
                        width={'15px'}
                        height={35}
                        color="#202020"
                        count={7}
                        duration={3}/></td>
                <td className="text-center">
                    <Skeleton
                        width={'15px'}
                        height={35}
                        color="#202020"
                        count={7}
                        duration={3}/></td>
            </tr>
        </>
    )
}
