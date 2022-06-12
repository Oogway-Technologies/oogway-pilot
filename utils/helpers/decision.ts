import { Rating, Ratings } from '../types/global'

export const findInOption = (
    array: Ratings[],
    name: string
): (Ratings & { index: number }) | undefined => {
    let found = undefined
    array.forEach((item, idx) => {
        if (item.option === name) {
            found = { ...item, index: idx }
        }
    })
    return found
}
export const findInCriteria = (
    array: Rating[],
    name: string
): (Rating & { index: number }) | undefined => {
    let found = undefined
    array.forEach((item, idx) => {
        if (item.criteria === name) {
            found = { ...item, index: idx }
        }
    })
    return found
}
