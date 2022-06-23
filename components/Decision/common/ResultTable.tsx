import { UilAngleDown } from '@iconscout/react-unicons'
import React, { FC, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import useMediaQuery from '../../../hooks/useMediaQuery'
import {
    body,
    bodyHeavy,
    bodySmall,
    bodySmallHeavy,
} from '../../../styles/typography'
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
import { Tooltip } from '../../Utils/Tooltip'

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
                borderSpacing: '0px 0.5rem',
            }}
        >
            <thead className="flex items-center w-full">
                <th className={'flex mr-4 w-1/3'}>
                    <span
                        className={`text-sm md:text-base leading-6 tracking-normal flex flex-col items-start text-primary dark:text-primaryDark px-2 py-1.5`}
                    >
                        <b>CRITERIA</b>
                        IMPORTANCE
                    </span>
                </th>
                <th
                    className={`flex items-center space-x-3 w-2/3 ${bodyHeavy} text-white bg-neutral-700 rounded-lg  py-1 px-2  min-h-[3.5rem]`}
                >
                    <DropDownMenu
                        menuText={selectedRating.option}
                        itemArray={rating.map(item => item.option)}
                        onClickItem={(v?: IV) => {
                            setSelectedRating(rating[v?.index || 0])
                        }}
                        selectedItem={selectedRating.option}
                        menuEndIcon={<UilAngleDown />}
                        menuTextClass={`${bodySmall} !font-bold text-white fill-neutral-700 dark:text-neutral-150 dark:fill-neutral-150 justify-between w-full`}
                        menuItemClass={`${body} text-neutral-700 fill-neutral-700 dark:text-neutral-150 dark:fill-neutral-150 truncate`}
                        menuItemsClass={
                            'w-full cursor-pointer items-start mt-4'
                        }
                        menuClass={'h-full'}
                    />
                </th>
            </thead>
            <tbody className="flex flex-col">
                {criteria.map((item: Criteria, index: number) => (
                    <tr
                        className="flex items-center my-2 w-full h-14"
                        key={`result-table-row-ratings-item-${index}`}
                    >
                        <td
                            className={`${bodySmall} flex flex-col items-start py-1.5 px-2 mr-4 w-1/3 
                        text-primary dark:text-primaryDark bg-primary/20 rounded-lg`}
                        >
                            {item.name.split('').length > 14 ? (
                                <Tooltip
                                    toolTipText={item.name}
                                    classForToolTipBox={
                                        '!rounded bg-primary dark:bg-primaryDark text-white border-none shadow-none left-1'
                                    }
                                    classForParent={'mb-8 ml-8'}
                                    classForBottomArrow="bg-primary dark:bg-primaryDark border-none relative left-3 mr-auto"
                                >
                                    <b
                                        className={
                                            'w-full max-w-[5rem] underline underline-offset-2 truncate'
                                        }
                                    >
                                        {item.name}
                                    </b>
                                </Tooltip>
                            ) : (
                                <b className="w-full max-w-min truncate">
                                    {item.name}
                                </b>
                            )}
                            {weightToString(item.weight)}
                        </td>

                        {selectedRating.rating.map((val: Rating, key: number) =>
                            item.name === val.criteria ? (
                                <td
                                    key={`result-item-criteria-${key}`}
                                    className={`${bodySmall} text-neutral-700 bg-neutral-50 
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
                <tr className="flex items-center w-full">
                    <td
                        className={`${bodySmallHeavy} text-primary dark:text-primaryDark w-1/3 py-1.5 px-2 mr-4`}
                    >
                        Score
                    </td>
                    {options.map((item: Options, index: number) =>
                        item.name === selectedRating.option ? (
                            <td
                                key={`option-item-score-${index}`}
                                className={`${bodySmall} text-center text-neutral-700 dark:text-white w-2/3`}
                            >
                                {item.score}
                            </td>
                        ) : null
                    )}
                </tr>
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
                    <td className={isMobile ? 'pr-2' : 'pr-4 w-0'}>
                        <span
                            className={`${body} flex flex-col items-start text-primary dark:text-primaryDark px-2 py-1.5`}
                        >
                            <b>CRITERIA</b>
                            IMPORTANCE
                        </span>
                    </td>
                    {rating.map((item: Ratings, index: number) => (
                        <td
                            key={`result-row-header-item-${index}`}
                            className={`${bodyHeavy} text-white bg-neutral-700 h-10 px-3 text-center ${
                                index === 0 ? 'rounded-l-lg' : ''
                            } last:rounded-r-lg truncate max-w-[5rem]`}
                        >
                            {item.option}
                        </td>
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
                                {item.name.split('').length > 16 ? (
                                    <Tooltip
                                        toolTipText={item.name}
                                        classForToolTipBox={
                                            '!rounded bg-primary dark:bg-primaryDark text-white border-none shadow-none'
                                        }
                                        classForParent={'mb-8'}
                                        classForBottomArrow="bg-primary dark:bg-primaryDark border-none"
                                    >
                                        <b className={'max-w-[10rem] truncate'}>
                                            {item.name}
                                        </b>
                                    </Tooltip>
                                ) : (
                                    <b className="max-w-[10rem] truncate">
                                        {item.name}
                                    </b>
                                )}

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
                        className={`${bodySmallHeavy} text-primary dark:text-primaryDark text-left`}
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
