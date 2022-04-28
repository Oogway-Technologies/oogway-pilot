import { FC } from 'react'
// import { useFormContext } from 'react-hook-form'

// import { warningTime } from '../../utils/constants/global'

interface DecisionSideBarProps {
    className?: string
    selectedTab: number
    setSelectedTab: (v: number) => void
}

export const DecisionSideBarOptions: { title: string; tab: number }[] = [
    { title: 'Decision', tab: 1 },
    { title: 'Options', tab: 2 },
    { title: 'Criteria', tab: 3 },
    { title: 'Rating', tab: 4 },
    { title: 'Result', tab: 5 },
]

export const DecisionSideBar: FC<DecisionSideBarProps> = ({
    className,
    selectedTab,
    setSelectedTab,
}: DecisionSideBarProps) => {
    // const {
    //     trigger,
    //     clearErrors,
    //     formState: { errors },
    //     getValues,
    // } = useFormContext()

    // const validationHandler = async (tab: number) => {
    //     await trigger()
    //     console.log('errors: ', errors)
    //     console.log('Values: ', getValues())

    //     if (
    //         errors &&
    //         Object.keys(errors).length === 0 &&
    //         Object.getPrototypeOf(errors) === Object.prototype
    //     ) {
    //         return true
    //     } else {
    //         setTimeout(() => clearErrors(), warningTime)
    //         return false
    //     }
    // }

    // const onSelectItem = async (tab: number) => {
    //     const isValid = await validationHandler(tab)
    //     if (isValid) {
    //         setSelectedTab(tab)
    //     }
    // }

    return (
        <div
            className={`flex flex-col space-y-2 w-3/4 h-full ${
                className ? className : ''
            }`}
        >
            {DecisionSideBarOptions.map(item => (
                <div
                    key={item.tab}
                    style={{
                        background:
                            selectedTab === item.tab ? '#7269FF' : '#8E87FF',
                        borderTopRightRadius: '8px',
                        borderBottomRightRadius: '8px',
                    }}
                    className={`flex items-center py-3 px-3 transition-all cursor-pointer ${
                        selectedTab === item.tab ? 'w-4/5' : 'w-3/5'
                    }`}
                    // onClick={() => onSelectItem(item.tab)}
                >
                    <span
                        className={`text-base text-white transition-all truncate ${
                            selectedTab === item.tab
                                ? 'font-bold'
                                : 'font-normal'
                        }`}
                    >
                        {item.title}
                    </span>
                </div>
            ))}
        </div>
    )
}
