import {useRecoilState, useRecoilValue} from "recoil";
import {termsAndConditionsPopUpState} from "../../atoms/termsAndConditons";
import {userProfileState} from "../../atoms/user";

interface AreTermsAcceptedProps {
    children: JSX.Element
    className?: string
}

export const AreTermsAccepted = (props: AreTermsAcceptedProps): { children: JSX.Element } | JSX.Element => {
    const {
        children,
        className
    } = props;

    // Get userProfileState state from recoil.
    const {termAndConditions} = useRecoilValue(userProfileState)

    const [termsModal, setTermsModal] = useRecoilState(termsAndConditionsPopUpState);

    return (
        termAndConditions ? <>{children}</> :
            <div className={className + 'm-0 p-0 cursor-pointer'} onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTermsModal(!termsModal)
            }}>
                {children}
            </div>

    );
};
