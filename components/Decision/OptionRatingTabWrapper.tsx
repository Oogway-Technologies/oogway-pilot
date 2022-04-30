import React, { FC } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { setDecisionEngineOptionTab } from '../../features/utils/utilsSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { bodyHeavy } from '../../styles/typography'

const OptionRatingTabWrapper: FC = () => {
    const selectedTab = useAppSelector(
        state => state.utilsSlice.decisionEngineOptionTab
    )
    const { control, watch } = useFormContext()
    const { fields } = useFieldArray({
        control,
        name: 'options',
    })
    const watchOptions = watch('options')

    return (
        <div className="flex sticky top-[-8px] z-40 items-center mb-3 w-full h-12 bg-white dark:bg-neutralDark-500">
            {fields.map((item, index) => {
                return watchOptions[index].name ? (
                    <span
                        key={item.id}
                        onClick={() =>
                            useAppDispatch(setDecisionEngineOptionTab(index))
                        }
                        className={`${bodyHeavy} py-3 w-full flex items-center justify-center transition-all border-b-2 border-transparent ${
                            selectedTab === index
                                ? 'text-primary border-primary'
                                : 'font-normal text-neutral-700 dark:text-neutral-300'
                        } cursor-pointer`}
                    >
                        {watchOptions[index].name}
                    </span>
                ) : null
            })}
        </div>
    )
}

export default OptionRatingTabWrapper
