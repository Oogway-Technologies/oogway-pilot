import React, { FC } from 'react'

import { parseYoutubeVideoId } from '../../utils/helpers/common'

interface YoutubeEmbedProps {
    text: string
    addStyle?: string
}

const YoutubeEmbed: FC<
    React.PropsWithChildren<React.PropsWithChildren<YoutubeEmbedProps>>
> = ({ text, addStyle }) => {
    const Embed = () => (
        <div className={'m-2' + addStyle}>
            <iframe
                src={`https://www.youtube.com/embed/${parseYoutubeVideoId(
                    text
                )}`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="video"
                className={'h-full w-full'}
            />
        </div>
    )

    if (parseYoutubeVideoId(text)) return <Embed />
    else return <></>
}

export default YoutubeEmbed
