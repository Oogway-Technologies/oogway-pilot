/* eslint-disable no-useless-escape */

import { DocumentSnapshot, FieldValue } from 'firebase/firestore'

import { jsonTimeObj, TruncateTextProps } from '../types/global'

// count number of like in snapshot
export const findLikes = (snapshot: any, setNumLikes: (n: number) => void) => {
    if (snapshot.exists()) {
        // Get the likes map
        const likesMap = snapshot?.data()?.likes
        // Count the entries that are True
        let ctr = 0
        // Count the entries that are True
        Object.values(likesMap).forEach(item => {
            if (item) {
                ctr += 1
            }
        })
        setNumLikes(ctr)
    }
}

// counter number of dislikes in snapshot
// NOTE: only works for Oogway AI bot comments, otherwise returns 0
export const findDislikes = (
    snapshot: DocumentSnapshot,
    setNumDislikes: (n: number) => void
) => {
    if (snapshot.exists()) {
        // If the comment is from Oogway AI and
        // it contains a dislike map (added to feature on 2022/04/07),
        // then count number of dislikes, otherwise default to 0
        if (typeof snapshot.data().dislikes !== 'undefined') {
            // Get the dislikes map
            const dislikesMap = snapshot.data().dislikes

            // Count the entries that are True
            let ctr = 0
            Object.values(dislikesMap).forEach(item => {
                if (item) {
                    ctr += 1
                }
            })
            setNumDislikes(ctr)
        } else {
            setNumDislikes(0)
        }
    }
}

// check whether the uploaded file is less then 10MB
export const checkFileSize = (files: FileList | null) => {
    if (files && files[0]) {
        // checking if file is less then 10MB
        // 10Mb is equal to 10485760 bytes
        if (files[0].size < 10485760) {
            return true
        }
    }
    return false
}

// To connect frontend with backend
export const fetcher = (url: string) =>
    fetch(url).then(res => {
        return res.json()
    })

// To detect a valid URL and return first URL found
export const isValidURL = (string: string | undefined) => {
    const res: Array<string> = string?.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    ) ?? ['']
    return res[0]
}

export const parseYoutubeVideoId = (videoUrl: string | undefined) => {
    const YOUTUBE_URL_REGEX =
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-z0-9_-]{11})/gi

    const validVideoUrl = videoUrl?.match(YOUTUBE_URL_REGEX)
    if (!validVideoUrl) return null

    const matches = validVideoUrl[0].match(/[a-zA-z0-9-]+$/)
    if (!matches) return null
    return matches[0]
}

export const winnerCall = (optionsArray: number[]) => {
    return optionsArray[0] > optionsArray[1]
        ? 0
        : optionsArray[0] < optionsArray[1]
        ? 1
        : -1
}

export const amazonURLAppendQueryString = (url: string) => {
    if (url && url.length > 0) {
        const urlArray = url.split(' ')
        urlArray.forEach((item, index) => {
            const res = item.match(
                /https?:\/\/(?=(?:....)?amazon|smile)(www|smile)\S+com(((?:\/(?:dp|gp)\/([A-Z0-9]+))?\S*[?&]?(?:tag=))?\S*?)(?:#)?(\w*?-\w{2})?(\S*)(#?\S*)+/g
            )
            if (res && res.length > 0) {
                if (!item.includes('tag=oogwayai0c-20')) {
                    if (!item.includes('?')) {
                        urlArray[index] = item + '?tag=oogwayai0c-20'
                    } else {
                        urlArray[index] = item + '&tag=oogwayai0c-20'
                    }
                }
            }
        })
        url = urlArray.join(' ')
    }
    return url
}

export const checkOrientation = (src: string) => {
    const postImg = new Image()
    postImg.src = src
    // TODO: add styles for items
    if (postImg.naturalWidth > postImg.naturalHeight) {
        // landscape
        return ''
    } else if (postImg.naturalWidth < postImg.naturalHeight) {
        // portrait
        return ''
    } else {
        // even
        return ''
    }
}

export const truncateText = ({
    input,
    maxLength,
    bufferLength = 0,
}: TruncateTextProps) => {
    return input.substring(0, maxLength - bufferLength)
}

const compareObjects = (obj1: any, obj2: any): boolean => {
    return JSON.stringify(obj1) == JSON.stringify(obj2) ? true : false
}

export const objectsEqual = (o1: any[], o2: any[]): boolean => {
    if (o1.length !== o2.length) {
        return false
    }
    let check = true
    for (let i = 0; i < o1.length; i++) {
        if (!compareObjects(o1[i], o2[i])) {
            check = false
        }
    }
    return check
}

export const deepCopy = (item: any): any => JSON.parse(JSON.stringify(item))

export function titleCase(str: string) {
    return str
        .toLowerCase()
        .split(' ')
        .map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .join(' ')
}

/**
 * Simple 53-bit hash
 *
 * Note:
 * https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
 *
 * roughly similar to the well-known MurmurHash/xxHash algorithms. It uses a combination
 * of multiplication and Xorshift to generate the hash, but not as thorough. As a result
 * it's faster than either would be in JavaScript and significantly simpler to implement,
 * but may not pass all tests in SMHasher. This is not a cryptographic hash function, so
 * don't use this for security purposes.
 */

export const cyrb53 = (str: string, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed
    let h2 = 0x41c6ce57 ^ seed
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i)
        h1 = Math.imul(h1 ^ ch, 2654435761)
        h2 = Math.imul(h2 ^ ch, 1597334677)
    }
    h1 =
        Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
        Math.imul(h2 ^ (h2 >>> 13), 3266489909)
    h2 =
        Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
        Math.imul(h1 ^ (h1 >>> 13), 3266489909)
    return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

// Utility to parse timestamp

export const parseTimestamp = (
    timestamp: FieldValue | Date | jsonTimeObj | null
) => {
    // Return early on missing timestamp
    if (!timestamp) {
        return
    }

    // If timestamp is a JSON time object, convert to date
    // Otherwise assume it has already been converted on pre-fetch
    if (!(timestamp instanceof Date) && timestamp instanceof Object) {
        if (!('seconds' in timestamp)) {
            return 'Cannot fetch time'
        }
        const timestampType: jsonTimeObj = timestamp as jsonTimeObj
        if (timestampType && timestampType.seconds) {
            timestamp = new Date(timestampType?.seconds * 1000 || '')
        }
    }

    // Convert to fromNow time
    return timestamp
}

export const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1)
}
