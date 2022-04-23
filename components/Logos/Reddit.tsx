import Image from 'next/image'
import React, { FC } from 'react'

interface Props {
    width: number
    height: number
}

const Reddit: FC<React.PropsWithChildren<React.PropsWithChildren<Props>>> = ({
    width,
    height,
}) => (
    <Image
        src="/reddit.svg"
        alt="Reddit logo"
        width={width}
        height={height}
        className="bg-clip-content bg-transparent dark:bg-white/90 rounded-md"
    />
)

export default Reddit
