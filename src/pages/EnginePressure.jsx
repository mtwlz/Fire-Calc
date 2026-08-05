import { calcEP } from "../utils/fireMath";
import "../styles/main.css";

export default function EnginePressure({
  unitSystem,
  pressureUnit,
  flowUnit,
  lengthUnit,
  NP,
  setNP,
  Q,
  setQ,
  L,
  setL,
  appliances,
  setAppliances,
  elevDiff,
  setElevDiff,
  C,
  isMaster,
  setIsMaster,
  nozzleId,
  setNozzleId,
  CId,
  setCId,
  NOZZLES,
  COEFFICIENTS,
  coefficientBank,
  results,
  setResults,
}) {
  function handleCalculate() {
    const NPn = Number(NP);
    const Qn = Number(Q);
    const Ln = Number(L);
    const An = Number(appliances);
    const En = Number(elevDiff);

    if (![NPn, Qn, Ln, An, En].every((x) => Number.isFinite(x))) return;

    setResults(
      calcEP({
        NP: NPn,
        Q: Qn,
        L: Ln,
        elevationDifference: En,
        C,
        isMaster,
        applianceCount: An,
        pressureUnit,
        flowUnit,
        lengthUnit,
      })
    );
  }

  return (
    <div className="page">
      <div>
        <div className="page-headerTitle">Engine Pressure</div>
        <div className="page-headerSubtitle">Calculates target pump discharge pressure. Enter the values below and click "Calculate" to see the results at the bottom.</div>
      </div>

      <div className="page-card">
        <div className="page-sectionTitle">Hose Setup</div>
        <div style={{ marginTop: 10 }}>
          <div className="page-help">Select {coefficientBank === "low" ? "low-pressure" : "high-pressure"} hose(s) in use.</div>
          <select value={CId} onChange={(e) => setCId(e.target.value)} className="page-select">
            {COEFFICIENTS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="page-card">
        <div className="page-sectionTitle">Nozzle Pressure [{pressureUnit}]</div>
        <div className="page-help">The pressure at the nozzle tip.</div>
        <div style={{ marginTop: 10 }}>
          <select
            value={nozzleId}
            onChange={(e) => {
              setNozzleId(e.target.value);
            }}
            className="page-select"
          >
            {NOZZLES.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
          <input value={NP} onChange={(e) => setNP(e.target.value)} inputMode="decimal" className="page-input" />
        </div>
      </div>

      <div className="page-card">
        <div className="page-sectionTitle">Flow Rate [{flowUnit === "gpm" ? "GPM" : "L/min"}]</div>
        <div className="page-help">The amount of water flowing through the system.</div>
        <input value={Q} onChange={(e) => setQ(e.target.value)} inputMode="decimal" className="page-input" />
      </div>

      <div className="page-card">
        <div className="page-sectionTitle">Total Hose Length [{lengthUnit}]</div>
        <div className="page-help">Enter the length of all hoses after the pump.</div>
        <input value={L} onChange={(e) => setL(e.target.value)} inputMode="decimal" className="page-input" />
      </div>

      <div className="page-card">
        <div className="page-sectionTitle">Number of Appliances</div>
        <div className="page-help">Only applies when flow exceeds 350 GPM.</div>
        <input
          value={appliances}
          onChange={(e) => setAppliances(e.target.value)}
          inputMode="numeric"
          className="page-input"
        />
      </div>
      
      <div className="page-card">
        <div className="page-sectionTitle">Elevation Difference [{lengthUnit}]</div>
        <div className="page-help">+ adds (nozzle higher), - subtracts.</div>
        <input
            value={elevDiff}
            onChange={(e) => setElevDiff(e.target.value)}
            inputMode="decimal"
            className="page-input"
          />
      </div>

      <button onClick={handleCalculate} className="page-primaryButton">
        Calculate Engine Pressure
      </button>

      {results && (
        <div className="page-card">
          <div className="page-sectionTitle">Results</div>
          <div className="page-kv">
            <div className="page-k">EP (pump discharge)</div>
            <div className="page-v">
              {Math.round(results.EP)} {pressureUnit}
            </div>
          </div>
          <div className="page-hr" />
          <div className="page-kv">
            <div className="page-k">FL (friction loss)</div>
            <div className="page-v">
              {Math.round(results.FL)} {pressureUnit}
            </div>
          </div>
          <div className="page-hr" />
          <div className="page-kv">
            <div className="page-k">AL (appliance loss)</div>
            <div className="page-v">
              {Math.round(results.AL)} {pressureUnit}
            </div>
          </div>
          <div className="page-hr" />
          <div className="page-kv">
            <div className="page-k">EL (± elevation term)</div>
            <div className="page-v">
              {Math.round(results.EL)} {pressureUnit}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}