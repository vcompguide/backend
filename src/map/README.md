# MapService Documentation

## Overview

The MapService is a **coordination layer** that orchestrates external API services (Nominatim, Overpass, OSRM) to provide unified, normalized mapping functionality. It does not call APIs directly but instead coordinates multiple services and normalizes their responses.

## Architecture

```
MapController → MapService → External APIs (Nominatim, Overpass, OSRM)
```

### Key Responsibilities
- Coordinate multiple external API services
- Normalize responses to unified formats
- Optimize data flow and reduce redundancy
- Provide high-level mapping features

---

## Core Features

### 1. Search Place (`searchPlace()`)

**Use Case:** Search bar functionality

**Endpoint:** `GET /map/search?q=<query>&limit=<number>`

**Method Signature:**
```typescript
searchPlace(query: string, limit = 5): Promise<SearchPlaceResponse>
```

**Flow:**
1. Calls `NominatimService.searchByName()`
2. Normalizes response to `MapLocation` format
3. Removes redundant fields
4. Limits results

**Example Request:**
```http
GET /map/search?q=ben%20thanh&limit=5
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123456",
      "name": "Ben Thanh Market",
      "lat": 10.7725,
      "lng": 106.6980,
      "type": "poi",
      "displayName": "Ben Thanh Market, District 1, Ho Chi Minh City",
      "placeType": "amenity",
      "importance": 0.85
    }
  ],
  "count": 1
}
```

---

### 2. Get Location Detail (`getLocationDetail()`)

**Use Case:** Detailed location information with nearby POIs

**Endpoint:** `GET /map/location?lat=<latitude>&lng=<longitude>`

**Method Signature:**
```typescript
getLocationDetail(lat: number, lng: number): Promise<LocationDetailResponse>
```

**Internal Flow:**
1. Reverse geocode using Nominatim
2. Search nearby POIs using Overpass (1km radius)
3. Classify location type
4. Organize POIs by category

**Example Request:**
```http
GET /map/location?lat=10.77&lng=106.69
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "coordinate": {
      "lat": 10.77,
      "lng": 106.69
    },
    "address": "Ben Thanh Market, District 1, Ho Chi Minh City",
    "nearby": {
      "restaurant": [
        {
          "id": 123456789,
          "name": "Pho 2000",
          "lat": 10.7726,
          "lng": 106.6981,
          "type": "restaurant",
          "tags": {
            "amenity": "restaurant",
            "cuisine": "vietnamese"
          }
        }
      ],
      "hotel": [...],
      "tourism": [...]
    },
    "locationType": "poi"
  }
}
```

---

### 3. Build Route (`buildRoute()`)

**Use Case:** Calculate route between origin and destination with optional waypoints

**Endpoint:** `POST /map/route`

**Method Signature:**
```typescript
buildRoute(buildRouteDto: BuildRouteDto): Promise<RouteResponse>
```

**Flow:**
1. Validate waypoints
2. Build coordinate array (origin → waypoints → destination)
3. Call OSRM to calculate route
4. Extract and format route steps
5. Generate route summary

**Example Request:**
```http
POST /map/route
Content-Type: application/json

{
  "origin": { "lat": 10.7725, "lng": 106.6980 },
  "destination": { "lat": 10.7769, "lng": 106.7009 },
  "waypoints": [
    { "lat": 10.7750, "lng": 106.6990 }
  ],
  "mode": "driving"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "geometry": {
      "type": "LineString",
      "coordinates": [...]
    },
    "distance": 1234.5,
    "duration": 180,
    "steps": [
      {
        "distance": 200,
        "duration": 30,
        "instruction": "Head north on Le Loi",
        "name": "Le Loi",
        "mode": "driving"
      }
    ],
    "summary": {
      "totalDistance": "1.2 km",
      "totalTime": "3 mins",
      "mainRoads": ["Le Loi", "Nguyen Hue"],
      "warnings": []
    }
  }
}
```

---

### 4. Update Waypoints (`updateWaypoints()`)

**Use Case:** Modify route waypoints dynamically

**Endpoint:** `POST /map/route/waypoints`

**Method Signature:**
```typescript
updateWaypoints(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  updateWaypointsDto: UpdateWaypointsDto,
  mode?: 'driving' | 'walking' | 'cycling'
): Promise<RouteResponse>
```

**Example Request:**
```http
POST /map/route/waypoints
Content-Type: application/json

{
  "origin": { "lat": 10.7725, "lng": 106.6980 },
  "destination": { "lat": 10.7769, "lng": 106.7009 },
  "waypoints": {
    "waypoints": [
      { "lat": 10.7750, "lng": 106.6990 },
      { "lat": 10.7755, "lng": 106.6995 }
    ]
  },
  "mode": "walking"
}
```

---

### 5. Route Summary Engine (`summarizeRoute()`)

**Purpose:** Generate human-readable route summary

**Method Signature:**
```typescript
summarizeRoute(route: any): RouteSummaryResponse
```

**Features:**
- Converts distance to kilometers
- Converts duration to minutes
- Extracts main road names (top 5 unique)
- Generates warnings for:
  - Long distance routes (> 50km)
  - Long duration routes (> 2 hours)

**Example Output:**
```json
{
  "totalDistance": "12.4 km",
  "totalTime": "32 mins",
  "mainRoads": ["Le Loi", "Nguyen Hue", "Dong Khoi"],
  "warnings": ["high traffic area"]
}
```

---

### 6. Nearby Search (`searchNearby()`)

**Use Case:** Find POIs around a coordinate

**Endpoint:** `GET /map/nearby?lat=<lat>&lng=<lng>&radius=<meters>&amenities=<types>`

**Method Signature:**
```typescript
searchNearby(
  lat: number,
  lng: number,
  radius = 1000,
  amenities?: string[]
): Promise<NearbyResponse>
```

**Example Request:**
```http
GET /map/nearby?lat=10.77&lng=106.69&radius=1000&amenities=restaurant,cafe
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "restaurant": [...],
    "cafe": [...]
  },
  "count": 25
}
```

---

## Unified Location Model

All location-related responses use the unified `MapLocation` interface:

```typescript
interface MapLocation {
  id?: string;              // Unique identifier
  name: string;             // Location name
  lat: number;              // Latitude
  lng: number;              // Longitude (unified from 'lon')
  type: 'place' | 'address' | 'poi';  // Classified type
  displayName?: string;     // Full formatted address
  placeType?: string;       // Original OSM type
  importance?: number;      // Relevance score
}
```

**Why Unified Model?**
- Nominatim returns `lon`, Overpass returns `lon` → MapService unifies to `lng`
- Different APIs have different field names → MapService standardizes
- Provides consistent interface for frontend consumption

---

## Helper Methods

### `classifyLocationType(osmType: string)`

Classifies OSM types into three categories:
- **place**: city, town, village, hamlet, suburb, neighbourhood
- **address**: house, building, residential, road, street
- **poi**: amenity, shop, tourism, leisure

### `organizePOIsByCategory(places: any[])`

Groups POIs by their amenity/tourism/shop category:
```typescript
{
  "restaurant": [...],
  "hotel": [...],
  "cafe": [...],
  "museum": [...]
}
```

---

## DTOs (Data Transfer Objects)

### `SearchPlaceDto`
```typescript
{
  q: string;        // Search query
  limit?: number;   // Max results (1-50, default: 5)
}
```

### `LocationDetailDto`
```typescript
{
  lat: number;      // Latitude (-90 to 90)
  lng: number;      // Longitude (-180 to 180)
}
```

### `BuildRouteDto`
```typescript
{
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  waypoints?: Array<{ lat: number; lng: number }>;
  mode?: 'driving' | 'walking' | 'cycling';  // default: 'driving'
}
```

### `UpdateWaypointsDto`
```typescript
{
  waypoints: Array<{ lat: number; lng: number }>;
}
```

### `NearbySearchDto`
```typescript
{
  lat: number;          // Latitude
  lng: number;          // Longitude
  radius?: number;      // Search radius in meters (100-10000, default: 1000)
  amenities?: string[]; // Filter by amenity types
}
```

---

## Complete API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/map/search` | Search places by name |
| GET | `/map/location` | Get location details |
| POST | `/map/route` | Build route |
| POST | `/map/route/waypoints` | Update route waypoints |
| GET | `/map/nearby` | Search nearby POIs |

---

## Dependencies

The MapService requires the following external services:

1. **NominatimService** - Geocoding and reverse geocoding
2. **OverpassService** - POI and amenity data from OpenStreetMap
3. **OsrmService** - Route calculation

These are injected through the `ExternalApiModule`.

---

## Error Handling

All methods throw `HttpException` with appropriate status codes:
- `400 BAD_REQUEST` - Invalid input or API error
- `404 NOT_FOUND` - Resource not found (from OSRM)
- `500 INTERNAL_SERVER_ERROR` - Unexpected errors

Example error response:
```json
{
  "statusCode": 400,
  "message": "Failed to search place: Invalid query",
  "error": "Bad Request"
}
```

---

## Usage Examples

### Frontend Integration

```typescript
// Search for a place
const results = await fetch('/map/search?q=restaurant&limit=10');

// Get location details
const detail = await fetch('/map/location?lat=10.77&lng=106.69');

// Build a route
const route = await fetch('/map/route', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    origin: { lat: 10.7725, lng: 106.6980 },
    destination: { lat: 10.7769, lng: 106.7009 },
    mode: 'driving'
  })
});
```

---

## Performance Considerations

1. **Caching**: Consider implementing caching for frequently searched locations
2. **Rate Limiting**: External APIs have rate limits - implement throttling
3. **Batch Requests**: Group multiple requests when possible
4. **Error Recovery**: Implement retry logic for transient failures

---

## Future Enhancements

- [ ] Add support for traffic-aware routing
- [ ] Implement location history/favorites
- [ ] Add multi-modal routing (drive + walk)
- [ ] Support for transit routing
- [ ] Add geocoding cache layer
- [ ] Implement route optimization (traveling salesman)
- [ ] Add support for avoiding specific road types
- [ ] Real-time traffic integration

---

## Testing

```bash
# Test search endpoint
curl "http://localhost:3000/map/search?q=market&limit=5"

# Test location detail
curl "http://localhost:3000/map/location?lat=10.77&lng=106.69"

# Test route building
curl -X POST "http://localhost:3000/map/route" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"lat": 10.7725, "lng": 106.6980},
    "destination": {"lat": 10.7769, "lng": 106.7009},
    "mode": "driving"
  }'

# Test nearby search
curl "http://localhost:3000/map/nearby?lat=10.77&lng=106.69&radius=1000"
```

---

## License

This module is part of the backend application.
