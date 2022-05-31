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
            className="group box-border flex items-center p-2 w-full truncate rounded-lg border border-neutral-300 transition-all cursor-pointer md:p-3 md:h-11"
            onClick={() => onClick(suggestionItem)}
        >
            <UilPlusCircle
                className={
                    'mr-2 min-w-[20px] min-h-[20px] transition-all cursor-pointer fill-neutral-700 group-hover:fill-primary dark:fill-neutralDark-150 md:mr-3'
                }
            />
            <span
                className={`${body}text-sm font-normal text-neutral-700 dark:text-neutralDark-150`}
            >
                {suggestionItem.name}
            </span>
        </div>
    )
}
