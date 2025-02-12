import MainLayout from '@/layouts/MainLayout';
import React from 'react';

const TermsOfUse = () => {
    return (
        <div className="poppins md:w-[75%] mx-auto my-8 p-4 text-gray-800 text-[16px]">
            <h1 className="m-auto w-fit text-xl md:text-4xl font-bold mb-4">Terms and Conditions</h1>

            <h1 className="text-xl font-bold mb-4 text-gray-900">1. Introduction</h1>
            <p className="mb-6">
                Welcome to Hubsite Social ("the Panel"). By accessing or utilizing our services,
                you are agreeing to comply with and be bound by the following Terms and Conditions ("Terms").
                These Terms constitute a legal agreement between you and Hubsite Social. If you do not accept
                these Terms, you must refrain from using the Panel or any of our services.
            </p>

            <h1 className="text-xl font-bold mb-4 text-gray-900">2. Eligibility</h1>
            <p className="mb-4">
                2.1 Age Requirement: To be eligible to participate in the Panel, you must be at least 18 years of age. By completing the registration process, you
                affirm that you satisfy this age requirement.
            </p>
            <p className="mb-4">
                2.2 Residency: You must be a resident of a country where the Panel is operational. Participation is not permitted where prohibited by law.
            </p>
            <p className="mb-4">
                2.3 Accuracy of Information: You are required to provide accurate, current, and complete information during registration and to update this information
                as necessary. Any attempt to provide false information or misrepresent your identity may result in the termination of your account.
            </p>

            <h1 className="text-xl font-bold mb-4 text-gray-900">3. Registration and Account Management</h1>
            <p className="mb-4">
                3.1 Registration Process: To join the Panel, you must complete the registration process by providing truthful and accurate information. You may be
                asked to verify your email address or provide additional information as part of the registration.
            </p>
            <p className="mb-4">
                3.2 Account Responsibility: You are responsible for maintaining the confidentiality of your account credentials, including your password. You agree
                to notify Hubsite Social immediately of any unauthorized use of your account or any breach of security. Hubsite Social will not be liable for any loss or damage arising from your failure to fulfill this responsibility.
            </p>
            <p className="mb-4">
                3.3 Prohibition of Multiple Accounts: The creation of multiple accounts or registration under different email addresses or identities is prohibited.
                Violations may result in the termination of all related accounts.
            </p>
            <p className="mb-4">
                3.4 Termination of Account: Hubsite Social reserves the right to suspend or terminate your account at its discretion, without prior notice, for any breach
                of these Terms or suspicion of fraudulent activity. Upon termination, any accrued rewards or incentives will be forfeited.
            </p>

            <h1 className="text-xl font-bold mb-4 text-gray-900">4. Participation in Surveys</h1>
            <p className="mb-4">
                4.1 Survey Invitations: As a member of the Panel, you may receive invitations to participate in surveys based on your profile. Hubsite Social does not guarantee a minimum number of survey invitations.
            </p>
            <p className="mb-4">
                4.2 Accuracy of Survey Responses: You agree to provide honest, accurate, and thoughtful responses to surveys. Responses that are inconsistent, incomplete, or suggestive of inattention may be disqualified, and your account may be subject to review.
            </p>
            <p className="mb-4">
                4.3 Confidentiality of Survey Content: All content and materials related to surveys are confidential. You agree not to disclose, share, or distribute any such content or materials to third parties without explicit written consent from Hubsite Social.
            </p>
            <p className="mb-4">
                4.4 Integrity of Surveys: You must not engage in activities that compromise the integrity of the survey process, including but not limited to the use of bots, scripts, or automated methods to complete surveys.
            </p>

            <h1 className="text-xl font-bold mb-4 text-gray-900">5. Incentives and Rewards</h1>
            <p className="mb-4">
                5.1 Earning Rewards: Participation in surveys may result in earning rewards, points, or other incentives as detailed in the survey invitations. The type and amount of rewards are solely determined by Hubsite Social and may change without notice.
            </p>
            <p className="mb-4">
                5.2 Redemption of Rewards: Rewards can be redeemed according to the terms specified in your account. Hubsite Social reserves the right to amend, suspend, or discontinue the rewards program at any time. Redemption is subject to availability and may require meeting specific criteria, such as minimum account activity.
            </p>
            <p className="mb-4">
                5.3 Expiration of Rewards: Rewards may have an expiration date. If not redeemed within the stipulated time, they will expire and be forfeited.
            </p>
            <p className="mb-4">
                5.4 Forfeiture of Rewards: If your account is terminated or suspended due to a breach of these Terms or remains inactive for a period specified in our Inactivity Policy, you may lose any accumulated rewards without prior notice.
            </p>

            <h1 className="text-xl font-bold mb-4 text-gray-900">6. Privacy Policy</h1>
            <p className="mb-4">
                6.1 Data Collection: Hubsite Social collects and processes personal data in accordance with our Privacy Policy. By agreeing to these Terms, you also consent to our data practices as described in the Privacy Policy.
            </p>
            <p className="mb-4">
                6.2 Use of Data: Your personal data is used to customize survey invitations, enhance our services, and for market research purposes. Aggregated and anonymized data may be used for research and analytical purposes.
            </p>

            <h1 className="text-xl font-bold mb-4 text-gray-900">7. Intellectual Property</h1>
            <p className="mb-4">
                All content, surveys, and materials provided through the Panel are the intellectual property of Hubsite Social or its licensors.
            </p>


        </div>
    );
};
TermsOfUse.Layout = MainLayout; 
export default TermsOfUse;
