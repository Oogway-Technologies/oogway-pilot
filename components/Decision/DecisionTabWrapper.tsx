import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

interface DecisionTabWrapperProps {
    className?: string
    title: string
    children: JSX.Element
}

export const DecisionTabWrapper: FC<DecisionTabWrapperProps> = ({
    className,
    title,
    children,
}: DecisionTabWrapperProps) => {
    const methods = useForm({
        defaultValues: {
            question: '',
            context: '',
            option: [{ name: '' }],
            cost: [[{ value: '' }]],
        },
    })

    return (
        <div
            className={`flex flex-col pt-5 w-full ${
                className ? className : ''
            }`}
        >
            <h3 className="text-2xl font-bold text-neutral-700">{title}</h3>
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit((state: any) => {
                        console.log(state)
                    })}
                    className="flex overflow-auto flex-col justify-center items-center mt-5 space-y-xl h-full"
                >
                    {children}
                </form>
            </FormProvider>
        </div>
    )
}
