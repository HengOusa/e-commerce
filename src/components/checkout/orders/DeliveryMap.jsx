import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { createPortal } from "react-dom";
import L from "leaflet";
import {
  MapPin,
  Warehouse,
  Navigation,
  Clock,
  Truck,
  Package,
  CheckCircle2,
  Ban,
  Plus,
  Minus,
  Maximize2,
  ExternalLink,
} from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";

const DEFAULT_ORIGIN = [11.5564, 104.9282];
const DEFAULT_DEST = [11.5449, 104.8922];

const toRad = (deg) => (deg * Math.PI) / 180;
const haversineKm = (a, b) => {
  const R = 6371,
    dLat = toRad(b[0] - a[0]),
    dLon = toRad(b[1] - a[1]),
    lat1 = toRad(a[0]),
    lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
const formatDistance = (km) =>
  km < 1 ? `${(km * 1000).toFixed(0)} m` : `${km.toFixed(1)} km`;
const estimateEta = (km) => {
  const minutes = Math.max(5, Math.round(km * 3));
  if (minutes < 60) return `~${minutes} min`;
  const h = Math.floor(minutes / 60),
    m = minutes % 60;
  return `~${h}h ${m > 0 ? `${m}m` : ""}`;
};

const decodePolyline = (encoded) => {
  const points = [];
  let index = 0,
    lat = 0,
    lng = 0;
  while (index < encoded.length) {
    let shift = 0,
      result = 0;
    let byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push([lat * 1e-5, lng * 1e-5]);
  }
  return points;
};

const createPinIcon = (color, IconComponent, size = 36) => {
  const pinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 1.3}" viewBox="0 0 24 31" fill="none"><path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 19 12 19s12-10 12-19c0-6.63-5.37-12-12-12z" fill="${color}"/><circle cx="12" cy="12" r="5" fill="white"/></svg>`;
  const iconSvg = renderToStaticMarkup(
    <IconComponent className="w-3.5 h-3.5" style={{ color }} />,
  );
  const html = `<div style="position:relative;width:${size}px;height:${size * 1.3}px;display:flex;align-items:center;justify-content:center;"><div style="position:absolute;top:0;left:0;width:100%;height:100%;">${pinSvg}</div><div style="position:absolute;top:6px;left:50%;transform:translateX(-50%);z-index:2;">${iconSvg}</div></div>`;
  return L.divIcon({
    html,
    className: "custom-google-pin",
    iconSize: [size, size * 1.3],
    iconAnchor: [size / 2, size * 1.3 - 2],
    popupAnchor: [0, -size * 1.3 + 4],
  });
};

const originIcon = createPinIcon("#4285F4", Warehouse, 36);
const destIcon = createPinIcon("#EA4335", MapPin, 36);

const FitBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds?.length) {
      const latLngBounds = L.latLngBounds(
        bounds.map((b) => L.latLng(b[0], b[1])),
      );
      map.fitBounds(latLngBounds, {
        padding: [80, 80],
        maxZoom: 16,
        animate: true,
      });
    }
  }, [map, bounds]);
  return null;
};

const MapController = () => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.zoomControl?.remove();
    }
  }, [map]);
  return null;
};

const ZoomControls = ({ isFullscreen, onFullscreenToggle, origin, dest }) => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.join(",")}&destination=${dest.join(",")}`;

  useEffect(() => {
    const handler = () => setZoom(map.getZoom());
    map.on("zoomend", handler);
    return () => map.off("zoomend", handler);
  }, [map]);

  const handleZoomIn = useCallback(() => map.zoomIn(), [map]);
  const handleZoomOut = useCallback(() => map.zoomOut(), [map]);
  const handleGoogleMaps = useCallback(
    () => window.open(googleMapsUrl, "_blank"),
    [googleMapsUrl],
  );
  const handleFullscreen = useCallback(() => onFullscreenToggle(), []);

  return (
    <div className="absolute right-3 top-3 z-[400] flex flex-col gap-1">
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors active:scale-95"
        aria-label="Zoom in"
      >
        <Plus className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={handleZoomOut}
        className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors active:scale-95"
        aria-label="Zoom out"
      >
        <Minus className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={handleFullscreen}
        className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors active:scale-95"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        <Maximize2 className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={handleGoogleMaps}
        className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors active:scale-95"
        aria-label="Open in Google Maps"
      >
        <ExternalLink className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
};

const RouteInfoCard = ({ order, distanceKm, eta }) => {
  const isCancelled = order?.status === "cancelled";
  const isDelivered = order?.status === "delivered";
  const isActive = !isCancelled && !isDelivered;
  const statusMeta = {
    placed: {
      label: "Placed",
      color: "bg-gray-100 text-gray-700",
      icon: Package,
    },
    confirmed: {
      label: "Confirmed",
      color: "bg-blue-100 text-blue-700",
      icon: CheckCircle2,
    },
    shipped: {
      label: "Shipped",
      color: "bg-indigo-100 text-indigo-700",
      icon: Truck,
    },
    out_for_delivery: {
      label: "Out for Delivery",
      color: "bg-orange-100 text-orange-700",
      icon: Truck,
    },
    delivered: {
      label: "Delivered",
      color: "bg-green-100 text-green-700",
      icon: CheckCircle2,
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-100 text-red-700",
      icon: Ban,
    },
  };
  const meta = statusMeta[order?.status] || statusMeta.placed;
  const StatusIcon = meta.icon;

  return (
    <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center pt-1 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#4285F4] border-2 border-white shadow-sm" />
          <div className="w-0.5 flex-1 bg-gray-200 my-1" />
          <div className="w-3 h-3 rounded-full bg-[#EA4335] border-2 border-white shadow-sm" />
        </div>
        <div className="flex-1 min-w-0 grid grid-cols-1 gap-2">
          <div>
            <p className="text-xs font-medium text-gray-900 truncate">
              Ousa Warehouse
            </p>
            <p className="text-[11px] text-gray-500 truncate">
              Order dispatch center
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900 truncate">
              {order?.customer?.address || "Delivery Address"}
            </p>
            <p className="text-[11px] text-gray-500 truncate">
              {order?.customer?.name || "Customer"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1 text-gray-900">
              <Navigation className="w-4 h-4" />
              <span className="text-sm font-bold">
                {formatDistance(distanceKm)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {isDelivered ? "Arrived" : isCancelled ? "—" : eta}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${meta.color} shadow-md`}
            >
              <StatusIcon className="w-4 h-4" />
            </div>
            {isActive && (
              <div className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 ring-2 ring-white/50 shadow-sm" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FullscreenMap = ({
  order,
  onClose,
  origin,
  dest,
  distanceKm,
  eta,
  bounds,
  routeCoords = [],
  isCancelled,
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex flex-col bg-white">
      <div className="flex-1 relative">
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [100, 100], maxZoom: 16 }}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
            url="https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            subdomains={["0", "1", "2", "3"]}
            maxZoom={20}
          />
          <MapController />
          <FitBounds bounds={bounds} />
          <ZoomControls
            isFullscreen={true}
            origin={origin}
            dest={dest}
            onFullscreenToggle={() => {}}
          />
          <Polyline
            positions={routeCoords.length > 1 ? routeCoords : [origin, dest]}
            pathOptions={{
              color: "rgba(0,0,0,0.12)",
              weight: 10,
              opacity: 1,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
          <Polyline
            positions={routeCoords.length > 1 ? routeCoords : [origin, dest]}
            pathOptions={{
              color: "#AECBFA",
              weight: 8,
              opacity: 0.35,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
          <Polyline
            positions={routeCoords.length > 1 ? routeCoords : [origin, dest]}
            pathOptions={{
              color: isCancelled ? "#EA4335" : "#4285F4",
              weight: 5,
              opacity: 1,
              dashArray: isCancelled ? "10, 8" : undefined,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
          <Marker position={origin} icon={originIcon}>
            <Popup>
              <div className="text-sm font-semibold text-gray-900">
                Ousa Warehouse
              </div>
              <div className="text-xs text-gray-500">Order dispatch center</div>
            </Popup>
          </Marker>
          <Marker position={dest} icon={destIcon}>
            <Popup>
              <div className="text-sm font-semibold text-gray-900">
                Delivery Address
              </div>
              <div className="text-xs text-gray-500">
                {order?.customer?.address || "Customer address"}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
        <RouteInfoCard order={order} distanceKm={distanceKm} eta={eta} />
        {isCancelled && (
          <div className="absolute inset-0 bg-red-500/5 flex items-center justify-center pointer-events-none z-[401]">
            <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border border-red-100">
              <span className="text-sm font-semibold text-red-600">
                Order Cancelled
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="absolute right-4 top-4 z-[1001] flex flex-col bg-white/95 backdrop-blur-xl rounded-2xl p-3 gap-2 shadow-2xl border border-white/50">
        <button
          onClick={() => {
            const mapInstance = window.mapInstance;
            if (mapInstance) mapInstance.zoomIn();
          }}
          className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg flex items-center justify-center hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 hover:shadow-xl hover:scale-[1.05] active:scale-[0.98] border border-blue-100/50"
          aria-label="Zoom in"
        >
          <Plus className="w-5 h-5 text-blue-600" />
        </button>
        <button
          onClick={() => {
            const mapInstance = window.mapInstance;
            if (mapInstance) mapInstance.zoomOut();
          }}
          className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg flex items-center justify-center hover:from-gray-100 hover:to-gray-200 transition-all duration-200 hover:shadow-xl hover:scale-[1.05] active:scale-[0.98] border border-gray-200/50"
          aria-label="Zoom out"
        >
          <Minus className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={onClose}
          className="w-12 h-12 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl shadow-lg flex items-center justify-center hover:from-red-100 hover:to-rose-100 transition-all duration-200 hover:shadow-xl hover:scale-[1.05] active:scale-[0.98] border border-red-100/50"
          aria-label="Exit fullscreen"
        >
          <Maximize2 className="w-5 h-5 text-red-600 rotate-180" />
        </button>
        <button
          onClick={() =>
            window.open(
              `https://www.google.com/maps/dir/?api=1&origin=${origin.join(",")}&destination=${dest.join(",")}`,
              "_blank",
            )
          }
          className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl shadow-lg flex items-center justify-center hover:from-emerald-100 hover:to-green-100 transition-all duration-200 hover:shadow-xl hover:scale-[1.05] active:scale-[0.98] border border-emerald-100/50"
          aria-label="Open in Google Maps"
        >
          <ExternalLink className="w-5 h-5 text-emerald-600" />
        </button>
      </div>
    </div>,
    document.body,
  );
};

const DeliveryMap = ({ order }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [routeCoords, setRouteCoords] = useState([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const origin = order?.originCoordinates || DEFAULT_ORIGIN;
  const dest = order?.deliveryCoordinates || DEFAULT_DEST;
  const isCancelled = order?.status === "cancelled";
  const isDelivered = order?.status === "delivered";
  const isInTransit = ["shipped", "out_for_delivery"].includes(order?.status);

  const distanceKm = useMemo(() => haversineKm(origin, dest), [origin, dest]);

  const fetchRoute = useCallback(async () => {
    if (!origin || !dest || origin[0] === dest[0] || origin[1] === dest[1])
      return;
    setIsLoadingRoute(true);
    try {
      const [lat1, lng1] = origin;
      const [lat2, lng2] = dest;
      const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=full&alternatives=false&geometries=polyline`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes?.[0]?.geometry) {
        const coords = decodePolyline(data.routes[0].geometry);
        setRouteCoords(coords);
      }
    } catch (err) {
      console.warn("Route fetch failed:", err);
      setRouteCoords([]);
    } finally {
      setIsLoadingRoute(false);
    }
  }, [origin, dest]);

  useEffect(() => {
    fetchRoute();
  }, [fetchRoute]);
  const eta = useMemo(() => estimateEta(distanceKm), [distanceKm]);
  const truckPos = null;
  const bounds = useMemo(
    () => (routeCoords.length > 1 ? routeCoords : [origin, dest]),
    [routeCoords, origin, dest],
  );

  if (isFullscreen) {
    return (
      <FullscreenMap
        order={order}
        onClose={() => setIsFullscreen(false)}
        origin={origin}
        dest={dest}
        distanceKm={distanceKm}
        eta={eta}
        bounds={bounds}
        routeCoords={routeCoords}
        isCancelled={isCancelled}
      />
    );
  }

  return (
    <div className="w-full rounded-xl border border-gray-200 shadow-sm bg-gray-100 flex flex-col h-72 lg:h-96">
      <div className="flex-1 relative rounded-t-xl overflow-hidden min-h-[200px] z-0">
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [80, 80], maxZoom: 16 }}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
            url="https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            subdomains={["0", "1", "2", "3"]}
            maxZoom={20}
          />
          <MapController />
          <FitBounds bounds={bounds} />
          <ZoomControls
            isFullscreen={isFullscreen}
            origin={origin}
            dest={dest}
            onFullscreenToggle={() => setIsFullscreen(true)}
          />
          <Polyline
            positions={routeCoords.length > 1 ? routeCoords : [origin, dest]}
            pathOptions={{
              color: "rgba(0,0,0,0.12)",
              weight: 10,
              opacity: 1,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
          <Polyline
            positions={routeCoords.length > 1 ? routeCoords : [origin, dest]}
            pathOptions={{
              color: "#AECBFA",
              weight: 8,
              opacity: 0.35,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
          <Marker position={origin} icon={originIcon}>
            <Popup>
              <div className="text-sm font-semibold text-gray-900">
                Ousa Warehouse
              </div>
              <div className="text-xs text-gray-500">Order dispatch center</div>
            </Popup>
          </Marker>
          <Marker position={dest} icon={destIcon}>
            <Popup>
              <div className="text-sm font-semibold text-gray-900">
                Delivery Address
              </div>
              <div className="text-xs text-gray-500">
                {order?.customer?.address || "Customer address"}
              </div>
            </Popup>
          </Marker>
          {truckPos && (
            <Marker position={truckPos} icon={createTruckIcon()}>
              <Popup>
                <div className="text-sm font-semibold text-gray-900">
                  On the way
                </div>
                <div className="text-xs text-gray-500">
                  Driver is en route to destination
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
        {isCancelled && (
          <div className="absolute inset-0 bg-red-500/5 flex items-center justify-center pointer-events-none z-[400]">
            <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border border-red-100">
              <span className="text-sm font-semibold text-red-600">
                Order Cancelled
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-gray-200" />
      <RouteInfoCard order={order} distanceKm={distanceKm} eta={eta} />
    </div>
  );
};

export default DeliveryMap;
