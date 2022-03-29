// Styling for Feed components

// Placeholder avatar url
export const avatarURL =
    'https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d'

export const loadingAvatarURL =
    'https://www.sibberhuuske.nl/wp-content/uploads/2016/10/default-avatar.png'

// Feed API
export const feedApiClass = {
    toolbarDiv: 'flex-grow z-10 ml-3 mr-1',
    feedToolbar:
        'items-center mb-sm mt-md xl:my-lg mx-auto max-w-md md:max-w-lg lg:max-w-2xl ',
    innerDiv: 'flex-grow h-screen space-y-4 overflow-y-auto scrollbar-hide',
    contentDiv: 'space-y-sm mx-auto mb-64 max-w-md md:max-w-lg lg:max-w-2xl',
    feedTitle:
        'flex gap-x-sm items-center text-xl font-bold ' +
        'text-neutral-800 dark:text-neutralDark-50',
    backbutton:
        'rounded-full p-1 ' +
        'text-primary dark:text-primaryDark bg-tertiary dark:bg-primaryDark/50 ' +
        'hover:scale-110 ',
    mobileNewPostButton:
        'absolute bottom-xl left-1/2 z-10 -translate-x-1/2 ' +
        'shadow-lg shadow-black/20 dark:shadow-black/60 ',
}

export const endOfFeedMessageClass = {
    outerDiv:
        'flex flex-col m-md align-items-center text-sm text-neutral-700 dark:text-neutralDark-150',
    topMessage: 'm-auto p-sm',
    bottomMessage: 'm-auto',
}

// Feed toolbar
export const feedToolbarClass = {
    div: 'relative grid grid-cols-2 ',
    leftDiv: 'flex items-center justify-self-start md:mr-auto ml-2',
    rightDiv: 'flex items-center justify-self-end md:ml-auto',
    leftTabButtons:
        'rounded-[20px] p-sm md:px-md md:space-x-2  ' +
        'hover:font-bold dark:hover:font-bold ' +
        'hover:bg-neutral-50 dark:hover:bg-neutralDark-300 ' +
        'hover:text-neutral-700 dark:hover:text-neutralDark-150  ',
    leftTabActive:
        'bg-primary/20 dark:bg-primaryDark/20 font-bold dark:font-bold ' +
        'text-primary dark:text-primaryDark hover:bg-primary/20 dark:hover:bg-primaryDark/20 ' +
        'hover:text-primary dark:hover:text-primaryDark ',
    leftTabInactive: 'text-neutral-700 dark:text-neutralDark-150 ',
    newPostButton:
        'rounded-[20px] py-sm px-md space-x-2 ' +
        'bg-primary dark:bg-primaryDark hover:bg-primaryActive' +
        'active:bg-primaryActive dark:hover:bg-primaryActive ' +
        'dark:active:bg-primaryActive text-white font-bold ',
    feedButton:
        'md:space-x-2 font-bold mx-sm  text-neutral-700 dark:text-neutralDark-150',
}

// Feed filter
export const feedSelectorClass = {
    dropdownButton:
        'inline-flex items-center font-bold text-neutral-700 dark:text-neutralDark-150 ' +
        'hover:cursor-pointer hover:scale-110 ',
    dropdown:
        'flex w-11/12 sm:w-auto h-auto p-2 mr-2 ' +
        'bg-white dark:bg-neutralDark-500 divide-y divide-neutral-300 ' +
        'dark:divide-neutralDark-300 rounded-md shadow-lg ' +
        'ring-2 ring-primary dark:ring-white ring-opacity-50 ' +
        'focus:outline-none',
    list: 'flex flex-col p-md space-y-sm',
    feed:
        'px-md py-0.5 text-base truncate rounded-md ' +
        'hover:bg-neutral-50 dark:hover:bg-neutralDark-300 ' +
        'hover:font-bold dark:hover:font-bold hover:cursor-pointer ',
    feedActive:
        'text-primary dark:text-primaryDark bg-tertiary dark:bg-primaryDark/50 font-bold ' +
        'hover:bg-tertiary hover:dark:bg-primaryDark/50 ',
    feedInactive: 'text-neutral-700 dark:text-neutralDark-50 ',
}

// PostCard
export const postCardClass = {
    card:
        'flex flex-col px-md pt-md pb-sm rounded-md shadow-sm shadow-black/20 dark:shadow-black/60 ' +
        'dark:bg-neutralDark-500',
    // Header
    header:
        'overflow-visible relative flex text-sm text-neutral-700 dark:text-neutralDark-150 ' +
        'space-x-1 items-center',
    infoDiv: 'flex flex-col',
    headerLeft: 'flex w-11/12 items-center',
    headerRight: 'flex w-1/12 justify-end',
    commentsP: 'inline-flex items-center',
    commentsSpan: 'hidden md:flex md:ml-1',
    commentsIconSpan: 'flex ml-1 md:hidden',
    categoryP: 'font-bold text-primary',
    leftMobileRowOne: 'inline-flex items-center',
    leftMobileRowTwo:
        'inline-flex flex-wrap items-center ml-sm md:ml text-xs md:text-sm',
    // Body
    body: 'flex flex-col ml-xl p-4',
    bodyQuestion:
        'font-bold mb-[8px] text-md text-neutral-800 dark:text-neutralDark-50',
    bodyDescription:
        'text-neutral-700 dark:text-neutralDark-150 text-sm whitespace-pre-line break-words',
    // Media
    voteDiv: 'grid grid-cols-2 gap-3 mx-3',
    voteContainer: 'flex flex-col items-center m-3 sm:m-2',
    imageVote: 'flex rounded-[8px] object-contain cursor-pointer m-auto',
    voteButtonContainer:
        'flex flex-col items-center justify-self-end mt-auto w-full p-sm',
    textVote:
        'bg-neutral-50 dark:bg-neutralDark-400 text-neutral-700 dark:text-neutralDark-150 ' +
        'rounded-sm shadow-sm shadow-black/30 dark:shadow-black/50',
    voteButton:
        'p-sm justify-center text-neutral-700 dark:text-neutralDark-150 ' +
        'hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-neutral-700 dark:active:text-neutralDark-150 ' +
        'focus:text-neutral-700 dark:focus:text-neutralDark-150 text-sm',
    voteCounter: 'text-sm text-neutral-700 dark:text-neutralDark-150 font-bold',
    // Engagement
    engagementBar:
        'flex px-md mt-[36px] pb-md ml-xl w-3/5 space-x-md text-xs sm:text-sm',
    engagementButton:
        'items-center space-x-2  ' +
        'hover:text-neutral-800 dark:hover:text-neutralDark-50  ' +
        'active:text-primary whitespace-nowrap',
}

export const postOptionsDropdownClass = {
    // Dropdown menu
    menuButtonClass:
        'inline-flex top-sm right-sm text-neutral-700 cursor-pointer',
    menuItemsClass:
        'w-auto h-auto mt-2 p-2 bg-white dark:bg-neutralDark-500 rounded-md shadow-lg ' +
        'ring-2 ring-primary dark:ring-white ring-opacity-50 focus:outline-none before:font-bold',
    buttonAddStyle:
        'items-center space-x-2 px-sm text-neutral-700 dark:text-neutralDark-150 ' +
        'hover:font-bold active:font-bold dark:hover:font-bold dark:active:font-bold ' +
        'hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-primary dark:active:text-primaryDark',
    // Delete post confirmation modal
    modalDiv: 'flex-col bg-white dark:bg-neutralDark-500',
    modalTitle:
        'flex px-2 py-md text-lg font-bold  text-neutral-800 dark:text-neutralDark-50',
    modalCancelButton:
        'rounded-[20px] p-sm w-full justify-center bg-neutral-150 hover:bg-neutral-300 ' +
        'text-neutral-700 text-sm font-bold',
    modalConfirmButton:
        'rounded-[20px] p-sm w-full space-x-2 justify-center bg-alert dark:bg-alertDark ' +
        'hover:bg-error active:bg-error dark:hover:bg-errorDark ' +
        'dark:active:bg-errorDark text-white dark:text-white font-bold',
}

export const postFormClass = {
    modalDiv: 'flex-col bg-white dark:bg-neutralDark-500 md:w-136',
    dialogTitle:
        'inline-flex w-full justify-between px-2 py-md text-lg font-bold  text-neutral-800 dark:text-neutralDark-50',
    // Form
    form: 'flex flex-col p-sm space-y-3',
    formQuestion:
        'border-solid border-[1px] border-neutral-300 ' +
        'focus-within:border-primary focus-visible:border-primary active:border-neutral-300 ' +
        'rounded-[8px]',
    formQuestionInput:
        'h-12 bg-transparent w-full max-w-full px-5 focus:outline-none text-sm',
    formDescription:
        'border-solid border-[1px] border-neutral-300 ' +
        'focus-within:border-primary focus-visible:border-primary active:border-neutral-300 ' +
        'alert:border-alert rounded-[8px]',
    formDescriptionInput:
        'resize-none w-full h-28 bg-transparent flex-grow py-2 px-5 ' +
        'focus:outline-none text-sm',
    uploadBar: 'inline-flex flex-col w-full space-y-3 px-2 pb-md',
    imageSizeAlert:
        'inline-flex items-center m-0 text-sm text-alert dark:text-alert',
    formCompareText:
        'border-solid border-[1px] border-neutral-300 w-36 lg:w-96 xl:w-96 ' +
        'focus-within:border-primary focus-visible:border-primary active:border-neutral-300 ' +
        'alert:border-alert rounded-[8px]',
    formAlert: 'inline-flex items-center text-sm text-alert dark:text-alert',
    imageComparisonDiv: 'flex place-content-between pb-md',
    imageSelectedText:
        'inline-flex items-center px-md text-neutral-700 dark:text-neutralDark-150',
    orText: 'inline-flex items-center px-md',
    imageSelectedSpan: 'italic ml-2',
    cancelSubmitDiv: 'inline-flex w-full space-x-3 px-2 pt-md',
    // feed
    fixedFeed: 'ml-md text-sm text-neutral-700 dark:text-neutralDark-150',
    feedSpan:
        'text-primary dark:text-tertiary bg-tertiary dark:bg-primaryDark/50 font-bold ' +
        'p-1 rounded-md ',
    // Media
    previewDiv: 'inline-flex px-2 space-x-md',
    imagePreview: 'flex flex-col items-center',
    image: 'flex rounded-[8px] h-20  object-contain',
    // Button styles
    cancelButton:
        'rounded-[20px] p-sm w-full justify-center bg-neutral-150 hover:bg-neutral-300 ' +
        'text-neutral-700 text-sm font-bold',
    PostButton:
        'rounded-[20px] p-sm w-full space-x-2 justify-center bg-primary dark:bg-primaryDark ' +
        'hover:bg-primaryActive active:bg-primaryActive dark:hover:bg-primaryActive ' +
        'dark:active:bg-primaryActive text-white font-bold disabled-style',
    imageButton:
        'inline-flex p-sm rounded-[20px] text-neutral-700 dark:text-neutralDark-150 ' +
        'hover:font-bold active:font-bold dark:hover:font-bold dark:active:font-bold ' +
        'hover:bg-neutral-50 dark:hover:bg-neutralDark-300 active:bg-primary/20 dark:active:bg-primaryDark/20 ' +
        'hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-primary dark:active:text-primaryDark',
    removeImageButton:
        'flex my-md cursor-pointer text-neutral-700 hover:text-error',
    compareUpload:
        'inline-block items-center text-primary dark:text-primaryDark text-sm disabled:text-neutral-700',
}

export const toggleIncognitoClass = {
    switchSlide:
        'relative inline-flex items-center h-7 rounded-full w-12 px-0.5 ' +
        'transition-colors ease-in-out duration-300',
    switchButton:
        'rounded-full inline-block w-6 h-6 transform bg-white ' +
        'transition ease-in-out duration-300',
}

export const compareFormClass = {
    container: 'flex flex-col',
    header: 'inline-flex font-bold items-center justify-between pb-md',
    cancelButton:
        'p-1 text-error rounded-full inline-flex font-bold items-center ' +
        'hover:scale-110 dark:hover:scale-110',
    tab: 'flex flex-col w-full h-fit rounded-md border border-1 border-neutralDark-150 divide-y divide-neutralDark-150',
    formContainer:
        'grid grid-cols-1 md:grid-cols-2 grid-rows-auto gap-x-sm gap-y-sm p-sm',
    // choose Type subform
    chooseTypeToolbar:
        'inline-flex p-sm space-x-sm divide-x divide-neutralDark-150',
    chooseTypeChild:
        'inline-flex items-center cursor-pointer text-xs sm:text-sm md:text-base',
    // Text only subform
    smallGreyText: 'text-sm text-neutral-700 dark:text-neutralDark-50',
    textInputDiv: 'rounded-[8px] bg-primary/25 dark:bg-primaryDark/25',
    textInput:
        'resize-none w-full h-xxl bg-transparent flex-grow py-2 px-5 ' +
        'focus:outline-none text-sm max-h-[100px] scrollbar-hide',
    caption:
        'resize-none w-full h-xl bg-transparent flex-grow py-2 px-5 ' +
        'focus:outline-none text-sm max-h-[100px] scrollbar-hide',
    previewText: 'm-auto w-full flex-grow',
    // Image only subform
    uploadButton:
        'inline-flex space-x-sm items-center text-neutral-700 dark:text-neutralDark-150 ' +
        'hover:font-bold active:font-bold dark:hover:font-bold dark:active:font-bold ' +
        'hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-primary ' +
        'dark:active:text-primaryDark',
    undoChoice:
        'flex mt-md mx-auto cursor-pointer text-neutral-700 hover:text-error',
    image: 'flex rounded-[8px] w-48 object-contain mx-auto',
}

// Comments
export const commentsPageClass = {
    outerDiv: 'flex flex-col w-full justify-center',
    toolbarDiv: 'flex-grow mx-3',
    backButtonDiv:
        'items-center my-md mx-auto max-w-md md:max-w-lg lg:max-w-2xl',
    innerDiv:
        'flex-grow h-screen pb-60 xl:mr-40 overflow-y-auto scrollbar-hide',
    contentDiv: 'mx-auto max-w-md md:max-w-lg lg:max-w-2xl',
    goBackButton:
        'rounded-[20px] p-sm space-x-sm text-primary dark:text-primaryDark bg-transparent dark:bg-transparent ' +
        'hover:text-white dark:hover:text-white hover:bg-primary dark:hover:bg-primaryDark font-semibold text-lg items-center',
}

export const commentsApiClass = {
    outerDiv: 'mb-md ml-xl',
    hr: 'mt-sm mb-lg text-neutralDark-50',
    innerDiv: 'flex flex-row mb-xl',
    loginReminder:
        'justify-center text-xs text-neutral-700 dark:text-neutralDark-150',
    counter: 'mb-sm font-bold text-neutral-700 dark:text-neutralDark-150',
}

export const commentFormClass = {
    form: 'flex flex-col',
    body: 'inline-flex items-center space-x-md w-full',
    commentBar:
        'inline-flex rounded-[10px] items-center py-2 pl-2 pr-1 md:pl-5 md:pr-3 lg:w-96 xl:w-96 ' +
        'border-solid border-2 border-neutral-50 dark:border-neutralDark-150 ' +
        'focus-within:border-primary focus-visible:border-primary ' +
        'dark:focus-within:border-primary dark:focus-visible:border-primary ' +
        'active:border-neutral-300 dark:active:border-neutralDark-50 ' +
        'hover:border-neutral-150 dark:hover:border-neutralDark-50 w-inherit',
    commentInput:
        'md:w-52 lg:w-80 justify-self-start focus:outline-none border-none bg-transparent text-black dark:text-white ' +
        'text-sm lg:text-base',
    commentTextArea:
        'p-sm resize-none justify-self-start focus:outline-none border-none bg-transparent ' +
        'text-black dark:text-white text-sm md:text-base w-inherit',
    growingTextArea:
        'w-full p-sm resize-none justify-self-start focus:outline-none border-none bg-transparent ' +
        'text-black dark:text-white text-sm md:text-base h-[24px] max-h-[100px] scrollbar-hide p-0',
    mobileSubmitDiv: 'inline-flex justify-between mt-sm',
    imageButton:
        'p-sm rounded-[20px] ml-1 justify-self-end text-neutral-700 dark:text-neutralDark-150 ' +
        'hover:font-bold active:font-bold dark:hover:font-bold dark:active:font-bold ' +
        'hover:bg-neutral-50 dark:hover:bg-neutralDark-300 active:bg-primary/20 dark:active:bg-primaryDark/20 ' +
        'hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-primary dark:active:text-primaryDark',
    submitButton:
        'rounded-[20px] p-sm md:px-md md:space-x-2 ' +
        'bg-primary dark:bg-primaryDark hover:bg-primaryActive ' +
        'active:bg-primaryActive dark:hover:bg-primaryActive ' +
        'dark:active:bg-primaryActive text-white font-bold items-center',
    imageSizeAlert:
        'inline-flex items-center m-0 text-sm text-alert dark:text-alert mt-1',
    formAlert:
        'inline-flex pt-sm ml-sm items-center text-sm text-alert dark:text-alert',
    previewDiv: 'inline-flex px-2 pt-sm space-x-md',
    imagePreview: 'flex flex-col items-center',
    image: 'flex rounded-[8px] h-20  object-contain',
    removeImageButton:
        'flex my-md cursor-pointer text-neutral-700 hover:text-error',
}

export const commentClass = {
    outerDiv: 'flex flex-col pt-md pb-sm dark:bg-neutralDark-500',
    body: 'flex flex-col ml-xl mt-sm',
    bodyDescription:
        'ml-md px-sm text-neutral-700 dark:text-neutralDark-150 text-sm break-words whitespace-pre-line',
    media: 'flex ml-xl p-md',
    replyDropdown: 'inline-flex items-center ml-[44px] mt-sm',
}

export const commentEngagementBarClass = {
    engagementBar: 'flex px-md mt-md pb-md ml-xl w-3/5 space-x-md text-sm',
    engagementButton:
        'inline-flex items-center space-x-2 ' +
        'hover:text-neutral-800 dark:hover:text-neutralDark-50 ' +
        'active:text-primary whitespace-nowrap',
}

// Replies
export const repliesApiClass = {
    outerDiv: 'mb-md ml-xl mt-md',
    loading:
        'flex flex-row justify-center space-x-sm text-xs text-neutral700 dark:text-neutralDark-150 items-center',
    loader: 'bg-primary dark:bg-primaryDark',
}

export const replyClass = {
    outerDiv: 'px-md dark:bg-neutralDark-500',
    innerDiv: 'flex flex-row',
    dividerLeft:
        'ml-[14px] border-r-2 border-primary/25 dark:border-primaryDark/50',
    dividerRight: 'w-full',
    body: 'flex flex-col mt-sm',
    bodyDescription:
        'ml-md pl-md pr-sm text-neutral-700 dark:text-neutralDark-150 text-sm break-words whitespace-pre-line',
}

export const replyFormClass = {
    form: 'flex flex-col',
    body: 'inline-flex items-center space-x-md',
    avatar:
        'h-[45px] w-[45px] ring-1 ring-black/25 dark:ring-neutralDark-50/25 ' +
        'hover:opacity-80 hover:scale-125',
    replyBar:
        'rounded-[10px] items-center py-2 px-2 md:px-5 lg:w-80 ' +
        'border-solid border-2 border-neutral-50 dark:border-neutralDark-150 ' +
        'focus-within:border-primary focus-visible:border-primary ' +
        'dark:focus-within:border-primary dark:focus-visible:border-primary ' +
        'active:border-neutral-300 dark:active:border-neutralDark-50 ' +
        'hover:border-neutral-150 dark:hover:border-neutralDark-50 w-full',
    replyInput:
        'w-full focus:outline-none border-none bg-transparent text-black dark:text-white ' +
        'text-sm',
    replyTextArea:
        'w-full p-sm flex-wrap resize-none focus:outline-none border-none bg-transparent text-black dark:text-white ' +
        'text-sm',
    growingTextArea:
        'w-full flex-wrap resize-none focus:outline-none border-none bg-transparent text-black dark:text-white ' +
        'text-sm h-[20px] max-h-[80px] scrollbar-hide p-0',
    submitButton:
        'rounded-[20px] p-sm md:px-md md:space-x-2 ' +
        'bg-primary dark:bg-primaryDark hover:bg-primaryActive ' +
        'active:bg-primaryActive dark:hover:bg-primaryActive ' +
        'dark:active:bg-primaryActive text-white font-bold',
    formAlert:
        'inline-flex pt-sm ml-xxl items-center text-sm text-alert dark:text-alert',
    formAlertMobile:
        'inline-flex pt-sm items-center text-sm text-alert dark:text-alert',
}

export const replyEngagementBarClass = {
    engagementBar: 'flex px-md mt-md pb-md ml-md w-3/5 space-x-md text-sm',
}
