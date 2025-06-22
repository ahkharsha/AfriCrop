// src/app/silo/page.tsx
'use client'

import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { contractAddress, contractABI } from '@/utils/contract'
import { useTranslations } from '@/utils/i18n'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CropCard from '@/components/CropCard'
import Card from '@/components/Card'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function SiloPage() {
  const { address } = useAccount()
  const { writeContract } = useWriteContract()
  const t = useTranslations()
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [selectedCrop, setSelectedCrop] = useState<number | null>(null)

  const { data: storedCrops } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'getFarmerStoredCrops',
    args: [address],
  }) as { data: bigint[] | undefined }

  const listCropForSale = () => {
    if (!selectedCrop || !price || !quantity) return

    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'listCropForSale',
      args: [selectedCrop, BigInt(price), BigInt(quantity)],
    }, {
      onSuccess: () => {
        toast.success('Crop listed for sale successfully!')
        setPrice('')
        setQuantity('')
        setSelectedCrop(null)
      },
      onError: (error) => {
        toast.error(`Failed to list crop: ${error.message}`)
      }
    })
  }

  return (
    <div>
      <Nav />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">My Silo</h1>
          <p className="text-secondary-600 mb-8">
            Manage your stored crops and list them for sale
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Stored Crops</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storedCrops?.map((cropId) => (
                  <CropCard 
                    key={cropId.toString()} 
                    cropId={Number(cropId)}
                    onUpdateStage={() => {}}
                    onStore={() => {}}
                  />
                ))}
              </div>
            </div>

            <div>
              <Card title="List Crop for Sale">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Crop</label>
                    <select
                      value={selectedCrop || ''}
                      onChange={(e) => setSelectedCrop(Number(e.target.value))}
                      className="input-field"
                    >
                      <option value="">Select a crop</option>
                      {storedCrops?.map((cropId) => (
                        <option key={cropId.toString()} value={Number(cropId)}>
                          Crop #{cropId.toString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="input-field"
                      placeholder="Amount to sell"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Total Price (ETH)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="input-field"
                      placeholder="Total price for the quantity"
                      step="0.0001"
                    />
                  </div>

                  <button
                    onClick={listCropForSale}
                    disabled={!selectedCrop || !price || !quantity}
                    className="btn btn-primary w-full mt-4"
                  >
                    List for Sale
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}