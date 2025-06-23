// src/app/api/check-lesson-completion/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { mainnet, curtis } from 'viem/chains' // Adjust based on your network

const client = createPublicClient({
  chain: curtis, // Change to your target chain
  transport: http()
})

export async function POST(request: NextRequest) {
  try {
    const { contractAddress, farmerAddress, lessonId } = await request.json()

    console.log('🔍 API - Checking lesson completion:', {
      contractAddress,
      farmerAddress,
      lessonId
    })

    if (!contractAddress || !farmerAddress || !lessonId) {
      console.error('❌ API - Missing required parameters')
      return NextResponse.json({ 
        error: 'Missing required parameters' 
      }, { status: 400 })
    }

    // Contract ABI for the completedLessons function
    const abi = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "completedLessons",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]

    try {
      const isCompleted = await client.readContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'completedLessons',
        args: [farmerAddress as `0x${string}`, BigInt(lessonId)]
      })

      console.log('✅ API - Lesson completion result:', {
        farmerAddress,
        lessonId,
        isCompleted
      })

      return NextResponse.json({
        isCompleted: Boolean(isCompleted),
        farmerAddress,
        lessonId
      })

    } catch (contractError) {
      console.error('❌ API - Contract read error:', contractError)
      return NextResponse.json({
        error: 'Contract read failed',
        details: contractError
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ API - General error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error
    }, { status: 500 })
  }
}