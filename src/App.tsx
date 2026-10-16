import { useState, useEffect, useRef, type ReactNode } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type Screen = "feed" | "map" | "new" | "messages" | "detail" | "profile" | "subscription";
type IconName =
  | "arrow"
  | "bookmark"
  | "calendar"
  | "camera"
  | "chevron"
  | "download"
  | "feed"
  | "heart"
  | "image"
  | "link"
  | "lock"
  | "map"
  | "moon"
  | "music"
  | "note"
  | "pin"
  | "plus"
  | "profile"
  | "search"
  | "send"
  | "share"
  | "sun"
  | "compass"
  | "rotate"
  | "close"
  | "check"
  | "message"
  | "dots";

export interface UserProfile {
  name: string;
  handle: string;
  bio: string;
  location: string;
  avatar: string;
}

export const defaultUserProfile: UserProfile = {
  name: "Deepak",
  handle: "@deepak_memo",
  bio: "Capturing coastlines, hilltops, and roadside chai moments.",
  location: "Tamil Nadu, India",
  avatar: "/logo.png",
};

export function getGreeting(): string {
  const hr = new Date().getHours();
  if (hr < 12) return "Good morning";
  if (hr < 17) return "Good afternoon";
  return "Good evening";
}

const photos = {
  kerala:
    "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=85",
  jaipur:
    "https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?auto=format&fit=crop&w=1200&q=85",
  taj: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85",
  goa: "https://images.unsplash.com/photo-1652820330085-82a0c2b88d78?auto=format&fit=crop&w=1200&q=85",
  palms:
    "https://images.unsplash.com/photo-1591933635584-d04c937a9a29?auto=format&fit=crop&w=1200&q=85",
  water:
    "https://images.unsplash.com/photo-1661174607003-d9d36388c916?auto=format&fit=crop&w=1200&q=85",
};

export interface PlaceMemory {
  id: string;
  name: string;
  detail: string;
  category: string;
  date: string;
  caption: string;
  image: string;
  lng: number;
  lat: number;
  isCustom?: boolean;
}

function Icon({
  name,
  size = 22,
  strokeWidth = 1.9,
  style,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  style?: React.CSSProperties;
}) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="m15 18-6-6 6-6" /><path d="M9 12h11" /></>,
    bookmark: <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.6L6 21Z" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    camera: <><path d="M14.5 5 13 3h-2L9.5 5H6a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z" /><circle cx="12" cy="12.5" r="3.5" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M5 20h14" /></>,
    feed: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
    heart: <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    image: <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" /><path d="M9 3v15m6-12v15" /></>,
    moon: <path d="M20.5 14.5A8 8 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />,
    music: <><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></>,
    note: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    compass: <><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" opacity="0.85" /></>,
    rotate: <><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.9 1 6.7 2.8L21 8" /><path d="M21 3v5h-5" /></>,
    close: <path d="M18 6 6 18M6 6l12 12" />,
    check: <polyline points="20 6 9 17 4 12" />,
    message: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
    dots: <><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /><circle cx="5" cy="12" r="1.5" /></>,
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {paths[name]}
    </svg>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <div className="brand-mark">
        <img src="/logo.png" alt="Gypsy Memo Logo" />
      </div>
      <div>
        <div className="brand-name">GYPSY MEMO</div>
        {!compact && <div className="tagline">Every place has a memory.</div>}
      </div>
    </div>
  );
}

function Search({ placeholder }: { placeholder: string }) {
  return (
    <label className="search">
      <Icon name="search" size={19} />
      <input aria-label={placeholder} placeholder={placeholder} />
    </label>
  );
}

function BottomNav({
  screen,
  navigate,
}: {
  screen: Screen;
  navigate: (screen: Screen) => void;
}) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <button className={screen === "feed" ? "active" : ""} onClick={() => navigate("feed")}>
        <Icon name="feed" /><span>Feed</span>
      </button>
      <button className={screen === "map" ? "active" : ""} onClick={() => navigate("map")}>
        <Icon name="map" /><span>Map</span>
      </button>
      <button className="create-button" onClick={() => navigate("new")} aria-label="New memory">
        <Icon name="plus" size={28} strokeWidth={2.4} />
      </button>
      <button className={screen === "messages" ? "active" : ""} onClick={() => navigate("messages")}>
        <Icon name="message" /><span>Messages</span>
      </button>
      <button className={screen === "profile" ? "active" : ""} onClick={() => navigate("profile")}>
        <Icon name="profile" /><span>Profile</span>
      </button>
    </nav>
  );
}

function TopBar({
  dark,
  toggleDark,
}: {
  dark: boolean;
  toggleDark: () => void;
}) {
  return (
    <header className="topbar">
      <Brand />
      <button className="icon-button" onClick={toggleDark} aria-label="Toggle color theme">
        <Icon name={dark ? "sun" : "moon"} size={20} />
      </button>
    </header>
  );
}

function MemoryCard({
  image,
  name,
  username,
  place,
  date,
  caption,
  avatar,
  onOpen,
}: {
  image: string;
  name: string;
  username: string;
  place: string;
  date: string;
  caption: string;
  avatar: string;
  onOpen: () => void;
}) {
  const [following, setFollowing] = useState(false);
  const [liked, setLiked] = useState(false);
  return (
    <article className="memory-card">
      <div className="card-author">
        <button className="author-main" onClick={onOpen}>
          <img src={avatar} alt="" />
          <span><strong>{name}</strong><small>{username}</small></span>
        </button>
        <button className={`follow-button ${following ? "following" : ""}`} onClick={() => setFollowing(!following)}>
          {following ? "Following" : "Follow"}
        </button>
      </div>
      <button className="photo-button" onClick={onOpen} aria-label={`Open memory from ${place}`}>
        <img className="card-photo" src={image} alt={`${place} travel memory`} />
        <span className="place-pill"><Icon name="pin" size={14} />{place}</span>
      </button>
      <div className="card-body">
        <div className="card-actions">
          <div>
            <button className={liked ? "liked" : ""} onClick={() => setLiked(!liked)} aria-label="Like">
              <Icon name="heart" size={21} />
            </button>
            <button aria-label="Share"><Icon name="send" size={21} /></button>
          </div>
          <button aria-label="Save"><Icon name="bookmark" size={21} /></button>
        </div>
        <div className="memory-date">{date}</div>
        <p><strong>{username}</strong> {caption}</p>
      </div>
    </article>
  );
}

function FeedScreen({
  navigate,
  dark,
  toggleDark,
  userProfile,
}: {
  navigate: (screen: Screen) => void;
  dark: boolean;
  toggleDark: () => void;
  userProfile: UserProfile;
}) {
  const [chip, setChip] = useState("Following");
  return (
    <div className="screen feed-screen">
      <TopBar dark={dark} toggleDark={toggleDark} />
      <main className="scroll-content">
        <div className="feed-intro">
          <div>
            <span className="eyebrow">Your travel circle</span>
            <h1>{getGreeting()}, {userProfile.name}</h1>
          </div>
          <div className="sun-sticker"><Icon name="sun" size={23} /></div>
        </div>
        <Search placeholder="Search places or people" />
        <div className="chips">
          {["Following", "Nearby", "Recent"].map((item) => (
            <button key={item} className={chip === item ? "active" : ""} onClick={() => setChip(item)}>{item}</button>
          ))}
        </div>
        <MemoryCard
          image={photos.kerala}
          name="Meera Selvan"
          username="@meerawanders"
          place="Kochi, Kerala"
          date="18 AUG 2025"
          caption="Monsoon air, slow boats, and the kindest cup of chai. Saving this quiet morning forever."
          avatar={photos.palms}
          onOpen={() => navigate("detail")}
        />
        <MemoryCard
          image={photos.jaipur}
          name="Arun Prakash"
          username="@arunontheroad"
          place="Jaipur, Rajasthan"
          date="02 JUL 2025"
          caption="Pink walls and yellow light. Jaipur feels like a story told out loud."
          avatar={photos.taj}
          onOpen={() => navigate("detail")}
        />
      </main>
      <BottomNav screen="feed" navigate={navigate} />
    </div>
  );
}

const defaultMemories: PlaceMemory[] = [
  {
    id: "kochi",
    name: "Kochi",
    detail: "Fort Kochi & Backwaters, Kerala",
    category: "Backwaters",
    date: "18 Aug 2025",
    caption: "Monsoon air, slow boats, and the kindest cup of chai. Saving this quiet morning forever.",
    image: photos.kerala,
    lng: 76.2673,
    lat: 9.9312,
  },
  {
    id: "jaipur",
    name: "Jaipur",
    detail: "Hawa Mahal, Rajasthan",
    category: "Heritage",
    date: "02 Jul 2025",
    caption: "Pink walls and yellow light. Jaipur feels like a story told out loud.",
    image: photos.jaipur,
    lng: 75.8267,
    lat: 26.9239,
  },
  {
    id: "taj",
    name: "Taj Mahal",
    detail: "Agra, Uttar Pradesh",
    category: "Monument",
    date: "12 May 2025",
    caption: "Sunrise over white marble. Unforgettable monument of love.",
    image: photos.taj,
    lng: 78.0421,
    lat: 27.1751,
  },
  {
    id: "goa",
    name: "Goa",
    detail: "Palolem Beach, South Goa",
    category: "Beach",
    date: "15 Jan 2025",
    caption: "Golden sands and sunset waves with calm coconut groves.",
    image: photos.goa,
    lng: 74.0232,
    lat: 15.0100,
  },
  {
    id: "chennai",
    name: "Chennai",
    detail: "Marina Beach, Tamil Nadu",
    category: "Coastal City",
    date: "20 Sep 2025",
    caption: "Evening breeze at Marina and hot sundal by the waves.",
    image: photos.palms,
    lng: 80.2824,
    lat: 13.0499,
  },
  {
    id: "namakkal",
    name: "Namakkal",
    detail: "Rock Fort & Anjaneyar Temple, Tamil Nadu",
    category: "Historic Fort",
    date: "10 Feb 2025",
    caption: "Magnificent single rock fortress towering over the historic town.",
    image: photos.water,
    lng: 78.1652,
    lat: 11.2189,
  },
];

interface SearchItem {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  class: string;
  address?: {
    village?: string;
    suburb?: string;
    town?: string;
    city?: string;
    state?: string;
    country?: string;
    tourism?: string;
    historic?: string;
  };
}

function MapScreen({
  navigate,
  memories,
  onAddMemory,
  onSelectMemory,
}: {
  navigate: (screen: Screen) => void;
  memories: PlaceMemory[];
  onAddMemory: (memory: PlaceMemory) => void;
  onSelectMemory: (memory: PlaceMemory) => void;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [id: string]: maplibregl.Marker }>({});
  const targetMarkerRef = useRef<maplibregl.Marker | null>(null);

  const [selected, setSelected] = useState<PlaceMemory>(memories[0] || defaultMemories[0]);
  const [bearing, setBearing] = useState(0);
  const [pitch, setPitch] = useState(35);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);

  // New Memory Modal state
  const [isAddingModal, setIsAddingModal] = useState(false);
  const [targetSpot, setTargetSpot] = useState<{
    lng: number;
    lat: number;
    name: string;
    detail: string;
    loading: boolean;
  } | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newCategory, setNewCategory] = useState("Tourist Spot");
  const [newDate, setNewDate] = useState("Today");
  const [newImage, setNewImage] = useState(photos.kerala);

  const [mapType, setMapType] = useState<"google" | "satellite" | "osm">("google");

  const switchMapLayer = (type: "google" | "satellite" | "osm") => {
    setMapType(type);
    const map = mapInstance.current;
    if (!map) return;
    const tileSources: Record<string, string[]> = {
      google: [
        "https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        "https://mt2.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        "https://mt3.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      ],
      satellite: [
        "https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        "https://mt2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        "https://mt3.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
      ],
      osm: [
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
    };

    try {
      const source = map.getSource("base-map-tiles") as any;
      if (source && typeof source.setTiles === "function") {
        source.setTiles(tileSources[type]);
      } else {
        if (map.getLayer("base-map-layer")) map.removeLayer("base-map-layer");
        if (map.getSource("base-map-tiles")) map.removeSource("base-map-tiles");
        map.addSource("base-map-tiles", {
          type: "raster",
          tiles: tileSources[type],
          tileSize: 256,
        });
        map.addLayer({
          id: "base-map-layer",
          type: "raster",
          source: "base-map-tiles",
          minzoom: 0,
          maxzoom: 22,
        });
      }
    } catch (err) {
      console.error("Map layer switch error:", err);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "base-map-tiles": {
            type: "raster",
            tiles: [
              "https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
              "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
              "https://mt2.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
              "https://mt3.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            ],
            tileSize: 256,
            attribution: "Map data © Google",
          },
        },
        layers: [
          {
            id: "base-map-layer",
            type: "raster",
            source: "base-map-tiles",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [78.9629, 20.5937],
      zoom: 4.8,
      pitch: 35,
      bearing: 0,
      dragRotate: true,
      pitchWithRotate: true,
      touchPitch: true,
    });

    map.on("rotate", () => setBearing(Math.round(map.getBearing())));
    map.on("pitch", () => setPitch(Math.round(map.getPitch())));

    // Tap on map anywhere to pick location and add memory
    map.on("click", async (e) => {
      const { lng, lat } = e.lngLat;
      
      if (!targetMarkerRef.current) {
        const el = document.createElement("div");
        el.className = "target-click-pin";
        targetMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);
      } else {
        targetMarkerRef.current.setLngLat([lng, lat]);
      }

      setTargetSpot({
        lng,
        lat,
        name: "Detecting location...",
        detail: "Finding village / district / tourist spot...",
        loading: true,
      });
      setIsAddingModal(true);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await res.json();
        const addr = data.address || {};
        const spotName =
          addr.tourism ||
          addr.historic ||
          addr.leisure ||
          addr.amenity ||
          addr.village ||
          addr.suburb ||
          addr.town ||
          addr.city ||
          addr.county ||
          data.name ||
          "Travel Spot";

        const placeDetail =
          [addr.village || addr.suburb || addr.town || addr.city, addr.state, addr.country]
            .filter(Boolean)
            .join(", ") || `${lat.toFixed(3)}, ${lng.toFixed(3)}`;

        setTargetSpot({
          lng,
          lat,
          name: spotName,
          detail: placeDetail,
          loading: false,
        });
        setNewTitle(spotName);
      } catch {
        setTargetSpot({
          lng,
          lat,
          name: "Pinned Location",
          detail: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          loading: false,
        });
        setNewTitle("Pinned Location");
      }
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update Markers when memories change
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    memories.forEach((mem) => {
      const el = document.createElement("div");
      el.className = `gypsy-pin ${selected.id === mem.id ? "selected" : ""}`;
      el.innerHTML = `
        <div class="gypsy-pin-badge">
          <div class="gypsy-pin-content">
            <img src="${mem.image}" alt="" />
          </div>
        </div>
        <div class="gypsy-pin-label">${mem.name}</div>
      `;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelected(mem);
        onSelectMemory(mem);
        map.flyTo({
          center: [mem.lng, mem.lat],
          zoom: Math.max(map.getZoom(), 11),
          pitch: 45,
          duration: 1200,
        });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([mem.lng, mem.lat])
        .addTo(map);

      markersRef.current[mem.id] = marker;
    });
  }, [memories, selected.id, onSelectMemory]);

  // Handle Search Input (Debounced)
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&limit=6&addressdetails=1`
        );
        const data = await res.json();
        setSearchResults(data);
      } catch {
        setSearchResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSearchResult = (item: SearchItem) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const map = mapInstance.current;

    if (map) {
      map.flyTo({
        center: [lon, lat],
        zoom: 14,
        pitch: 45,
        duration: 1800,
      });

      if (!targetMarkerRef.current) {
        const el = document.createElement("div");
        el.className = "target-click-pin";
        targetMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat([lon, lat])
          .addTo(map);
      } else {
        targetMarkerRef.current.setLngLat([lon, lat]);
      }
    }

    const addr = item.address || {};
    const spotName =
      addr.tourism ||
      addr.historic ||
      addr.village ||
      addr.town ||
      addr.city ||
      item.display_name.split(",")[0];

    const placeDetail =
      [addr.village || addr.town || addr.city, addr.state, addr.country]
        .filter(Boolean)
        .join(", ") || item.display_name;

    setTargetSpot({
      lng: lon,
      lat,
      name: spotName,
      detail: placeDetail,
      loading: false,
    });
    setNewTitle(spotName);
    setSearchQuery("");
    setSearchResults([]);
    setIsAddingModal(true);
  };

  const handleSaveMemory = () => {
    if (!targetSpot) return;

    const newMem: PlaceMemory = {
      id: "mem_" + Date.now(),
      name: newTitle.trim() || targetSpot.name,
      detail: targetSpot.detail,
      category: newCategory,
      date: newDate.trim() || "Just now",
      caption: newCaption.trim() || `Memories captured at ${newTitle || targetSpot.name}`,
      image: newImage,
      lng: targetSpot.lng,
      lat: targetSpot.lat,
      isCustom: true,
    };

    onAddMemory(newMem);
    setSelected(newMem);
    onSelectMemory(newMem);
    setIsAddingModal(false);

    if (targetMarkerRef.current) {
      targetMarkerRef.current.remove();
      targetMarkerRef.current = null;
    }

    mapInstance.current?.flyTo({
      center: [newMem.lng, newMem.lat],
      zoom: 13,
      pitch: 45,
      duration: 1000,
    });
  };

  return (
    <div className="screen map-screen">
      {/* Header with Live Search */}
      <div className="map-header">
        <div className="map-title">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="brand-mark" style={{ width: "38px", height: "38px" }}>
              <img src="/logo.png" alt="Gypsy Memo Logo" />
            </div>
            <div>
              <span className="eyebrow">Interactive 3D Atlas</span>
              <h1>Explore World</h1>
            </div>
          </div>
        </div>

        <div className="search">
          <Icon name="search" size={19} />
          <input
            placeholder="Search country, state, village, tourist spot..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
              style={{ padding: "0 6px", color: "var(--muted)" }}
            >
              <Icon name="close" size={16} />
            </button>
          )}

          {/* Search Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map((item) => (
                <button
                  key={item.place_id}
                  className="search-item"
                  onClick={() => handleSelectSearchResult(item)}
                >
                  <Icon name="pin" size={16} />
                  <div className="search-item-info">
                    <strong>{item.display_name.split(",")[0]}</strong>
                    <span>{item.display_name}</span>
                  </div>
                  <span className="search-item-badge">{item.type || "Place"}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map Hint */}
      <div className="map-tap-hint">
        <Icon name="pin" size={13} />
        <span>Tap any spot on map to add memory!</span>
      </div>

      {/* 360-Degree & 3D Aerial Controls */}
      <div className="map-floating-controls">
        {/* Layer Switcher: Google Map / Satellite / OSM */}
        <button
          className="map-ctrl-btn"
          onClick={() => {
            const next = mapType === "google" ? "satellite" : mapType === "satellite" ? "osm" : "google";
            switchMapLayer(next);
          }}
          title={`Layer: ${mapType === "google" ? "Google Map" : mapType === "satellite" ? "Satellite" : "OpenStreetMap"} (Tap to change)`}
          style={{ fontSize: "15px" }}
        >
          {mapType === "google" ? "🗺️" : mapType === "satellite" ? "🛰️" : "🌍"}
        </button>

        {/* Compass: Resets north and indicates bearing */}
        <button
          className="map-ctrl-btn"
          onClick={() => mapInstance.current?.resetNorthPitch()}
          title="Reset North & 360°"
        >
          <div className="compass-needle" style={{ transform: `rotate(${-bearing}deg)` }}>
            <Icon name="compass" size={22} />
          </div>
        </button>

        {/* Rotate Left 45° */}
        <button
          className="map-ctrl-btn"
          onClick={() => {
            if (!mapInstance.current) return;
            mapInstance.current.rotateTo(mapInstance.current.getBearing() - 45, { duration: 400 });
          }}
          title="Rotate 360° Left"
        >
          <Icon name="rotate" size={17} style={{ transform: "scaleX(-1)" }} />
        </button>

        {/* Rotate Right 45° */}
        <button
          className="map-ctrl-btn"
          onClick={() => {
            if (!mapInstance.current) return;
            mapInstance.current.rotateTo(mapInstance.current.getBearing() + 45, { duration: 400 });
          }}
          title="Rotate 360° Right"
        >
          <Icon name="rotate" size={17} />
        </button>

        {/* 3D / 2D Perspective Toggle */}
        <button
          className={`map-ctrl-btn tilt-pill ${pitch > 20 ? "active" : ""}`}
          onClick={() => {
            if (!mapInstance.current) return;
            mapInstance.current.easeTo({ pitch: pitch > 20 ? 0 : 55, duration: 400 });
          }}
          title="Toggle 3D View"
        >
          {pitch > 20 ? "3D" : "2D"}
        </button>

        {/* Zoom In */}
        <button
          className="map-ctrl-btn"
          onClick={() => mapInstance.current?.zoomIn()}
          title="Zoom In"
        >
          +
        </button>

        {/* Zoom Out */}
        <button
          className="map-ctrl-btn"
          onClick={() => mapInstance.current?.zoomOut()}
          title="Zoom Out"
        >
          −
        </button>
      </div>

      {/* Map Container */}
      <div className="map-area">
        <div ref={mapContainer} className="map-canvas" />
      </div>

      {/* Selected Memory Bottom Card */}
      {selected && (
        <section className="place-sheet">
          <div className="sheet-handle" />
          <div className="sheet-content">
            <img src={selected.image} alt={selected.name} />
            <div className="sheet-copy">
              <span className="eyebrow">{selected.category} · {selected.date}</span>
              <h2>{selected.name}</h2>
              <p>{selected.caption}</p>
            </div>
            <button
              className="round-arrow"
              onClick={() => {
                onSelectMemory(selected);
                navigate("detail");
              }}
              aria-label="Open memory"
            >
              <Icon name="chevron" />
            </button>
          </div>
          <button
            className="primary-button"
            onClick={() => {
              onSelectMemory(selected);
              navigate("detail");
            }}
          >
            Open memory <Icon name="arrow" size={19} />
          </button>
        </section>
      )}

      {/* Add Memory Modal (When Tapping on any location) */}
      {isAddingModal && targetSpot && (
        <div className="add-memory-overlay" onClick={() => setIsAddingModal(false)}>
          <div className="add-memory-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">Pin New Travel Memory</span>
                <h2>{targetSpot.loading ? "Locating place..." : targetSpot.name}</h2>
              </div>
              <button className="close-btn" onClick={() => setIsAddingModal(false)}>
                ✕
              </button>
            </div>

            <p style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "12px" }}>
              📍 {targetSpot.detail}
            </p>

            <div className="form-card">
              <Field icon="pin" label="Place / Spot Name">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Meenakshi Amman Temple, Nilgiris, etc."
                />
              </Field>

              <Field icon="note" label="Memory Caption / Story">
                <textarea
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="What made this place unforgettable?"
                />
              </Field>

              <Field icon="calendar" label="Date">
                <input
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  placeholder="e.g. 16 Oct 2026"
                />
              </Field>
            </div>

            {/* Photo Selection with Gallery Upload */}
            <div style={{ marginTop: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span className="eyebrow">Choose Memory Photo</span>
                <label style={{ fontSize: "11px", fontWeight: "800", color: "var(--teal)", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Icon name="camera" size={14} />
                  <span>Gallery Photo 📁</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === "string") setNewImage(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>

              {newImage && !Object.values(photos).includes(newImage) && (
                <div className="file-preview-strip" style={{ height: "110px", marginBottom: "8px" }}>
                  <img src={newImage} alt="Uploaded custom" />
                  <span className="file-change-badge">✓ Gallery Photo Selected</span>
                </div>
              )}

              <div className="photo-presets">
                {Object.entries(photos).map(([key, url]) => (
                  <button
                    key={key}
                    type="button"
                    className={`photo-preset-btn ${newImage === url ? "active" : ""}`}
                    onClick={() => setNewImage(url)}
                  >
                    <img src={url} alt={key} />
                  </button>
                ))}
              </div>
            </div>

            {/* Category selection */}
            <div style={{ marginTop: "4px" }}>
              <span className="eyebrow">Place Type</span>
              <div className="chips" style={{ marginTop: "6px" }}>
                {["Tourist Spot", "Village / Town", "Beach", "Heritage", "Nature", "Cafe"].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={newCategory === cat ? "active" : ""}
                      onClick={() => setNewCategory(cat)}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            <button
              className="primary-button"
              style={{ width: "100%", marginTop: "16px" }}
              onClick={handleSaveMemory}
            >
              Save Memory to Atlas ✨
            </button>
          </div>
        </div>
      )}

      <BottomNav screen="map" navigate={navigate} />
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: IconName;
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="form-field">
      <span className="field-icon"><Icon name={icon} size={19} /></span>
      <span className="field-content"><span className="field-label">{label}</span>{children}</span>
    </label>
  );
}

function NewMemoryScreen({
  navigate,
  onAddMemory,
}: {
  navigate: (screen: Screen) => void;
  onAddMemory: (memory: PlaceMemory) => void;
}) {
  const [destination, setDestination] = useState("Kochi, Kerala");
  const [date, setDate] = useState("2025-08-18");
  const [caption, setCaption] = useState("Monsoon air, slow boats, and the kindest cup of chai.");
  const [selectedPhoto, setSelectedPhoto] = useState(photos.kerala);
  const [visibility, setVisibility] = useState("Public");
  const [published, setPublished] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = () => {
    const spot = destination.split(",")[0].trim() || "Travel Memory";
    const newMem: PlaceMemory = {
      id: "mem_" + Date.now(),
      name: spot,
      detail: destination,
      category: "Personal Journey",
      date: date,
      caption: caption,
      image: selectedPhoto,
      lng: 76.2673,
      lat: 9.9312,
      isCustom: true,
    };
    onAddMemory(newMem);
    setPublished(true);
    setTimeout(() => {
      navigate("map");
    }, 800);
  };

  return (
    <div className="screen new-screen">
      <header className="simple-header">
        <button className="icon-button" onClick={() => navigate("feed")} aria-label="Go back"><Icon name="arrow" /></button>
        <div><span className="eyebrow">Add to your journey</span><h1>New memory</h1></div>
        <span className="step-label">1 / 1</span>
      </header>
      <main className="new-content">
        <div className="storage-limit">
          <div>
            <span className="eyebrow">Gallery Mode</span>
            <strong>Upload Your Real Photos</strong>
          </div>
          <div className="usage-track"><span style={{ width: "35%", background: "var(--teal)" }} /></div>
          <button onClick={() => navigate("subscription")}>Go Plus</button>
        </div>

        <div className="photo-strip">
          <label className="upload-tile" style={{ cursor: "pointer" }}>
            <Icon name="camera" size={24} />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />
          </label>
          <div className="thumb selected">
            <img src={selectedPhoto} alt="Selected travel photo" />
            <span>Active</span>
          </div>
          <button
            type="button"
            className="thumb"
            onClick={() => setSelectedPhoto(photos.jaipur)}
          >
            <img src={photos.jaipur} alt="Jaipur preset" />
          </button>
        </div>

        <div className="form-card">
          <Field icon="pin" label="Destination">
            <input value={destination} onChange={(e) => setDestination(e.target.value)} />
          </Field>
          <Field icon="calendar" label="Travel date">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field icon="note" label="Caption">
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} />
          </Field>
          <Field icon="music" label="Song link · optional">
            <input placeholder="Paste Spotify or Apple Music link" />
          </Field>
          <Field icon="lock" label="Private notes">
            <textarea placeholder="Only you can see this..." />
          </Field>
        </div>
        <div className="visibility-block">
          <div className="section-title"><span>Who can see this?</span><small>You can change this later</small></div>
          <div className="segment">
            {["Private", "Public", "Followers"].map((item) => (
              <button className={visibility === item ? "active" : ""} onClick={() => setVisibility(item)} key={item}>
                {item === "Private" && <Icon name="lock" size={14} />}{item}
              </button>
            ))}
          </div>
        </div>
        <button className="primary-button publish" onClick={handlePublish}>
          {published ? "Memory published to Map!" : "Publish memory"} <Icon name={published ? "heart" : "send"} size={19} />
        </button>
      </main>
    </div>
  );
}

interface MessageItem {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

interface ChatContact {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  mutual: boolean;
  followsYou: boolean;
  youFollow: boolean;
  isBlocked: boolean;
  isRestricted: boolean;
  messages: MessageItem[];
}

function MessagesScreen({
  navigate,
  userProfile,
}: {
  navigate: (screen: Screen) => void;
  userProfile: UserProfile;
}) {
  const [contacts, setContacts] = useState<ChatContact[]>([
    {
      id: "meera",
      name: "Meera Selvan",
      handle: "@meerawanders",
      avatar: photos.kerala,
      mutual: true,
      followsYou: true,
      youFollow: true,
      isBlocked: false,
      isRestricted: false,
      messages: [
        { id: "1", sender: "them", text: `Hey ${userProfile.name}! Loved your travel stories from Kochi! ⛵`, time: "10:30 AM" },
        { id: "2", sender: "me", text: "Thank you Meera! Are you planning to visit Ooty soon?", time: "10:32 AM" },
        { id: "3", sender: "them", text: "Yes! Planning a road trip to Nilgiris next month. Any tips?", time: "10:35 AM" },
      ],
    },
    {
      id: "kaviya",
      name: "Kaviya Raman",
      handle: "@kaviyatravels",
      avatar: photos.palms,
      mutual: true,
      followsYou: true,
      youFollow: true,
      isBlocked: false,
      isRestricted: false,
      messages: [
        { id: "1", sender: "them", text: "Did you visit the rock fort in Namakkal? Amazing sunrise view!", time: "Yesterday" },
      ],
    },
    {
      id: "arun",
      name: "Arun Prakash",
      handle: "@arunphotos",
      avatar: photos.taj,
      mutual: false,
      followsYou: false,
      youFollow: true,
      isBlocked: false,
      isRestricted: false,
      messages: [],
    },
    {
      id: "vicky",
      name: "Vicky Nomad",
      handle: "@vickynomad",
      avatar: photos.water,
      mutual: true,
      followsYou: true,
      youFollow: true,
      isBlocked: false,
      isRestricted: false,
      messages: [
        { id: "1", sender: "them", text: "Bro! The sunset at Palolem beach in Goa was unbelievable 🌊", time: "2 days ago" },
      ],
    },
  ]);

  const [activeChat, setActiveChat] = useState<ChatContact | null>(null);
  const [inputMsg, setInputMsg] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMutualAlert, setShowMutualAlert] = useState<ChatContact | null>(null);

  const handleSelectContact = (c: ChatContact) => {
    if (!c.mutual) {
      setShowMutualAlert(c);
      return;
    }
    setActiveChat(c);
    setMenuOpen(false);
  };

  const handleSendMessage = () => {
    if (!inputMsg.trim() || !activeChat || activeChat.isBlocked) return;
    const newMsg: MessageItem = {
      id: "msg_" + Date.now(),
      sender: "me",
      text: inputMsg.trim(),
      time: "Just now",
    };

    const updated = contacts.map((c) => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });

    setContacts(updated);
    setActiveChat((prev) => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : null));
    setInputMsg("");
  };

  const toggleBlock = () => {
    if (!activeChat) return;
    const updated = contacts.map((c) => (c.id === activeChat.id ? { ...c, isBlocked: !c.isBlocked } : c));
    setContacts(updated);
    setActiveChat((prev) => (prev ? { ...prev, isBlocked: !prev.isBlocked } : null));
    setMenuOpen(false);
  };

  const toggleRestrict = () => {
    if (!activeChat) return;
    const updated = contacts.map((c) => (c.id === activeChat.id ? { ...c, isRestricted: !c.isRestricted } : c));
    setContacts(updated);
    setActiveChat((prev) => (prev ? { ...prev, isRestricted: !prev.isRestricted } : null));
    setMenuOpen(false);
  };

  const clearChat = () => {
    if (!activeChat) return;
    const updated = contacts.map((c) => (c.id === activeChat.id ? { ...c, messages: [] } : c));
    setContacts(updated);
    setActiveChat((prev) => (prev ? { ...prev, messages: [] } : null));
    setMenuOpen(false);
  };

  return (
    <div className="screen messages-screen">
      <div className="messages-header">
        <Brand compact />
        <h1>Direct Messages</h1>
        <div className="mutual-badge">🛡️ Mutual Only</div>
      </div>

      <div className="messages-list">
        <p style={{ margin: "4px 4px 12px", fontSize: "11px", color: "var(--muted)", fontWeight: "700" }}>
          Travel safety: You can only chat with users who mutually follow you.
        </p>

        {contacts.map((c) => (
          <div key={c.id} className="chat-row" onClick={() => handleSelectContact(c)}>
            <img src={c.avatar} alt={c.name} className="chat-row-avatar" />
            <div className="chat-row-content">
              <div className="chat-row-header">
                <strong>{c.name}</strong>
                <small>{c.messages[c.messages.length - 1]?.time || ""}</small>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                <span style={{ fontSize: "10px", color: "var(--muted)" }}>{c.handle}</span>
                {c.mutual ? (
                  <span className="mutual-badge">Mutual 🟢</span>
                ) : (
                  <span className="locked-badge">🔒 Not Mutual</span>
                )}
                {c.isBlocked && <span className="locked-badge">Blocked</span>}
                {c.isRestricted && <span className="mutual-badge" style={{ color: "#d97706", background: "#fef3c7" }}>Restricted</span>}
              </div>
              <p className="chat-row-preview">
                {c.mutual
                  ? c.messages[c.messages.length - 1]?.text || "No messages yet. Say hi!"
                  : "🔒 Follow each other to enable messaging."}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mutual Follow Alert Modal */}
      {showMutualAlert && (
        <div className="add-memory-overlay" onClick={() => setShowMutualAlert(null)}>
          <div className="add-memory-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔒 Mutual Follow Required</h2>
              <button className="close-btn" onClick={() => setShowMutualAlert(null)}>✕</button>
            </div>
            <p style={{ fontSize: "13px", lineHeight: "1.5", color: "var(--text)" }}>
              You cannot send a direct message to <strong>{showMutualAlert.name}</strong> because they haven't followed you back yet.
            </p>
            <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "8px" }}>
              GYPSY MEMO protects traveler privacy: Both travelers must follow each other to start a conversation.
            </p>
            <button
              className="primary-button"
              style={{ width: "100%", marginTop: "16px" }}
              onClick={() => {
                const updated = contacts.map((c) =>
                  c.id === showMutualAlert.id ? { ...c, mutual: true, followsYou: true } : c
                );
                setContacts(updated);
                setShowMutualAlert(null);
              }}
            >
              Demo: Simulate Mutual Follow Back ✨
            </button>
          </div>
        </div>
      )}

      {/* Active Chat Conversation Window */}
      {activeChat && (
        <div className="chat-window">
          <div className="chat-win-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button className="icon-button" style={{ width: "34px", height: "34px" }} onClick={() => setActiveChat(null)}>
                <Icon name="arrow" size={18} />
              </button>
              <div className="chat-win-user">
                <img src={activeChat.avatar} alt={activeChat.name} />
                <div>
                  <strong>{activeChat.name}</strong>
                  <small>{activeChat.handle} · Mutual 🟢</small>
                </div>
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <button className="chat-options-btn" onClick={() => setMenuOpen(!menuOpen)}>
                <Icon name="dots" size={18} />
              </button>

              {menuOpen && (
                <div className="chat-dropdown-menu">
                  <button className="chat-menu-item" onClick={toggleBlock}>
                    🛡️ {activeChat.isBlocked ? "Unblock User" : "Block User"}
                  </button>
                  <button className="chat-menu-item" onClick={toggleRestrict}>
                    ⚠️ {activeChat.isRestricted ? "Unrestrict" : "Restrict User"}
                  </button>
                  <button className="chat-menu-item danger" onClick={clearChat}>
                    🗑️ Clear Messages
                  </button>
                </div>
              )}
            </div>
          </div>

          {activeChat.isBlocked && (
            <div className="chat-status-alert blocked">
              <span>⛔ You have blocked this user. Unblock in options menu to chat.</span>
            </div>
          )}

          {activeChat.isRestricted && (
            <div className="chat-status-alert restricted">
              <span>⚠️ User is restricted. Message alerts muted.</span>
            </div>
          )}

          <div className="chat-messages-area">
            {activeChat.messages.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--muted)", margin: "auto", fontSize: "12px" }}>
                No messages yet. Send a greeting to start your travel chat! 👋
              </p>
            ) : (
              activeChat.messages.map((m) => (
                <div key={m.id} className={`chat-bubble ${m.sender}`}>
                  <span>{m.text}</span>
                  <span className="chat-bubble-time">{m.time}</span>
                </div>
              ))
            )}
          </div>

          <div className="chat-input-row">
            <input
              placeholder={activeChat.isBlocked ? "User blocked" : "Type a message..."}
              disabled={activeChat.isBlocked}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <button
              className="chat-send-btn"
              disabled={activeChat.isBlocked || !inputMsg.trim()}
              onClick={handleSendMessage}
            >
              <Icon name="send" size={17} />
            </button>
          </div>
        </div>
      )}

      <BottomNav screen="messages" navigate={navigate} />
    </div>
  );
}

function DetailScreen({
  navigate,
  memory,
}: {
  navigate: (screen: Screen) => void;
  memory: PlaceMemory | null;
}) {
  const [liked, setLiked] = useState(false);
  const mem = memory || {
    id: "kochi",
    name: "Kochi",
    detail: "Fort Kochi & Backwaters, Kerala",
    category: "Backwaters",
    date: "18 Aug 2025",
    caption: "Monsoon air, slow boats, and the kindest cup of chai. Saving this quiet morning forever.",
    image: photos.kerala,
    lng: 76.2673,
    lat: 9.9312,
  };

  return (
    <div className="screen detail-screen">
      <div className="detail-photo">
        <img src={mem.image} alt={mem.name} />
        <div className="photo-overlay" />
        <header className="detail-header">
          <button onClick={() => navigate("map")} aria-label="Go back"><Icon name="arrow" /></button>
          <Brand compact />
          <button aria-label="Share memory"><Icon name="share" size={20} /></button>
        </header>
        <div className="detail-place">
          <span><Icon name="pin" size={15} /> {mem.detail}</span>
          <h1>{mem.name}</h1>
        </div>
      </div>
      <main className="detail-body">
        <div className="detail-author">
          <img src={photos.palms} alt="Traveler" />
          <div><strong>Traveler Story</strong><span>{mem.date}</span></div>
          <button className={liked ? "liked like-button" : "like-button"} onClick={() => setLiked(!liked)}><Icon name="heart" size={20} /></button>
        </div>
        <p className="detail-caption">{mem.caption}</p>
        <div className="song-card">
          <div className="album-art"><Icon name="music" /></div>
          <div><span>Category</span><strong>{mem.category || "Travel Memory"}</strong></div>
          <button aria-label="Location coordinate"><Icon name="pin" size={18} /></button>
        </div>
        <div className="private-note">
          <div><Icon name="pin" size={17} /><strong>GPS Coordinates</strong><span>Location</span></div>
          <p>Lat: {mem.lat.toFixed(4)}, Lng: {mem.lng.toFixed(4)}</p>
        </div>
        <div className="detail-actions">
          <button><Icon name="share" size={19} /> Share</button>
          <button><Icon name="download" size={19} /> Save as PDF</button>
        </div>
      </main>
    </div>
  );
}

function ProfileScreen({
  navigate,
  dark,
  toggleDark,
  userProfile,
  onUpdateProfile,
}: {
  navigate: (screen: Screen) => void;
  dark: boolean;
  toggleDark: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}) {
  const [isPublic, setIsPublic] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editHandle, setEditHandle] = useState(userProfile.handle);
  const [editBio, setEditBio] = useState(userProfile.bio);
  const [editLocation, setEditLocation] = useState(userProfile.location);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onUpdateProfile({ ...userProfile, avatar: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    onUpdateProfile({
      ...userProfile,
      name: editName.trim() || userProfile.name,
      handle: editHandle.trim() || userProfile.handle,
      bio: editBio.trim() || userProfile.bio,
      location: editLocation.trim() || userProfile.location,
    });
    setIsEditing(false);
  };

  return (
    <div className="screen profile-screen">
      <header className="profile-top">
        <Brand compact />
        <button className="icon-button" onClick={toggleDark} aria-label="Toggle color theme"><Icon name={dark ? "sun" : "moon"} size={20} /></button>
      </header>
      <main className="profile-content">
        <section className="profile-hero">
          <div className="avatar-wrap">
            <img src={userProfile.avatar} alt={userProfile.name} />
            <label style={{ position: "absolute", right: "-5px", bottom: "5px", width: "28px", height: "28px", borderRadius: "50%", background: "var(--yellow)", display: "grid", placeItems: "center", cursor: "pointer", border: "2px solid #fff" }}>
              <Icon name="camera" size={14} />
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarUpload} />
            </label>
          </div>
          <h1>{userProfile.name}</h1>
          <div className="handle">{userProfile.handle} · {userProfile.location}</div>
          <p>{userProfile.bio}</p>
          <button className="edit-button" onClick={() => setIsEditing(true)}>Edit profile</button>
        </section>

        {isEditing && (
          <div className="add-memory-overlay" onClick={() => setIsEditing(false)}>
            <div className="add-memory-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Your Profile</h2>
                <button className="close-btn" onClick={() => setIsEditing(false)}>✕</button>
              </div>

              <div className="form-card">
                <Field icon="profile" label="Your Name">
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="e.g. Deepak" />
                </Field>
                <Field icon="pin" label="Username / Handle">
                  <input value={editHandle} onChange={(e) => setEditHandle(e.target.value)} placeholder="e.g. @deepak_memo" />
                </Field>
                <Field icon="map" label="Your Location">
                  <input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} placeholder="e.g. Tamil Nadu, India" />
                </Field>
                <Field icon="note" label="Bio / About You">
                  <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} />
                </Field>
              </div>

              <button
                className="primary-button"
                style={{ width: "100%", marginTop: "16px" }}
                onClick={handleSaveProfile}
              >
                Save Profile Changes ✨
              </button>
            </div>
          </div>
        )}

        <div className="stats">
          <div><strong>24</strong><span>Memories</span></div>
          <div><strong>1.8K</strong><span>Followers</span></div>
          <div><strong>346</strong><span>Following</span></div>
        </div>
        <div className="account-toggle">
          <div className="toggle-icon"><Icon name={isPublic ? "profile" : "lock"} size={19} /></div>
          <div><strong>{isPublic ? "Public account" : "Private account"}</strong><span>{isPublic ? "Anyone can enjoy your memories" : "Only approved followers can see posts"}</span></div>
          <button className={`switch ${isPublic ? "on" : ""}`} onClick={() => setIsPublic(!isPublic)} aria-label="Toggle account privacy"><span /></button>
        </div>
        <button className="upgrade-banner" onClick={() => navigate("subscription")}>
          <span className="upgrade-spark"><Icon name="plus" size={22} /></span>
          <span><strong>Unlock unlimited memories</strong><small>Bank-linked secure subscription</small></span>
          <Icon name="chevron" size={19} />
        </button>
        <div className="profile-gallery-title">
          <div><span className="eyebrow">24 memories</span><h2>My posts</h2></div>
          <button>View all <Icon name="chevron" size={15} /></button>
        </div>
        <div className="photo-grid">
          {[photos.kerala, photos.jaipur, photos.goa, photos.taj, photos.water, photos.palms].map((photo, i) => (
            <button key={photo} onClick={() => navigate("detail")} aria-label={`Open memory ${i + 1}`}><img src={photo} alt="" />{i === 0 && <span><Icon name="image" size={14} /> 3</span>}</button>
          ))}
        </div>
      </main>
      <BottomNav screen="profile" navigate={navigate} />
    </div>
  );
}

function SubscriptionScreen({
  navigate,
  userProfile,
}: {
  navigate: (screen: Screen) => void;
  userProfile: UserProfile;
}) {
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const [payment, setPayment] = useState<"upi" | "card" | "wallet">("upi");
  const [upiId, setUpiId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const price = plan === "yearly" ? "₹999 / year" : "₹149 / month";

  const handleRazorpayPayment = () => {
    const envKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;
    const localKey = localStorage.getItem("gypsy_razorpay_key");
    let activeKey = envKey || localKey || "";

    if (!activeKey) {
      const inputKey = prompt(
        "Enter your Razorpay Key ID (starts with rzp_test_ or rzp_live_):",
        "rzp_test_"
      );
      if (inputKey && inputKey.trim()) {
        activeKey = inputKey.trim();
        localStorage.setItem("gypsy_razorpay_key", activeKey);
      } else {
        alert("Please provide your Razorpay Key ID to launch checkout.");
        return;
      }
    }

    if (typeof (window as any).Razorpay === "undefined") {
      alert("Razorpay Checkout SDK is still loading. Please check internet connection.");
      return;
    }

    const amountInPaise = plan === "yearly" ? 99900 : 14900;

    const options: any = {
      key: activeKey,
      amount: amountInPaise,
      currency: "INR",
      name: "GYPSY MEMO",
      description: plan === "yearly" ? "Gypsy Memo Plus - Yearly Plan" : "Gypsy Memo Plus - Monthly Plan",
      image: "/logo.png",
      handler: function (response: any) {
        setPaymentId(response.razorpay_payment_id || "pay_success");
        setSubmitted(true);
        alert(`🎉 Payment Successful!\nPayment ID: ${response.razorpay_payment_id}\nFunds will settle directly to your bank account!`);
      },
      prefill: {
        name: userProfile.name,
        ...(upiId.trim() ? { vpa: upiId.trim() } : {}),
      },
      theme: {
        color: "#ffc400",
      },
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e: any) {
      alert("Error opening Razorpay: " + e.message);
    }
  };

  return (
    <div className="screen subscription-screen">
      <header className="simple-header">
        <button className="icon-button" onClick={() => navigate("profile")} aria-label="Go back"><Icon name="arrow" /></button>
        <div><span className="eyebrow">GYPSY MEMO PLUS</span><h1>Keep every memory</h1></div>
        <span />
      </header>
      <main className="subscription-content">
        <section className="plan-hero">
          <div className="plan-symbol"><Icon name="image" size={29} /></div>
          <span className="eyebrow">Upgrade your journey</span>
          <h2>Direct Bank Payouts.</h2>
          <p>Link your Indian Bank Account via Razorpay to receive subscription revenue directly.</p>
          <div className="benefits">
            <span><Icon name="image" size={17} /> Unlimited photos</span>
            <span><Icon name="download" size={17} /> PDF exports</span>
            <span><Icon name="lock" size={17} /> Direct Bank Settlement</span>
          </div>
        </section>

        <section className="checkout-card">
          <div className="plan-options">
            <button className={plan === "monthly" ? "selected" : ""} onClick={() => setPlan("monthly")}>
              <span>Monthly</span><strong>₹149</strong><small>per month</small>
            </button>
            <button className={plan === "yearly" ? "selected" : ""} onClick={() => setPlan("yearly")}>
              <em>Save 44%</em><span>Yearly</span><strong>₹999</strong><small>₹83 per month</small>
            </button>
          </div>

          <div className="payment-title"><strong>Payment method</strong><span>Secure checkout</span></div>
          <div className="payment-methods">
            <button className={payment === "upi" ? "selected" : ""} onClick={() => setPayment("upi")}><Icon name="send" size={18} /> UPI</button>
            <button className={payment === "card" ? "selected" : ""} onClick={() => setPayment("card")}><Icon name="bookmark" size={18} /> Card</button>
            <button className={payment === "wallet" ? "selected" : ""} onClick={() => setPayment("wallet")}><Icon name="profile" size={18} /> Wallet</button>
          </div>

          {payment === "upi" && (
            <label className="payment-field">
              <span>UPI ID (Optional)</span>
              <input 
                placeholder="e.g. mobile@upi or name@okhdfcbank" 
                value={upiId} 
                onChange={(e) => setUpiId(e.target.value)} 
              />
            </label>
          )}
          {payment === "card" && (
            <div className="card-fields">
              <label className="payment-field full"><span>Card number</span><input inputMode="numeric" placeholder="1234 5678 9012 3456" /></label>
              <label className="payment-field"><span>Expiry</span><input placeholder="MM / YY" /></label>
              <label className="payment-field"><span>CVV</span><input inputMode="numeric" placeholder="•••" /></label>
            </div>
          )}
          {payment === "wallet" && <div className="wallet-note">Apple Pay, PhonePe, and Google Pay supported in Razorpay checkout.</div>}

          <div className="order-row"><span>Total today</span><strong>{price}</strong></div>
          <button className="primary-button payment-button" onClick={handleRazorpayPayment}>
            {submitted ? `✓ Paid (${paymentId.slice(0, 10)})` : `Pay with Razorpay · ${price}`} <Icon name={submitted ? "heart" : "lock"} size={18} />
          </button>
          <p className="checkout-note">Funds settle directly to merchant bank account via Razorpay Payment Gateway.</p>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("feed");
  const [dark, setDark] = useState(false);
  const toggleDark = () => setDark((value) => !value);

  // User Profile State with localStorage persistence
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("gypsy_user_profile");
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultUserProfile;
  });

  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    try {
      localStorage.setItem("gypsy_user_profile", JSON.stringify(updated));
    } catch {}
  };

  // Load memories from localStorage if available
  const [memories, setMemories] = useState<PlaceMemory[]>(() => {
    try {
      const saved = localStorage.getItem("gypsy_memories");
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultMemories;
  });

  const [selectedMemory, setSelectedMemory] = useState<PlaceMemory | null>(
    memories[0] || defaultMemories[0]
  );

  const handleAddMemory = (newMem: PlaceMemory) => {
    setMemories((prev) => {
      const updated = [newMem, ...prev];
      try {
        localStorage.setItem("gypsy_memories", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <div className={`app-shell ${dark ? "dark" : ""}`}>
      <div className="phone-frame">
        {screen === "feed" && (
          <FeedScreen
            navigate={setScreen}
            dark={dark}
            toggleDark={toggleDark}
            userProfile={userProfile}
          />
        )}
        {screen === "map" && (
          <MapScreen
            navigate={setScreen}
            memories={memories}
            onAddMemory={handleAddMemory}
            onSelectMemory={setSelectedMemory}
          />
        )}
        {screen === "new" && (
          <NewMemoryScreen
            navigate={setScreen}
            onAddMemory={handleAddMemory}
          />
        )}
        {screen === "messages" && (
          <MessagesScreen
            navigate={setScreen}
            userProfile={userProfile}
          />
        )}
        {screen === "detail" && (
          <DetailScreen
            navigate={setScreen}
            memory={selectedMemory}
          />
        )}
        {screen === "profile" && (
          <ProfileScreen
            navigate={setScreen}
            dark={dark}
            toggleDark={toggleDark}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
        {screen === "subscription" && (
          <SubscriptionScreen
            navigate={setScreen}
            userProfile={userProfile}
          />
        )}
      </div>
    </div>
  );
}
