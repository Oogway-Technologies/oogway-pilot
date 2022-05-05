import React, { FC } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { setDecisionEngineOptionTab } from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { optionRatingTab } from '../../../styles/decision'
import { bodyHeavy } from '../../../styles/typography'

const OptionRatingTabWrapper: FC = () => {
    const selectedTab = useAppSelector(
        state => state.decisionSlice.decisionEngineOptionTab
    )
    const { control, watch } = useFormContext()
    const { fields } = useFieldArray({
        control,
        name: 'options',
    })
    const watchOptions = watch('options')
    const isMobile = useMediaQuery('(max-width: 965px)')

    return (
        <div className={optionRatingTab.container}>
            {fields.map((item, index) => {
                return watchOptions[index].name ? (
                    <span
                        key={item.id}
                        onClick={() =>
                            useAppDispatch(setDecisionEngineOptionTab(index))
                        }
                        className={`${bodyHeavy} ${
                            optionRatingTab.itemContainer
                        } ${
                            selectedTab === index
                                ? 'text-primary border-primary'
                                : 'font-normal text-neutral-700 dark:text-neutral-300'
                        } ${isMobile ? ' py-1' : ' py-3'}`}
                    >
                        {watchOptions[index].name}
                    </span>
                ) : null
            })}
        </div>
    )
}

export default OptionRatingTabWrapper
