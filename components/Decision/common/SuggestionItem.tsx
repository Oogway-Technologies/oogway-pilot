import { UilPlusCircle } from '@iconscout/react-unicons'
import React from 'react'

import { body } from '../../../styles/typography'
import { Criteria, Options } from '../../../utils/types/global'

interface SuggestionItemProps {
    suggestionItem: Options | Criteria
    onClick: (item: Options | Criteria) => void
}
export const SuggestionItem = ({
    suggestionItem,
    onClick,
}: SuggestionItemProps) => {
    return (
        <div
            className="group box-border flex w-full cursor-pointer items-center truncate rounded-lg border border-neutral-300 p-2 transition-all md:h-11 md:p-3"
            onClick={() => onClick(suggestionItem)}
        >
            <UilPlusCircle
                className={
                    'mr-2 min-h-[20px] min-w-[20px] cursor-pointer fill-neutral-700 transition-all group-hover:fill-primary dark:fill-neutralDark-150 md:mr-3'
                }
            />
            <span
                className={`${body}font-normal text-neutral-700 text-sm dark:text-neutralDark-150`}
            >
                {suggestionItem.name}
            </span>
        </div>
    )
}
