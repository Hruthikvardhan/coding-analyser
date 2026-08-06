/**
 * Real GitHub contribution heatmap using actual daily activity levels (0-4)
 * scraped from GitHub's own public contribution calendar page.
 */
const LEVEL_COLORS = ["#182238", "#0e4429", "#166b34", "#26a641", "#39d353"];

export default function HeatMap({
  days = [],
  totalLastYear = null,
  activeDaysLast30 = 0,
}) {
  if (!days.length) {
    return (
      <p className="text-xs text-slate-500">
        Contribution activity unavailable for this profile.
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-10 gap-1.5">
        {days.map((d) => (
          <div
            key={d.date}
            className="w-4 h-4 rounded-sm"
            style={{ background: LEVEL_COLORS[d.level] || LEVEL_COLORS[0] }}
            title={`${d.date}: level ${d.level}`}
          />
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-2">
        Active on {activeDaysLast30} of the last {days.length} days
        {totalLastYear !== null &&
          ` · ${totalLastYear.toLocaleString()} contributions in the last year`}
      </p>
    </div>
  );
}
