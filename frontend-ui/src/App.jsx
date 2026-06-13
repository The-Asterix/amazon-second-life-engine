// App.jsx
import React, { useState, useEffect } from 'react';

export default function App() {
  // State machine configurations for handling explicit assessment phases
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [assessmentStage, setAssessmentStage] = useState("idle"); // idle | analyzing | completed | error
  const [diagnosticText, setDiagnosticText] = useState("");
  const [evaluationReport, setEvaluationReport] = useState(null);
  const [pipelineError, setPipelineError] = useState("");

  // Array of processing milestones to feed the real-time UI loading simulation loop
  const processingMilestones = [
    "Initializing stream matrix...",
    "Extracting structural boundaries via Computer Vision...",
    "Executing cosmetic wear-and-tear evaluation...",
    "Calculating product integrity index against original SKU specifications...",
    "Allocating green micro-credits and secondary life routing path..."
  ];

  // Effect hook to cycle human-readable telemetry status messages while the cloud processes data
  useEffect(() => {
    let milestoneIndex = 0;
    let textIntervalTimer;

    if (assessmentStage === "analyzing") {
      setDiagnosticText(processingMilestones[0]);
      textIntervalTimer = setInterval(() => {
        milestoneIndex++;
        if (milestoneIndex < processingMilestones.length) {
          setDiagnosticText(processingMilestones[milestoneIndex]);
        }
      }, 900); // 900ms interval mimics deep local network processing tasks smoothly
    }

    return () => clearInterval(textIntervalTimer);
  }, [assessmentStage]);

  // Read upload buffers and safely translate binary streams to Base64 payloads
  const processImageUpload = (event) => {
    const rawAssetFile = event.target.files[0];
    if (!rawAssetFile) return;

    setSelectedFile(rawAssetFile);
    setPipelineError("");

    const dataStreamReader = new FileReader();
    dataStreamReader.onloadend = () => {
      // Stripping out header data-uri string to feed raw Base64 bytes cleanly to AWS SDK
      const modularBase64String = dataStreamReader.result.split(',')[1];
      setBase64Image(modularBase64String);
    };
    dataStreamReader.onerror = () => {
      setPipelineError("File system stream translation corrupted. Select another clear image asset.");
    };
    dataStreamReader.readAsDataURL(rawAssetFile);
  };

  // Dispatch payloads directly to local server route using native fetch API wrappers
  const initializeAssetAssessment = async (e) => {
    e.preventDefault();
    if (!base64Image) {
      setPipelineError("Action blocked: Please attach a physical image preview of the item first.");
      return;
    }

    setAssessmentStage("analyzing");
    setPipelineError("");
    setEvaluationReport(null);

    try {
      const upstreamNetworkResponse = await fetch("http://127.0.0.1:8000/api/v1/evaluate-return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "usr_9921_kapoor",
          order_id: `ord_${Math.floor(Math.random() * 900000 + 100000)}`, // Generates dynamic tracking markers matching Amazon schema
          item_image_b64: base64Image
        })
      });

      if (!upstreamNetworkResponse.ok) {
        throw new Error(`Cloud gateway responded with status code: ${upstreamNetworkResponse.status}`);
      }

      const parsedPayloadPayload = await upstreamNetworkResponse.json();
      
      if (parsedPayloadPayload.data && parsedPayloadPayload.data.error) {
        throw new Error(parsedPayloadPayload.data.error);
      }

      setEvaluationReport(parsedPayloadPayload.data);
      setAssessmentStage("completed");
    } catch (networkFault) {
      setPipelineError(networkFault.message || "Upstream diagnostic server connection failure.");
      setAssessmentStage("error");
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '40px auto', padding: '20px', color: '#111' }}>
      {/* Amazon Secondary Market Branding Header Element */}
      <header style={{ borderBottom: '2px solid #eaeded', paddingBottom: '15px', marginBottom: '30px' }}>
        <h1 style={{ color: '#232f3e', margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>
          Amazon <span style={{ color: '#ff9900' }}>Second Life</span> Commerce
        </h1>
        <p style={{ margin: 0, color: '#565959', fontSize: '14px' }}>Reverse Logistics Automated Inspection Portal (Staging Environment)</p>
      </header>

      <main style={{ background: '#f7f7f7', borderRadius: '8px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <form onSubmit={initializeAssetAssessment}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
              Upload Asset Condition Photograph (JPEG Format recommended):
            </label>
            <input 
              type="file" 
              accept="image/jpeg, image/jpg, image/png" 
              onChange={processImageUpload}
              style={{ display: 'block', width: '100%', padding: '10px', background: '#fff', border: '1px solid #a6a9a9', borderRadius: '4px' }}
            />
          </div>

          {selectedFile && (
            <p style={{ fontSize: '13px', color: '#565959', marginTop: '-10px', marginBottom: '20px' }}>
              Target Asset Staged: <strong>{selectedFile.name}</strong>
            </p>
          )}

          <button 
            type="submit" 
            disabled={assessmentStage === "analyzing"}
            style={{
              background: assessmentStage === "analyzing" ? '#e7e9ec' : '#f0c14b',
              borderColor: assessmentStage === "analyzing" ? '#e7e9ec' : '#a88734 #9c7e31 #846a29',
              color: '#111',
              padding: '12px 24px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '3px',
              cursor: assessmentStage === "analyzing" ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            {assessmentStage === "analyzing" ? "Processing Analysis..." : "Initiate Autonomous Inspection"}
          </button>
        </form>

        {/* Live Diagnostics Telemetry Screen Component */}
        {assessmentStage === "analyzing" && (
          <div style={{ marginTop: '25px', padding: '15px', background: '#232f3e', borderRadius: '4px', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', fontFamily: 'monospace' }}>⚡ telemetry_status_stream_active:</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#ff9900' }}>{diagnosticText}</span>
            </div>
          </div>
        )}

        {/* Resilience Mechanism: Explicit Interface Level Feedback Handling */}
        {pipelineError && (
          <div style={{ marginTop: '25px', padding: '15px', background: '#fdf0f0', border: '1px solid #d51919', borderRadius: '4px', color: '#b12704' }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>Pipeline Anomaly Flagged</h4>
            <p style={{ margin: 0, fontSize: '13px' }}>{pipelineError}</p>
          </div>
        )}

        {/* Inspection Results Dashboard Block */}
        {assessmentStage === "completed" && evaluationReport && (
          <div style={{ marginTop: '30px', background: '#fff', border: '1px solid #d5dbdb', borderRadius: '4px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#232f3e', fontSize: '18px', borderBottom: '1px solid #eaeded', paddingBottom: '10px' }}>
              Autonomous Evaluation Report
            </h3>
            
            <div style={{ display: 'grid', gap: '15px', fontSize: '14px' }}>
              <p style={{ margin: 0 }}>
                Inventory Disposition Path: 
                <span style={{
                  marginLeft: '8px', padding: '4px 8px', borderRadius: '3px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase',
                  background: evaluationReport.action_route === 'Resale' ? '#e7f4e4' : '#eaf3f5',
                  color: evaluationReport.action_route === 'Resale' ? '#0e6216' : '#004b64'
                }}>
                  {evaluationReport.action_route}
                </span>
              </p>

              <p style={{ margin: 0 }}>
                Asset Integrity Level: <strong>{evaluationReport.condition_score} / 100</strong>
              </p>

              <div style={{ margin: 0 }}>
                <span style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Cosmetic/Functional Fault Defect Log:</span>
                {evaluationReport.detected_damage && evaluationReport.detected_damage.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#565959' }}>
                    {evaluationReport.detected_damage.map((faultDescription, trackingIndex) => (
                      <li key={trackingIndex} style={{ marginBottom: '3px' }}>{faultDescription}</li>
                    ))}
                  </ul>
                ) : (
                  <span style={{ color: '#0e6216', fontSize: '13px' }}>✓ No superficial or geometric deformations parsed.</span>
                )}
              </div>

              <div style={{ marginTop: '10px', padding: '12px', background: '#f0fbfd', border: '1px solid #bee6ed', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#004b64', fontWeight: '600' }}>Eco-Tax Allocation Incentive:</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#004b64' }}>+{evaluationReport.green_credits_awarded} Green Credits</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}