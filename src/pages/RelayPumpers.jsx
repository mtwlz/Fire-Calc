import { useMemo } from "react";
import { MAXRELAYLENGTHS } from "../utils/CONSTANTS";
import "../styles/main.css";

const flowOptions = [250, 500, 750, 1000, 1250];
const hoseOptions = [
  { value: "2.5", label: '2.5"' },
  { value: "3", label: '3"' },
  { value: "4", label: '4"' },
  { value: "5", label: '5"' },
  { value: "2.5x2", label: 'Two 2.5" hoses' },
  { value: "3x2", label: 'Two 3" hoses' },
  { value: "3and2.5", label: 'One 3" & one 2.5" hose' },
];

export default function RelayPumpers({ unitSystem, flowUnit, relayLength, setRelayLength, relayType, setRelayType, relayFlow, setRelayFlow, results, setResults }) {
  const flowValue = Number(relayFlow);
  const flowGpm = flowUnit === "gpm" ? flowValue : flowValue / 3.785411784;
  const selectedFlowKey = String(
    flowOptions.reduce((closest, option) =>
      Math.abs(option - flowGpm) < Math.abs(closest - flowGpm) ? option : closest,
      flowOptions[0]
    )
  );

  const maxRelayLabel = useMemo(() => {
    const maxRelay = MAXRELAYLENGTHS[relayType]?.[selectedFlowKey];
    return maxRelay ? `${maxRelay} ft` : "—";
  }, [relayType, selectedFlowKey]);

  const displayFlowUnit = flowUnit === "gpm" ? "GPM" : "L/min";
  const relayLengthUnit = unitSystem === "imperial" ? "ft" : "m";

  function parseFlow(raw) {
    const value = Number(raw);
    if (!Number.isFinite(value)) return NaN;
    return flowUnit === "gpm" ? value : value / 3.785411784;
  }

  function parseLength(raw) {
    const value = Number(raw);
    if (!Number.isFinite(value)) return NaN;
    return unitSystem === "imperial" ? value : value / 0.3048;
  }

  function handleCalculate() {
    const flowValue = parseFlow(relayFlow);
    const lengthFeet = parseLength(relayLength);
    const relayKey = relayType;
    const maxDistance = MAXRELAYLENGTHS[relayKey]?.[selectedFlowKey];
    if (!Number.isFinite(flowValue) || !Number.isFinite(lengthFeet) || !maxDistance) {
      setResults({ error: true });
      return;
    }

    const pumpers = Math.ceil(lengthFeet / maxDistance) + 1;
    setResults({
      flowRate: relayFlow,
      length: relayLength,
      maxDistance,
      pumpers,
      relayKey,
      selectedFlowKey,
      error: false,
    });
  }

  return (
    <div className="page">
      <div>
        <div className="page-headerTitle">Relay Pumpers</div>
        <div className="page-headerSubtitle">Estimate the number of pumpers required for a relay operation.</div>
      </div>

      <div className="page-card">
        <div className="page-sectionTitle">Flow Rate [{displayFlowUnit}]</div>
        <div className="page-help">Enter the flow amount you need at the attack pumper.</div>
        <input
          value={relayFlow}
          onChange={(e) => setRelayFlow(e.target.value)}
          inputMode="decimal"
          className="page-input"
        />
      </div>

      <div className="page-card">
        <div className="page-sectionTitle">Hose Type</div>
        <div className="page-help">Select the hose diameter or hose combination used for the relay.</div>
        <select value={relayType} onChange={(e) => setRelayType(e.target.value)} className="page-select">
          {hoseOptions.map((hose) => (
            <option key={hose.value} value={hose.value}>
              {hose.label}
            </option>
          ))}
        </select>
      </div>

      <div className="page-card">
        <div className="page-sectionTitle">Total Relay Length [{relayLengthUnit}]</div>
        <div className="page-help">Enter the total length from pump to pump to pump.</div>
        <input value={relayLength} onChange={(e) => setRelayLength(e.target.value)} inputMode="decimal" className="page-input" />
      </div>

      <button onClick={handleCalculate} className="page-primaryButton">
        Calculate Pumpers
      </button>

      {results && results.error ? (
        <div className="page-card page-errorCard">
          <div className="page-sectionTitle">Invalid input</div>
          <div className="page-help">Check flow, relay length, and hose type selection.</div>
        </div>
      ) : results && !results.error ? (
        <div className="page-card">
          <div className="page-sectionTitle">Relay Result</div>
          <div className="page-kv">
            <div className="page-k">Selected relay flow</div>
            <div className="page-v">
              {results.flowRate} {displayFlowUnit}
            </div>
          </div>
          <div className="page-hr" />
          <div className="page-kv">
            <div className="page-k">Maximum relay distance used</div>
            <div className="page-v">{results.maxDistance} ft</div>
          </div>
          <div className="page-hr" />
          <div className="page-kv">
            <div className="page-k">Relay length</div>
            <div className="page-v">
              {results.length} {relayLengthUnit}
            </div>
          </div>
          <div className="page-hr" />
          <div className="page-kv">
            <div className="page-k">Pumpers needed</div>
            <div className="page-v">{results.pumpers}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
