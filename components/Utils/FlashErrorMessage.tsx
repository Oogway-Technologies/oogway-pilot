import React, { useState } from 'react'
import useTimeout from '../../hooks/useTimeout'
// @ts-ignore
import { UilExclamationTriangle } from '@iconscout/react-unicons'

export type FlashErrorMessageProps = {
    message: string
    ms: number
    style: string
    onClose?: (arg?: string | boolean | number) => void
}

const FlashErrorMessage: React.FC<FlashErrorMessageProps> = ({
    message,
    ms,
    style,
    onClose,
}) => {
    // Tracks how long a form warning message has been displayed
    const [warningHasElapsed, setWarningHasElapsed] = useState(false)

    useTimeout(() => {
        setWarningHasElapsed(true)
        onClose && onClose()
    }, ms)

    // If show is false the component will return null and stop here
    if (warningHasElapsed) {
        return null
    }

    // Otherwise, return warning
    return (
        <span className={style} role="alert">
            <UilExclamationTriangle className="mr-1 h-4" /> {message}
        </span>
    )
}

export default FlashErrorMessage
