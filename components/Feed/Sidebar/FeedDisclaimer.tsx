import React from 'react'

import { bodySmall } from '../../../styles/typography'
interface FeedDisclaimerProps {
    className?: string
}
const FeedDisclaimer = ({ className }: FeedDisclaimerProps) => {
    return (
        <span className={`${bodySmall} ${className ? className : ''}`}>
            By using Oogway, you agree to our
            <a
                target="_blank"
                href="https://www.oogway.ai/terms-of-use"
                rel="noopener noreferrer"
                className="text-primary hover:cursor-pointer hover:underline"
            >
                {' '}
                Terms of Use,
            </a>{' '}
            <a
                target="_blank"
                href="https://www.oogway.ai/privacy-policy"
                rel="noopener noreferrer"
                className="text-primary hover:cursor-pointer hover:underline"
            >
                Privacy Policy
            </a>{' '}
            and
            <a
                target="_blank"
                href="https://www.oogway.ai/privacy-policy"
                rel="noopener noreferrer"
                className="text-primary hover:cursor-pointer hover:underline"
            >
                {' '}
                Cookie Policy.
            </a>
        </span>
    )
}

export default FeedDisclaimer
