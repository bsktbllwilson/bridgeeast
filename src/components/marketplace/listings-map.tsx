'use client'

import 'mapbox-gl/dist/mapbox-gl.css'

import mapboxgl from 'mapbox-gl'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { formatCentsCompact, formatCuisine } from '@/lib/format'

export type MapListing = {
  id: string
  title: string
  city: string | null
  state: string | null
  neighborhood: string | null
  cuisine: string | null
  cover_image_url: string | null
  asking_price_cents: number | null
  lat: number
  lng: number
}

const DEFAULT_CENTER: [number, number] = [-73.95, 40.73] // NYC
const DEFAULT_ZOOM = 10

export function ListingsMap({
  listings,
  mapboxToken,
}: {
  listings: MapListing[]
  mapboxToken: string | null
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapboxToken || !containerRef.current || mapRef.current) return

    mapboxgl.accessToken = mapboxToken

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    })
    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')

    map.on('load', () => {
      const features = listings.map((l) => ({
        type: 'Feature' as const,
        properties: {
          id: l.id,
          title: l.title,
          city: l.city,
          state: l.state,
          neighborhood: l.neighborhood,
          cuisine: l.cuisine,
          cover_image_url: l.cover_image_url,
          asking_price_cents: l.asking_price_cents,
        },
        geometry: { type: 'Point' as const, coordinates: [l.lng, l.lat] },
      }))

      map.addSource('listings', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      })

      // Cluster bubbles
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'listings',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#E8542C',
          'circle-radius': ['step', ['get', 'point_count'], 22, 5, 28, 15, 36],
          'circle-stroke-width': 3,
          'circle-stroke-color': '#FFFFFF',
        },
      })
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'listings',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 14,
        },
        paint: { 'text-color': '#FFFFFF' },
      })

      // Unclustered single pins
      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'listings',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#E8542C',
          'circle-radius': 10,
          'circle-stroke-width': 3,
          'circle-stroke-color': '#FFFFFF',
        },
      })

      // Cluster click → zoom in
      map.on('click', 'clusters', (e) => {
        const feature = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })[0]
        if (!feature) return
        const clusterId = feature.properties?.cluster_id as number | undefined
        if (clusterId == null) return
        const source = map.getSource('listings') as mapboxgl.GeoJSONSource
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom == null) return
          const geom = feature.geometry
          if (geom.type !== 'Point') return
          map.easeTo({ center: geom.coordinates as [number, number], zoom })
        })
      })

      // Single pin click → popup
      map.on('click', 'unclustered-point', (e) => {
        const feature = e.features?.[0]
        if (!feature || feature.geometry.type !== 'Point') return
        const coords = feature.geometry.coordinates.slice() as [number, number]
        const props = feature.properties as MapListing | null
        if (!props) return

        const html = renderPopupHtml(props)
        new mapboxgl.Popup({ offset: 18, closeButton: true, maxWidth: '300px' })
          .setLngLat(coords)
          .setHTML(html)
          .addTo(map)
      })

      // Cursor affordance
      const setPointer = () => (map.getCanvas().style.cursor = 'pointer')
      const clearPointer = () => (map.getCanvas().style.cursor = '')
      map.on('mouseenter', 'clusters', setPointer)
      map.on('mouseleave', 'clusters', clearPointer)
      map.on('mouseenter', 'unclustered-point', setPointer)
      map.on('mouseleave', 'unclustered-point', clearPointer)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [listings, mapboxToken])

  if (!mapboxToken) {
    return <FallbackList listings={listings} />
  }

  return (
    <div
      ref={containerRef}
      className="h-[500px] w-full overflow-hidden rounded-2xl border border-brand-border bg-brand-cream/40"
      role="application"
      aria-label="Map of available listings"
    />
  )
}

function renderPopupHtml(p: MapListing): string {
  const location = [p.neighborhood, p.state].filter(Boolean).join(', ')
  const cuisine = formatCuisine(p.cuisine)
  const subtitle = [location, cuisine].filter(Boolean).join(' · ')
  const price = formatCentsCompact(p.asking_price_cents)
  const cover = p.cover_image_url
    ? `<div style="background-image:url('${escapeHtml(p.cover_image_url)}');background-size:cover;background-position:center;height:120px;border-radius:12px 12px 0 0;"></div>`
    : ''
  return `
    <a href="/buy/${escapeHtml(p.id)}" style="display:block;text-decoration:none;color:inherit;font-family:system-ui,sans-serif;">
      ${cover}
      <div style="padding:12px 14px 14px;">
        <div style="font-weight:600;font-size:15px;line-height:1.2;color:#0A0A0A;">${escapeHtml(p.title)}</div>
        ${subtitle ? `<div style="margin-top:4px;font-size:12px;color:#6B6B6B;">${escapeHtml(subtitle)}</div>` : ''}
        <div style="margin-top:8px;font-weight:600;color:#E8542C;font-size:14px;">${price}</div>
      </div>
    </a>
  `
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function FallbackList({ listings }: { listings: MapListing[] }) {
  return (
    <div className="rounded-2xl border border-brand-border bg-white p-6 text-sm text-brand-muted">
      <p className="mb-4">
        Map disabled. Set <code className="text-brand-ink">NEXT_PUBLIC_MAPBOX_TOKEN</code> in your
        environment to enable the interactive map.
      </p>
      {listings.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {listings.map((l) => (
            <li key={l.id}>
              <Link
                href={`/buy/${l.id}`}
                className="block rounded-xl border border-brand-border p-3 transition-colors hover:bg-brand-cream"
              >
                <div className="font-medium text-brand-ink">{l.title}</div>
                <div className="mt-1 text-xs text-brand-muted">
                  {[l.neighborhood, l.state].filter(Boolean).join(', ')}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
