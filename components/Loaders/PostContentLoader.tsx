import { Card, CardTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import React, { FC, forwardRef } from 'react'
import ContentLoader from 'react-content-loader'
import { postCardClass } from '../../styles/feed'

export const PostContent: FC = (props) => (
    <ContentLoader
        speed={2}
        width={650}
        height={124}
        viewBox="0 0 650 124"
        backgroundColor="#B0B3B8"
        foregroundColor="#7269FF"
        {...props}
    >
        <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
        <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
        <rect x="-163" y="55" rx="3" ry="3" width="410" height="6" />
        <rect x="-133" y="71" rx="3" ry="3" width="380" height="6" />
        <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
        <circle cx="20" cy="20" r="20" />
    </ContentLoader>
)

export const PostCardLoader = forwardRef(
    (props, ref: React.Ref<HTMLDivElement>) => (
        <Card className={postCardClass.card} {...props} ref={ref}>
            <PostContent />
        </Card>
    )
)

interface GeneratePostCardLoaderProps {
    n: number // number of place holder cards to generate
}

export const GeneratePostCardLoaders: FC<GeneratePostCardLoaderProps> = ({
    n,
}) => {
    // Create array to iterate over
    const nPosts = new Array<number>(n)

    return (
        <>
            {nPosts.map((i) => {
                ;<PostCardLoader key={i} />
            })}
        </>
    )
}
