"use client"

import { LoadingSpinner } from "../components/LoadingSpinner"

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
            <span className="text-4xl">🍽️</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 gradient-text">ComandaYa</h1>

        <LoadingSpinner message="Cargando aplicación..." />
      </div>
    </div>
  )
}
