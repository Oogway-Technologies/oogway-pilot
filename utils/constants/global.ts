import service from '../../env/serviceAccount.enc'
import decryptAES from '../helpers/decryptAES'

/**
import decryptAES from '../helpers/decryptAES';
 * Feed
 */
export const defaultProfileImage =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'

export const warningTime = 3000 // set warning to flash for 3 sec
export const shortLimit = 300 // limit for short text
export const longLimit = 40000 // limit for paragraphs
export const truncateLength = 10
export const anonymousUserName = 'Anonymous' // Author's display name for anon posts
export const authorLabel = '(Author)' // Label displayed next to username in post-activities

/**
 * Environment variables
 */
export const bingVars = decryptAES(service.bing)
export const oogwayVars = decryptAES(service.oogway_ai)
export const upstashVars = decryptAES(service.upstash)
export const demoAccountVars = decryptAES(service.demo_account)

/**
 * API Calls
 */
export const oogwayDecisionFTVersion = 'v1'
export const bingTopN = 5 // number of results to display from bing API in Oogway Bot comments
export const decisionTitle = [
    '',
    'What decision do you need help with?',
    'What are your options?',
    'What do you want to consider about your decision?',
    '',
    'Your best option is',
]
export const decisionInfoParagraph = [
    'Oogway helps you when making a decision. All you have to do is put in your decision, and let Oogway help you come up with the best answer.',
    'Oogway reads through different web sources , and combines all the information together to give you the best answer.',
]

/**
 * Caching
 */

export const criteriaInfoCacheDays = 21
