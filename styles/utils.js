export const modal = {
    overlay: 'fixed inset-0 bg-neutralDark-300/75',
    wrapper:
        'flex overflow-y-auto fixed inset-0 z-10 justify-center items-center',
    container: 'flex justify-center text-center w-fit px-4 md:px-0',
    center: 'inline-block align-middle',
    content:
        'overflow-hidden justify-center items-center p-6 my-8 max-w-6xl text-left' +
        ' bg-white dark:bg-neutralDark-500 rounded-2xl shadow-xl transition-all',
}

export const sidebarWidget = {
    container:
        'flex flex-col self-end mt-xl ml-xxl mr-md rounded-md  ' +
        'bg-white dark:bg-neutralDark-500 shadow-sm shadow-black/20 dark:shadow-black/60 ',
    title: 'ml-md mt-lg text-md font-bold text-neutral-700 dark:text-neutralDark-150',
}
export const avatarStyle =
    'mr-sm ring-1 ring-black/25 dark:ring-neutralDark-50/25 object-cover text-center text-transparent rounded-full'

export const CollapseStyle = 'ease-in-out overflow-hidden'

export const cardMediaStyle =
    'block object-cover w-full max-w-full h-auto align-middle bg-center bg-no-repeat bg-cover'
