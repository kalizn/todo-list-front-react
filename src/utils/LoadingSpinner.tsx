'use client'
// React Import
import React from 'react'

// Dependency Import
import { CircularProgress } from '@mui/material'

const LoadingSpinner = () => {
  return (
    <div>
        <CircularProgress size={40} thickness={4} style={{ color: '#3498db' }} />
    </div>
  )
}

export default LoadingSpinner