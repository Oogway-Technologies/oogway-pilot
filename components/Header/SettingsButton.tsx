import { UilSetting } from '@iconscout/react-unicons'
import Link from 'next/link'

const SettingsButton = () => {
    // TODO: Add Hooks / link href

    return (
        <Link href='#' passHref>
            <a><UilSetting className="hover:text-black active:text-black dark:hover:text-neutralDark-50 
            dark:active:text-neutralDark-50"/></a>
        </Link>
    )
}

export default SettingsButton
