export const NotificationDropdownStyles = {
    button: 'inline-block relative mx-2 align-middle bg-neutral-50 dark:bg-neutralDark-50 rounded-full cursor-pointer w-10 h-10 md:w-12 md:h-12 ',
    bellIcon: 'my-2 mx-auto rotate-[25deg] fill-primary ',
    dot: 'inline-flex absolute top-2 right-1 md:right-1.5 w-2 h-2 bg-error dark:bg-errorDark rounded-full translate-x-1/2 -translate-y-1/2 ',
}

export const BadgeButtonStyles = {
    body: 'inline-block relative cursor-pointer ',
    button: 'box-border relative inline-block justify-center items-center rounded-lg p-2 border-[1px] border-neutral-150 ',
    badge: 'inline-flex absolute top-0 right-0 justify-center items-center w-4 h-4 text-xs not-italic font-semibold tracking-normal text-primary bg-tertiary rounded-full translate-x-1/2 -translate-y-1/2 ',
}

export const NotificationBlockStyles = {
    body: 'flex flex-col justify-start py-1.5 px-2 rounded-lg w-full ',
    username: 'text-primary dark:text-primaryDark mr-2.5 ',
    innerBody: 'flex items-center mt-2 ',
}

export const NotificationMenuStyles = {
    body:
        'flex flex-col px-3 pt-6 pb-1 mt-2 mr-sm max-h-96 ' +
        'bg-white dark:bg-neutralDark-500 rounded-2xl focus:outline-none drop-shadow',
    header: 'flex gap-x-xl items-center',
    main:
        'flex flex-col my-5 space-y-2 overflow-y-auto pr-3 snap-proximity ' +
        'scrollbar scrollbar-sm scrollbar-rounded scrollbar-thumb-tertiary ' +
        'scrollbar-track-neutral-50 dark:scrollbar-thumb-primaryDark dark:scrollbar-track-neutralDark-300',
    footer: 'flex items-end py-3',
    toggleOld:
        'inline-flex items-center ml-sm gap-x-md text-xs text-black dark:text-neutralDark-50 md:text-base',
    checkbox:
        'form-check-input appearance-none h-3 w-3 ring-2 ring-neutral-300 ring-offset-2 ' +
        'rounded-sm bg-white checked:bg-primary checked:ring-primary focus:outline-none ' +
        'transition duration-200 bg-no-repeat bg-center bg-contain cursor-pointer',
}
