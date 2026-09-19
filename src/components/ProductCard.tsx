import Image from 'next/image'
import { Product } from '@/types/product'

export default function ProductCard({ product }: { product: Product }) {
  const isML = product.source === 'mercadolibre'
  const isNew = product.condition === 'new'

  return (
    <a
      href={product.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200"
    >
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
            📦
          </div>
        )}
        <span
          className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isML ? 'bg-yellow-400 text-yellow-900' : 'bg-green-500 text-white'
          }`}
        >
          {isML ? 'ML' : 'EC'}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <p className="text-sm text-gray-800 leading-snug line-clamp-2 font-medium min-h-[2.5rem]">
          {product.title}
        </p>

        <p className="text-lg font-bold text-[#D85A30]">
          ${product.price.toLocaleString('es-AR')}
        </p>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isML ? 'bg-yellow-400' : 'bg-green-500'
              }`}
            />
            {isML ? 'Mercado Libre' : 'EnvioCompras'}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isNew ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}
          >
            {isNew ? 'Nuevo' : 'Usado'}
          </span>
        </div>

        <div className="mt-auto pt-2 w-full text-center text-xs font-semibold text-white bg-[#D85A30] hover:bg-[#B84A22] rounded-lg py-2 transition-colors">
          Ver publicación →
        </div>
      </div>
    </a>
  )
}