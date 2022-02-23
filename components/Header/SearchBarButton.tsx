import React from 'react'
import { Search } from 'react-feather'
//@ts-ignore
import { UilExchange } from '@iconscout/react-unicons'
import needsHook from '../../hooks/needsHook'
import { searchBarButtonClass } from '../../styles/header'

interface SearchBarButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    type: 'submit' | 'reset' | 'button' | undefined
}

const SearchBarButton = ({ type }: SearchBarButtonProps) => {
    return (
        <button
            type={type}
            className={searchBarButtonClass.button}
            onClick={needsHook}
        >
            <span className={searchBarButtonClass.magnifyingGlassSpan}>
                <Search className={searchBarButtonClass.magnifyingGlass} />
            </span>
            <span className={searchBarButtonClass.switchSpan}>
                <UilExchange
                    className={searchBarButtonClass.switch}
                    color="currentColor"
                />
            </span>
        </button>
    )
}

SearchBarButton.defaultProps = {
    type: 'button',
}

export default SearchBarButton
