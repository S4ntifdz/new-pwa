"use client"
import { ArrowLeft, Sun, Moon, ShoppingCart, Phone } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useThemeStore } from "../stores/useThemeStore"
import { useCartStore } from "../stores/useCartStore"

interface HeaderProps {
  title: string
  showBack?: boolean
  showCart?: boolean
  showThemeToggle?: boolean
  showCallWaiter?: boolean
  tableNumber?: number
  tableStatus?: string
  onCallWaiter?: () => void
}

export function Header({
  title,
  showBack = false,
  showCart = false,
  showThemeToggle = true,
  showCallWaiter = false,
  tableNumber,
  tableStatus,
  onCallWaiter,
}: HeaderProps) {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useThemeStore()
  const { getItemCount } = useCartStore()
  const cartItemCount = getItemCount()

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl text-gray-900 dark:text-white px-4 py-4 flex items-center justify-between shadow-lg border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        )}

        <div>
          <h1 className="font-bold text-xl text-gray-900 dark:text-white gradient-text">{title}</h1>
          {tableNumber && (
            <p className="text-orange-500 dark:text-orange-400 text-sm font-semibold">
              Mesa {tableNumber} • {tableStatus}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showCallWaiter && (
          <button
            onClick={onCallWaiter}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 text-white shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Phone className="w-4 h-4" />
            Mozo
          </button>
        )}

        {showCart && (
          <button
            onClick={() => navigate(`/cart/${window.location.pathname.split("/")[2]}`)}
            className="relative p-3 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>
        )}

        {showThemeToggle && (
          <button
            onClick={toggleTheme}
            className="p-3 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        )}
      </div>
    </header>
  )
}
