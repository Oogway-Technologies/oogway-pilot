import { FC } from 'react'

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
                    className={`flex items-center py-3 px-3 text-base leading-6 text-white cursor-pointer transition-all ${
                        selectedTab === item.tab
                            ? 'font-bold w-4/6'
                            : 'font-normal w-3/6'
                    }`}
                    onClick={() => setSelectedTab(item.tab)}
                >
                    {item.title}
                </div>
            ))}
        </div>
    )
}
