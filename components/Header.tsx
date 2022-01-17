import ToggleTheme from "./Theme/ToggleTheme"

const Header = () => {
    return (
        <div>
            <ToggleTheme />
            <h1 className="text-primary dark:text-white">I'm the header</h1>
        </div>
    )
}

export default Header
