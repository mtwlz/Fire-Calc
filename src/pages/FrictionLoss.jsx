import { calcEP, frictionLossPSI } from "../utils/fireMath";
import "../styles/main.css";

export default function FrictionLoss({
  unitSystem,
  pressureUnit,
  flowUnit,
  lengthUnit,
  Q,
  setQ,
  L,
  setL,
  C,
  CId,
  setCId,
  COEFFICIENTS,
  coefficientBank,
  results,
  setResults,
}) {
  // We'll compute FL specifically, but reuse conversion constants via calcEP.
  // Easiest: set NP=0, AL=0, EL=0, and read FL out.
  function handleCalculate() {
    const Qn = Number(Q);
    const Ln = Number(L);

    if (![Qn, Ln].every((x) => Number.isFinite(x))) return;

    const r = calcEP({
      NP: 0,
      Q: Qn,
      L: Ln,
      elevationDifference: 0,
      C,
      isMaster: false, // doesn't matter because AL will be 0/irrelevant at NP=0; Q > 350 would set AL though
      pressureUnit,
      flowUnit,
      lengthUnit,
    });

    // calcEP includes AL when Q > 350; friction-loss page should show FL only.
    // So we recompute FL using the formula components directly:
    const Q_gpm = flowUnit === "gpm" ? Qn : Qn * (3.785411784); // (kept simple for display)
    const L_feet = lengthUnit === "ft" ? Ln : Ln * (1 / 0.3048);

    const FL_psi = frictionLossPSI({ Q_gpm, L_feet, C });
    const FL =
      pressureUnit === "psi" ? FL_psi : FL_psi * 0.0689475729;

    setResults({
      FL_psi,
      FL,
      Q_gpm,
      L_feet,
    });
  }

  return (
    <div className="page">
      <div>
        <div className="page-headerTitle">Friction Loss</div>
        <div className="page-headerSubtitle">Uses: FL = C · (Q/100)² · (L/100)</div>
      </div>

      <div className="page-card">
        <div className="page-sectionTitle">Hose Setup (Coefficient C)</div>
        <div style={{ marginTop: 10 }}>
          <div className="page-help">Select C</div>
          <div className="page-help">
            Using {coefficientBank === "low" ? "low-pressure" : "high-pressure"} hose coefficients.
          </div>
          <select value={CId} onChange={(e) => setCId(e.target.value)} className="page-select">
            {COEFFICIENTS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <div style={{ marginTop: 8, color: "var(--app-muted)" }}>
            Current C: <span style={{ fontWeight: 900, color: "var(--app-text)" }}>{C}</span>
          </div>
        </div>
      </div>

      <div className="page-card">
        <div className="page-sectionTitle">Inputs</div>

        <div style={{ marginTop: 10 }}>
          <div className="page-help">Flow Rate Q [{flowUnit === "gpm" ? "GPM" : "L/min"}]</div>
          <input value={Q} onChange={(e) => setQ(e.target.value)} inputMode="decimal" className="page-input" />
        </div>

        <div style={{ marginTop: 10 }}>
          <div className="page-help">Hose Total Length L (discharge line total) [{lengthUnit}]</div>
          <input value={L} onChange={(e) => setL(e.target.value)} inputMode="decimal" className="page-input" />
        </div>

        <button onClick={handleCalculate} className="page-primaryButton" style={{ marginTop: 12 }}>
          Calculate FL
        </button>
      </div>

      {results && (
        <div className="page-card">
          <div className="page-sectionTitle">Results</div>
          <div className="page-kv">
            <div className="page-k">FL</div>
            <div className="page-v">
              {results.FL} {pressureUnit}
            </div>
          </div>
          <div className="page-hr" />
          <div className="page-helpText">
            Internally used units: Q ≈ {Number(results.Q_gpm).toFixed(2)} gpm, L ≈ {Number(results.L_feet).toFixed(2)} ft
          </div>
        </div>
      )}
    </div>
  );
}
