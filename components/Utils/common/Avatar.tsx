/* eslint-disable @next/next/no-img-element */
import { FC, MouseEvent } from 'react'

import { avatarStyle } from '../../../styles/utils'

interface AvatarProps {
    alt?: string
    className?: string
    sizes?: string
    src: string
    onClick?: (e: MouseEvent<HTMLDivElement>) => void
    isHoverEffect?: boolean
}

export const Avatar: FC<AvatarProps> = ({
    alt,
    src,
    className,
    onClick,
    isHoverEffect = true,
}: AvatarProps) => {
    return src ? (
        <img
            alt={alt}
            src={src}
            className={`${avatarStyle} ${
                isHoverEffect
                    ? 'hover:opacity-80 hover:scale-125 cursor-pointer'
                    : ''
            }  ${className}`}
            onClick={onClick}
        />
    ) : (
        <div className={avatarStyle} />
    )
}
