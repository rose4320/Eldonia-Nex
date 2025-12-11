'use client';

import { useEffect, useRef, useState } from 'react';

interface VenueSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
}

interface VenueMapSearchProps {
  onVenueSelect: (venue: {
    name: string;
    address: string;
    placeId: string;
    lat: number;
    lng: number;
  }) => void;
  initialLocation?: string;
}

export default function VenueMapSearch({ onVenueSelect, initialLocation = '東京都' }: VenueMapSearchProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [searchResults, setSearchResults] = useState<VenueSearchResult[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<VenueSearchResult | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Google Maps APIの読み込み
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=ja`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    // 東京駅を初期位置に設定
    const defaultCenter = { lat: 35.6812, lng: 139.7671 };

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    setMap(mapInstance);

    // 検索ボックスの初期化
    if (searchInputRef.current) {
      const searchBoxInstance = new google.maps.places.SearchBox(searchInputRef.current);
      setSearchBox(searchBoxInstance);

      // 検索範囲を地図の表示範囲に限定
      mapInstance.addListener('bounds_changed', () => {
        searchBoxInstance.setBounds(mapInstance.getBounds() as google.maps.LatLngBounds);
      });

      // 検索結果のリスナー
      searchBoxInstance.addListener('places_changed', () => {
        const places = searchBoxInstance.getPlaces();
        if (!places || places.length === 0) return;

        // 既存のマーカーをクリア
        markers.forEach(marker => marker.setMap(null));
        setMarkers([]);

        // 検索結果を保存
        const results: VenueSearchResult[] = places.map(place => ({
          place_id: place.place_id || '',
          name: place.name || '',
          formatted_address: place.formatted_address || '',
          geometry: {
            location: {
              lat: place.geometry?.location?.lat() || 0,
              lng: place.geometry?.location?.lng() || 0,
            },
          },
          rating: place.rating,
          user_ratings_total: place.user_ratings_total,
          types: place.types,
        }));

        setSearchResults(results);

        // 新しいマーカーを追加
        const newMarkers: google.maps.Marker[] = [];
        const bounds = new google.maps.LatLngBounds();

        results.forEach((place) => {
          if (!place.geometry.location) return;

          const marker = new google.maps.Marker({
            map: mapInstance,
            title: place.name,
            position: place.geometry.location,
          });

          marker.addListener('click', () => {
            handleVenueClick(place);
          });

          newMarkers.push(marker);
          bounds.extend(place.geometry.location);
        });

        setMarkers(newMarkers);
        mapInstance.fitBounds(bounds);
      });
    }
  };

  const handleVenueClick = (venue: VenueSearchResult) => {
    setSelectedVenue(venue);
  };

  const handleSelectVenue = () => {
    if (selectedVenue) {
      onVenueSelect({
        name: selectedVenue.name,
        address: selectedVenue.formatted_address,
        placeId: selectedVenue.place_id,
        lat: selectedVenue.geometry.location.lat,
        lng: selectedVenue.geometry.location.lng,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* 検索ボックス */}
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="会場名、住所、または施設タイプで検索（例: 会議室 渋谷）"
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-base"
        />
        <div className="absolute right-3 top-3 text-gray-400">
          🔍
        </div>
      </div>

      {/* 地図 */}
      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-lg"
      />

      {/* 検索結果リスト */}
      {searchResults.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600 p-4 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            検索結果 ({searchResults.length}件)
          </h3>
          <div className="space-y-2">
            {searchResults.map((venue) => (
              <div
                key={venue.place_id}
                onClick={() => handleVenueClick(venue)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedVenue?.place_id === venue.place_id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                      {venue.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      📍 {venue.formatted_address}
                    </p>
                    {venue.rating && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {venue.rating.toFixed(1)}
                        </span>
                        {venue.user_ratings_total && (
                          <span className="text-gray-500 dark:text-gray-400">
                            ({venue.user_ratings_total}件)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {selectedVenue?.place_id === venue.place_id && (
                    <div className="text-blue-500 text-2xl">✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 選択ボタン */}
      {selectedVenue && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-4 rounded-lg border-2 border-blue-300 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">選択中の会場:</p>
              <p className="font-bold text-gray-900 dark:text-white">{selectedVenue.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedVenue.formatted_address}</p>
            </div>
            <button
              onClick={handleSelectVenue}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              この会場を選択
            </button>
          </div>
        </div>
      )}

      {/* ヘルプテキスト */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>ヒント:</strong> 上の検索ボックスに会場名、住所、または「会議室 渋谷」のように入力して検索してください。
          地図上のマーカーをクリックして会場を選択できます。
        </p>
      </div>
    </div>
  );
}
