// check and counts number of likes
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

// checks if string is an Amazon URL.
export const isAmazonValidURL = (string: string) => {
    const res = string.match(/https?:\/\/(?=(?:....)?amazon|smile)(www|smile)\S+com(((?:\/(?:dp|gp)\/([A-Z0-9]+))?\S*[?&]?(?:tag=))?\S*?)(?:#)?(\w*?-\w{2})?(\S*)(#?\S*)+/g);
    return (res !== null);
}

// check if the string is URL
export const isValidURL = (string: string) => {
    const res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null);
};
