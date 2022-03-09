import { Switch } from '@headlessui/react'
import React, { FC, useState } from 'react'
import { toggleIncognitoClass } from '../../../styles/feed'
import { Icon } from '@iconify/react'

type ToggleIncognitoProps = {
    onChange: () => void
}

const ToggleIncognito: FC<ToggleIncognitoProps> = ({ onChange }) => {
    // Track slider sstate
    const [enabled, setEnabled] = useState(false)

    // Set specs
    const enabledColor = 'bg-primary dark:bg-primaryDark'
    const disabledColor = 'bg-neutral-150 dark:bg-neutralDark-150'
    const height = 7
    const width = 10

    return (
        <Switch
            checked={enabled}
            onChange={() => {
                onChange()
                setEnabled(!enabled)
            }}
            className={
                toggleIncognitoClass.switchSlide +
                (enabled ? ` ${enabledColor}` : ` ${disabledColor}`)
            }
        >
            <span
                aria-hidden="true"
                className={
                    toggleIncognitoClass.switchButton +
                    (enabled ? ' translate-x-5' : ' translate-x-0')
                }
            >
                <Icon
                    className="m-auto mt-1"
                    color={enabled ? '#7041EE' : '#3A3B3C'}
                    icon="mdi:incognito"
                    width="16"
                    height="16"
                />
            </span>
        </Switch>
    )
}

export default ToggleIncognito
