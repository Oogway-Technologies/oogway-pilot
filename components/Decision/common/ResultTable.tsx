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
            <thead className="flex w-full items-center">
                <th className={'mr-4 flex w-1/3'}>
                    <span
                        className={`flex flex-col items-start px-2 py-1.5 leading-6 text-primary text-sm tracking-normal dark:text-primaryDark md:text-base`}
                    >
                        <b>CRITERIA</b>
                        IMPORTANCE
                    </span>
                </th>
                <th
                    className={`flex w-2/3 items-center space-x-3 ${bodyHeavy} min-h-[3.5rem] rounded-lg bg-neutral-700  py-1 px-2  text-white`}
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
                        className="my-2 flex h-14 w-full items-center"
                        key={`result-table-row-ratings-item-${index}`}
                    >
                        <td
                            className={`${bodySmall} mr-4 flex w-1/3 flex-col items-start rounded-lg bg-primary/20 
                        py-1.5 px-2 text-primary dark:text-primaryDark`}
                        >
                            {item.name.split('').length > 12 ? (
                                <Tooltip
                                    toolTipText={item.name}
                                    classForToolTipBox={
                                        '!rounded bg-primary dark:bg-primaryDark text-white border-none shadow-none left-[16%]'
                                    }
                                    classForParent={'mb-8'}
                                    classForBottomArrow="hidden"
                                >
                                    <b
                                        className={
                                            'w-full max-w-[5rem] truncate underline underline-offset-2'
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
                                    className={`${bodySmall} flex h-full 
                                    w-2/3 items-center justify-center rounded-lg 
                                    bg-neutral-50 text-neutral-700 dark:bg-neutralDark-300 dark:text-white`}
                                >
                                    {val.value}
                                </td>
                            ) : null
                        )}
                    </tr>
                ))}

                {/* Score row */}
                <tr className="flex w-full items-center">
                    <td
                        className={`${bodySmallHeavy} mr-4 w-1/3 py-1.5 px-2 text-primary dark:text-primaryDark`}
                    >
                        Score
                    </td>
                    {options.map((item: Options, index: number) =>
                        item.name === selectedRating.option ? (
                            <td
                                key={`option-item-score-${index}`}
                                className={`${bodySmall} w-2/3 text-center text-neutral-700 dark:text-white`}
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
                <tr className="relative">
                    <td className={isMobile ? 'pr-2' : 'w-0 pr-4'}>
                        <span
                            className={`${body} flex flex-col items-start px-2 py-1.5 text-primary dark:text-primaryDark`}
                        >
                            <b>CRITERIA</b>
                            IMPORTANCE
                        </span>
                    </td>
                    {rating.map((item: Ratings, index: number) => (
                        <>
                            <td
                                key={`result-row-header-item-${index}`}
                                className={`${bodyHeavy} h-10 bg-neutral-700 px-3 text-center text-white ${
                                    index === 0 ? 'rounded-l-lg' : ''
                                } group max-w-[5rem] truncate last:rounded-r-lg`}
                            >
                                {item.option.split('').length > 14 && (
                                    <span className="absolute top-1 hidden rounded border-none bg-primary px-1 text-white shadow-none text-xs group-hover:flex dark:bg-primaryDark">
                                        {item.option}
                                    </span>
                                )}
                                {item.option}
                            </td>
                        </>
                    ))}
                </tr>
            </thead>
            <tbody>
                {criteria.map((item: Criteria, index: number) => (
                    <tr key={`result-table-row-ratings-item-${index}`}>
                        <td className="pr-4">
                            <span
                                className={`${body} flex flex-col items-start rounded-lg bg-primary/20 px-2 py-1.5 text-primary dark:text-primaryDark`}
                            >
                                {item.name.split('').length > 14 ? (
                                    <Tooltip
                                        toolTipText={item.name}
                                        classForToolTipBox={
                                            '!rounded bg-primary dark:bg-primaryDark text-white border-none shadow-none'
                                        }
                                        classForParent={'mb-8'}
                                        classForBottomArrow="hidden"
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
                                        className={`${body} bg-neutral-50 text-center text-neutral-700 dark:bg-neutralDark-300 dark:text-white ${
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
                        className={`${bodySmallHeavy} text-left text-primary dark:text-primaryDark`}
                    >
                        Score
                    </td>
                    {options?.map((item: Options, index: number) => (
                        <td
                            key={`option-item-score-${index}`}
                            className={`${body} border-none text-center text-neutral-700 dark:text-white`}
                        >
                            {item.score}
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    )
}
