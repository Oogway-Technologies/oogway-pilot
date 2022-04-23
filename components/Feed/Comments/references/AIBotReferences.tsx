import { UilAngleDown, UilAngleUp } from '@iconscout/react-unicons'
import React, { FC, useState } from 'react'

import useMediaQuery from '../../../../hooks/useMediaQuery'
import { bodyHeavy } from '../../../../styles/typography'
import { BingReference } from '../../../../utils/types/bingapi'
import Reddit from '../../../Logos/Reddit'
import { Collapse } from '../../../Utils/common/Collapse'
import Reference from './Reference'
import { AIBotReferencesStyles } from './ReferencesSyles'

type Props = {
    references: BingReference[]
}

const AIBotReferences: FC<
    React.PropsWithChildren<React.PropsWithChildren<Props>>
> = ({ references }) => {
    const [isShowing, setIsShowing] = useState<boolean>(false)

    // Track mobile state
    const isMobile = useMediaQuery('(max-width: 500px)')

    // helper functions
    const toggleShowing = () => setIsShowing(!isShowing)

    return (
        <div className={AIBotReferencesStyles.body}>
            <div
                className={
                    bodyHeavy +
                    ' cursor-pointer inline-flex dark:text-neutralDark-50'
                }
                onClick={toggleShowing}
            >
                <span>{isShowing ? <UilAngleUp /> : <UilAngleDown />}</span>
                {isShowing ? 'Hide ' : 'Show '} references
            </div>
            <Collapse show={isShowing}>
                <div className={AIBotReferencesStyles.card}>
                    {/* Header */}
                    <div className={AIBotReferencesStyles.header}>
                        <span className="flex">
                            <Reddit width={25} height={25} />
                        </span>
                        <span className={'flex ' + bodyHeavy}>Reddit</span>
                    </div>

                    {/* References */}
                    <div
                        className={
                            AIBotReferencesStyles.references +
                            (isMobile ? 'flex-col ' : 'flex-wrap gap-x-md ')
                        }
                    >
                        {references.map((e, idx) => (
                            <Reference key={idx} reference={e} />
                        ))}
                    </div>
                </div>
            </Collapse>
        </div>
    )
}

export default AIBotReferences
