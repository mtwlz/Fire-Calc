import "../styles/main.css";

export default function RelayPerformance({ tankSize, setTankSize, relayMiles, setRelayMiles, fillSiteTime, setFillSiteTime, dumpSiteTime, setDumpSiteTime, results, setResults }) {
  const tankValue = Number(tankSize);
  const milesValue = Number(relayMiles);
  const fillValue = Number(fillSiteTime);
  const dumpValue = Number(dumpSiteTime);

  function handleCalculate() {
    if (![tankValue, milesValue, fillValue, dumpValue].every((value) => Number.isFinite(value))) {
      setResults({ error: true });
      return;
    }

    const usableGallons = tankValue * 0.9;
    const cycleMinutes = 0.65 + 1.7 * milesValue + fillValue + dumpValue;
    if (cycleMinutes <= 0) {
      setResults({ error: true });
      return;
    }

    const gpm = usableGallons / cycleMinutes;
    setResults({
      gpm: Number(gpm.toFixed(1)),
      usableGallons: Number(usableGallons.toFixed(1)),
      cycleMinutes: Number(cycleMinutes.toFixed(2)),
      error: false,
    });
  }

  return (
    <div className="page">
      <div>
        <div className="page-headerTitle">Relay Performance</div>
        <div className="page-headerSubtitle">Calculate tender actual flow using tank capacity, distance, and site times.</div>
      </div>

      <div className="page-card">
        <div className="page-sectionTitle">Tank Size [gal]</div>
        <div className="page-help">Enter the tender tank capacity in gallons.</div>
        <input value={tankSize} onChange={(e) => setTankSize(e.target.value)} inputMode="decimal" className="page-input" />
      </div>

      <div className="page-card">
        <div className="page-sectionTitle">Distance [miles]</div>
        <div className="page-help">Enter the one-way distance to the fill site.</div>
        <input value={relayMiles} onChange={(e) => setRelayMiles(e.target.value)} inputMode="decimal" className="page-input" />
      </div>

      <div className="page-card">
        <div className="page-sectionTitle">Fill Site Time [min]</div>
        <div className="page-help">Enter the time spent filling the tender.</div>
        <input value={fillSiteTime} onChange={(e) => setFillSiteTime(e.target.value)} inputMode="decimal" className="page-input" />
      </div>

      <div className="page-card">
        <div className="page-sectionTitle">Dump Site Time [min]</div>
        <div className="page-help">Enter the time spent dumping the tank.</div>
        <input value={dumpSiteTime} onChange={(e) => setDumpSiteTime(e.target.value)} inputMode="decimal" className="page-input" />
      </div>

      <button onClick={handleCalculate} className="page-primaryButton">
        Calculate Flow
      </button>

      {results && results.error ? (
        <div className="page-card page-errorCard">
          <div className="page-sectionTitle">Invalid input</div>
          <div className="page-help">Check all fields and enter valid numeric values.</div>
        </div>
      ) : results && !results.error ? (
        <div className="page-card">
          <div className="page-sectionTitle">Performance Result</div>
          <div className="page-kv">
            <div className="page-k">Usable tank volume</div>
            <div className="page-v">{results.usableGallons} gal</div>
          </div>
          <div className="page-hr" />
          <div className="page-kv">
            <div className="page-k">Total cycle time</div>
            <div className="page-v">{results.cycleMinutes} min</div>
          </div>
          <div className="page-hr" />
          <div className="page-kv">
            <div className="page-k">Actual flow rate</div>
            <div className="page-v">{results.gpm} GPM</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
