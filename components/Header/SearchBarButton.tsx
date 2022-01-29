import React, { useState }  from 'react'
import { Search } from 'react-feather'
import { UilExchange } from '@iconscout/react-unicons'

interface SearchBarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    type: 'submit' | 'reset' | 'button' | undefined;
}

const SearchBarButton = ({ type }: SearchBarButtonProps) => {
    return (
        <button 
        type={type}
        className="relative items-center inline-flex cursor-pointer 
        align-text-middle h-[23px] w-[47px] md:h-[38px] md:w-[74px] rounded-full
        bg-neutral-50 dark:bg-neutralDark-300 group">
            <span 
            className="inline-block align-text-middle translate-x-0.5 md:translate-x-1 
            h-[20px] w-[20px] md:h-[30px] md:w-[30px] rounded-full bg-primary text-white transform ring-0">
                <Search className="my-0.5 -mx-0.5 md:my-1 md:mx-0.5 h-3.5 md:h-5"/>
            </span>
            <span 
            className="inline-block align-text-middle translate-x-0.5 md:translate-x-2.5 
            text-neutral-300 group-hover:text-neutral-700 active:text-neutral-700
            dark:text-neutralDark-150 dark:group-hover:text-neutralDark-50 
            dark:active:text-neutralDark-50">
                <UilExchange className="h-3.5 md:h-5" color="currentColor"/>
            </span>
        </button>
    )
}

SearchBarButton.defaultProps = {
    type: "button"
}

export default SearchBarButton
