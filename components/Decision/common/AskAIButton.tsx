import { UilCreditCardSearch } from '@iconscout/react-unicons'
import React, { FC, MouseEventHandler } from 'react'

import Button from '../../Utils/Button'

interface AskAIButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>
}

const AskAIButton: FC<AskAIButtonProps> = ({ onClick }) => (
    <Button
        icon={<UilCreditCardSearch />}
        text={'Ask AI'}
        addStyle={
            'bg-primaryInactive dark:bg-primaryDark ' +
            'hover:bg-primaryActive dark:hover:bg-primaryActive ' +
            'text-white rounded-md p-1 gap-x-1'
        }
        keepText={false}
        forceNoText={false}
        onClick={onClick}
    />
)

export default AskAIButton
