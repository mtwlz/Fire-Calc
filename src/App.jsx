import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGaugeHigh, faDroplet, faGear, faCircleInfo, faTruckFast, faWater } from "@fortawesome/free-solid-svg-icons";
import EnginePressure from "./pages/EnginePressure";
import FrictionLoss from "./pages/FrictionLoss";
import RelayPumpers from "./pages/RelayPumpers";
import RelayPerformance from "./pages/RelayPerformance";
import About from "./pages/About";
import "./styles/App.css";
import { NOZZLES, COEFFICIENTS } from "./utils/CONSTANTS";

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
  const [coefficientBank, setCoefficientBank] = useState("low");

  // Sync master/NP when nozzle selection changes
  // (simple sync without useEffect to keep this short; you can add useEffect if you prefer)
  function handleNozzleChange(id) {
    setNozzleId(id);
    const n = NOZZLES.find((x) => x.id === id) ?? NOZZLES[0];
    setIsMaster(n.isMaster);
    setNP(String(n.psi));
  }

  const [CId, setCId] = useState("2.5");
  const activeCoefficients = useMemo(
    () => COEFFICIENTS.filter((x) => x.type === coefficientBank),
    [coefficientBank]
  );

  useEffect(() => {
    if (!activeCoefficients.some((x) => x.id === CId)) {
      setCId(activeCoefficients[0]?.id ?? "2.5");
    }
  }, [activeCoefficients, CId]);

  const C = useMemo(
    () => activeCoefficients.find((x) => x.id === CId) ?? activeCoefficients[0],
    [activeCoefficients, CId]
  )?.C;

  const [Q, setQ] = useState("350");
  const [L, setL] = useState("200");
  const [appliances, setAppliances] = useState("0");
  const [elevDiff, setElevDiff] = useState("0");
  const [relayFlow, setRelayFlow] = useState("350");
  const [tankSize, setTankSize] = useState("2000");
  const [relayMiles, setRelayMiles] = useState("1");
  const [fillSiteTime, setFillSiteTime] = useState("5");
  const [dumpSiteTime, setDumpSiteTime] = useState("5");

  // Separate results per tab
  const [epResults, setEpResults] = useState(null);
  const [flResults, setFlResults] = useState(null);
  const [relayLength, setRelayLength] = useState("1000");
  const [relayType, setRelayType] = useState("3");
  const [relayResults, setRelayResults] = useState(null);
  const [relayPerfResults, setRelayPerfResults] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTabReady, setIsTabReady] = useState(true);
  const pendingTabRef = useRef(null);

  function handleTabChange(tab) {
    if (tab === activeTab) return;
    pendingTabRef.current = tab;
    setIsTabReady(false);
  }

  useEffect(() => {
    if (!isTabReady && pendingTabRef.current) {
      const timeout = window.setTimeout(() => {
        setActiveTab(pendingTabRef.current);
        pendingTabRef.current = null;
        setIsTabReady(true);
      }, 120);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [isTabReady]);

  return (
    <div className="app-shell">
      <div className="app-topBar">
        <div className="app-brand">
          <img src="./icon-192x192.png" alt="Fire Calc logo" className="app-brandLogo" />
          Fire-Calc
        </div>

        <div className="app-topBarActions">
          <button
            className="app-menuButton"
            onClick={() => setIsDrawerOpen((open) => !open)}
            aria-label={isDrawerOpen ? "Close settings" : "Open settings"}
            aria-expanded={isDrawerOpen}
          >
            <FontAwesomeIcon icon={faGear} className="app-tabIcon" />
          </button>
          <button
            className={`app-menuButton ${activeTab === "about" ? "app-menuButtonActive" : ""}`}
            onClick={() => handleTabChange("about")}
            aria-label="Open About page"
            aria-selected={activeTab === "about"}
          >
            <FontAwesomeIcon icon={faCircleInfo} className="app-tabIcon" />
          </button>
        </div>
      </div>

      <div className={`app-drawer ${isDrawerOpen ? "app-drawerOpen" : ""}`}>
        <div className="app-drawerContent">
          <div className="app-drawerSection">
            <div className="app-drawerTitle">Settings</div>
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
          </div>

          <div className="app-drawerSection">
            <div className="app-drawerTitle">Units</div>
            <div className="app-bankToggleGroup">
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

          <div className="app-drawerSection">
            <div className="app-drawerTitle">Hose Coefficients</div>
            <div className="app-bankToggleGroup" role="group" aria-label="Coefficient bank">
              <button
                onClick={() => setCoefficientBank("low")}
                className={coefficientBank === "low" ? "app-bankButtonActive" : "app-bankButton"}
              >
                Low pressure
              </button>
              <button
                onClick={() => setCoefficientBank("high")}
                className={coefficientBank === "high" ? "app-bankButtonActive" : "app-bankButton"}
              >
                High pressure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="app-content">
        <div className={`app-pageTransition ${isTabReady ? "app-pageReady" : "app-pageHidden"}`}>
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
              COEFFICIENTS={activeCoefficients}
              coefficientBank={coefficientBank}
              results={epResults}
              setResults={setEpResults}
            />
          ) : activeTab === "fl" ? (
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
              COEFFICIENTS={activeCoefficients}
              coefficientBank={coefficientBank}
              results={flResults}
              setResults={setFlResults}
            />
          ) : activeTab === "relay" ? (
            <RelayPumpers
              unitSystem={unitSystem}
              flowUnit={flowUnit}
              relayLength={relayLength}
              setRelayLength={setRelayLength}
              relayType={relayType}
              setRelayType={setRelayType}
              relayFlow={relayFlow}
              setRelayFlow={setRelayFlow}
              results={relayResults}
              setResults={setRelayResults}
            />
          ) : activeTab === "relayPerformance" ? (
            <RelayPerformance
              tankSize={tankSize}
              setTankSize={setTankSize}
              relayMiles={relayMiles}
              setRelayMiles={setRelayMiles}
              fillSiteTime={fillSiteTime}
              setFillSiteTime={setFillSiteTime}
              dumpSiteTime={dumpSiteTime}
              setDumpSiteTime={setDumpSiteTime}
              results={relayPerfResults}
              setResults={setRelayPerfResults}
            />
          ) : (
            <About />
          )}
        </div>
      </div>

      <div className="app-tabs" role="tablist" aria-label="Calculator views">
        <button
          onClick={() => handleTabChange("ep")}
          className={activeTab === "ep" ? "app-tabActive" : "app-tab"}
          role="tab"
          aria-selected={activeTab === "ep"}
        >
          <FontAwesomeIcon icon={faGaugeHigh} className="app-tabIcon" />
          <span className="app-tabLabel">Engine Pressure</span>
        </button>
        <button
          onClick={() => handleTabChange("fl")}
          className={activeTab === "fl" ? "app-tabActive" : "app-tab"}
          role="tab"
          aria-selected={activeTab === "fl"}
        >
          <FontAwesomeIcon icon={faDroplet} className="app-tabIcon" />
          <span className="app-tabLabel">Friction Loss</span>
        </button>
        <button
          onClick={() => handleTabChange("relay")}
          className={activeTab === "relay" ? "app-tabActive" : "app-tab"}
          role="tab"
          aria-selected={activeTab === "relay"}
        >
          <FontAwesomeIcon icon={faTruckFast} className="app-tabIcon" />
          <span className="app-tabLabel">Relay Pumpers</span>
        </button>
        <button
          onClick={() => handleTabChange("relayPerformance")}
          className={activeTab === "relayPerformance" ? "app-tabActive" : "app-tab"}
          role="tab"
          aria-selected={activeTab === "relayPerformance"}
        >
          <FontAwesomeIcon icon={faWater} className="app-tabIcon" />
          <span className="app-tabLabel">Relay Performance</span>
        </button>
      </div>
    </div>
  );
}