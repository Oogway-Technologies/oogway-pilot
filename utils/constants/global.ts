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
export const matrixToken = decryptAES(service.oogway_ai).ai_matrix_token
export const aiMatrixURL = decryptAES(service.oogway_ai).ai_matrix_url

/**
 * API Calls
 */
export const oogwayDecisionFTVersion = 'v1'
export const bingTopN = 5 // number of results to display from bing API in Oogway Bot comments
export const decisionTitle = [
    'Your decision/Your result',
    'Your decision',
    'Your options',
    'Your criteria',
    'Your ratings',
    '',
]

export const decisionInfo = [
    'Define your decision and add more information about it (this will help our AI understand your decision, and provide suggestions for options and criteria in the next steps)',
    'Define your decision and add more information about it (this will help our AI understand your decision, and provide suggestions for options and criteria in the next steps)',
    'Add your decision options, pick from the AI Suggestions or do both! Up to 5 options can be added.',
    'Add the things you want to consider about your decision, pick from the AI Suggestions, or both! Then pick how important each of these are to you, in regard to your decision.',
    'To help provide you with the winning option for your decision, give each criteria a rating between 1 to 5. \nClick the Ask AI button if you don’t have enough information on each criteria. It will give you all the information so you can confidently rate it.',
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
export const rehydrateDecisionForm = false

/**
 * Decision Page
 */
export const decisionSideBarOptions: TabItem[] = [
    { title: 'Decision', tab: 1 },
    { title: 'Options', tab: 2 },
    { title: 'Criteria', tab: 3 },
    { title: 'Rating', tab: 4 },
    { title: 'Result', tab: 5 },
]

export const criteriaTabs: Tab[] = [
    { name: 'Somewhat', weight: 1 },
    { name: 'Moderately', weight: 2 },
    { name: 'Super', weight: 3 },
    { name: 'Super Duper', weight: 4 },
]
