// 'use client'

// import { useAccount, useReadContract } from 'wagmi'
// import { contractAddress, contractABI } from '@/utils/contract'
// import { useTranslations } from '@/utils/i18n'
// import Nav from '@/components/Nav'
// import Footer from '@/components/Footer'
// import { useWriteContract } from 'wagmi'
// import { useEffect, useState } from 'react'
// import { toast } from 'react-toastify'

// export default function Home() {
//   const { address, isConnected } = useAccount()
//   const { writeContract } = useWriteContract()
//   const t = useTranslations()
//   const [showRegistration, setShowRegistration] = useState(false)

//   const { data: farmer } = useReadContract({
//     address: contractAddress,
//     abi: contractABI,
//     functionName: 'farmers',
//     args: [address!],
//   }) as { data: any }

//   const { data: siloCrops } = useReadContract({
//     address: contractAddress,
//     abi: contractABI,
//     functionName: 'getFarmerStoredCrops',
//     args: [address],
//   }) as { data: bigint[] | undefined }

//   const { data: farmCrops } = useReadContract({
//     address: contractAddress,
//     abi: contractABI,
//     functionName: 'getFarmerCrops',
//     args: [address],
//   }) as { data: bigint[] | undefined }

//   useEffect(() => {
//     if (isConnected && farmer && !farmer.isRegistered) {
//       setShowRegistration(true)
//     }
//   }, [isConnected, farmer])

//   const registerFarmer = () => {
//     writeContract({
//       address: contractAddress,
//       abi: contractABI,
//       functionName: 'registerFarmer',
//     }, {
//       onSuccess: () => {
//         toast.success(t('registrationSuccess'))
//         setShowRegistration(false)
//         window.dispatchEvent(new Event('contractWrite'))
//       },
//       onError: (error) => {
//         toast.error(t('registrationError'))
//       }
//     })
//   }

//   return (
//     <div>
//       <Nav />
//       <main className="py-8">
//         <h1 className="text-3xl font-bold mb-6">{t('welcome')}</h1>

//         {showRegistration && (
//           <div className="bg-primary-100 border-l-4 border-primary-500 p-4 mb-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-medium">{t('registerPrompt')}</p>
//                 <p className="text-sm text-secondary-600">{t('registerBenefits')}</p>
//               </div>
//               <button 
//                 onClick={registerFarmer}
//                 className="btn btn-primary"
//               >
//                 {t('registerNow')}
//               </button>
//             </div>
//           </div>
//         )}

//         {isConnected ? (
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//             <DashboardCard
//               title={t('myFarm')}
//               value={farmCrops?.length || 0}
//               description={t('activeLands')}
//               link="/farm"
//             />
//             <DashboardCard
//               title={t('mySilo')}
//               value={siloCrops?.length || 0}
//               description={t('storedCrops')}
//               link="/silo"
//             />
//             <DashboardCard
//               title={t('marketplace')}
//               value="0" // Will implement later
//               description={t('activeListings')}
//               link="/market"
//             />
//             <DashboardCard
//               title={t('dao')}
//               value={farmer?.reputationPoints?.toString() || '0'}
//               description={t('reputationPoints')}
//               link="/govern"
//             />
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <p className="text-lg mb-4">{t('connectWallet')}</p>
//           </div>
//         )}
//       </main>
//       <Footer />
//     </div>
//   )
// }

// function DashboardCard({ title, value, description, link }: { 
//   title: string, 
//   value: string | number,
//   description: string, 
//   link: string 
// }) {
//   return (
//     <a href={link} className="block bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
//       <h2 className="text-xl font-semibold mb-2">{title}</h2>
//       <p className="text-3xl font-bold text-primary-600 mb-2">{value}</p>
//       <p className="text-secondary-600">{description}</p>
//     </a>
//   )
// }

// src/app/page.tsx
'use client'

import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { useTranslations } from '../utils/i18n'
import Nav from '../components/Nav'
import Footer from '@/components/Footer'
import { contractAddress, contractABI } from '@/utils/contract'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function Home() {
  const { isConnected, address } = useAccount()
  const { writeContract } = useWriteContract()
  const t = useTranslations()
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(false)

  const { data: farmer } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'farmers',
    args: [address!],
  }) as { data: any }

  useEffect(() => {
    if (farmer && farmer[6]) { // isRegistered field
      setIsRegistered(true)
    }
  }, [farmer])

  const registerFarmer = () => {
    setLoading(true)
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'registerFarmer',
    }, {
      onSuccess: () => {
        toast.success('Successfully registered as farmer!')
        setIsRegistered(true)
      },
      onError: (error) => {
        toast.error(`Registration failed: ${error.message}`)
      },
      onSettled: () => {
        setLoading(false)
      }
    })
  }

  return (
    <div>
      <Nav />
      <main className="py-8">
        <h1 className="text-3xl font-bold mb-6">{t('welcome')}</h1>

        {isConnected ? (
          <>
            {!isRegistered ? (
              <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto text-center">
                <h2 className="text-xl font-semibold mb-4">Register as Farmer</h2>
                <p className="mb-4 text-secondary-600">You need to register to start using AfriCropDAO</p>
                <button 
                  onClick={registerFarmer}
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? 'Registering...' : 'Register Now'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardCard
                  title={t('myCrops')}
                  description={t('manageYourCrops')}
                  link="/farm"
                />
                <DashboardCard
                  title={t('marketplace')}
                  description={t('buySellCrops')}
                  link="/market"
                />
                <DashboardCard
                  title={t('governance')}
                  description={t('participateInDAO')}
                  link="/dao"
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg mb-4">{t('connectWallet')}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

function DashboardCard({ title, description, link }: { title: string, description: string, link: string }) {
  return (
    <a href={link} className="block bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-secondary-600">{description}</p>
    </a>
  )
}