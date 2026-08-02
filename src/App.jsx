import { useEffect, useMemo, useState } from "react";
import EnginePressure from "./pages/EnginePressure";
import FrictionLoss from "./pages/FrictionLoss";
import "./styles/App.css";

const NOZZLES = [
  { id: "smooth", label: "Smooth Bore", psi: 50, isMaster: false },
  { id: "fog", label: "Fog Nozzle", psi: 100, isMaster: false },
  { id: "m_smooth", label: "Master Stream Smooth Bore", psi: 80, isMaster: true },
  { id: "m_fog", label: "Master Stream Fog Nozzle", psi: 100, isMaster: true },
];

const COEFFICIENTS = [
  { id: "0.75", label: '0.75"', C: 1100 },
  { id: "1", label: '1"', C: 150 },
  { id: "1.5", label: '1.5"', C: 24 },
  { id: "1.75", label: '1.75"', C: 15.5 },
  { id: "2", label: '2"', C: 8 },
  { id: "2.5", label: '2.5"', C: 2 },
  { id: "3", label: '3"', C: 0.8 },
  { id: "4", label: '4"', C: 0.2 },
  { id: "5", label: '5"', C: 0.08 },
  { id: "2.5x2", label: 'Two 2.5" hoses', C: 0.5 },
  { id: "2.5x3", label: 'Three 2.5" hoses', C: 0.22 },
  { id: "3x2", label: 'Two 3" hoses', C: 0.2 },
  { id: "3and2.5", label: 'A 3" hose and a 2.5" hose', C: 0.3 },
  { id: "2.5x2_3x1", label: 'Two 2.5" hoses and one 3" hose', C: 0.16 },
  { id: "3x2_2.5x1", label: 'Two 3" hoses and one 2.5" hose', C: 0.12 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("ep"); // "ep" | "fl"
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("firecalc-theme");
      if (stored === "light" || stored === "dark") return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("firecalc-theme", theme);
  }, [theme]);

  // Unit system
  const [unitSystem, setUnitSystem] = useState("imperial"); // default PSI/ft + GPM
  const pressureUnit = unitSystem === "imperial" ? "psi" : "bar";
  const lengthUnit = unitSystem === "imperial" ? "ft" : "m";
  const flowUnit = unitSystem === "imperial" ? "gpm" : "lpm";

  // Shared inputs (so users can move tabs without retyping)
  const [nozzleId, setNozzleId] = useState("smooth");
  const nozzle = useMemo(
    () => NOZZLES.find((n) => n.id === nozzleId) ?? NOZZLES[0],
    [nozzleId]
  );

  const [isMaster, setIsMaster] = useState(nozzle.isMaster);
  const [NP, setNP] = useState(String(nozzle.psi));

  // Sync master/NP when nozzle selection changes
  // (simple sync without useEffect to keep this short; you can add useEffect if you prefer)
  function handleNozzleChange(id) {
    setNozzleId(id);
    const n = NOZZLES.find((x) => x.id === id) ?? NOZZLES[0];
    setIsMaster(n.isMaster);
    setNP(String(n.psi));
  }

  const [CId, setCId] = useState("2.5");
  const C = useMemo(
    () => COEFFICIENTS.find((x) => x.id === CId) ?? COEFFICIENTS[0],
    [CId]
  ).C;

  const [Q, setQ] = useState("350");
  const [L, setL] = useState("200");
  const [appliances, setAppliances] = useState("0");
  const [elevDiff, setElevDiff] = useState("0");

  // Separate results per tab
  const [epResults, setEpResults] = useState(null);
  const [flResults, setFlResults] = useState(null);

  return (
    <div className="app-shell">
      <div className="app-topBar">
        <div className="app-brand">Fireflow</div>

        <div className="app-topBarActions">
          <label className="app-toggle">
            <input
              className="app-toggleInput"
              type="checkbox"
              checked={theme === "dark"}
              onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
            <span className="app-toggleTrack" />
            <span>{theme === "dark" ? "Dark" : "Light"}</span>
          </label>
          <button
            onClick={() => setUnitSystem("imperial")}
            className={unitSystem === "imperial" ? "app-topBtnActive" : "app-topBtn"}
          >
            PSI/GPM
          </button>
          <button
            onClick={() => setUnitSystem("metric")}
            className={unitSystem === "metric" ? "app-topBtnActive" : "app-topBtn"}
          >
            bar/L
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="app-tabs">
        <button
          onClick={() => setActiveTab("ep")}
          className={activeTab === "ep" ? "app-tabActive" : "app-tab"}
        >
          Engine Pressure
        </button>
        <button
          onClick={() => setActiveTab("fl")}
          className={activeTab === "fl" ? "app-tabActive" : "app-tab"}
        >
          Friction Loss
        </button>
      </div>

      {/* Content */}
      <div className="app-content">
        {activeTab === "ep" ? (
          <EnginePressure
            unitSystem={unitSystem}
            pressureUnit={pressureUnit}
            flowUnit={flowUnit}
            lengthUnit={lengthUnit}
            NP={NP}
            setNP={setNP}
            Q={Q}
            setQ={setQ}
            L={L}
            setL={setL}
            appliances={appliances}
            setAppliances={setAppliances}
            elevDiff={elevDiff}
            setElevDiff={setElevDiff}
            C={C}
            isMaster={isMaster}
            setIsMaster={setIsMaster}
            nozzleId={nozzleId}
            setNozzleId={handleNozzleChange}
            CId={CId}
            setCId={setCId}
            NOZZLES={NOZZLES}
            COEFFICIENTS={COEFFICIENTS}
            results={epResults}
            setResults={setEpResults}
          />
        ) : (
          <FrictionLoss
            unitSystem={unitSystem}
            pressureUnit={pressureUnit}
            flowUnit={flowUnit}
            lengthUnit={lengthUnit}
            Q={Q}
            setQ={setQ}
            L={L}
            setL={setL}
            C={C}
            CId={CId}
            setCId={setCId}
            COEFFICIENTS={COEFFICIENTS}
            results={flResults}
            setResults={setFlResults}
          />
        )}
      </div>
    </div>
  );
}