"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Header } from "../components/Header"
import { BottomNavigation } from "../components/BottomNavigation"
import { OffersCarousel } from "../components/OffersCarousel"
import { ChatbotModal } from "../components/ChatbotModal"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { ErrorMessage } from "../components/ErrorMessage"
import { useAuthStore } from "../stores/useAuthStore"
import { apiClient } from "../lib/api"
import type { ClientUnpaidOrdersResponse, Offer } from "../types"
import { Plus, CreditCard, Phone, X, Bot, UtensilsCrossed, Clock, CheckCircle2, Sparkles } from "lucide-react"
import defaultLogo from '../media/Comandaya_bk.png';
import { ErrorModal } from "../components/ErrorModal"

export function DashboardPage() {
  const { tableId } = useParams<{ tableId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()
  const [unpaidOrders, setUnpaidOrders] = useState<ClientUnpaidOrdersResponse | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showOrderSuccess, setShowOrderSuccess] = useState(false)
  const [waiterCalled, setWaiterCalled] = useState(false)
  const [showWaiterModal, setShowWaiterModal] = useState(false)
  const [showCancelWaiterModal, setShowCancelWaiterModal] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [config, setConfig] = useState<any>(null);

  // Error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState<string>("");

  // Poll for order updates every 3 seconds
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      loadUnpaidOrders()
    }, 10000)

    return () => clearInterval(interval)
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/loading/${tableId}`)
      return
    }

    // Check if we just created an order
    if (location.state?.orderCreated) {
      setShowOrderSuccess(true)
      // Clear the state to prevent showing again on refresh
      window.history.replaceState({}, document.title)
      // Hide success message after 3 seconds
      setTimeout(() => setShowOrderSuccess(false), 3000)
    }

    loadData()
  }, [isAuthenticated, tableId, navigate, location.state])


  const loadData = async () => {
    if (!tableId) return

    try {
      setLoading(true)
      setError(null)

      // Cargar configuración y ofertas
      const [configData, offersData] = await Promise.all([
        apiClient.getConfig(),
        apiClient.getOffers()
      ])

      setConfig(configData.config)
      setOffers(offersData)
      await loadUnpaidOrders()
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Error al cargar los datos de la mesa")
    } finally {
      setLoading(false)
    }
  }

  const loadUnpaidOrders = async () => {
    try {
      const unpaidOrdersData = await apiClient.getClientUnpaidOrders()
      setUnpaidOrders(unpaidOrdersData)
    } catch (error) {
      console.error("Error loading unpaid orders:", error)
    }
  }

  const handleCallWaiter = async () => {
    setShowWaiterModal(true)
  }
const confirmCallWaiter = async () => {
  if (!tableId) return

  try {
    const response = await apiClient.callWaiter(tableId)
    if (response.calling) {
      setWaiterCalled(true)
      setShowWaiterModal(false)
    }
  } catch (error) {
    console.error("Error calling waiter:", error)
    setErrorModalMessage("Error al llamar al mozo. Intenta nuevamente.")
    setShowErrorModal(true)
    setShowWaiterModal(false)
  }
}

const handleCancelWaiter = async () => {
  if (!tableId) return

  try {
    await apiClient.cancelWaiterCall()
    setWaiterCalled(false)
    setShowCancelWaiterModal(false)
  } catch (error) {
    console.error("Error canceling waiter call:", error)
    setErrorModalMessage("Error al cancelar llamado. Intenta nuevamente.")
    setShowErrorModal(true)
  }
}

// Agregar el ErrorModal al JSX
{showErrorModal && (
  <ErrorModal
    isOpen={showErrorModal}
    onClose={() => setShowErrorModal(false)}
    title="Error"
    message={errorModalMessage}
  />
)}

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      RECEIVED: "Recibida",
      ACEPTED: "Aceptada",
      IN_PREPARATION: "En preparación",
      DELIVERED: "Entregada",
      CANCELED: "Cancelada",
    }
    return statusMap[status] || status
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "ACEPTED":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "IN_PREPARATION":
        return <UtensilsCrossed className="w-4 h-4 text-orange-500" />
      case "DELIVERED":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header title="Cargando..." />
        <LoadingSpinner message="Cargando información de la mesa..." />
        <BottomNavigation tableId={tableId || ""} onCallWaiter={handleCallWaiter} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header title="Error" />
        <ErrorMessage
          message={error}
          action={
            <button
              onClick={loadData}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              Reintentar
            </button>
          }
        />
        <BottomNavigation tableId={tableId || ""} onCallWaiter={handleCallWaiter} />
      </div>
    )
  }

  const hasOrders = unpaidOrders && unpaidOrders.orders.length > 0
  const hasBalance = unpaidOrders && unpaidOrders.total_amount_owed > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-28">
      <Header
        title="ComandaYa"
        tableNumber={unpaidOrders?.table_number}
        tableStatus="Ocupada"
        showCallWaiter
        onCallWaiter={handleCallWaiter}
      />
   <div className={`px-4 py-6 space-y-6 max-w-md mx-auto ${hasOrders || hasBalance ? "pb-32" : ""}`}>
        {!hasOrders && !hasBalance && (
          <div className="relative">
            {/* Hero Background */}
            <div className="relative bg-gradient-to-br from-[#497385] via-[#769BAE] to-[#497385] rounded-3xl p-8 mb-6 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('/food-hero-bg.jpg')] bg-cover bg-center opacity-10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>


            <div className="relative z-10 text-center text-white">
              <img
                src={config?.logotype || defaultLogo}
                alt={config?.tenant_name || "Logotipo"}
                className="mx-auto mb-4 object-contain h-32 w-auto max-w-48"
              />
              <h1 className="text-2xl font-bold mb-2">{config?.tenant_name || "¡Hola!"}</h1>
              <p className="text-orange-100 text-sm mb-6 max-w-xs mx-auto">
                {config?.business_description ||
                  `Mesa ${unpaidOrders?.table_number || "X"} • Explora nuestro delicioso menú y haz tu primer pedido`}
              </p>
            </div>


            </div>

            {/* Ofertas Carousel en lugar de los cuadrados */}
            <OffersCarousel offers={offers} />

            {/* Eliminar los cuadrados de Menú Completo y Ofertas Especiales */}
          </div>
        )}

        {/* Chatbot Button - repositioned */}

        {/* Order Success Message */}
        {showOrderSuccess && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-green-800 dark:text-green-200 font-bold text-lg">¡Orden creada exitosamente!</h3>
                <p className="text-green-600 dark:text-green-400 text-sm">
                  Tu pedido ha sido enviado a la cocina
                  {location.state?.orderNumber && ` - Orden #${location.state.orderNumber}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Waiter Called Banner */}
        {waiterCalled && (
          <div
            onClick={() => setShowCancelWaiterModal(true)}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-2xl p-6 cursor-pointer hover:from-blue-100 dark:hover:from-blue-900/30 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-blue-800 dark:text-blue-200 font-bold text-lg">Mozo en camino</h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">Toca para cancelar llamado</p>
                </div>
              </div>
              <div className="animate-pulse">
                <Phone className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
        )}

        {/* Órdenes en Proceso */}
        {hasOrders && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-500" />
              Órdenes en Proceso
            </h2>
            {unpaidOrders.orders.map((order) => (
              <div
                key={order.uuid}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-orange-200/50 dark:border-orange-800/50 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-orange-900 dark:text-orange-100">
                    Orden #{order.order_number}
                  </h3>
                  <div className="flex items-center gap-2 bg-orange-100/80 dark:bg-orange-900/30 px-3 py-2 rounded-2xl backdrop-blur-sm">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.order_products.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-orange-50/80 dark:bg-orange-900/20 rounded-2xl p-4 backdrop-blur-sm"
                    >
                      <span className="text-orange-800 dark:text-orange-200 font-medium">
                        {item.quantity}x {item.product_details?.name || item.offer_details?.name || "Producto"}
                      </span>
                      <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                        ${((item.product_details?.price || item.offer_details?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumen de Cuenta */}
        {hasBalance && (
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100/50 dark:border-gray-700/50">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-green-500" />
              Resumen de Cuenta
            </h2>

            <div className="space-y-4">
              {unpaidOrders.orders.flatMap((order) =>
                order.order_products.map((item, index) => (
                  <div
                    key={`${order.uuid}-${index}`}
                    className="flex justify-between items-center py-3 border-b border-gray-100/50 dark:border-gray-700/50 last:border-b-0"
                  >
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {item.quantity}x {item.product_details?.name || item.offer_details?.name || "Producto"}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ${((item.product_details?.price || item.offer_details?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                )),
              )}

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 mt-6 backdrop-blur-sm border border-green-200/50 dark:border-green-800/50">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Total a Pagar</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${unpaidOrders.total_amount_owed.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


       <div className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto">
          <div className="absolute inset-x-0 -bottom-2 h-8 bg-gradient-to-t from-white/95 to-transparent dark:from-gray-900/95 pointer-events-none"></div>
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl p-4 shadow-xl border border-gray-200/30 dark:border-gray-700/30 relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent"></div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/menu/${tableId}`)}
                className="flex-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-700/90 border border-gray-200/40 dark:border-gray-600/40 hover:border-orange-300/60 dark:hover:border-orange-500/60 text-gray-900 dark:text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:scale-[1.02]"
              >
                <Plus className="w-5 h-5" />
                Ordenar
              </button>
            </div>
          </div>
        </div>


      {(hasOrders || hasBalance) && (
        <div className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto">
          <div className="absolute inset-x-0 -bottom-2 h-8 bg-gradient-to-t from-white/95 to-transparent dark:from-gray-900/95 pointer-events-none"></div>

          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl p-4 shadow-xl border border-gray-200/30 dark:border-gray-700/30 relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent"></div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/menu/${tableId}`)}
                className="flex-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-700/90 border border-gray-200/40 dark:border-gray-600/40 hover:border-orange-300/60 dark:hover:border-orange-500/60 text-gray-900 dark:text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:scale-[1.02]"
              >
                <Plus className="w-5 h-5" />
                Ordenar
              </button>

              {hasBalance && (
                <button
                  onClick={() => {
                    // Check if there's more than one person at the table
                    apiClient
                      .getOpenSessions()
                      .then((response) => {
                        if (response.open_sessions > 1) {
                          // Show payment selection if more than one person
                          navigate(`/payment-split/${tableId}`, {
                            state: { unpaidOrders },
                          })
                        } else {
                          // Go directly to payment if only one person
                          navigate(`/payment/${tableId}`, {
                            state: {
                              paymentType: "individual",
                              unpaidOrders,
                            },
                          })
                        }
                      })
                      .catch((error) => {
                        console.error("Error checking open sessions:", error)
                        // Fallback to payment selection
                        navigate(`/payment-split/${tableId}`, {
                          state: { unpaidOrders },
                        })
                      })
                  }}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:scale-[1.02]"
                >
                  <CreditCard className="w-5 h-5" />
                  Pagar ${unpaidOrders.total_amount_owed.toFixed(2)}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation tableId={tableId || ""} onCallWaiter={handleCallWaiter} />

      {/* Waiter Call Confirmation Modal */}
      {showWaiterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100/50 dark:border-gray-700/50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Phone className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">¿Llamar al mozo?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">El mozo será notificado y se dirigirá a tu mesa</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowWaiterModal(false)}
                  className="flex-1 bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-4 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmCallWaiter}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                >
                  Llamar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Waiter Call Modal */}
      {showCancelWaiterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100/50 dark:border-gray-700/50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <X className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">¿Cancelar llamado?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Se cancelará la notificación al mozo</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCancelWaiterModal(false)}
                  className="flex-1 bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-4 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm"
                >
                  Mantener
                </button>
                <button
                  onClick={handleCancelWaiter}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                >
                  Cancelar Llamado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
