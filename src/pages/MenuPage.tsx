"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { BottomNavigation } from "../components/BottomNavigation"
import { ProductCard } from "../components/ProductCard"
import { OfferCard } from "../components/OfferCard"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { useAuthStore } from "../stores/useAuthStore"
import { useCartStore } from "../stores/useCartStore"
import { apiClient } from "../lib/api"
import type { Product, MenuCategory, Menu, Offer } from "../types"
import { Search, Sparkles } from "lucide-react"

export function MenuPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { getTotal, getItemCount } = useCartStore()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [menus, setMenus] = useState<Menu[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/loading/${tableId}`)
      return
    }

    loadData()
  }, [isAuthenticated, tableId, navigate])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load all data from API
      const [productsData, categoriesData, offersData] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getMenuCategories(),
        apiClient.getOffers(),
      ])

      setProducts(productsData)
      setCategories(categoriesData)
      setOffers(offersData)
    } catch (error) {
      console.error("Error loading menu data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCallWaiter = async () => {
    // Implementation for calling waiter
  }

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredOffers = offers.filter((offer) => offer.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const cartTotal = getTotal()
  const cartItemCount = getItemCount()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
        <Header title="Menú" showBack showCart />
        <LoadingSpinner message="Cargando menú..." />
        <BottomNavigation tableId={tableId || ""} onCallWaiter={handleCallWaiter} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-32">
      <Header title="Nuestro Menú" showBack showCart />

      {/* Search Bar */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 shadow-sm border-b border-gray-100 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar platos, bebidas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 shadow-sm">
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 shadow-sm ${
              activeCategory === "all"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveCategory("offers")}
            className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 shadow-sm flex items-center gap-2 ${
              activeCategory === "offers"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Ofertas
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-6">
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Resultados para "{searchQuery}"</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {(activeCategory === "offers" ? filteredOffers : filteredProducts).length} resultados encontrados
            </p>
          </div>
        )}

        <div className="grid gap-6">
          {activeCategory === "offers" ? (
            filteredOffers.length > 0 ? (
              filteredOffers.map((offer) => <OfferCard key={offer.uuid} offer={offer} />)
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No hay ofertas disponibles</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery
                    ? "Intenta con otros términos de búsqueda"
                    : "Vuelve pronto para ver nuestras ofertas especiales"}
                </p>
              </div>
            )
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => <ProductCard key={product.uuid} product={product} />)
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No se encontraron productos</h3>
              <p className="text-gray-600 dark:text-gray-400">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Footer */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-24 left-4 right-4 z-40">
          <button
            onClick={() => navigate(`/cart/${tableId}`)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 backdrop-blur-sm text-white py-5 rounded-2xl font-bold transition-all duration-200 flex items-center justify-between px-8 shadow-2xl border border-white/20 hover:scale-105"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">{cartItemCount}</span>
              </div>
              <span className="text-sm font-semibold">{cartItemCount === 1 ? "Item" : "Items"}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">Ver Carrito</span>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>

            <div className="text-right">
              <div className="text-xs opacity-80">Total</div>
              <div className="text-lg font-bold">${cartTotal.toFixed(2)}</div>
            </div>
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation tableId={tableId || ""} onCallWaiter={handleCallWaiter} />
    </div>
  )
}
