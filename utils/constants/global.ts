export const warningTime = 3000 // set warning to flash for 3 sec

export const shortLimit = 300 // limit for short text
export const longLimit = 40000 // limit for paragraphs
export const truncateLength = 10

export const anonymousUserName = 'Anonymous' // Author's display name for anon posts
export const authorLabel = '(Author)' // Label displayed next to username in post-activities

export const adviceBotId = process.env.ADVICEBOT_ID as string // Used for fetching advice bot
export const demoAccountIdDev = process.env.DEMO_ACCOUNT_ID_DEV as string
export const demoAccountIdProd = process.env.DEMO_ACCOUNT_ID_PROD as string
