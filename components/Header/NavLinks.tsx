import { useUser } from '@auth0/nextjs-auth0'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { navLinksClass } from '../../styles/header'

interface NavLinksProps {
    links: Array<NavLink>
    listStyle: string
}

type NavLink = {
    href: Array<string>
    text: string
}

const NavLinks = ({ links, listStyle }: NavLinksProps) => {
    const router = useRouter()

    return (
        <ul className={listStyle}>
            {links.map((link, idx) => {
                /** Warns about passing a prop to href.
                 * Might need to undo functional approach here an manually enumerate each link.
                 * */
                return (
                    <li key={idx} className={navLinksClass.li}>
                        <Link href={link.href[0]} passHref>
                            <a
                                data-text={link.text}
                                className={
                                    'buttonText ' +
                                    (link.href.includes(
                                        router.asPath.split('?')[0]
                                    )
                                        ? 'text-primary font-bold underline underline-offset-8'
                                        : 'text-neutral-700 dark:text-neutralDark-150')
                                }
                            >
                                {link.text}
                            </a>
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}

export default NavLinks
