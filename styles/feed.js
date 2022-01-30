// Styling for Feed components

// Placeholder avatar url
export const avatarURL =
  "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";

// Feed API
export const feedApiClass = {
  divOuter: "flex-grow h-screen pb-44 pt-6 mx-4 xl:mr-40 overflow-y-auto",
  divInner: "space-y-4 mx-auto max-w-md md:max-w-lg lg:max-w-2xl",
};

// PostCard
export const postCardClass = {
  card: "flex flex-col px-md pt-md pb-sm rounded-md shadow-sm shadow-black/20 dark:shadow-black/60 \
        dark:bg-neutralDark-500",
  // Header
  header:
    "overflow-visible relative flex text-sm text-neutral-700 dark:text-neutralDark-150 \
      space-x-1 items-center",
  headerLeft: "flex w-11/12 items-center",
  headerRight: "flex w-1/12 justify-end",
  leftMobileRowOne: "inline-flex items-center",
  leftMobileRowTwo: "inline-flex items-center pl-sm sm:pl-0 text-xs md:text-sm",
  // Body
  body: "flex flex-col ml-xl",
  bodyQuestion:
    "font-bold mb-[8px] text-md text-neutral-800 dark:text-neutralDark-50",
  bodyDescription: "text-neutral-700 dark:text-neutralDark-150 text-sm",
  // Media
  voteDiv: "flex px-2 space-x-md",
  voteContainer: "flex flex-col w-full items-center",
  imageVote: "flex rounded-[8px]  object-contain",
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
    "inline-flex items-center space-x-2 text-neutral-700 dark:text-neutralDark-150 \
        hover:text-neutral-800 dark:hover:text-neutralDark-50 focus:text-neutral-800 dark:focus:text-neutralDark-50 \
        active:text-primary",
};

export const postOptionsDropdownStyles = {
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
