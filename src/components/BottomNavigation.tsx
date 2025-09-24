"use client"
import { useNavigate, useLocation } from "react-router-dom"
import { Home, UtensilsCrossed, ShoppingCart, Phone } from "lucide-react"
import { useCartStore } from "../stores/useCartStore"

interface BottomNavigationProps {
  tableId: string
  onCallWaiter?: () => void
}

export function BottomNavigation({ tableId, onCallWaiter }: BottomNavigationProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { getItemCount } = useCartStore()
  const cartItemCount = getItemCount()

  const isActive = (path: string) => {
    return location.pathname.includes(path)
  }

  const navItems = [
    {
      id: "home",
      label: "Inicio",
      icon: Home,
      path: `/dashboard/${tableId}`,
      isActive: isActive("dashboard"),
    },
    {
      id: "menu",
      label: "Menú",
      icon: UtensilsCrossed,
      path: `/menu/${tableId}`,
      isActive: isActive("menu"),
    },
    {
      id: "cart",
      label: "Carrito",
      icon: ShoppingCart,
      path: `/cart/${tableId}`,
      isActive: isActive("cart"),
      badge: cartItemCount > 0 ? cartItemCount : undefined,
    },
    {
      id: "waiter",
      label: "Mozo",
      icon: Phone,
      action: onCallWaiter,
      isActive: false,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100]">
      <div className="absolute inset-x-0 -top-4 h-6 bg-gradient-to-b from-transparent to-white/95 dark:to-gray-900/95 pointer-events-none"></div>

      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-t border-gray-200/30 dark:border-gray-800/30 shadow-2xl relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/40 to-transparent"></div>

        <div className="flex items-center justify-around max-w-md mx-auto px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActiveItem = item.isActive

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action()
                  } else if (item.path) {
                    navigate(item.path)
                  }
                }}
                className={`flex flex-col items-center gap-1 py-3 px-4 rounded-2xl transition-all duration-300 relative group min-w-[60px] ${
                  isActiveItem
                    ? "text-orange-500 bg-orange-50/80 dark:bg-orange-900/30 scale-105 shadow-md"
                    : "text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-900/20 hover:scale-105"
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-6 h-6 transition-all duration-300 ${
                      isActiveItem ? "text-orange-500 scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs font-semibold transition-all duration-300 ${
                    isActiveItem ? "text-orange-500" : "group-hover:text-orange-500"
                  }`}
                >
                  {item.label}
                </span>
                {isActiveItem && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full shadow-glow"></div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
