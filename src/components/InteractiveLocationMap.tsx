'use client';

import React from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

interface InteractiveLocationMapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  zoom?: number;
  interactive?: boolean;
  onCoordinatesChange?: (lat: number, lng: number) => void;
  className?: string;
}

export const InteractiveLocationMap: React.FC<InteractiveLocationMapProps> = ({
  latitude = 19.0760,
  longitude = 72.8777,
  address,
  zoom = 15,
  interactive = true,
  onCoordinatesChange,
  className = 'h-64'
}) => {
  // Bounding box calculation for OpenStreetMap embed
  const delta = 0.008;
  const bbox = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
  const osmFullUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`;

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-black/15 bg-neutral-100 ${className}`}>
      {/* Map iframe */}
      <iframe
        title="Issue GPS Map"
        width="100%"
        height="100%"
        src={osmEmbedUrl}
        className="w-full h-full border-0 filter grayscale contrast-125"
        loading="lazy"
      />

      {/* Top Coordinate Badge Overlay */}
      <div className="absolute top-3 left-3 bg-black/90 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1.5 rounded-lg border border-neutral-700 shadow-md flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-white animate-pulse" />
        <span>
          {latitude.toFixed(5)}° N, {longitude.toFixed(5)}° E
        </span>
      </div>

      {/* External Full Map Link */}
      <div className="absolute top-3 right-3">
        <a
          href={osmFullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/95 text-black hover:bg-black hover:text-white transition-colors text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow border border-neutral-200 flex items-center gap-1"
        >
          <span>Open Full Map</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Manual Pin Correction Controls if interactive */}
      {interactive && onCoordinatesChange && (
        <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-neutral-300 shadow-lg flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="text-[11px] text-neutral-600 truncate max-w-xs">
            {address ? <span className="font-semibold text-black">{address}</span> : 'Pin marked via browser GPS'}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-neutral-500 font-mono">Fine tune pin:</span>
            <button
              type="button"
              onClick={() => onCoordinatesChange(latitude + 0.0005, longitude)}
              className="px-2 py-0.5 bg-neutral-100 hover:bg-black hover:text-white rounded border text-[10px] font-bold"
              title="Move Pin North"
            >
              ▲ N
            </button>
            <button
              type="button"
              onClick={() => onCoordinatesChange(latitude - 0.0005, longitude)}
              className="px-2 py-0.5 bg-neutral-100 hover:bg-black hover:text-white rounded border text-[10px] font-bold"
              title="Move Pin South"
            >
              ▼ S
            </button>
            <button
              type="button"
              onClick={() => onCoordinatesChange(latitude, longitude - 0.0005)}
              className="px-2 py-0.5 bg-neutral-100 hover:bg-black hover:text-white rounded border text-[10px] font-bold"
              title="Move Pin West"
            >
              ◀ W
            </button>
            <button
              type="button"
              onClick={() => onCoordinatesChange(latitude, longitude + 0.0005)}
              className="px-2 py-0.5 bg-neutral-100 hover:bg-black hover:text-white rounded border text-[10px] font-bold"
              title="Move Pin East"
            >
              ▶ E
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
