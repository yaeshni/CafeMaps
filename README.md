☕ CafeMaps

A full-stack web app that discovers nearby cafes in real time using the Google Places API, displays them on an interactive map with rating badges, and lets you save favorites — persisted in MongoDB.

<!-- Live demo: [add your deployed link here once live] -->


Features


📍 Geolocation search — find cafes near your current location, or click anywhere on the map to search that spot instead
🗺️ Interactive map — custom pin markers showing live ratings, a search-radius circle, and click-to-select syncing between the map and the results list
⭐ Filtering — filter results by name and minimum rating, live
📏 Distance-based sorting — results ranked by actual distance (Haversine formula) from the search point, with an adjustable radius (1–5 km)
🧠 Cafe-type filtering — cross-checks Google's primaryType/types fields to exclude restaurants, bars, and fast food that Google sometimes co-tags as "cafe"
❤️ Favorites — save/unsave cafes, persisted server-side in MongoDB (not just local storage)
🖼️ Photo proxying — cafe photos are served through the backend, keeping the Google API key server-side only
🎨 Custom UI — built with Tailwind CSS + Lucide icons, not a template
🐳 Dockerized — runs identically via npm run dev or docker compose up



Tech stack

LayerTechnologyFrontendReact (Vite), Tailwind CSS, React-Leaflet, Lucide iconsBackendNode.js, ExpressDatabaseMongoDB (Atlas)External APIGoogle Places API (New)ContainerizationDocker, Docker Compose (multi-stage build for the client)Map tilesOpenStreetMap via Leaflet


Architecture

#mermaid-r2en-r2 { font-family: "Anthropic Sans", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; fill: rgb(229, 229, 229); }
#mermaid-r2en-r2 .edge-animation-slow { stroke-dashoffset: 900; animation: 50s linear 0s infinite normal none running dash; stroke-linecap: round; stroke-dasharray: 9, 5 !important; }
#mermaid-r2en-r2 .edge-animation-fast { stroke-dashoffset: 900; animation: 20s linear 0s infinite normal none running dash; stroke-linecap: round; stroke-dasharray: 9, 5 !important; }
#mermaid-r2en-r2 .error-icon { fill: rgb(204, 120, 92); }
#mermaid-r2en-r2 .error-text { fill: rgb(51, 135, 163); stroke: rgb(51, 135, 163); }
#mermaid-r2en-r2 .edge-thickness-normal { stroke-width: 1px; }
#mermaid-r2en-r2 .edge-thickness-thick { stroke-width: 3.5px; }
#mermaid-r2en-r2 .edge-pattern-solid { stroke-dasharray: 0; }
#mermaid-r2en-r2 .edge-thickness-invisible { stroke-width: 0; fill: none; }
#mermaid-r2en-r2 .edge-pattern-dashed { stroke-dasharray: 3; }
#mermaid-r2en-r2 .edge-pattern-dotted { stroke-dasharray: 2; }
#mermaid-r2en-r2 .marker { fill: rgb(161, 161, 161); stroke: rgb(161, 161, 161); }
#mermaid-r2en-r2 .marker.cross { stroke: rgb(161, 161, 161); }
#mermaid-r2en-r2 svg { font-family: "Anthropic Sans", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; }
#mermaid-r2en-r2 p { margin: 0px; }
#mermaid-r2en-r2 .label { font-family: "Anthropic Sans", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: rgb(229, 229, 229); }
#mermaid-r2en-r2 .cluster-label text { fill: rgb(51, 135, 163); }
#mermaid-r2en-r2 .cluster-label span { color: rgb(51, 135, 163); }
#mermaid-r2en-r2 .cluster-label span p { background-color: transparent; }
#mermaid-r2en-r2 .label text, #mermaid-r2en-r2 span { fill: rgb(229, 229, 229); color: rgb(229, 229, 229); }
#mermaid-r2en-r2 .node rect, #mermaid-r2en-r2 .node circle, #mermaid-r2en-r2 .node ellipse, #mermaid-r2en-r2 .node polygon, #mermaid-r2en-r2 .node path { fill: transparent; stroke: rgb(161, 161, 161); stroke-width: 1px; }
#mermaid-r2en-r2 .rough-node .label text, #mermaid-r2en-r2 .node .label text, #mermaid-r2en-r2 .image-shape .label, #mermaid-r2en-r2 .icon-shape .label { text-anchor: middle; }
#mermaid-r2en-r2 .node .katex path { fill: rgb(0, 0, 0); stroke: rgb(0, 0, 0); stroke-width: 1px; }
#mermaid-r2en-r2 .rough-node .label, #mermaid-r2en-r2 .node .label, #mermaid-r2en-r2 .image-shape .label, #mermaid-r2en-r2 .icon-shape .label { text-align: center; }
#mermaid-r2en-r2 .node.clickable { cursor: pointer; }
#mermaid-r2en-r2 .root .anchor path { stroke-width: 0; stroke: rgb(161, 161, 161); fill: rgb(161, 161, 161) !important; }
#mermaid-r2en-r2 .arrowheadPath { fill: rgb(11, 11, 11); }
#mermaid-r2en-r2 .edgePath .path { stroke: rgb(161, 161, 161); stroke-width: 1px; }
#mermaid-r2en-r2 .flowchart-link { stroke: rgb(161, 161, 161); fill: none; }
#mermaid-r2en-r2 .edgeLabel { background-color: transparent; text-align: center; }
#mermaid-r2en-r2 .edgeLabel p { background-color: transparent; }
#mermaid-r2en-r2 .edgeLabel rect { opacity: 0.5; background-color: transparent; fill: transparent; }
#mermaid-r2en-r2 .labelBkg { background-color: rgba(0, 0, 0, 0.5); }
#mermaid-r2en-r2 .cluster rect { fill: rgb(204, 120, 92); stroke: rgb(138, 115, 107); stroke-width: 1px; }
#mermaid-r2en-r2 .cluster text { fill: rgb(51, 135, 163); }
#mermaid-r2en-r2 .cluster span { color: rgb(51, 135, 163); }
#mermaid-r2en-r2 div.mermaidTooltip { position: absolute; text-align: center; max-width: 200px; padding: 2px; font-family: "Anthropic Sans", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 12px; background: rgb(204, 120, 92); border: 1px solid rgb(138, 115, 107); border-radius: 2px; pointer-events: none; z-index: 100; }
#mermaid-r2en-r2 .flowchartTitleText { text-anchor: middle; font-size: 18px; fill: rgb(229, 229, 229); }
#mermaid-r2en-r2 rect.text { fill: none; stroke-width: 0; }
#mermaid-r2en-r2 .icon-shape, #mermaid-r2en-r2 .image-shape { background-color: transparent; text-align: center; }
#mermaid-r2en-r2 .icon-shape p, #mermaid-r2en-r2 .image-shape p { background-color: transparent; padding: 2px; }
#mermaid-r2en-r2 .icon-shape .label rect, #mermaid-r2en-r2 .image-shape .label rect { opacity: 0.5; background-color: transparent; fill: transparent; }
#mermaid-r2en-r2 .label-icon { display: inline-block; height: 1em; overflow: visible; vertical-align: -0.125em; }
#mermaid-r2en-r2 .node .label-icon path { fill: currentcolor; stroke: revert; stroke-width: revert; }
#mermaid-r2en-r2 .node .neo-node { stroke: rgb(161, 161, 161); }
#mermaid-r2en-r2 [data-look="neo"].node rect, #mermaid-r2en-r2 [data-look="neo"].cluster rect, #mermaid-r2en-r2 [data-look="neo"].node polygon { stroke: url("#mermaid-r2en-r2-gradient"); filter: drop-shadow(rgb(185, 185, 185) 1px 2px 2px); }
#mermaid-r2en-r2 [data-look="neo"].node path { stroke: url("#mermaid-r2en-r2-gradient"); stroke-width: 1px; }
#mermaid-r2en-r2 [data-look="neo"].node .outer-path { filter: drop-shadow(rgb(185, 185, 185) 1px 2px 2px); }
#mermaid-r2en-r2 [data-look="neo"].node .neo-line path { stroke: rgb(161, 161, 161); filter: none; }
#mermaid-r2en-r2 [data-look="neo"].node circle { stroke: url("#mermaid-r2en-r2-gradient"); filter: drop-shadow(rgb(185, 185, 185) 1px 2px 2px); }
#mermaid-r2en-r2 [data-look="neo"].node circle .state-start { fill: rgb(0, 0, 0); }
#mermaid-r2en-r2 [data-look="neo"].icon-shape .icon { fill: url("#mermaid-r2en-r2-gradient"); filter: drop-shadow(rgb(185, 185, 185) 1px 2px 2px); }
#mermaid-r2en-r2 [data-look="neo"].icon-shape .icon-neo path { stroke: url("#mermaid-r2en-r2-gradient"); filter: drop-shadow(rgb(185, 185, 185) 1px 2px 2px); }
#mermaid-r2en-r2 :root { --mermaid-font-family: "Anthropic Sans",system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }Docker ComposeHTTP/api/cafes/api/favorites/api/photossearchNearby / details /photo mediaCRUD favoritesUser's BrowserReact Frontend (Vite)served via nginx in prodExpress BackendGoogle Places API (New)MongoDB Atlas

Why this shape:


The frontend never talks to Google directly — the API key lives only on the server, in an environment variable, never shipped to the browser.
Photos are proxied through /api/photos for the same reason: some Google photo endpoints require the key at request time, which would otherwise force the key into client-side code.
MongoDB stores only favorites (not cafe data itself) — cafe data is always fetched fresh from Google, since caching it long-term would go stale (hours, ratings, etc. change).



Project structure

cafe-finder/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # CafeCard, CafeList, CafeMap, SearchBar, FavoritesList
│   │   ├── hooks/           # useGeolocation
│   │   ├── api.js           # fetch wrapper for backend calls
│   │   └── App.jsx
│   ├── Dockerfile           # multi-stage: build with Vite, serve with nginx
│   └── nginx.conf
├── server/                  # Express backend
│   ├── routes/               places.js, favorites.js, photos.js
│   ├── controllers/
│   ├── services/              placesApi.js (Google Places wrapper)
│   ├── models/                Favorite.js (Mongoose schema)
│   ├── middleware/            errorHandler.js
│   ├── Dockerfile
│   └── server.js
├── docker-compose.yml
└── README.md


Getting started (local, without Docker)

1. Prerequisites


Node.js 20+
A Google Cloud project with Places API (New) enabled
A MongoDB Atlas cluster (free tier is fine)


2. Clone and configure

bashgit clone https://github.com/<your-username>/cafeMaps.git
cd cafeMaps

Backend:

bashcd server
cp .env.example .env
# fill in GOOGLE_PLACES_API_KEY and MONGO_URI in .env
npm install

Frontend:

bashcd ../client
cp .env.example .env
npm install

3. Run it (two terminals)

bash# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev

Open http://localhost:5173.


Getting started (with Docker)

bashdocker compose up --build

Open http://localhost:5173. The client is served by nginx (production-style build), the server runs the same Express app, and both talk to the same MongoDB Atlas + Google Places API as the non-Docker setup — only your server/.env is required (no local Mongo container needed, since Atlas is cloud-hosted).

Stop with:

bashdocker compose down


API endpoints (backend)

MethodRouteDescriptionGET/api/cafes?lat=&lng=&radius=Nearby cafe searchGET/api/cafes/:placeIdFull details for one cafeGET/api/photos?name=&maxWidth=Proxies a Google Places photoGET/api/favoritesList saved favoritesPOST/api/favoritesSave a favoriteDELETE/api/favorites/:placeIdRemove a favorite


Known limitations


Category accuracy depends on Google's own data. Small businesses (especially in smaller towns) sometimes self-tag their Google Business listing as "cafe" even when they're a motel, electronics shop, or juice stall. The app filters on primaryType/types, which correctly reflects what's tagged — but tagging quality itself varies by region. Results are noticeably cleaner in metro areas with denser, better-maintained Places data.
Photo coverage is sparse in smaller towns, for the same reason — many listings simply have no photos uploaded to Google at all. The app gracefully falls back to a placeholder icon rather than a broken image.
No user accounts yet — favorites are global rather than per-user (see Future Improvements).
Manual address search (typing a place name instead of clicking the map) isn't implemented yet — would require the Google Geocoding API.


<!-- 
Future improvements


Per-user accounts with JWT auth, so favorites are personal rather than global
Manual address/city search via Google Geocoding API
Response caching to reduce repeat Google API calls
Basic rate limiting on the backend
Deployed CI/CD pipeline -->


<!-- 
Author

Built by Aeshni — GitHub · LinkedIn -->