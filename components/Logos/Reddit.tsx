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
        className="rounded-md bg-transparent bg-clip-content dark:bg-white/90"
    />
)

export default Reddit
