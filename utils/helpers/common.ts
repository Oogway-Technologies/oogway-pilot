import {db} from "../../firebase";

/**
 *
 * @param id
 * @param setNumLikes setState function for saving likes
 * @description to fetch likes of the post from Firebase.
 */
export const getLikes = (id: string, setNumLikes: (n: number) => void): void => {
    db.collection("posts")
        .doc(id)
        .onSnapshot((snapshot) => {
            if (snapshot.data()) {
                // Get the likes map
                const likesMap = snapshot && snapshot?.data()?.likes;
                let ctr = 0;
                // Count the entries that are True
                Object.values(likesMap).forEach((item) => {
                    if (item) {
                        ctr += 1;
                    }
                });
                setNumLikes(ctr)
            }
        });
}
