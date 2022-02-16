// count number of like in snapshot
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

// check wether the uploaded file is less then 10MB
export const checkFileSize = (files: FileList | null) => {
    if (!files) { // This is VERY unlikely, browser support is near-universal
        console.error("This browser doesn't seem to support the `files` property of file inputs.");
    }
    if (files && files[0]) {
        // checking if file is less then 10MB
        if (files[0].size < 1000000) {
            return true
        }
    }
    return false
}
