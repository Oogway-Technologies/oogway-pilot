// Prevents default on form inputs when user presses enter
const preventDefaultOnEnter = (e: any) => {
    if (e.key === 'Enter') {
        e.preventDefault()
    }
    if (e.target.keyCode === 13) {
        e.preventDefault()
    }
}

export default preventDefaultOnEnter
