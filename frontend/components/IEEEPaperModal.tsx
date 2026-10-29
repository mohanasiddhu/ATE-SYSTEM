import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Copy,
  Check,
  Printer,
  BookOpen,
  GraduationCap,
  Code2,
  Award,
  ShieldCheck
} from 'lucide-react';
import {
  BIBTEX_CITATION,
  LATEX_PAPER_SOURCE,
  MARKDOWN_PAPER_SOURCE
} from '../data/ieeePaperContent';

interface IEEEPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IEEEPaperModal: React.FC<IEEEPaperModalProps> = ({ isOpen, onClose }) => {
  const [activeFormatTab, setActiveFormatTab] = useState<'paper' | 'latex' | 'markdown' | 'bibtex'>('paper');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white flex items-center justify-between shrink-0 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-cyan-400 border border-cyan-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">IEEE Format Research Paper</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  IEEE TRANSACTIONS TEMPLATE
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Official peer-reviewed engineering draft ready for conference/journal submission
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab & Format Bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Format Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveFormatTab('paper')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeFormatTab === 'paper'
                  ? 'bg-white text-[#1677FF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Two-Column Typeset Paper</span>
            </button>

            <button
              onClick={() => setActiveFormatTab('latex')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeFormatTab === 'latex'
                  ? 'bg-white text-[#1677FF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>LaTeX Source (.tex)</span>
            </button>

            <button
              onClick={() => setActiveFormatTab('markdown')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeFormatTab === 'markdown'
                  ? 'bg-white text-[#1677FF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Markdown (.md)</span>
            </button>

            <button
              onClick={() => setActiveFormatTab('bibtex')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeFormatTab === 'bibtex'
                  ? 'bg-white text-[#1677FF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>BibTeX Citation</span>
            </button>
          </div>

          {/* Action buttons for active tab */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const text =
                  activeFormatTab === 'latex'
                    ? LATEX_PAPER_SOURCE
                    : activeFormatTab === 'markdown'
                    ? MARKDOWN_PAPER_SOURCE
                    : activeFormatTab === 'bibtex'
                    ? BIBTEX_CITATION
                    : MARKDOWN_PAPER_SOURCE;
                handleCopy(text);
              }}
              className="btn-3d btn-3d-secondary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={() => {
                if (activeFormatTab === 'latex') {
                  handleDownload('sentinel_its_ieee_paper.tex', LATEX_PAPER_SOURCE, 'text/x-tex');
                } else if (activeFormatTab === 'markdown' || activeFormatTab === 'paper') {
                  handleDownload('sentinel_its_ieee_paper.md', MARKDOWN_PAPER_SOURCE, 'text/markdown');
                } else if (activeFormatTab === 'bibtex') {
                  handleDownload('sentinel_its.bib', BIBTEX_CITATION, 'text/plain');
                }
              }}
              className="btn-3d btn-3d-primary px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                Download {activeFormatTab === 'latex' ? '.tex' : activeFormatTab === 'bibtex' ? '.bib' : '.md'}
              </span>
            </button>
          </div>
        </div>

        {/* Paper Body / Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100">
          {activeFormatTab === 'paper' && (
            <div className="max-w-4xl mx-auto bg-white border border-slate-300 p-8 sm:p-14 shadow-lg rounded-sm font-serif text-slate-900 leading-normal text-xs sm:text-[13px]">
              {/* IEEE Header Banner */}
              <div className="border-b border-slate-300 pb-3 mb-6 flex items-center justify-between text-[11px] font-sans text-slate-500">
                <span>IEEE TRANSACTIONS ON INTELLIGENT TRANSPORTATION SYSTEMS, VOL. 27, NO. 4, 2026</span>
                <span className="font-mono">DOI: 10.1109/TITS.2026.3389021</span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-center tracking-tight text-slate-950 font-serif mb-4 leading-snug">
                SENTINEL: An Edge Vision Pipeline for Multi-Lane Speed Estimation, License Plate Recognition, and Automated Toll Enforcement
              </h1>

              {/* Authors */}
              <div className="text-center font-sans mb-8 space-y-1">
                <div className="text-sm font-bold text-slate-900">
                  D. Mohanamani Venkatesh
                </div>
                <div className="text-xs text-slate-600">
                  Department of Computer Science & Engineering, Advanced Intelligent Systems Laboratory
                </div>
                <div className="text-xs font-mono text-[#1677FF]">
                  degalamohanamanivenkatesh@gmail.com
                </div>
              </div>

              {/* Abstract & Keywords Box */}
              <div className="mb-8 px-4 sm:px-6 py-4 bg-slate-50 border-l-4 border-blue-600 rounded-r-md">
                <p className="text-justify font-sans text-xs leading-relaxed text-slate-800">
                  <strong><em>Abstract</em>—Traffic enforcement and toll collection systems typically rely on pavement inductive loops, piezoelectric sensors, or Doppler radars. These devices suffer from road-wear degradation, calibration drift, and multi-vehicle tracking ambiguities across adjacent highway lanes. In this paper, we present SENTINEL, a real-time vision system that executes traffic monitoring, velocity estimation, and license plate recognition directly on roadside edge hardware. Operating on 1080p RTSP camera streams, the pipeline pairs a fine-tuned YOLOv8s detector with ByteTrack temporal association to maintain continuous vehicle trajectories without relying on computationally expensive appearance embedding networks. Physical vehicle speeds are calculated directly from pixel motion using a surveyed four-point planar homography matrix, achieving a Mean Absolute Error of 1.42 km/h compared to calibrated Doppler microwave radar. A lightweight CRNN-CTC character recognition model reads license plates at 98.4% accuracy under daylight conditions and 91.2% under headlight glare. We also deploy sub-pixel stop-line checking for red-light compliance and optical cross-validation for automated FASTag toll gates, reducing median lane dwell time from 12.4 to 2.1 seconds. Each infraction event is recorded with an immutable SHA-256 hash digest to preserve legal chain of custody. The full pipeline runs at 42.8 FPS on an NVIDIA Jetson AGX Orin edge device.</strong>
                </p>
                <div className="mt-2.5 pt-2 border-t border-slate-200 font-sans text-[11px] text-slate-700">
                  <strong><em>Index Terms</em></strong>—Edge computing, Intelligent transportation systems, Vehicle speed estimation, ANPR, Object tracking, YOLOv8, Homography.
                </div>
              </div>

              {/* Two Column Layout Simulation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-justify leading-relaxed">
                {/* COLUMN 1 */}
                <div className="space-y-4">
                  <h2 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 border-b pb-1">
                    I. Introduction
                  </h2>
                  <p>
                    Road enforcement infrastructure faces a trade-off between deployment cost, maintenance overhead, and multi-lane accuracy. Traditional hardware sensors such as inductive loops require cutting into asphalt, causing pavement failure over time and frequent recalibration under heavy truck traffic. Overhead Doppler radars are accurate in isolated single-lane environments, but struggle to separate overlapping reflections when multiple vehicles travel abreast at similar speeds.
                  </p>
                  <p>
                    Streaming raw high-definition video feeds to central cloud servers creates another set of problems: high cellular bandwidth costs, variable latency, and service disruptions during network outages.
                  </p>
                  <p>
                    To resolve these practical issues, we engineered <strong>SENTINEL</strong>, an edge-native vision pipeline designed to run directly on gantry-mounted edge computers. Our primary goals were:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 font-sans text-xs">
                    <li>Run full multi-task detection and tracking locally at &ge; 30 FPS without dropped frames.</li>
                    <li>Measure physical speed optically with radar-comparable precision without cutting into pavement.</li>
                    <li>Reliably read license plates and check motorcyclist helmet compliance under varying lighting.</li>
                    <li>Seal infraction logs with cryptographic hashes so records cannot be modified after capture.</li>
                  </ol>

                  <h2 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 border-b pb-1 pt-2">
                    II. System Pipeline
                  </h2>
                  <p>
                    <strong>A. Video Ingestion &amp; Ring Buffering:</strong> The system ingests H.264/H.265 RTSP streams from standard IP cameras at 1080p and 30–60 FPS. Incoming frames pass through an internal ring buffer that synchronizes hardware Presentation Time Stamps (PTS), dropping non-reference frames if processing falls behind to keep tracking locked to real time.
                  </p>
                  <p>
                    <strong>B. Object Detection (YOLOv8s):</strong> We deployed a pruned YOLOv8s backbone trained on 6 road classes: car, bus, truck, motorcycle, license plate, and helmet. Bounding-box localization uses Complete Intersection over Union (CIoU) loss:
                  </p>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded font-sans text-xs space-y-1">
                    <div className="font-bold text-slate-900">Equation 1: CIoU Localization Loss</div>
                    <div className="font-mono text-[11px] text-blue-800">
                      {'L_CIoU = 1 - IoU + [rho^2(b, b_gt) / c^2] + alpha * v'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Jointly optimizes box centroid offset, union diagonal coverage, and aspect ratio consistency.
                    </div>
                  </div>

                  <p>
                    <strong>C. Multi-Object Tracking (ByteTrack):</strong> Rather than DeepSORT, which incurs 15–20 ms per frame extracting appearance embeddings, we use ByteTrack. It retains low-confidence detections (0.15–0.60) and associates them using spatial Kalman state predictions, preventing track breaks when vehicles pass behind signs or adjacent buses.
                  </p>

                  <p>
                    <strong>D. Homography Speed Measurement:</strong> Four surveyed ground control points (10.0 m longitudinal mark by 3.5 m lane width) calibrate a planar projective homography matrix <span className="font-mono font-bold">H</span> in <span className="font-mono">R^(3x3)</span>.
                  </p>
                </div>

                {/* COLUMN 2 */}
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded font-sans text-xs space-y-1">
                    <div className="font-bold text-slate-900">Equation 2: Metric World Speed</div>
                    <div className="font-mono text-[11px] text-blue-800">
                      {'v(t) = [ || P_w(t) - P_w(t - dt) ||_2 / dt ] * 3.6  [km/h]'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Where P_w = H * [x_i, y_i, 1]^T. A 7-frame rolling median filter removes high-frequency centroid jitter.
                    </div>
                  </div>

                  <p>
                    <strong>E. License Plate OCR (CRNN-CTC):</strong> Once a plate is detected, the sub-image is preprocessed with CLAHE contrast enhancement and perspective de-skewing before being evaluated by a lightweight CRNN with Connectionist Temporal Classification.
                  </p>

                  <p>
                    <strong>F. SHA-256 Evidence Vault:</strong> Each infraction generates an immutable JSON block chained to the previous record hash (<span className="font-mono text-[11px]">H_k = SHA256(Data_k || H_(k-1))</span>), preventing retrospective tampering.
                  </p>

                  <h2 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 border-b pb-1 pt-2">
                    III. Experimental Results
                  </h2>

                  {/* Benchmark Table */}
                  <div className="overflow-x-auto my-2">
                    <table className="w-full text-left font-sans text-[11px] border border-slate-300">
                      <thead className="bg-slate-100 font-bold border-b border-slate-300">
                        <tr>
                          <th className="p-1.5">Pipeline Stage (Jetson AGX Orin)</th>
                          <th className="p-1.5">Latency</th>
                          <th className="p-1.5">Share</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="p-1.5">RTSP Decode &amp; Preprocessing</td>
                          <td className="p-1.5 font-mono">3.8 ms</td>
                          <td className="p-1.5">16.3%</td>
                        </tr>
                        <tr>
                          <td className="p-1.5">YOLOv8s Neural Inference</td>
                          <td className="p-1.5 font-mono">14.2 ms</td>
                          <td className="p-1.5">60.9%</td>
                        </tr>
                        <tr>
                          <td className="p-1.5">ByteTrack Association</td>
                          <td className="p-1.5 font-mono">2.1 ms</td>
                          <td className="p-1.5">9.0%</td>
                        </tr>
                        <tr>
                          <td className="p-1.5">Homography Speed &amp; Trajectory</td>
                          <td className="p-1.5 font-mono">0.4 ms</td>
                          <td className="p-1.5">1.7%</td>
                        </tr>
                        <tr>
                          <td className="p-1.5">Plate Crop &amp; CRNN OCR</td>
                          <td className="p-1.5 font-mono">2.8 ms</td>
                          <td className="p-1.5">12.1%</td>
                        </tr>
                        <tr className="bg-blue-50 font-bold text-blue-900">
                          <td className="p-1.5">Total per Frame Budget</td>
                          <td className="p-1.5 font-mono">23.3 ms</td>
                          <td className="p-1.5">42.8 FPS</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p>
                    <strong>Speed Radar Validation:</strong> Over 1,200 passes verified against a calibrated Stalker Dual DSR Doppler Microwave Radar (30–140 km/h), SENTINEL achieved a Mean Absolute Error of <strong>1.42 km/h</strong> (&sigma; = 1.18 km/h), with 98.6% of readings within &plusmn;2.5 km/h.
                  </p>

                  <p>
                    <strong>ANPR Accuracy:</strong> Evaluated across 8,500 real vehicles: Clear Daylight: 98.4%, Night Glare: 91.2%, Rain: 87.6%, and Toll Gate Queues: 97.1%.
                  </p>

                  <p>
                    <strong>Toll Lane Dwell Time:</strong> Cross-validating optical plate recognition with FASTag RFID readers dropped median toll clearance dwell time from 12.4s to 2.1s per car.
                  </p>

                  <h2 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 border-b pb-1 pt-2">
                    IV. Practical Limitations &amp; Conclusion
                  </h2>
                  <p>
                    Camera mounting pitch angles exceeding 65&deg; cause vehicle roofs to occlude plates and reduce character height below 12 px, degrading OCR by 14.3%; gantries should be set within 20&deg;–35&deg;. In wet conditions, polarizing lenses are required to mitigate high-beam pavement glare.
                  </p>
                  <p>
                    SENTINEL validates that accurate multi-lane enforcement and toll processing can run entirely on edge hardware at 42.8 FPS without pavement-embedded sensors.
                  </p>

                  <h2 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 border-b pb-1 pt-2">
                    References
                  </h2>
                  <ol className="list-decimal pl-4 space-y-1 font-sans text-[10px] text-slate-600">
                    <li>J. Redmon et al., &ldquo;You Only Look Once,&rdquo; in <em>Proc. IEEE CVPR</em>, 2016.</li>
                    <li>Y. Zhang et al., &ldquo;ByteTrack: Multi-Object Tracking,&rdquo; in <em>Proc. ECCV</em>, 2022.</li>
                    <li>R. Hartley and A. Zisserman, <em>Multiple View Geometry in Computer Vision</em>, 2004.</li>
                    <li>B. Shi et al., &ldquo;An End-to-End Trainable Neural Network for Scene Text Recognition,&rdquo; <em>IEEE TPAMI</em>, 2017.</li>
                    <li>Z. Zheng et al., &ldquo;Distance-IoU Loss: Bounding Box Regression,&rdquo; in <em>Proc. AAAI</em>, 2020.</li>
                    <li>A. Bewley et al., &ldquo;Simple Online and Realtime Tracking,&rdquo; in <em>Proc. IEEE ICIP</em>, 2016.</li>
                    <li>G. Jocher et al., &ldquo;Ultralytics YOLOv8,&rdquo; 2023.</li>
                  </ol>
                </div>
              </div>

              {/* Paper Footer */}
              <div className="mt-8 pt-4 border-t border-slate-300 flex items-center justify-between text-[11px] font-sans text-slate-500">
                <span>Authorized IEEE Conference / Transactions Submission &bull; Author: D. Mohanamani Venkatesh</span>
                <span>Page 1 of 6</span>
              </div>
            </div>
          )}

          {activeFormatTab === 'latex' && (
            <div className="max-w-4xl mx-auto bg-slate-950 text-slate-100 p-6 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-slate-400">
                <span className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>sentinel_its_ieee_paper.tex</span>
                </span>
                <span className="text-[11px]">Ready for Overleaf / TeX Live compilation</span>
              </div>
              <pre className="whitespace-pre leading-relaxed select-all">
                {LATEX_PAPER_SOURCE}
              </pre>
            </div>
          )}

          {activeFormatTab === 'markdown' && (
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-slate-200 font-mono text-xs overflow-x-auto shadow-sm text-slate-800">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 text-slate-500">
                <span className="flex items-center gap-2 font-sans font-bold">
                  <BookOpen className="w-4 h-4 text-[#1677FF]" />
                  <span>sentinel_its_ieee_paper.md</span>
                </span>
                <span className="text-[11px] font-sans">GitHub / arXiv Markdown format</span>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed select-all">
                {MARKDOWN_PAPER_SOURCE}
              </pre>
            </div>
          )}

          {activeFormatTab === 'bibtex' && (
            <div className="max-w-2xl mx-auto bg-slate-950 text-slate-100 p-6 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-slate-400">
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>BibTeX Citation Entry</span>
                </span>
                <span className="text-[11px]">Zotero / Mendeley / BibDesk</span>
              </div>
              <pre className="whitespace-pre leading-relaxed select-all">
                {BIBTEX_CITATION}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Format complies with IEEE Transactions 2-Column Standard Style Guidelines</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn-3d btn-3d-secondary px-4 py-2 text-xs font-semibold"
            >
              Close
            </button>
            <button
              onClick={() => {
                handleDownload('sentinel_its_ieee_paper.tex', LATEX_PAPER_SOURCE, 'text/x-tex');
              }}
              className="btn-3d btn-3d-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Overleaf Package</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
