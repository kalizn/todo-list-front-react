'use client'
import { CircularProgress } from '@mui/material'
import React from 'react'

const LoadingSpinner = () => {
  return (
    <div>
        <CircularProgress size={40} thickness={4} style={{ color: '#3498db' }} />
    </div>
  )
}

export default LoadingSpinner