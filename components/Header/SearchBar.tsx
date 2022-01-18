import React from 'react'
import SearchBarButton from './SearchBarButton';

interface SearchBarProps {
    placeholder: string
}

const SearchBar = ({ placeholder }: SearchBarProps) => {
    return (
        <form className="flex justify-center">
            <div className="flex w-full items-center space-x-3">
                <div 
                className="border-solid border-2 border-neutral-50 lg:w-128 focus-within:border-primary
                focus-visible:border-primary hover:border-neutral-150 
                active:border-neutral-300 invalid:border-alert rounded-full py-3 px-5">
                    <input 
                    className="focus:outline-none border-none bg-transparent" 
                    type="text" placeholder={placeholder}/>
                </div>
                <SearchBarButton type="submit"/>
            </div>
            
        </form>
    )
}

export default SearchBar
