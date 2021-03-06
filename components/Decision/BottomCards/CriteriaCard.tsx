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
            className="flex w-full items-center bg-white p-3 dark:bg-neutralDark-300"
        >
            <div className="flex w-full flex-col">
                <div className="flex items-center">
                    <span
                        className={`${bodyHeavy} mr-2 min-w-[70%] truncate whitespace-nowrap text-neutral-800 dark:text-white`}
                    >
                        {item.name}
                    </span>
                    {item.isAI ? (
                        <span
                            className={`${caption} border-l border-l-neutral-700 px-2 text-primary`}
                        >
                            AI
                        </span>
                    ) : null}
                    <TabsMenu
                        firstItemText={'Edit Criteria'}
                        secondItemText={'Delete Criteria'}
                        onClickFirst={onClickEdit}
                        onClickSecond={onClickRemove}
                        isAI={false}
                    />
                </div>
                <span
                    className={`${body} w-full truncate whitespace-nowrap text-neutral-700 dark:text-neutral-150`}
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
                        className={`${bodyHeavy} min-w-[70%] truncate whitespace-nowrap text-neutral-800 dark:text-white`}
                    >
                        {item.name}
                    </span>
                    <TabsMenu
                        firstItemText={'Edit Criteria'}
                        secondItemText={'Delete Criteria'}
                        onClickFirst={onClickEdit}
                        onClickSecond={onClickRemove}
                        isAI={false}
                    />
                </div>
                <span
                    className={`${body} w-full truncate whitespace-nowrap text-neutral-700 dark:text-neutral-150`}
                >
                    {weightToString(item.weight)} important
                </span>
            </div>

            {item.isAI ? (
                <span
                    className={`${bodyXSmall} py-3 text-center text-primary dark:text-primaryDark`}
                >
                    AI Suggestion
                </span>
            ) : null}
        </BaseCard>
    )
}
