import React from 'react'
import { Spinner } from './ui/spinner'

function LoadingPage() {
  return (
    <div>
      <Spinner size="sm" className="bg-black dark:bg-white" />
    </div>
  )
}

export default LoadingPage
