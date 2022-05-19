import { UilSpinner } from '@iconscout/react-unicons'
import moment from 'moment'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { setDecisionCriteriaQueryKey } from '../../../features/decision/decisionSlice'
import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import {
    getDecisionCriteriaInfoParams,
    useCreateDecisionCriteriaInfo,
    useDecisionCriteriaInfoQuery,
} from '../../../queries/decisionCriteriaInfo'
import {
    criteriaInfoCacheDays,
    oogwayDecisionFTVersion,
} from '../../../utils/constants/global'
import { parseTimestamp, titleCase } from '../../../utils/helpers/common'
import { GoogleSearchHyperlink } from '../../../utils/types/googleapi'
import AISidebar from '../common/AISidebar'

interface CriteriaFactProps {
    criterion: string
    fact?: string
}

const CriteriaFact: FC<CriteriaFactProps> = ({ criterion, fact }) => (
    <div className="flex flex-col p-2">
        <span className="text-base font-bold text-primary dark:text-primaryDark">
            {titleCase(criterion)}
        </span>
        {fact && (
            <span className="mx-2 text-sm text-neutral-700 dark:text-neutralDark-50 break-normal">
                {fact}
            </span>
        )}
    </div>
)

interface CriteriaLinksProps {
    links: GoogleSearchHyperlink[]
    topN: number
    query: string
}

const CriteriaLinks: FC<CriteriaLinksProps> = ({ links, topN, query }) => (
    <div className="flex flex-col p-2">
        <span className="text-sm text-primary dark:text-primaryDark">
            Question
        </span>
        <span className="mb-2 ml-2 text-xs text-neutral-700 dark:text-neutralDark-50">
            {query}
        </span>
        <span className="text-sm text-primary dark:text-primaryDark">
            Links
        </span>
        <div className="flex flex-col mx-2 space-y-1 text-xs text-neutral-700 dark:text-neutralDark-50">
            {links.slice(0, topN).map((elem, idx) => (
                <Link key={idx} href={elem.url} passHref={true}>
                    <a
                        className="underline truncate"
                        key={idx}
                        target={'_blank'}
                        rel="noopener noreferrer"
                    >
                        {elem.title}
                    </a>
                </Link>
            ))}
        </div>
    </div>
)

export const CriteriaInfo: FC = () => {
    // // Track option - criteria state
    const { getValues } = useFormContext()
    const optionArray = getValues('options')
    const decision = getValues('question')
    const optionIndex = useAppSelector(
        state => state.decisionSlice.decisionEngineOptionTab
    )
    const criteria = useAppSelector(
        state => state.decisionSlice.decisionCriteriaQueryKey
    )
    const isMobile = useMediaQuery('(max-width: 965px)')

    // Instatiate queries and POST mutator
    const decisionCriteriaInfo = useCreateDecisionCriteriaInfo()
    const [isAwaitingAI, setIsAwaitingAI] = useState<boolean>(true)
    const today = moment()
    const { data, isLoading, isError, isFetched } =
        useDecisionCriteriaInfoQuery(
            oogwayDecisionFTVersion,
            optionArray[optionIndex].name,
            criteria as string, // always defined since component only mounts when set
            retrievedData => {
                // On succesful query, check to ensure results were found
                // and object has a timestamp. If cached result is still
                // fresh, use result otherwise trigger a new call to AI endpoint
                if (
                    retrievedData?.err !== 'No results found' &&
                    'timestamp' in retrievedData &&
                    today.diff(
                        moment(parseTimestamp(retrievedData?.timestamp)),
                        'days'
                    ) < criteriaInfoCacheDays
                ) {
                    console.log('CACHE used!')
                    setIsAwaitingAI(false)
                } else {
                    console.log('POST triggered!')
                    const mutateParams: getDecisionCriteriaInfoParams = {
                        _version: oogwayDecisionFTVersion,
                        _option: optionArray[optionIndex].name,
                        _criterion: criteria as string,
                        _decision: decision,
                    }
                    decisionCriteriaInfo.mutate(mutateParams, {
                        onSettled: () => {
                            setIsAwaitingAI(false)
                        },
                    })
                    decisionCriteriaInfo.reset()
                }
            }
        )

    // Handle instances where data already cached, isAwatingAI is set to true,
    // but react query doesn't need to refetch, so the onSettled hook never has
    // a chance to turn off isAwaitingAI even though data is already present
    useEffect(() => {
        if (isFetched) {
            setIsAwaitingAI(false)
        }
    }, [isFetched])

    // Clean up function
    useEffect(() => {
        return () => {
            useAppDispatch(setDecisionCriteriaQueryKey(undefined))
            // setIsAwaitingAI(true)
        }
    }, [])

    // Helpers
    const errorMessage = (
        option: string | number,
        criterion: string | number
    ) => `We're sorry. Oogway AI encountered a problem and
                            cannot provide information about{' '}
                            ${option} and ${criterion}.`

    return (
        <AISidebar subtitle={'AI Answer Card'} infoCircle>
            <div
                className={`flex w-full p-2 max-h-[320px] overflow-auto ${
                    isMobile ? 'items-center space-x-2' : 'flex-col space-y-2'
                }`}
            >
                {isLoading || isAwaitingAI ? (
                    <UilSpinner className={'my-3 mx-auto animate-spin'} />
                ) : (
                    <div
                        className={
                            'flex flex-col w-full bg-neutral-25 dark:bg-neutralDark-300 rounded-xl md:p-sm md:shadow-md md:dark:shadow-black/10'
                        }
                    >
                        {isError ? (
                            errorMessage(
                                optionArray[optionIndex].name,
                                criteria as string
                            )
                        ) : (
                            <>
                                <CriteriaFact
                                    criterion={criteria as string}
                                    fact={
                                        data?.results?.fact ||
                                        'Facts coming soon!'
                                    }
                                />
                                {data?.results?.url_list && (
                                    <CriteriaLinks
                                        links={data?.results?.url_list}
                                        topN={5}
                                        query={data?.results?.query}
                                    />
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </AISidebar>
    )
}
