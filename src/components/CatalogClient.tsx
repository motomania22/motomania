'use client'

import { useState, useMemo } from 'react'
import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'

type SortOrder = 'default' | 'precio-asc' | 'precio-desc' | 'az'
type SourceFilter = 'todos' | 'mercadolibre' | 'enviocompras'

export default function CatalogClient({ products }: { products: Product[] }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')
  const [source, setSource] = useState<SourceFilter>('todos')
  const [sort, setSort] = useState<SortOrder>('default')

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(products.map((p) => p.category_name).filter(Boolean))
    ).sort()
    return ['Todos', ...cats]
  }, [products])

  const filtered = useMemo(() => {
    let list = [...products]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.title.toLowerCase().includes(q))
    }
    if (category !== 'Todos') list = list.filter((p) => p.category_name === category)
    if (source !== 'todos') list = list.filter((p) => p.source === source)
    if (sort === 'precio-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'precio-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'az') list.sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [products, search, category, source, sort])

  const mlCount = products.filter((p) => p.source === 'mercadolibre').length
  const ecCount = products.filter((p) => p.source === 'enviocompras').length
  const avgPrice =
    products.length > 0
      ? Math.round(products.reduce((a, p) => a + p.price, 0) / products.length)
      : 0

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Catálogo de productos
        </h1>
        <p className="text-sm text-gray-500">
          Repuestos y accesorios para tu moto — hacé clic para comprar
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total productos', value: products.length },
          { label: 'Mercado Libre', value: mlCount },
          { label: 'EnvioCompras', value: ecCount },
          { label: 'Precio promedio', value: `$${avgPrice.toLocaleString('es-AR')}` },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <p className="text-xs text-gray-500 mb-0.5">{s.label}</p>
            <p className="text-lg font-semibold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por producto, marca, modelo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30] focus:border-transparent"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOrder)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#D85A30]"
        >
          <option value="default">Relevancia</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="az">A → Z</option>
        </select>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(
          [
            { val: 'todos' as SourceFilter, label: 'Todas las fuentes', cls: 'bg-gray-800 border-gray-800 text-white' },
            { val: 'mercadolibre' as SourceFilter, label: '🛒 Mercado Libre', cls: 'bg-yellow-400 border-yellow-400 text-yellow-900' },
            { val: 'enviocompras' as SourceFilter, label: '📦 EnvioCompras', cls: 'bg-green-500 border-green-500 text-white' },
          ]
        ).map((f) => (
          <button
            key={f.val}
            onClick={() => setSource(f.val)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              source === f.val
                ? f.cls
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              category === cat
                ? 'bg-[#D85A30] border-[#D85A30] text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado
        {filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm">No encontramos productos para tu búsqueda.</p>
          <button
            onClick={() => {
              setSearch('')
              setCategory('Todos')
              setSource('todos')
            }}
            className="mt-3 text-xs text-[#D85A30] underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </section>
  )
}