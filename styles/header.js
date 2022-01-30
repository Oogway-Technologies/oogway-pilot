// Styling for header components
export const headerClass = {
  div: "shadow-sm shadow-black/10 dark:shadow-white/20",
  toolbar:
    "grid grid-cols-2 md:grid-cols-3 gap-y-2 grid-flow-row-dense w-full \
          py-5 px-3 justify-items-stretch items-center bg-white \
          dark:bg-neutralDark-500",
  logo: "flex items-center justify-self-start cursor-pointer md:mr-auto \
          text-black dark:text-neutralDark-50",
  search:
    "flex items-center justify-center col-span-2 md:col-span-1 \
          md:justify-items-start",
  user: "flex space-x-2 items-center justify-self-end whitespace-nowrap \
          px-1 md:ml-auto text-neutral-700 dark:text-neutralDark-150",
  slug: "flex w-full items-center justify-center bg-white \
          dark:bg-neutralDark-500 px-3",
  slugList: "inline-flex",
};

export const searchBarClass = {
  form: "flex justify-center",
  formBody: "flex items-center gap-x-1",
  inputBar:
    "rounded-full py-1 px-2 md:py-3 md:px-5 lg:w-96 xl:w-128 \
          border-solid border-2 border-neutral-50 dark:border-neutralDark-150 \
          focus-within:border-primary focus-visible:border-primary \
          dark:focus-within:border-primary dark:focus-visible:border-primary \
          active:border-neutral-300 dark:active:border-neutralDark-50 \
          hover:border-neutral-150 dark:hover:border-neutralDark-50",
  inputField:
    "focus:outline-none border-none bg-transparent text-sm md:text-base",
};

export const searchBarButtonClass = {
  button:
    "relative items-center inline-flex cursor-pointer \
          align-text-middle h-[23px] w-[47px] md:h-[38px] md:w-[74px] rounded-full \
          bg-neutral-50 dark:bg-neutralDark-300 group",
  magnifyingGlassSpan:
    "inline-block align-text-middle translate-x-0.5 md:translate-x-1 \
          h-[20px] w-[20px] md:h-[30px] md:w-[30px] rounded-full bg-primary \
          text-white transform ring-0",
  magnifyingGlass: "my-0.5 -mx-0.5 md:my-1 md:mx-0.5 h-3.5 md:h-5",
  switchSpan:
    "inline-block align-text-middle translate-x-0.5 md:translate-x-2.5 \
          text-neutral-300 group-hover:text-neutral-700 active:text-neutral-700 \
          dark:text-neutralDark-150 dark:group-hover:text-neutralDark-50 \
          dark:active:text-neutralDark-50",
  switch: "h-3.5 md:h-5",
};

export const toggleThemeClass = {
  a: "inline-flex group-hover:text-black active:text-black \
          dark:group-hover:text-neutralDark-50 dark:active:text-neutralDark-50 \
          cursor-pointer",
};

export const settingsButtonClass = {
  a: "inline-flex group-hover:text-black active:text-black \
      dark:group-hover:text-neutralDark-50 dark:active:text-neutralDark-50",
  icon: "mx-1",
};

export const appsButtonClass = {
  a: "hover:text-black active:text-black dark:hover:text-neutralDark-50 \
          dark:active:text-neutralDark-50",
};

export const logoutButtonClass = {
  a: "inline-flex group-hover:text-black active:text-black \
          dark:group-hover:text-neutralDark-50 dark:active:text-neutralDark-50 \
          cursor-pointer",
  icon: "mx-1",
};

export const navLinksClass = {
  li: "flex w-16 justify-around",
};

export const userDropdownClass = {
  avatar: "hover:opacity-80 hover:scale-125 md:h-12 md:w-12 cursor-pointer",
  menuButtonClass: "inline-flex font-medium bg-transparent",
  menuItemsClass:
    "absolute right-6 w-48 h-auto mt-2 p-2 origin-top-right \
          bg-white dark:bg-neutralDark-500 divide-y divide-neutral-300 \
          dark:divide-neutralDark-300 rounded-md shadow-lg \
          ring-2 ring-primary dark:ring-white ring-opacity-50 \
          focus:outline-none",
};
