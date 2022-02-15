import { Circle } from 'better-react-spinkit'

function Loading() {
    // ========== TODO: redo according to design ========== //

    return (
        <div className="flex h-screen">
            <div className="flex m-auto text-primary">
                <Circle color="currentColor" size={60} />
            </div>
        </div>
    )
}

export default Loading
