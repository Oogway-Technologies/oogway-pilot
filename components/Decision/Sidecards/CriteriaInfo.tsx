import { UilSpinner } from '@iconscout/react-unicons'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import useMediaQuery from '../../../hooks/useMediaQuery'
import { useAppSelector } from '../../../hooks/useRedux'
import {
    getDecisionCriteriaInfoParams,
    useCreateDecisionCriteriaInfo,
    useDecisionCriteriaInfoQuery,
} from '../../../queries/decisionCriteriaInfo'
import { oogwayDecisionFTVersion } from '../../../utils/constants/global'
import AISidebar from '../common/AISidebar'

export const CriteriaInfo = () => {
    // Track option - criteria state
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
    const params: getDecisionCriteriaInfoParams = {
        _version: oogwayDecisionFTVersion,
        _option: optionArray[optionIndex].name,
        _criterion: criteria, // Will always be defined because this component only mounts when criteria is defined
    }
    const { data, status, isLoading } = useDecisionCriteriaInfoQuery(params)
    const decisionCriteriaInfo = useCreateDecisionCriteriaInfo()

    // On mount, heck if there is a cached result that will be used
    // otherwise make a new call to the ai endpoint and store
    // that in react-query's short term cache as well as the long-term
    // firebase cache
    useEffect(() => {
        if (!(status === 'success' || data?.results)) {
            const mutateParams = {
                ...params,
                _decision: decision,
            }
            decisionCriteriaInfo.mutate(mutateParams)
        }
    }, [])

    return (
        <AISidebar title={'AI Answer Card'}>
            <>
                <div
                    className={`flex w-full max-h-[320px] overflow-auto ${
                        isMobile
                            ? 'items-center space-x-2'
                            : 'flex-col space-y-2'
                    }`}
                >
                    {isLoading && (
                        <UilSpinner className={'my-3 mx-auto animate-spin'} />
                    )}
                </div>
            </>
        </AISidebar>
    )
}
