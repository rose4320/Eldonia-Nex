// Google Maps JavaScript API型定義

interface Window {
  google: typeof google;
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      fitBounds(bounds: LatLngBounds): void;
      getBounds(): LatLngBounds | undefined;
      addListener(eventName: string, handler: Function): void;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      addListener(eventName: string, handler: Function): void;
    }

    class LatLngBounds {
      extend(latLng: LatLng | LatLngLiteral): void;
    }

    interface MapOptions {
      center?: LatLngLiteral;
      zoom?: number;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
    }

    interface MarkerOptions {
      position?: LatLngLiteral;
      map?: Map;
      title?: string;
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    namespace places {
      class SearchBox {
        constructor(inputField: HTMLInputElement);
        addListener(eventName: string, handler: Function): void;
        getPlaces(): PlaceResult[];
        setBounds(bounds: LatLngBounds): void;
      }

      interface PlaceResult {
        place_id?: string;
        name?: string;
        formatted_address?: string;
        geometry?: PlaceGeometry;
        rating?: number;
        user_ratings_total?: number;
        types?: string[];
      }

      interface PlaceGeometry {
        location?: LatLng;
        viewport?: LatLngBounds;
      }
    }
  }
}
