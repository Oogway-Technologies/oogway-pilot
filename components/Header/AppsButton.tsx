import { UilApps } from '@iconscout/react-unicons'
import Link from 'next/link'

const AppsButton = () => {
    // TODO: Add Hooks / link href

    return (
        <Link href='#'>
            <UilApps className="hover:text-black active:text-black dark:hover:text-neutralDark-50 
            dark:active:text-neutralDark-50"/>
        </Link>
    )
}

export default AppsButton
