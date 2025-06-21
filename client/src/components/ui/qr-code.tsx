'use client'

import QRCode from 'react-qr-code'
import { Button } from './button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'

export function FarmerQRCode({ address }: { address: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Farmer ID
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Farmer Verification QR</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center p-4">
          <QRCode 
            value={address}
            size={192}
            bgColor="var(--background-light)"
            fgColor="var(--primary-green-dark)"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}