export const profilePage = {
    innerDiv: "flex-grow h-screen space-y-4 overflow-y-auto scrollbar-hide",
    contentDiv: "space-y-sm mx-auto mb-64 max-w-md md:max-w-lg lg:max-w-2xl",

}


export const profileCard = {
    mainDiv: 'flex items-center mx-3 my-5 md:my-9 w-full',
    userProfileName: 'mr-auto justify-self-start font-bold text-2xl',
    userDetailsDiv: 'flex flex-col space-y-2 w-full h-full  ml-4',
    profileImg: 'w-32 h-32 rounded-full self-start md:h-40 md:w-40',
    newPostButton:
        "rounded-[20px] flex items-center py-2 px-4 whitespace-no-wrap\
        bg-primary dark:bg-primaryDark hover:bg-primaryActive \
        active:bg-primaryActive dark:hover:bg-primaryActive \
        dark:active:bg-primaryActive \
        text-white font-bold text-base leading-5 not-italic tracking-normal",
    editButton:
        "text-neutral-700 dark:text-neutralDark-300 rounded-[20px] py-2 px-4 \
        font-bold text-sm leading-5 not-italic tracking-normal \
        bg-neutral-150 dark:bg-neutral-150 hover:bg-neutral-300 dark:hover:bg-neutralDark-150",
    joinedAndLocationText: 'text-neutral-700 dark:text-neutralDark-300 flex item-center \
        font-normal text-sm md:text-base leading-6 tracking-normal text-gray-600 pt-1',
    bioText: 'text-neutral-700 dark:text-neutralDark-150 font-normal text-sm md:text-base \
        leading-6 text-left not-italic tracking-normal mx-3 md:mx-0 pt-1 whitespace-pre-line',
    usernameText: 'text-primary dark:text-primaryDark',
}

export const profileEngagementBarClass = {
    engagementBar: "flex px-md mt-md pb-md ml-xl w-full space-x-md text-sm",
    engagementButton:
        "rounded-[20px] inline-flex items-center space-x-2 py-2 px-4 \
            text-neutral-700 dark:text-neutralDark-150 \
            hover:text-neutral-800 dark:hover:text-neutralDark-50 \
            focus:text-neutral-800 dark:focus:text-neutralDark-50 \
            active:text-primary dark:active:text-primary",
};
