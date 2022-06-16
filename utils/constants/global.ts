import service from '../../env/serviceAccount.enc'
import decryptAES from '../helpers/decryptAES'
import { Tab, TabItem } from '../types/global'

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
    'Your decision',
    'Your decision',
    'Your options',
    'Your criteria',
    '',
    '',
]
export const decisionInfoParagraph = [
    'Oogway helps you when making a decision. All you have to do is put in your decision, and let Oogway help you come up with the best answer.',
    'Oogway reads through different web sources , and combines all the information together to give you the best answer.',
]

/**
 * Caching
 */

export const criteriaInfoCacheDays = 21
export const maxAllowedUnauthenticatedDecisions = 2

export const decisionSideBarOptions: TabItem[] = [
    { title: 'Decision', tab: 1 },
    { title: 'Options', tab: 2 },
    { title: 'Criteria', tab: 3 },
    { title: 'Rating', tab: 4 },
    { title: 'Result', tab: 5 },
]

export const criteriaTabs: Tab[] = [
    { name: 'Not much', weight: 1 },
    { name: 'Somewhat', weight: 2 },
    { name: 'Fairly', weight: 3 },
    { name: 'Super', weight: 4 },
]
