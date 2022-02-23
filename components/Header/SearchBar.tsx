import React, { FC } from 'react'
import SearchBarButton from './SearchBarButton'
import { searchBarClass } from '../../styles/header'

interface SearchBarProps {
    placeholder: string
}

const SearchBar: FC<SearchBarProps> = ({ placeholder }) => {
    return (
        <form className={searchBarClass.form}>
            <div className={searchBarClass.formBody}>
                <div className={searchBarClass.inputBar}>
                    <input
                        className={searchBarClass.inputField}
                        type="text"
                        placeholder={placeholder}
                    />
                </div>
                <SearchBarButton type="submit" />
            </div>
        </form>
    )
}

export default SearchBar
