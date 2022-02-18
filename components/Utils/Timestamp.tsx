import moment from 'moment'
import React from 'react'

type Props = {
    timestamp: object | string | Date | null
}

const Timestamp = ({ timestamp }: Props) => {
    // Utility to parse timestamp
    const parseTimestamp = () => {
        // Return early on missing timestamp
        if (!timestamp) {
            return
        }

        // If timestamp is a JSON time object, convert to date
        // Otherwise assume it has already been converted on pre-fetch
        if (!(timestamp instanceof Date) && timestamp instanceof Object) {
            timestamp = Date(timestamp)
        }

        // Convert to fromNow time
        return moment(timestamp).fromNow()
    }

    return (
        <>
            {timestamp ? (
                <p>{parseTimestamp()}</p>
            ) : (
                <p className="inline-flex text-neutral-700 dark:text-neutralDark-50">
                    loading
                </p>
            )}
        </>
    )
}

export default Timestamp
