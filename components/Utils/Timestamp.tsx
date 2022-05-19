import { FieldValue } from 'firebase/firestore'
import moment from 'moment'
import React from 'react'

import { parseTimestamp } from '../../utils/helpers/common'
import { jsonTimeObj } from '../../utils/types/global'

interface TimestampProps {
    timestamp: FieldValue | Date | jsonTimeObj | null
}

const Timestamp = ({ timestamp }: TimestampProps) => {
    return (
        <>
            {timestamp ? (
                <p>{moment(parseTimestamp(timestamp)).fromNow()}</p>
            ) : (
                <p className="inline-flex text-neutral-700 dark:text-neutralDark-50">
                    loading
                </p>
            )}
        </>
    )
}

export default Timestamp
