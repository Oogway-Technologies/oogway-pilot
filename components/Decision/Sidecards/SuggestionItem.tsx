import { UilPlusCircle } from '@iconscout/react-unicons'
import React from 'react'

interface SuggestionItemProps {
    suggestionItem: { name: string; weight?: number; isAI: boolean }
    onClick: (item: { name: string; weight?: number; isAI: boolean }) => void
}
export const SuggestionItem = ({
    suggestionItem,
    onClick,
}: SuggestionItemProps) => {
    return (
        <div
            className="box-border flex items-center p-3 mt-4 rounded-lg border border-neutral-300 border-solid cursor-pointer"
            onClick={() => onClick(suggestionItem)}
        >
            <UilPlusCircle
                className={
                    'mr-3 cursor-pointer fill-neutral-300 hover:fill-primary'
                }
            />
            <span className="text-sm font-normal  text-neutral-700 dark:text-neutralDark-150">
                {suggestionItem.name}
            </span>
        </div>
    )
}
