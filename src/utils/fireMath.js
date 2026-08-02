// utils/fireMath.js

const PSI_TO_BAR = 0.0689475729;
const BAR_TO_PSI = 1 / PSI_TO_BAR;

const FT_TO_M = 0.3048;
const M_TO_FT = 1 / FT_TO_M;

const GPM_TO_LPM = 3.785411784;
const LPM_TO_GPM = 1 / GPM_TO_LPM;

export function toPSI(value, pressureUnit) {
  return pressureUnit === "psi" ? value : value * BAR_TO_PSI;
}

export function fromPSI(value, pressureUnit) {
  return pressureUnit === "psi" ? value : value * PSI_TO_BAR;
}

export function toFeet(value, lengthUnit) {
  return lengthUnit === "ft" ? value : value * M_TO_FT;
}

export function fromFeet(value, lengthUnit) {
  return lengthUnit === "ft" ? value : value * FT_TO_M;
}

export function toGPM(value, flowUnit) {
  return flowUnit === "gpm" ? value : value * LPM_TO_GPM;
}

export function fromGPM(value, flowUnit) {
  return flowUnit === "gpm" ? value : value * GPM_TO_LPM;
}

// FL = C * (Q/100)^2 * (L/100)
// Q in GPM, L in feet, FL in PSI
export function frictionLossPSI({ Q_gpm, L_feet, C }) {
  return C * Math.pow(Q_gpm / 100, 2) * (L_feet / 100);
}

// AL: only relevant when Q > 350
export function applianceLossPSI({ Q_gpm, applianceCount = 0 }) {
  if (Q_gpm <= 350) return 0;
  return applianceCount * 10;
}

// EL: 0.5 psi per foot
// elevationDifferenceFeet = (nozzle - pump)
export function elevationLossPSI({ elevationDifferenceFeet }) {
  return elevationDifferenceFeet * 0.5;
}

export function calcEP({
  NP, // number in user pressureUnit
  Q, // number in user flowUnit
  L, // number in user lengthUnit (total hose length)
  elevationDifference, // number in user lengthUnit (nozzle - pump)
  C, // coefficient
  isMaster, // boolean
  applianceCount = 0, // number of appliances
  pressureUnit, // "psi" | "bar"
  flowUnit, // "gpm" | "lpm"
  lengthUnit, // "ft" | "m"
}) {
  const NP_psi = toPSI(NP, pressureUnit);
  const Q_gpm = toGPM(Q, flowUnit);
  const L_feet = toFeet(L, lengthUnit);
  const elev_feet = toFeet(elevationDifference, lengthUnit);

  const FL_psi = frictionLossPSI({ Q_gpm, L_feet, C });
  const AL_psi = applianceLossPSI({ Q_gpm, applianceCount });
  const EL_psi = elevationLossPSI({ elevationDifferenceFeet: elev_feet });

  const EP_psi = NP_psi + FL_psi + AL_psi + EL_psi;

  return {
    EP_psi,
    EP: fromPSI(EP_psi, pressureUnit),
    FL_psi,
    FL: fromPSI(FL_psi, pressureUnit),
    AL_psi,
    AL: fromPSI(AL_psi, pressureUnit),
    EL_psi,
    EL: fromPSI(EL_psi, pressureUnit),
    NP_psi,
    NP: fromPSI(NP_psi, pressureUnit),
    Q_gpm,
    L_feet,
    elev_feet,
  };
}
