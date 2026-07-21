// The habit graphs (T2.4): a "graphs" section at the foot of the field
// notes — one collapsible line per habit, drawn in SVG in the habit's
// symbol colour. All the counting lives in game/graphs.js; this file
// only draws. Neutral by design: raw frequency, no targets, no misses.
//
// Kimia's decisions (2026-07-18): the section sits below the week grid
// and ignores which week is on show (a graph is whole-life, not
// weekly); the x-axis is the habit's entire history squeezed to fit;
// a graph opens on the coarsest unlocked zoom.

import { useState } from 'react'
import { graphSeries, hasGraph, unlockedZooms } from '../game/graphs.js'
import CharmSymbol from './CharmSymbol.jsx'
import { SYMBOL_COLORS } from './symbols.js'

const ZOOM_LABELS = {
  day: 'day by day',
  week: 'week by week',
  fourWeek: '4 weeks at a time',
}

// The drawing area. Wide and short, like a strip of field notes;
// padding leaves room for the quiet corner labels.
const W = 600
const H = 150
const PAD_X = 8
const PAD_TOP = 14
const PAD_BOTTOM = 20

function GraphLine({ series, color, habitName, zoom }) {
  const top = Math.max(1, ...series.map((b) => b.count))
  const lastX = W - PAD_X
  const x = (i) =>
    series.length === 1
      ? W / 2
      : PAD_X + (i * (lastX - PAD_X)) / (series.length - 1)
  const y = (count) =>
    H - PAD_BOTTOM - (count / top) * (H - PAD_TOP - PAD_BOTTOM)
  const points = series.map((b, i) => `${x(i)},${y(b.count)}`).join(' ')

  return (
    <svg
      className="habit-graph-svg"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`${habitName}, completions ${ZOOM_LABELS[zoom]}`}
    >
      {/* the floor of the graph: zero, a fine quiet line */}
      <line
        x1={PAD_X}
        y1={y(0)}
        x2={lastX}
        y2={y(0)}
        stroke="#2a3040"
        strokeWidth="1"
      />
      {series.length === 1 ? (
        <circle cx={x(0)} cy={y(series[0].count)} r="3" fill={color} />
      ) : (
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}
      {/* quiet corner labels: the scale, and where the line starts/ends */}
      <text className="graph-label" x={PAD_X} y={PAD_TOP - 4}>
        {top}
      </text>
      <text className="graph-label" x={PAD_X} y={H - 6}>
        {series[0].startKey}
      </text>
      <text className="graph-label" x={lastX} y={H - 6} textAnchor="end">
        {series[series.length - 1].startKey}
      </text>
    </svg>
  )
}

function HabitGraph({ habit, completions, now, cutoffHour }) {
  const zooms = unlockedZooms(habit, now, cutoffHour)
  // Coarsest unlocked zoom first (Kimia's decision 2026-07-18): the
  // whole shape of the habit's life at a glance, zoom in from there.
  const [zoom, setZoom] = useState(zooms[zooms.length - 1] ?? null)

  return (
    <details className="habit-graph">
      <summary>
        <CharmSymbol symbol={habit.symbol} className="symbol" />{' '}
        {habit.name}
        {habit.archived && <span className="habit-meta"> (archived)</span>}
      </summary>
      {zoom === null ? (
        <p className="habit-graph-young">habit is too young</p>
      ) : (
        <>
          {zooms.length > 1 && (
            <div className="graph-zooms">
              {zooms.map((z) => (
                <button
                  key={z}
                  className="zoom-button"
                  aria-pressed={z === zoom}
                  onClick={() => setZoom(z)}
                >
                  {ZOOM_LABELS[z]}
                </button>
              ))}
            </div>
          )}
          <GraphLine
            series={graphSeries(habit, completions, zoom, now, cutoffHour)}
            color={SYMBOL_COLORS[habit.symbol]}
            habitName={habit.name}
            zoom={zoom}
          />
        </>
      )}
    </details>
  )
}

function HabitGraphs({ habits, completions, now, cutoffHour }) {
  const graphable = habits.filter(hasGraph)
  if (graphable.length === 0) return null

  return (
    <div className="habit-graphs">
      <h3>graphs</h3>
      {graphable.map((habit) => (
        <HabitGraph
          key={habit.id}
          habit={habit}
          completions={completions}
          now={now}
          cutoffHour={cutoffHour}
        />
      ))}
    </div>
  )
}

export default HabitGraphs
