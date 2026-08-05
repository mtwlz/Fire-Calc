import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/main.css";
import { faCode } from "@fortawesome/free-solid-svg-icons";

export default function About() {
    return (
        <div className="page">
            <div>
                <div className="page-headerTitle">About</div>
                <div className="page-headerSubtitle">Help and version information.</div>
            </div>

            <div className="page-card">
                <div className="page-sectionTitle">What this app does</div>
                <div className="page-help">
                    This app estimates figures using standard fire service formulas.
                    <div style={{ fontSize: '1.25em', marginTop: '1em', textAlign: 'left' }}>Engine Pressure</div>
                    <div>Calculate the pump discharge pressure using a combination of the friction loss equation and <b>EP = NP + FL + AL + EL</b>.</div>
                    <div style={{ fontSize: '1.25em', marginTop: '1em', textAlign: 'left' }}>Friction Loss</div>
                    <div>Calculates hose line friction loss using <b>FL = C x (Q/100)² x (L/100)</b>.</div>
                    <div style={{ fontSize: '1.25em', marginTop: '1em', textAlign: 'left' }}>Relay Pumpers</div>
                    <div>Estimate the number of pumpers required for a relay operation, using the equation <b>P = (D x F) / R</b>.</div>
                    <div style={{ fontSize: '1.25em', marginTop: '1em', textAlign: 'left' }}>Relay Performance</div>
                    <div>Calculate tender actual flow using the formula <b>Q = (V x T) / D</b>.</div>

                </div>
            </div>

            <div className="page-card">
                <div className="page-sectionTitle">How to use this app</div>
                <div className="page-help">
                    <ol style={{ paddingLeft: 20, marginTop: 10, textAlign: "left" }}>
                        <li>Select the tab at the bottom that you want to use.</li>
                        <li>Enter the parameters shown.</li>
                        <li>Click "Calculate" at the bottom of the page.</li>
                        <li>The results will appear below the Calculate button.</li>
                    </ol>
                </div>
            </div>

            <div className="page-card">
                    <div className="page-sectionTitle">Version</div>
                <div className="page-kv">
                    <div className="page-k">Release Candidate</div>
                    <div className="page-v">0.2.1</div>
                </div>
            </div>
            <div className="page-card">
                <a
                    href="https://github.com/mtwlz/Fire-Calc"
                    target="_blank"
                    rel="noreferrer"
                    className="page-secondaryButton"
                    style={{ marginTop: 16, textAlign: "center", display: "inline-block" }}
                >
                    <FontAwesomeIcon icon={faCode} style={{ marginRight: 8 }} />
                    View Source Code
                </a>
            </div>
            <div className="page-card">
                <div className="page-sectionTitle">Disclaimer</div>
                <div className="page-help">
                    The calculations are based on standard fire service formulas, but actual conditions may vary. Always follow your department's protocols and guidelines. This app is provided as a tool for estimation and should not replace professional judgment or training.
                </div>
            </div>
        
        </div>
    );
}
