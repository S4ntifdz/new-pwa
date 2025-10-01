"use client"

import { useState, useEffect } from "react"
import type { Offer } from "../types"
import { Sparkles, Gift, Star } from "lucide-react"

interface OffersCarouselProps {
  offers: Offer[]
}

export function OffersCarousel({ offers }: OffersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (offers.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === offers.length - 1 ? 0 : prevIndex + 1))
    }, 4000)

    return () => clearInterval(interval)
  }, [offers.length])

  if (offers.length === 0) return null

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl
     p-6 shadow-xl border border-gray-100/50 dark:border-gray-700/50 mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ofertas Especiales</h3>
        <div className="flex items-center gap-1 ml-auto">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Destacadas</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl shadow-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {offers.map((offer) => (
            <div
              key={offer.uuid}
              className="w-full flex-shrink-0 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 p-8 text-white relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

              <div className="text-center relative z-10">
                <div className="text-5xl mb-4">🎉</div>
                <h4 className="text-2xl font-bold mb-3">{offer.name}</h4>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-4xl font-bold">${offer.price.toFixed(2)}</span>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20">
                    <span className="text-sm font-bold">¡OFERTA!</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm opacity-90 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20">
                  <Gift className="w-4 h-4" />
                  <span>{offer.products.length} productos incluidos</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {offers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-gradient-to-r from-orange-500 to-red-500 scale-125 shadow-lg"
                : "bg-gray-300 dark:bg-gray-600 hover:bg-orange-300 dark:hover:bg-orange-700 hover:scale-110"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
