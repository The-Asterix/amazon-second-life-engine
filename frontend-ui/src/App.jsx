import React, { useState, useEffect } from 'react';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [assessmentStage, setAssessmentStage] = useState("idle"); 
  const [diagnosticText, setDiagnosticText] = useState("");
  const [evaluationReport, setEvaluationReport] = useState(null);
  const [pipelineError, setPipelineError] = useState("");

  // UPDATED: Added Enterprise Fraud Detection Milestones
  const processingMilestones = [
    "Authenticating image EXIF metadata & liveness (Anti-Spoofing)...",
    "Executing OCR to match physical Serial Number with Order database...",
    "Extracting structural boundaries via Bedrock Vision...",
    "Executing cosmetic wear-and-tear evaluation...",
    "Calculating product integrity & generating routing disposition..."
  ];

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
      }, 950); 
    }

    return () => clearInterval(textIntervalTimer);
  }, [assessmentStage]);

  const processImageUpload = (event) => {
    const rawAssetFile = event.target.files[0];
    if (!rawAssetFile) return;

    setSelectedFile(rawAssetFile);
    setPipelineError("");

    const dataStreamReader = new FileReader();
    dataStreamReader.onloadend = () => {
      const modularBase64String = dataStreamReader.result.split(',')[1];
      setBase64Image(modularBase64String);
    };
    dataStreamReader.onerror = () => {
      setPipelineError("File system stream translation corrupted. Select another clear image asset.");
    };
    dataStreamReader.readAsDataURL(rawAssetFile);
  };

  const initializeAssetAssessment = async (e) => {
    e.preventDefault();
    if (!base64Image) {
      setPipelineError("Action blocked: Please attach a physical image preview of the item first.");
      return;
    }

    setAssessmentStage("analyzing");
    setPipelineError("");
    setEvaluationReport(null);

    // MOCK MODE: Simulating AWS Bedrock API latency + Fraud Checks
    setTimeout(() => {
      const mockBedrockResponse = {
        condition_score: 78,
        detected_damage: ["Minor cosmetic scuff on the lower left casing", "Original packaging missing"],
        action_route: "REFURBISHED",
        green_credits_awarded: 150,
        // NEW SECURITY PAYLOADS
        security_clearance: {
            fraud_risk: "LOW",
            exif_authentic: true,
            serial_number_match: "VERIFIED"
        }
      };
      
      setEvaluationReport(mockBedrockResponse);
      setAssessmentStage("completed");
    }, 5000); // 5 seconds of heavy AI + Security processing
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '850px', margin: '40px auto', padding: '20px', color: '#111' }}>
      <header style={{ borderBottom: '2px solid #eaeded', paddingBottom: '15px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ color: '#232f3e', margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>
              Amazon <span style={{ color: '#ff9900' }}>Second Life</span> Commerce
            </h1>
            <p style={{ margin: 0, color: '#565959', fontSize: '14px' }}>Reverse Logistics Automated Inspection Portal (Staging Environment)</p>
          </div>
          <span style={{ background: '#e7f4e4', color: '#0e6216', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
            🔒 Zero-Fraud Architecture Enabled
          </span>
        </div>
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
            {assessmentStage === "analyzing" ? "Running AI & Security Diagnostics..." : "Initiate Autonomous Inspection"}
          </button>
        </form>

        {assessmentStage === "analyzing" && (
          <div style={{ marginTop: '25px', padding: '15px', background: '#232f3e', borderRadius: '4px', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', fontFamily: 'monospace' }}>⚡ system_pipeline_active:</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#ff9900' }}>{diagnosticText}</span>
            </div>
          </div>
        )}

        {assessmentStage === "completed" && evaluationReport && (
          <div style={{ marginTop: '30px', background: '#fff', border: '1px solid #d5dbdb', borderRadius: '4px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#232f3e', fontSize: '18px', borderBottom: '1px solid #eaeded', paddingBottom: '10px' }}>
              Autonomous Evaluation & Security Report
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Security Block */}
              <div style={{ padding: '15px', background: '#f8f8f8', border: '1px solid #e7e7e7', borderRadius: '6px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#565959', textTransform: 'uppercase' }}>Security Clearance</h4>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Anti-Spoofing (EXIF Check):</span> 
                    <span style={{ color: '#0e6216', fontWeight: 'bold' }}>✓ PASSED</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>OCR Serial Match:</span> 
                    <span style={{ color: '#0e6216', fontWeight: 'bold' }}>✓ VERIFIED</span>
                  </li>
                  <li style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '8px', marginTop: '4px' }}>
                    <span>Overall Fraud Risk:</span> 
                    <span style={{ background: '#e7f4e4', color: '#0e6216', padding: '2px 6px', borderRadius: '3px', fontWeight: 'bold' }}>LOW</span>
                  </li>
                </ul>
              </div>

              {/* Disposition Block */}
              <div style={{ padding: '15px', background: '#f8f8f8', border: '1px solid #e7e7e7', borderRadius: '6px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#565959', textTransform: 'uppercase' }}>Asset Disposition</h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
                  Routing Lane: 
                  <span style={{ marginLeft: '8px', padding: '4px 8px', borderRadius: '3px', fontWeight: 'bold', fontSize: '12px', background: '#eaf3f5', color: '#004b64' }}>
                    {evaluationReport.action_route}
                  </span>
                </p>
                <p style={{ margin: 0, fontSize: '13px' }}>
                  Asset Integrity Level: <strong>{evaluationReport.condition_score} / 100</strong>
                </p>
              </div>
            </div>

            <div style={{ margin: 0, fontSize: '14px' }}>
              <span style={{ display: 'block', fontWeight: '600', marginBottom: '5px' }}>Cosmetic/Functional Fault Defect Log:</span>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#565959' }}>
                {evaluationReport.detected_damage.map((fault, idx) => (
                  <li key={idx} style={{ marginBottom: '3px' }}>{fault}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: '#f0fbfd', border: '1px solid #bee6ed', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#004b64', fontWeight: '600' }}>Eco-Tax Allocation Incentive:</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#004b64' }}>+{evaluationReport.green_credits_awarded} Green Credits</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}