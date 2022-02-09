// Prevents default on form inputs when user presses enter
const preventDefaultOnEnter = (e) => {
    e.target.keyCode === 13 && e.preventDefault();
}

export default preventDefaultOnEnter;