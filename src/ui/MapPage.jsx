// The Map (T4.1): the planet of N-Z-D, reached from the expedition
// meter. The whole planet is hinted at from day one as a faint outline
// (Kimia's decision 2026-07-19); regions light up inside it as the
// expedition steps into them, radiating outward from the landing site.
//
// What shows here and what doesn't:
//   - shapes are seeded generative placeholders until the T5.3 art
//     pass (ui/mapLayout.js); no names anywhere until T6.1 names the
//     regions — each known region offers only its discovery date.
//   - landmark markers are fully plumbed (game/map.js) but none can
//     render until T6.1 decides which flora species are landmarks.
//   - the discovery-moment narration slots exist (content/narration.js,
//     mapRegions) — their ambient-swell moment is wired in T5.2.

import { LANDMARK_FLORA, MAP_REGION_COUNT } from '../game/constants.js'
import {
  discoveredRegionCount,
  landmarkMarkers,
  regionDiscoveries,
} from '../game/map.js'
import { expeditionSteps } from '../game/meters.js'
import { buildMapLayout, landmarkPoint } from './mapLayout.js'

function MapPage({
  completions,
  worldSeed,
  onBack,
  landmarkSpecies = LANDMARK_FLORA,
}) {
  const layout = buildMapLayout(worldSeed)
  const known = discoveredRegionCount(expeditionSteps(completions))
  const discoveries = regionDiscoveries(completions)
  const markers = landmarkMarkers(completions, landmarkSpecies)

  return (
    <section className="map-page">
      <h2>the Map</h2>
      <svg
        className="map-svg"
        viewBox={`0 0 ${layout.size} ${layout.size}`}
        role="img"
        aria-label="the planet, region by region"
      >
        <path className="map-silhouette" d={layout.silhouettePath} />
        {layout.regions.slice(0, known).map(({ region, path, hue }) => (
          <path
            key={region}
            className={
              region === known - 1 ? 'map-region map-region-frontier' : 'map-region'
            }
            style={{ color: `hsl(${hue} 65% 62%)` }}
            d={path}
          >
            <title>{`known since ${discoveries[region].dayKey}`}</title>
          </path>
        ))}
        {markers.map((marker) => {
          const { x, y } = landmarkPoint(worldSeed, layout, marker)
          return (
            <g
              key={marker.completionId}
              className="map-landmark"
              transform={`translate(${x} ${y})`}
            >
              <title>{marker.dayKey}</title>
              <line x1="0" y1="7" x2="0" y2="-1" />
              <circle cx="0" cy="-4" r="3.5" />
            </g>
          )
        })}
      </svg>
      <p className="map-caption">
        {known} of {MAP_REGION_COUNT} regions known
      </p>
      <button onClick={onBack}>← back to the habits</button>
    </section>
  )
}

export default MapPage
