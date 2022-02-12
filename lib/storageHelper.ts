import { storage } from "../firebase"
import { ref, listAll } from '@firebase/storage'

export const deleteMedia = (path: string) => {
    const mediaRef = ref(storage, path)
    listAll(mediaRef).then((listResults) => {
        const promises = listResults.items.map((item) => {
            return item.delete()
        })
        Promise.all(promises)
    })
    .catch((error) => {console.log("Cannot delete media: ", error)})
}