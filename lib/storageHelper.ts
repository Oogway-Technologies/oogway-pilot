import { deleteObject, listAll, ref } from '@firebase/storage'

import { storage } from '../firebase'

export const deleteMedia = (path: string) => {
    const mediaRef = ref(storage, path)
    listAll(mediaRef)
        .then(listResults => {
            const promises = listResults.items.map(item => {
                return deleteObject(item)
            })
            Promise.all(promises)
        })
        .catch(error => {
            console.log('Cannot delete media: ', error)
        })
}
