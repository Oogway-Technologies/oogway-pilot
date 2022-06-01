import React from 'react'

import useMediaQuery from '../../../hooks/useMediaQuery'
import {
    body,
    bodyHeavy,
    bodyXSmall,
    caption,
} from '../../../styles/typography'
import { weightToString } from '../../../utils/helpers/common'
import { Criteria } from '../../../utils/types/global'
import { BaseCard } from '../common/BaseCard'
import { TabsMenu } from '../common/TabsMenu'

interface CriteriaID extends Criteria {
    id: string
}
interface CriteriaCardProps {
    item: CriteriaID
    onClickRemove: () => void
    onClickEdit: () => void
}
export const CriteriaCard = ({
    item,
    onClickRemove,
    onClickEdit,
}: CriteriaCardProps) => {
    const isMobile = useMediaQuery('(max-width: 965px)')

    return isMobile ? (
        <BaseCard
            key={item.id}
            className="flex items-center p-3 w-full bg-white dark:bg-neutralDark-300"
        >
            <div className="flex flex-col w-full">
                <div className="flex items-center">
                    <span
                        className={`${bodyHeavy} text-neutral-800 dark:text-white whitespace-nowrap mr-2`}
                    >
                        {item.name}
                    </span>
                    {item.isAI ? (
                        <span
                            className={`${caption} text-primary px-2 border-l border-l-neutral-700`}
                        >
                            AI
                        </span>
                    ) : null}
                    <TabsMenu
                        firstItemText={'Edit Option'}
                        secondItemText={'Delete Option'}
                        onClickFirst={onClickEdit}
                        onClickSecond={onClickRemove}
                        isAI={item.isAI}
                    />
                </div>
                <span
                    className={`${body} text-neutral-700 dark:text-neutral-150 whitespace-nowrap truncate w-full`}
                >
                    {weightToString(item.weight)} important
                </span>
            </div>
        </BaseCard>
    ) : (
        <BaseCard
            key={item.id}
            className="flex flex-col bg-white dark:bg-neutralDark-300"
        >
            <div
                className={`flex flex-col p-3 ${
                    item.isAI ? 'border-b border-neutral-150' : ''
                }`}
            >
                <div className="flex items-center">
                    <span
                        className={`${bodyHeavy} text-neutral-800 dark:text-white whitespace-nowrap truncate w-full`}
                    >
                        {item.name}
                    </span>
                    <TabsMenu
                        firstItemText={'Edit Criteria'}
                        secondItemText={'Delete Criteria'}
                        onClickFirst={onClickEdit}
                        onClickSecond={onClickRemove}
                        isAI={item.isAI}
                    />
                </div>
                <span
                    className={`${body} text-neutral-700 dark:text-neutral-150 whitespace-nowrap truncate w-full`}
                >
                    {weightToString(item.weight)} important
                </span>
            </div>

            {item.isAI ? (
                <span
                    className={`${bodyXSmall} text-primary dark:text-primaryDark text-center py-3`}
                >
                    AI Suggestion
                </span>
            ) : null}
        </BaseCard>
    )
}
