import React from 'react'

export const TableLoader = () => {
    return (
        <table
            className="mt-3 w-full table-auto"
            style={{
                borderCollapse: 'separate',
                borderSpacing: '0px 1rem',
            }}
        >
            <thead className="flex items-center w-full">
                <td className={'flex mr-4 w-1/4'}>
                    <span
                        className={
                            'flex flex-col items-start py-1.5 px-2 text-sm tracking-normal leading-6 text-primary dark:text-primaryDark md:text-base'
                        }
                    />
                </td>
                <td className={'flex items-center space-x-3 w-3/4'}>
                    <span
                        className={
                            'py-1 px-2 w-full h-14 text-white bg-neutral-700 rounded-lg animate-pulse'
                        }
                    />
                </td>
            </thead>
            <tbody className="flex flex-col">
                {Array(4)
                    .fill(0)
                    .map((_, idx) => (
                        <tr
                            className="flex items-center my-2 w-full h-14"
                            key={`key-loading-${idx + _}`}
                        >
                            <td className="flex flex-col items-start py-1.5 px-2 mr-4 w-1/4 h-14 text-primary dark:text-primaryDark truncate bg-primary/20 rounded-lg animate-pulse" />
                            <td
                                className={
                                    'flex justify-center items-center w-3/4 h-full text-neutral-700 dark:text-white bg-neutral-50 dark:bg-neutralDark-300 rounded-lg animate-pulse'
                                }
                            />
                        </tr>
                    ))}
            </tbody>
        </table>
    )
}
