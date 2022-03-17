/* eslint-disable @next/next/no-img-element */
import { FC, MouseEvent } from 'react'
import { loadingAvatarURL } from '../../../styles/feed'

import { avatarStyle } from '../../../styles/utils'

interface AvatarProps {
    alt?: string
    className?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
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
    size = 'md',
}: AvatarProps) => {
    const selectedSize =
        size === 'sm'
            ? 'h-[35px] w-[35px]'
            : size === 'md'
            ? 'h-[45px] w-[45px]'
            : size === 'lg'
            ? 'h-[70px] w-[70px]'
            : 'h-[150px] w-[150px]'

    return (
        <img
            alt={alt}
            src={src}
            className={`${selectedSize} ${avatarStyle} ${
                isHoverEffect
                    ? 'hover:opacity-80 hover:scale-125 cursor-pointer'
                    : ''
            }  ${className ? className : ''}`}
            onClick={onClick}
            onError={({ currentTarget }) => {
                currentTarget.src = loadingAvatarURL
                currentTarget.style.borderRadius = '50%'
                currentTarget.onerror = null
            }}
        />
    )
}
