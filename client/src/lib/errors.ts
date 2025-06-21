import { useTranslations } from 'next-intl'

export const getErrorMessage = (error: any) => {
  const t = useTranslations('Errors')
  
  if (error?.code === 'ACTION_REJECTED') {
    return t('rejected')
  }

  if (error?.message?.includes('AfriCropDAO__FarmerNotRegistered')) {
    return t('farmerNotRegistered')
  }

  if (error?.message?.includes('AfriCropDAO__InsufficientFunds')) {
    return t('insufficientFunds')
  }

  // Add more error mappings as needed

  return t('genericError')
}

export const errorMessages = {
  rejected: 'Transaction was rejected',
  farmerNotRegistered: 'Farmer not registered',
  insufficientFunds: 'Insufficient funds',
  genericError: 'Something went wrong',
}