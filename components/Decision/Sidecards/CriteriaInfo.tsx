// import { UilSpinner } from '@iconscout/react-unicons'
// import Link from 'next/link'
// import { useEffect, useState } from 'react'
// import { useFormContext } from 'react-hook-form'

import useMediaQuery from '../../../hooks/useMediaQuery'
// import { useAppSelector } from '../../../hooks/useRedux'
// import {
//     getDecisionCriteriaInfoParams,
//     useCreateDecisionCriteriaInfo,
//     useDecisionCriteriaInfoQuery,
// } from '../../../queries/decisionCriteriaInfo'
// import { bodyHeavy } from '../../../styles/typography'
// import { oogwayDecisionFTVersion } from '../../../utils/constants/global'
// import { titleCase } from '../../../utils/helpers/common'
import AISidebar from '../common/AISidebar'

export const CriteriaInfo = () => {
    // // Track option - criteria state
    // const { getValues } = useFormContext()
    // const optionArray = getValues('options')
    // const decision = getValues('question')
    // const optionIndex = useAppSelector(
    //     state => state.decisionSlice.decisionEngineOptionTab
    // )
    // const criteria = useAppSelector(
    //     state => state.decisionSlice.decisionCriteriaQueryKey
    // )
    const isMobile = useMediaQuery('(max-width: 965px)')

    // Instatiate queries and POST mutator
    // const params: getDecisionCriteriaInfoParams = {
    //     _version: oogwayDecisionFTVersion,
    //     _option: optionArray[optionIndex].name,
    //     _criterion: criteria, // Will always be defined because this component only mounts when criteria is defined
    // }
    // const { data, status, isLoading, isError } =
    //     useDecisionCriteriaInfoQuery(params)
    // const decisionCriteriaInfo = useCreateDecisionCriteriaInfo()
    // const [isAwaitingAI, setIsAwaitingAI] = useState<boolean>(true)

    // On mount, heck if there is a cached result that will be used
    // otherwise make a new call to the ai endpoint and store
    // that in react-query's short term cache as well as the long-term
    // firebase cache
    // useEffect(() => {
    //     if (status === 'success' && data?.results) setIsAwaitingAI(false)
    //     if (!(status === 'success' || data?.results)) {
    //         const mutateParams = {
    //             ...params,
    //             _decision: decision,
    //         }
    //         decisionCriteriaInfo.mutate(mutateParams, {
    //             onSuccess: () => {
    //                 setIsAwaitingAI(false)
    //             },
    //         })
    //     }
    // }, [])

    // Helpers
    // const errorMessage = (
    //     option: string | number,
    //     criterion: string | number
    // ) => `We're sorry. Oogway AI encountered a problem and
    //                         cannot provide information about{' '}
    //                         ${option} and ${criterion}.`

    return (
        <AISidebar subtitle={'AI Answer Card'}>
            <div
                className={`flex w-full max-h-[320px] overflow-auto ${
                    isMobile ? 'items-center space-x-2' : 'flex-col space-y-2'
                }`}
            >
                Coming Soon!
            </div>
        </AISidebar>
    )
}
