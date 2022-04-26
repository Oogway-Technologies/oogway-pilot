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
        <div className="flex items-center mb-3 w-full">
            {fields.map((item, index) => {
                return (
                    <span
                        key={item.id}
                        onClick={() =>
                            useAppDispatch(setDecisionEngineOptionTab(index))
                        }
                        className={`${bodyHeavy} py-3 w-full flex items-center justify-center transition-all border-b-2 border-transparent ${
                            selectedTab === index
                                ? 'text-primary border-primary'
                                : 'font-normal text-neutral-700'
                        } cursor-pointer`}
                    >
                        {watchOptions[index].name}
                    </span>
                )
            })}
        </div>
    )
}

export default OptionRatingTabWrapper
