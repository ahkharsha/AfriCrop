'use client'

import { useAccount } from 'wagmi'
import { useCrops } from '@/hooks/useCrops'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CropCard } from '@/components/crops/CropCard'
import { Skeleton } from '@/components/ui/skeleton'

export default function SiloPage() {
  const { address } = useAccount()
  const { crops, isLoading } = useCrops(address)

  const groupedCrops = {
    sown: crops.filter(crop => crop.stage === 0),
    growing: crops.filter(crop => crop.stage === 1),
    harvested: crops.filter(crop => crop.stage === 2),
    selling: crops.filter(crop => crop.stage === 3),
    sold: crops.filter(crop => crop.stage === 4),
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Silo</h1>

      <Tabs defaultValue="sown" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sown">Sown</TabsTrigger>
          <TabsTrigger value="growing">Growing</TabsTrigger>
          <TabsTrigger value="harvested">Harvested</TabsTrigger>
          <TabsTrigger value="selling">Selling</TabsTrigger>
          <TabsTrigger value="sold">Sold</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="sown">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedCrops.sown.map(crop => (
                  <CropCard key={crop.id} crop={crop} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="growing">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedCrops.growing.map(crop => (
                  <CropCard key={crop.id} crop={crop} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="harvested">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedCrops.harvested.map(crop => (
                  <CropCard key={crop.id} crop={crop} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="selling">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedCrops.selling.map(crop => (
                  <CropCard key={crop.id} crop={crop} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="sold">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedCrops.sold.map(crop => (
                  <CropCard key={crop.id} crop={crop} />
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}