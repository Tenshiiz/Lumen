'use client'

import React, { useEffect } from 'react'
import { useToast } from '../../../context/ToastContext'

function ToastNotification() {
    const { toastState, hideToast } = useToast()

    useEffect(() => {
        if (!toastState.show) return

        const timer = setTimeout(() => {
            hideToast()
        }, 3000)

        return () => clearTimeout(timer)
    }, [toastState.show, hideToast])

    if (!toastState.show) return null

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-xs sm:max-w-sm bg-gray-900 text-white px-4 py-3 sm:px-6 sm:py-4.5 rounded-lg shadow-lg border border-gray-700 animate-slide-in-righttransition-opacity duration-300">

            <div className="flex items-center gap-2">
                <span className="text-green-400 text-xs sm:text-sm">✓</span>
                <span className="text-xs sm:text-sm font-medium">{toastState.message}</span>
            </div>
        </div>
    )
}

export default ToastNotification
