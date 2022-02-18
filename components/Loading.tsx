import { Circle } from 'better-react-spinkit'

function Loading() {
    // ========== TODO: redo according to design ========== //

    return (
        <div className="flex m-auto">
            <div>
                <Circle
                    className="text-primary/60 dark:text-primaryDark/60"
                    size={60}
                />
            </div>
        </div>
    )
}

export default Loading
