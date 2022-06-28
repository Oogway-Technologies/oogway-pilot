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
            <thead className="flex w-full items-center">
                <th className={'mr-4 flex w-1/4'}>
                    <span
                        className={
                            'flex flex-col items-start py-1.5 px-2 leading-6 text-primary text-sm tracking-normal dark:text-primaryDark md:text-base'
                        }
                    />
                </th>
                <th className={'flex w-3/4 items-center space-x-3'}>
                    <span
                        className={
                            'h-14 w-full animate-pulse rounded-lg bg-neutral-700 py-1 px-2 text-white'
                        }
                    />
                </th>
            </thead>
            <tbody className="flex flex-col">
                {Array(4)
                    .fill(0)
                    .map((_, idx) => (
                        <tr
                            className="my-2 flex h-14 w-full items-center"
                            key={`key-loading-${idx + _}`}
                        >
                            <td className="mr-4 flex h-14 w-1/4 animate-pulse flex-col items-start truncate rounded-lg bg-primary/20 py-1.5 px-2 text-primary dark:text-primaryDark" />
                            <td
                                className={
                                    'flex h-full w-3/4 animate-pulse items-center justify-center rounded-lg bg-neutral-50 text-neutral-700 dark:bg-neutralDark-300 dark:text-white'
                                }
                            />
                        </tr>
                    ))}
            </tbody>
        </table>
    )
}
