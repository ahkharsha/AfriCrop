'use client'

import { useState, FormEvent } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { AfriCropDAOABI } from '@/lib/contracts/contracts'
import { AFRICROP_DAO_ADDRESS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

type ProposalType = {
  value: string
  label: string
}

const proposalTypes: ProposalType[] = [
  { value: '0', label: 'Admin Change' },
  { value: '1', label: 'Fund Allocation' },
  { value: '2', label: 'Parameter Change' },
  { value: '3', label: 'Research Grant' },
]

export default function CreateProposalPage() {
  const [proposalType, setProposalType] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [targetAddress, setTargetAddress] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [paramKey, setParamKey] = useState<string>('')
  const [paramValue, setParamValue] = useState<string>('')
  const [researchDetails, setResearchDetails] = useState<string>('')
  const { address } = useAccount()
  const router = useRouter()

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast({
          title: 'Proposal created',
          description: 'Your proposal has been submitted for voting',
        })
        router.push('/governance')
      },
      onError: (error: Error) => {
        toast({
          title: 'Error creating proposal',
          description: error.message,
          variant: 'destructive',
        })
      },
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!proposalType || !description) return

    writeContract({
      abi: AfriCropDAOABI,
      address: AFRICROP_DAO_ADDRESS,
      functionName: 'createProposal',
      args: [
        parseInt(proposalType),
        description,
        targetAddress || address,
        amount ? BigInt(amount) : BigInt(0),
        paramKey ? BigInt(paramKey) : BigInt(0),
        paramValue ? BigInt(paramValue) : BigInt(0),
        researchDetails || '',
      ],
      value: BigInt(0.01 * 10**18), // 0.01 ETH stake
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    switch (id) {
      case 'targetAddress':
        setTargetAddress(value)
        break
      case 'amount':
        setAmount(value)
        break
      case 'paramKey':
        setParamKey(value)
        break
      case 'paramValue':
        setParamValue(value)
        break
      case 'researchDetails':
        setResearchDetails(value)
        break
      case 'description':
        setDescription(value)
        break
      default:
        break
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Proposal</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="proposalType">Proposal Type</Label>
          <Select value={proposalType} onValueChange={setProposalType}>
            <SelectTrigger>
              <SelectValue placeholder="Select proposal type" />
            </SelectTrigger>
            <SelectContent>
              {proposalTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={handleInputChange}
            placeholder="Describe your proposal"
            required
          />
        </div>

        {proposalType === '1' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="targetAddress">Recipient Address</Label>
              <Input
                id="targetAddress"
                value={targetAddress}
                onChange={handleInputChange}
                placeholder="0x..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ETH)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={handleInputChange}
                placeholder="0.0"
              />
            </div>
          </>
        )}

        {proposalType === '2' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="paramKey">Parameter Key</Label>
              <Input
                id="paramKey"
                value={paramKey}
                onChange={handleInputChange}
                placeholder="Parameter identifier"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paramValue">New Value</Label>
              <Input
                id="paramValue"
                value={paramValue}
                onChange={handleInputChange}
                placeholder="New parameter value"
              />
            </div>
          </>
        )}

        {proposalType === '3' && (
          <div className="space-y-2">
            <Label htmlFor="researchDetails">Research Details (IPFS Hash)</Label>
            <Input
              id="researchDetails"
              value={researchDetails}
              onChange={handleInputChange}
              placeholder="Qm..."
            />
          </div>
        )}

        <div className="pt-4">
          <p className="text-sm text-muted-foreground">
            Creating a proposal requires a 0.01 ETH stake
          </p>
          <Button type="submit" disabled={isPending} className="w-full mt-2">
            {isPending ? 'Creating...' : 'Create Proposal'}
          </Button>
        </div>
      </form>
    </div>
  )
}