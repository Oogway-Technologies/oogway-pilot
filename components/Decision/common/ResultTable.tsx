import { UilAngleDown } from '@iconscout/react-unicons'
import React, { FC, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { body, bodyHeavy, bodySmall, caption } from '../../../styles/typography'
import { weightToString } from '../../../utils/helpers/common'
import {
    Criteria,
    IV,
    Options,
    Rating,
    Ratings,
} from '../../../utils/types/global'
import { TableLoader } from '../../Loaders/TableLoader'
import { DropDownMenu } from '../../Utils/common/DropDownMenu'

interface ResultTableProps {
    isLoading?: boolean
}
export const ResultTable: FC<ResultTableProps> = ({
    isLoading = false,
}: ResultTableProps) => {
    const { control } = useFormContext()
    const rating: Ratings[] = useWatch({ name: 'ratings', control })
    const criteria: Criteria[] = useWatch({ name: 'criteria', control })
    const options: Options[] = useWatch({ name: 'options', control })
    const isMobile = useMediaQuery('(max-width: 965px)')

    const [selectedRating, setSelectedRating] = useState<Ratings>(rating[0])

    useEffect(() => {
        if (isMobile) {
            setSelectedRating(rating[0])
        }
    }, [isMobile])

    return isLoading ? (
        <TableLoader />
    ) : isMobile ? (
        <table
            className="mt-3 w-full table-auto"
            style={{
                borderCollapse: 'separate',
                borderSpacing: `0px ${isMobile ? '0.5rem' : '1rem'}`,
            }}
        >
            <thead className="flex items-center w-full">
                <td className={'flex mr-4 w-1/2'}>
                    <span
                        className={`text-sm md:text-base leading-6 tracking-normal flex flex-col items-start text-primary dark:text-primaryDark px-2 py-1.5`}
                    >
                        <b>CRITERIA</b>
                        IMPORTANCE
                    </span>
                </td>
                <td className={'flex items-center space-x-3 w-1/2 '}>
                    <span
                        className={`${bodyHeavy} text-white bg-neutral-700 py-1 px-2 rounded-lg w-full truncate max-w-[8rem]`}
                    >
                        {selectedRating.option}
                    </span>
                    <DropDownMenu
                        menuText="Options"
                        itemArray={rating.map(item => item.option)}
                        onClickItem={(v?: IV) => {
                            setSelectedRating(rating[v?.index || 0])
                        }}
                        selectedItem={selectedRating.option}
                        menuEndIcon={<UilAngleDown />}
                        menuTextClass={`${caption} !font-bold text-neutral-700 fill-neutral-700 dark:text-neutral-150 dark:fill-neutral-150`}
                        menuItemClass={`${bodySmall} text-neutral-700 fill-neutral-700 dark:text-neutral-150 dark:fill-neutral-150 truncate`}
                        menuItemsClass={
                            'max-w-full min-w-[2rem] cursor-pointer'
                        }
                    />
                </td>
            </thead>
            <tbody className="flex flex-col">
                {criteria.map((item: Criteria, index: number) => (
                    <tr
                        className="flex items-center my-2 w-full h-14"
                        key={`result-table-row-ratings-item-${index}`}
                    >
                        <td
                            className="flex flex-col items-start py-1.5 px-2 mr-4 w-1/3 
                        text-primary dark:text-primaryDark truncate bg-primary/20 rounded-lg"
                        >
                            <b className="max-w-[7rem] truncate">{item.name}</b>
                            {weightToString(item.weight)}
                        </td>

                        {selectedRating.rating.map((val: Rating, key: number) =>
                            item.name === val.criteria ? (
                                <td
                                    key={`result-item-criteria-${key}`}
                                    className={`${body} text-neutral-700 bg-neutral-50 
                                    dark:bg-neutralDark-300 dark:text-white flex items-center 
                                    justify-center rounded-lg w-2/3 h-full`}
                                >
                                    {val.value}
                                </td>
                            ) : null
                        )}
                    </tr>
                ))}

                {/* Score row */}
                <div className="flex items-center w-full">
                    <td
                        className={`${bodyHeavy} text-primary dark:text-primaryDark w-1/3 py-1.5 px-2 mr-4`}
                    >
                        Score
                    </td>
                    {options.map((item: Options, index: number) =>
                        item.name === selectedRating.option ? (
                            <td
                                key={`option-item-score-${index}`}
                                className={`${body} text-center text-neutral-700 dark:text-white w-2/3`}
                            >
                                {item.score}
                            </td>
                        ) : null
                    )}
                </div>
            </tbody>
        </table>
    ) : (
        <table
            className="mt-3 w-full table-auto"
            style={{
                borderCollapse: 'separate',
                borderSpacing: `0px ${isMobile ? '0.5rem' : '1rem'}`,
            }}
        >
            <thead>
                <tr>
                    <th className={isMobile ? 'pr-2' : 'pr-4 w-0'}>
                        <span
                            className={`${body} flex flex-col items-start text-primary dark:text-primaryDark px-2 py-1.5`}
                        >
                            <b>CRITERIA</b>
                            IMPORTANCE
                        </span>
                    </th>
                    {rating.map((item: Ratings, index: number) => (
                        <th
                            key={`result-row-header-item-${index}`}
                            className={`${bodyHeavy} text-white bg-neutral-700 h-10 ${
                                index === 0 ? 'rounded-l-lg' : ''
                            } last:rounded-r-lg truncate max-w-[5rem]`}
                        >
                            {item.option}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {criteria.map((item: Criteria, index: number) => (
                    <tr key={`result-table-row-ratings-item-${index}`}>
                        <td className="pr-4">
                            <span
                                className={`${body} flex flex-col items-start text-primary dark:text-primaryDark bg-primary/20 rounded-lg px-2 py-1.5`}
                            >
                                <b className="max-w-[10rem] truncate">
                                    {item.name}
                                </b>
                                {weightToString(item.weight)}
                            </span>
                        </td>

                        {rating.map((ratings: Ratings, idx: number) =>
                            ratings.rating.map((val: Rating, key: number) =>
                                item.name === val.criteria ? (
                                    <td
                                        key={`result-item-criteria-${key}`}
                                        className={`${body} text-neutral-700 bg-neutral-50 dark:bg-neutralDark-300 dark:text-white text-center ${
                                            idx === 0 ? 'rounded-l-lg' : ''
                                        } last:rounded-r-lg`}
                                    >
                                        {val.value}
                                    </td>
                                ) : null
                            )
                        )}
                    </tr>
                ))}
                {/* Score row */}
                <tr>
                    <td
                        className={`${bodyHeavy} text-primary dark:text-primaryDark text-left`}
                    >
                        Score
                    </td>
                    {options?.map((item: Options, index: number) => (
                        <td
                            key={`option-item-score-${index}`}
                            className={`${body} text-neutral-700 dark:text-white border-none text-center`}
                        >
                            {item.score}
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    )
}
