import { UilApps } from '@iconscout/react-unicons'
import Link from 'next/link'

import { appsButtonClass } from '../../styles/header'

const AppsButton = () => {
    // TODO: Add Hooks / link href

    return (
        <Link href="#" passHref>
            <a>
                <UilApps className={appsButtonClass.a} />
            </a>
        </Link>
    )
}

export default AppsButton
