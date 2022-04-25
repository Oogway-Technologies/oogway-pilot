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
            criteria: [[{ name: '', weight: 1, rating: [5] }]],
        },
    })

    return (
        <div
            className={`flex flex-col pt-5 w-full ${
                className ? className : ''
            }`}
        >
            <h3 className="text-2xl font-bold text-neutral-700 dark:text-neutralDark-150">
                {title}
            </h3>
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit((state: any) => {
                        console.log(state)
                        // Pass state to react query mutator for API endpoint
                    })}
                    className="flex overflow-auto flex-col justify-center items-center mt-5 space-y-8 h-full"
                >
                    {children}
                </form>
            </FormProvider>
        </div>
    )
}
