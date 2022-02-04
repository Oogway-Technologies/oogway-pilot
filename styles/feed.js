// Styling for Feed components

// Placeholder avatar url
export const avatarURL =
  "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";

// Feed API
export const feedApiClass = {
  divOuter:
    "flex-grow h-screen pb-44 pt-6 mx-4 xl:mr-40 overflow-y-auto scrollbar-hide",
  divInner: "space-y-4 mx-auto max-w-md md:max-w-lg lg:max-w-2xl",
};

// Feed toolbar
export const feedToolbarClass = {
  div: "grid grid-cols-2",
  leftDiv: "flex items-center justify-self-start md:mr-auto",
  rightDiv: "flex items-center justify-self-end md:ml-auto",
  leftTabButtons:
    "rounded-[20px] p-sm md:px-md md:space-x-2 border-2 border-solid border-transparent\
    text-neutral-700 dark:text-neutralDark-150 \
    hover:font-bold active:font-bold dark:hover:font-bold dark:active:font-bold \
    hover:bg-neutral-50 dark:hover:bg-neutralDark-300 active:bg-primary/20 dark:active:bg-primaryDark/20\
    hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-primary dark:active:text-primaryDark",
  newPostButton:
    "rounded-[20px] p-sm md:px-md md:space-x-2 \
    bg-primary dark:bg-primaryDark hover:bg-primaryActive \
    active:bg-primaryActive dark:hover:bg-primaryActive \
    dark:active:bg-primaryActive text-white font-bold",
};

// Posts API
export const postApiClass = {
  div: "flex flex-col space-y-md",
};

// PostCard
export const postCardClass = {
  card: "flex flex-col px-md pt-md pb-sm rounded-md shadow-sm shadow-black/20 dark:shadow-black/60 \
        dark:bg-neutralDark-500",
  // Header
  header:
    "overflow-visible relative flex text-sm text-neutral-700 dark:text-neutralDark-150 \
      space-x-1 items-center",
  avatar:
    "h-[45px] w-[45px] mr-sm ring-1 ring-black/25 dark:ring-neutralDark-50/25\
    hover:opacity-80 hover:scale-125",
  infoDiv: "flex flex-col",
  headerLeft: "flex w-11/12 items-center",
  headerRight: "flex w-1/12 justify-end",
  commentsP: "inline-flex items-center",
  commentsSpan: "hidden md:flex md:ml-1",
  commentsIconSpan: "flex ml-1 md:hidden",
  categoryP: "font-bold text-primary",
  leftMobileRowOne: "inline-flex items-center",
  leftMobileRowTwo: "inline-flex items-center ml-sm md:ml  text-xs md:text-sm",
  // Body
  body: "flex flex-col ml-xl",
  bodyQuestion:
    "font-bold mb-[8px] text-md text-neutral-800 dark:text-neutralDark-50",
  bodyDescription: "text-neutral-700 dark:text-neutralDark-150 text-sm",
  // Media
  voteDiv: "flex px-2 space-x-md",
  voteContainer: "flex flex-col w-full items-center",
  imageVote: "flex rounded-[8px]  object-contain cursor-pointer",
  textVote:
    "flex rounded-[8px] border border-solid border-primary p-xl \
        text-sm text-primary dark:text-primaryDark",
  voteButton:
    "p-sm justify-center text-neutral-700 dark:text-neutralDark-150 \
        hover:text-primary dark:hover:text-primary active:text-primary dark:active:text-primary \
        focus:text-primary dark:focus:text-primary text-sm",
  voteCounter: "text-sm text-neutral-700 dark:text-neutralDark-150",
  // Engagement
  engagementBar: "flex px-md mt-[36px] pb-md ml-xl w-3/5 space-x-md text-sm",
  engagementButton:
    "items-center space-x-2 text-neutral-700 dark:text-neutralDark-150 \
        hover:text-neutral-800 dark:hover:text-neutralDark-50 focus:text-neutral-800 dark:focus:text-neutralDark-50 \
        active:text-primary",
};

export const postOptionsDropdownClass = {
  // Dropdown menu
  menuButtonClass:
    "inline-flex top-sm right-sm text-neutral-700 cursor-pointer",
  menuItemsClass:
    "fixed right-0 w-auto h-auto mt-2 p-2 origin-top-left \
            bg-white dark:bg-neutralDark-500 rounded-md shadow-lg \
            ring-2 ring-primary dark:ring-white ring-opacity-50 focus:outline-none before:font-bold",
  buttonAddStyle:
    "items-center space-x-2 px-sm text-neutral-700 dark:text-neutralDark-150 \
            hover:font-bold active:font-bold dark:hover:font-bold dark:active:font-bold \
            hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-primary dark:active:text-primaryDark",
  // Delete post confirmation modal
  modalDiv: "flex-col bg-white dark:bg-neutralDark-500",
  modalTitle:
    "flex px-2 py-md text-lg font-bold  text-neutral-800 dark:text-neutralDark-50",
  modalCancelButton:
    "rounded-[20px] p-sm w-full justify-center bg-neutral-150 hover:bg-neutral-300\
        text-neutral-700 text-sm font-bold",
  modalConfirmButton:
    "rounded-[20px] p-sm w-full space-x-2 justify-center bg-alert dark:bg-alertDark\
        hover:bg-error active:bg-error dark:hover:bg-errorDark \
        dark:active:bg-errorDark text-white dark:text-white font-bold",
};

export const postFormClass = {
  modalDiv: "flex-col bg-white dark:bg-neutralDark-500",
  dialogTitle:
    "flex px-2 py-md text-lg font-bold  text-neutral-800 dark:text-neutralDark-50",
  // Form
  form: "flex flex-col p-sm space-y-3 lg:w-136",
  formQuestion:
    "border-solid border-[1px] border-neutral-300 \
        focus-within:border-primary focus-visible:border-primary active:border-neutral-300\
       rounded-[8px]",
  formQuestionInput:
    "h-12 bg-transparent w-full max-w-full px-5 focus:outline-none text-sm",
  formDescription:
    "border-solid border-[1px] border-neutral-300 \
        focus-within:border-primary focus-visible:border-primary active:border-neutral-300\
        alert:border-alert rounded-[8px]",
  formDescriptionInput:
    "resize-none w-full h-28 bg-transparent flex-grow py-2 px-5\
        focus:outline-none text-sm",
  uploadBar: "inline-flex w-full space-x-3 px-2 pt-md pb-xl",
  formCompareText:
    "border-solid border-[1px] border-neutral-300 w-36 lg:w-96 xl:w-96 \
        focus-within:border-primary focus-visible:border-primary active:border-neutral-300\
        alert:border-alert rounded-[8px]",
  formAlert: "inline-flex items-center text-sm text-alert dark:text-alert",
  imageComparisonDiv: "flex place-content-between pb-md",
  imageSelectedText:
    "inline-flex items-center px-md text-neutral-700 dark:text-neutralDark-150",
  orText: "inline-flex items-center px-md",
  imageSelectedSpan: "italic ml-2",
  cancelSubmitDiv: "inline-flex w-full space-x-3 px-2",
  // Media
  previewDiv: "inline-flex px-2 space-x-md",
  imagePreview: "flex flex-col items-center",
  image: "flex rounded-[8px] h-20  object-contain",
  // Button styles
  cancelButton:
    "rounded-[20px] p-sm w-full justify-center bg-neutral-150 hover:bg-neutral-300\
        text-neutral-700 text-sm font-bold",
  PostButton:
    "rounded-[20px] p-sm w-full space-x-2 justify-center bg-primary dark:bg-primaryDark\
        hover:bg-primaryActive active:bg-primaryActive dark:hover:bg-primaryActive \
        dark:active:bg-primaryActive text-white font-bold",
  imageButton:
    "inline-flex p-sm rounded-[20px] text-neutral-700 dark:text-neutralDark-150 \
        hover:font-bold active:font-bold dark:hover:font-bold dark:active:font-bold \
        hover:bg-neutral-50 dark:hover:bg-neutralDark-300 active:bg-primary/20 dark:active:bg-primaryDark/20\
        hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-primary dark:active:text-primaryDark",
  removeImageButton:
    "flex my-md cursor-pointer text-neutral-700 hover:text-error",
  compareUpload:
    "inline-block items-center text-primary dark:text-primaryDark text-sm",
};

// Comments
export const commentsPageClass = {
  outerDiv: "flex w-full justify-center",
  innerDiv:
    "flex-grow h-screen pb-44 pt-6 mx-4 xl:mr-40 overflow-y-auto scrollbar-hide",
  contentDiv: "space-y-4 mx-auto max-w-md md:max-w-lg lg:max-w-2xl",
  goBackButton:
    "rounded-[20px] p-sm space-x-sm text-primary dark:text-primaryDark bg-transparent dark:bg-transparent \
    hover:text-white dark:hover:text-white hover:bg-primary dark:hover:bg-primaryDark",
};

export const commentsApiClass = {
  outerDiv: "mb-md ml-xl",
  hr: "mt-sm mb-lg text-neutralDark-50",
  innerDiv: "flex flex-row mb-xl",
  avatar:
    "h-[45px] w-[45px] mr-md ring-1 ring-black/25 dark:ring-neutralDark-50/25\
    hover:opacity-80 hover:scale-125",
  counter: "mb-sm font-bold text-neutral-700 dark:text-neutralDark-150",
};

export const commentFormClass = {
  form: "flex flex-col",
  body: "inline-flex items-center space-x-md",
  commentBar:
    "grid grid-cols-2 rounded-full items-center py-1 px-2 md:px-5 lg:w-96 xl:w-96 \
    border-solid border-2 border-neutral-50 dark:border-neutralDark-150 \
    focus-within:border-primary focus-visible:border-primary \
    dark:focus-within:border-primary dark:focus-visible:border-primary \
    active:border-neutral-300 dark:active:border-neutralDark-50 \
    hover:border-neutral-150 dark:hover:border-neutralDark-50",
  commentInput:
    "justify-self-start focus:outline-none border-none bg-transparent text-black dark:text-white \
    text-sm md:text-base",
  imageButton:
    "p-sm rounded-[20px] justify-self-end text-neutral-700 dark:text-neutralDark-150 \
    hover:font-bold active:font-bold dark:hover:font-bold dark:active:font-bold \
    hover:bg-neutral-50 dark:hover:bg-neutralDark-300 active:bg-primary/20 dark:active:bg-primaryDark/20\
    hover:text-neutral-700 dark:hover:text-neutralDark-150 active:text-primary dark:active:text-primaryDark",
  submitButton:
    "rounded-[20px] p-sm md:px-md md:space-x-2 \
  bg-primary dark:bg-primaryDark hover:bg-primaryActive \
  active:bg-primaryActive dark:hover:bg-primaryActive \
  dark:active:bg-primaryActive text-white font-bold",
  formAlert:
    "inline-flex pt-sm ml-sm items-center text-sm text-alert dark:text-alert",
  previewDiv: "inline-flex px-2 pt-sm space-x-md",
  imagePreview: "flex flex-col items-center",
  image: "flex rounded-[8px] h-20  object-contain",
  removeImageButton:
    "flex my-md cursor-pointer text-neutral-700 hover:text-error",
};

export const commentClass = {
  outerDiv: "flex flex-col pt-md pb-sm dark:bg-neutralDark-500",
  body: "flex flex-col ml-xl mt-sm",
  bodyDescription:
    "ml-md px-sm text-neutral-700 dark:text-neutralDark-150 text-sm",
  media: "flex ml-xl p-md",
  replyDropdown: "inline-flex items-center ml-[44px] mt-sm",
};

export const commentEngagementBarClass = {
  engagementBar: "flex px-md mt-md pb-md ml-xl w-3/5 space-x-md text-sm",
  engagementButton:
    "inline-flex items-center space-x-2 text-neutral-700 dark:text-neutralDark-150 \
        hover:text-neutral-800 dark:hover:text-neutralDark-50 focus:text-neutral-800 dark:focus:text-neutralDark-50 \
        active:text-primary",
};

// Replies
export const repliesApiClass = {
  outerDiv: "mb-md ml-xl mt-md",
  loading:
    "flex flex-row justify-center space-x-sm text-xs text-neutral700 dark:text-neutralDark-150 items-center",
  loader: "bg-primary dark:bg-primaryDark",
};

export const replyClass = {
  outerDiv: "px-md dark:bg-neutralDark-500",
  innerDiv: "flex flex-row",
  dividerLeft:
    "ml-[14px] border-r-2 border-primary/25 dark:border-primaryDark/50",
  dividerRight: "grow",
  body: "flex flex-col mt-sm",
  bodyDescription:
    "ml-md pl-md pr-sm text-neutral-700 dark:text-neutralDark-150 text-sm",
};

export const replyFormClass = {
  form: "flex flex-col",
  body: "inline-flex items-center space-x-md",
  avatar:
    "h-[45px] w-[45px] ring-1 ring-black/25 dark:ring-neutralDark-50/25\
    hover:opacity-80 hover:scale-125",
  replyBar:
    "rounded-full items-center py-1 px-2 md:px-5 lg:w-80 \
      border-solid border-2 border-neutral-50 dark:border-neutralDark-150 \
      focus-within:border-primary focus-visible:border-primary \
      dark:focus-within:border-primary dark:focus-visible:border-primary \
      active:border-neutral-300 dark:active:border-neutralDark-50 \
      hover:border-neutral-150 dark:hover:border-neutralDark-50",
  replyInput:
    "w-full focus:outline-none border-none bg-transparent text-black dark:text-white \
      text-sm",
  submitButton:
    "rounded-[20px] p-sm md:px-md md:space-x-2 \
        bg-primary dark:bg-primaryDark hover:bg-primaryActive \
        active:bg-primaryActive dark:hover:bg-primaryActive \
        dark:active:bg-primaryActive text-white font-bold",
  formAlert:
    "inline-flex pt-sm ml-xxl items-center text-sm text-alert dark:text-alert",
};

export const replyHeaderClass = {
  avatar:
    "h-[30px] w-[30px] mr-sm ring-1 ring-black/25 dark:ring-neutralDark-50/25\
    hover:opacity-80 hover:scale-125",
};

export const replyEngagementBarClass = {
  engagementBar: "flex px-md mt-md pb-md ml-md w-3/5 space-x-md text-sm",
};
