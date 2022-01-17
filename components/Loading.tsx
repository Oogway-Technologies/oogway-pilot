import { Circle } from "better-react-spinkit";

function Loading() {
    
    // ========== TODO: redo according to design ========== //

    return (
        <div className="auto-colos-max place-items-center h-screen">
            <div>
                <img
                    src="https://cdn-icons-png.flaticon.com/512/2395/2395608.png"
                    alt=""
                    style={{marginBottom: 10}}
                    height={200}
                />
                <Circle color="#3CBC28" size={60} />
            </div>
        </div>
    )
}

export default Loading
