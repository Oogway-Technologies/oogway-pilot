export const findLikes = (snapshot: any, setNumLikes: (n: number) => void) => {
    if (snapshot.data()) {
        // Get the likes map
        const likesMap = snapshot && snapshot?.data()?.likes;
        // Count the entries that are True
        let ctr = 0;
        // Count the entries that are True
        Object.values(likesMap).forEach((item) => {
            if (item) {
                ctr += 1;
            }
        });
        setNumLikes(ctr);
    }
}
