import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGaugeHigh, faDroplet, faGear, faCircleInfo, faTruckFast, faWater, faFire } from "@fortawesome/free-solid-svg-icons";
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetModalMounted, setResetModalMounted] = useState(false);
  const [isResetModalActive, setIsResetModalActive] = useState(false);
  const [previousTab, setPreviousTab] = useState("ep");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTabReady, setIsTabReady] = useState(true);
  const pendingTabRef = useRef(null);

  useEffect(() => {
    let timeout;
    let firstFrame;
    let secondFrame;

    if (showResetConfirm) {
      setResetModalMounted(true);
      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          setIsResetModalActive(true);
        });
      });
    } else if (resetModalMounted) {
      setIsResetModalActive(false);
      timeout = window.setTimeout(() => setResetModalMounted(false), 180);
    }

    return () => {
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [showResetConfirm, resetModalMounted]);

  function getPreferredTheme() {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  }

  function resetAllFields() {
    const defaultNozzle = NOZZLES.find((n) => n.id === "smooth") ?? NOZZLES[0];

    setActiveTab("ep");
    setTheme(getPreferredTheme());
    setUnitSystem("imperial");
    setNozzleId("smooth");
    setIsMaster(defaultNozzle.isMaster);
    setNP(String(defaultNozzle.psi));
    setCoefficientBank("low");
    setCId("2.5");
    setQ("350");
    setL("200");
    setAppliances("0");
    setElevDiff("0");
    setRelayFlow("350");
    setTankSize("2000");
    setRelayMiles("1");
    setFillSiteTime("5");
    setDumpSiteTime("5");
    setEpResults(null);
    setFlResults(null);
    setRelayResults(null);
    setRelayPerfResults(null);
    setIsDrawerOpen(false);
    setShowResetConfirm(false);
  }

  function handleTabChange(tab) {
    if (tab === activeTab) {
      if (tab === "about") {
        const target = previousTab === "about" ? "ep" : previousTab;
        if (target !== activeTab) {
          pendingTabRef.current = target;
          setIsTabReady(false);
        }
      }
      return;
    }

    if (tab === "about") {
      setPreviousTab(activeTab);
    } else if (activeTab === "about") {
      setPreviousTab(tab);
    }

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
            className={`app-menuButton ${isDrawerOpen ? "app-menuButtonActive" : ""}`}
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
          <button
            className={`app-menuButton ${showResetConfirm ? "app-menuButtonReset" : ""}`}
            onClick={() => setShowResetConfirm(true)}
            aria-label="Reset all fields"
          >
            <FontAwesomeIcon icon={faFire} className="app-tabIcon" />
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

      {resetModalMounted ? (
        <div className={`app-modalOverlay ${isResetModalActive ? "app-modalVisible" : "app-modalHidden"}`} role="dialog" aria-modal="true" aria-labelledby="reset-modal-title">
          <div className={`app-modal ${isResetModalActive ? "app-modalEnter" : "app-modalExit"}`}>
            <div className="app-modalTitle" id="reset-modal-title">Reset all fields?</div>
            <div className="app-modalBody">This will restore every input field to its default value. Are you sure you want to continue?</div>
            <div className="app-modalActions">
              <button className="app-buttonSecondary" onClick={() => setShowResetConfirm(false)}>
                No
              </button>
              <button className="app-buttonDanger" onClick={resetAllFields}>
                Yes, reset
              </button>
            </div>
          </div>
        </div>
      ) : null}

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