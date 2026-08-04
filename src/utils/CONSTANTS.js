const NOZZLES = [
  { id: "smooth", label: "Smooth Bore", psi: 50, isMaster: false },
  { id: "fog", label: "Fog Nozzle", psi: 100, isMaster: false },
  { id: "m_smooth", label: "Master Stream Smooth Bore", psi: 80, isMaster: true },
  { id: "m_fog", label: "Master Stream Fog Nozzle", psi: 100, isMaster: true },
];

const COEFFICIENTS = [
  { id: "0.75", label: '0.75"', C: 1100, type: 'high'},
  { id: "1", label: '1"', C: 150, type: 'high' },
  { id: "1.5", label: '1.5"', C: 24, type: 'high' },
  { id: "1.75", label: '1.75"', C: 15.5, type: 'high' },
  { id: "2", label: '2"', C: 8, type: 'high' },
  { id: "2.5", label: '2.5"', C: 2, type: 'high' },
  { id: "3", label: '3"', C: 0.8, type: 'high' },
  { id: "4", label: '4"', C: 0.2, type: 'high' },
  { id: "5", label: '5"', C: 0.08, type: 'high' },
  { id: "2.5x2", label: 'Two 2.5" hoses', C: 0.5, type: 'high' },
  { id: "2.5x3", label: 'Three 2.5" hoses', C: 0.22, type: 'high' },
  { id: "3x2", label: 'Two 3" hoses', C: 0.2, type: 'high' },
  { id: "3and2.5", label: 'A 3" hose and a 2.5" hose', C: 0.3, type: 'high' },
  { id: "2.5x2_3x1", label: 'Two 2.5" hoses and one 3" hose', C: 0.16, type: 'high' },
  { id: "3x2_2.5x1", label: 'Two 3" hoses and one 2.5" hose', C: 0.12, type: 'high' },
  { id: "0.75", label: '0.75"', C: 1100, type: 'low'},
  { id: "1", label: '1"', C: 150, type: 'low' },
  { id: "1.5", label: '1.5"', C: 24, type: 'low' },
  { id: "1.75", label: '1.75"', C: 8.3, type: 'low' },
  { id: "2", label: '2"', C: 6.3, type: 'low' },
  { id: "2.5", label: '2.5"', C: 2, type: 'low' },
  { id: "3", label: '3"', C: 0.8, type: 'low' },
  { id: "4", label: '4"', C: 0.2, type: 'low' },
  { id: "5", label: '5"', C: 0.08, type: 'low' },
  { id: "2.5x2", label: 'Two 2.5" hoses', C: 0.5, type: 'low' },
  { id: "2.5x3", label: 'Three 2.5" hoses', C: 0.22, type: 'low' },
  { id: "3x2", label: 'Two 3" hoses', C: 0.2, type: 'low' },
  { id: "3and2.5", label: 'A 3" hose and a 2.5" hose', C: 0.3, type: 'low' },
  { id: "2.5x2_3x1", label: 'Two 2.5" hoses and one 3" hose', C: 0.16, type: 'low' },
  { id: "3x2_2.5x1", label: 'Two 3" hoses and one 2.5" hose', C: 0.12, type: 'low' },
];

// Shows maximum feet in a relay, based on GPM and hose diameter(s)
/*
{
    "hoseDiameter": {
        250gpm: maxDistance,
        500gpm: maxDistance
        etc.
    }
}
*/
const MAXRELAYLENGTHS = {
    "2.5": {
        '250': 1440,
        '500': 360,
        '750': 160,
        '1000': 90,
        '1250': 50
    },
    "3": {
        '250': 3600,
        '500': 900,
        '750': 400,
        '1000': 225,
        '1250': 140
    },
    "4": {
        '250': 13200,
        '500': 3300,
        '750': 1450,
        '1000': 825,
        '1250': 525
    },
    "5": {
        '250': 33000,
        '500': 8250,
        '750': 3670,
        '1000': 2050,
        '1250': 1320
    },
    "2.5x2": {
        '250': 5760,
        '500': 1440,
        '750': 640,
        '1000': 360,
        '1250': 200
    },
    "3and2.5": {
        '250': 9600,
        '500': 2400,
        '750': 1050,
        '1000': 600,
        '1250': 375
    },
    "3x2": {
        '250': 14400,
        '500': 36000,
        '750': 1600,
        '1000': 900,
        '1250': 500
    },
}

export { NOZZLES, COEFFICIENTS, MAXRELAYLENGTHS };