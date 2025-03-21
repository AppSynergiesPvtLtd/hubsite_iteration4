import React from 'react'

import Welcome from '@/components/Home/WelcomeBanner/WelcomeBanner'
import SignUpSection from '@/components/Works/Signupsection'
import OnboardingSection from '@/components/Works/OnboardingSection'
import CompleteProfileSection from '@/components/Works/CompleteProfileSection'
import SurveysSection from '@/components/Works/SurveysSection'
import RewardSection from './RewardsSection'
import MainLayout from '@/layouts/MainLayout'

const Work = () => {
    return (
        <div className='poppins'>
            <Welcome heading={"How Hubsite Social Paid Surveys Work"} />
            <div className='text-center m-auto max-w-[75%] md:mt-12 '>
                <h1 className='text-[#303F9E] text-4xl font-bold md:text-[45px] poppins'>Access Hubsite Social in 5 Simple Steps</h1>
                <p className='mt-8 poppins'>
                    Get ready to join the Hubsite Social community! Follow these five easy steps to set up your
                    account, complete your profile, and start participating in engaging surveys. Share your insights,
                    influence the marketplace, and earn exciting rewards—all in just a few clicks!
                </p>
            </div>
            <SignUpSection />
            <CompleteProfileSection/>
            <OnboardingSection/>
            <SurveysSection/>
            
            
            <RewardSection/>

        </div>
    )
}

Work.Layout = MainLayout; 

export default Work
