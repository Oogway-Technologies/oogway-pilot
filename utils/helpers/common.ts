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

//To connect frontend with backend
export const fetcher = (url: string) => fetch(url).then((res) => {
    return res.json()
});

//To detect a valid URL and return first URL found
export const isValidURL = (string: string | undefined) => {
    const res: Array<string> = string?.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) ?? [''];
    return res[0];
};
