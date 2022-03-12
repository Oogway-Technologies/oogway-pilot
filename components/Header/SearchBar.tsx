import React, { FC } from 'react'

import { searchBarClass } from '../../styles/header'
import SearchBarButton from './SearchBarButton'

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
