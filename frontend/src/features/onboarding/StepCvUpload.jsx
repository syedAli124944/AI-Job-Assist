import { useState, useRef } from "react";
import { motion as m } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, X, Sparkles, ArrowRight } from "lucide-react";

export default function StepCvUpload({ onNext, cvData, setCvData }) {
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState(""); // "uploading", "parsing", "extracting", "complete"
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    setError("");
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
      setError("Please upload a valid CV format (.pdf, .docx, .doc, or .txt)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);
    setUploadStage("Uploading file...");

    // Simulate multi-stage upload & parse animation
    setTimeout(() => {
      setUploadProgress(50);
      setUploadStage("Parsing document structure...");
    }, 600);

    setTimeout(() => {
      setUploadProgress(85);
      setUploadStage("Extracting skills & experience with AI...");
    }, 1300);

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStage("Analysis complete!");
      setIsUploading(false);

      const parsedResult = {
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        uploadedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        parsedSkills: ["React", "JavaScript", "TypeScript", "Node.js", "Tailwind CSS", "REST APIs"],
        suggestedTitle: "Frontend / Full Stack Engineer",
        extractedEmail: "candidate@example.com",
      };

      setCvData(parsedResult);
    }, 2000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles size={13} /> Step 1 of 3
        </span>
        <h2 className="font-fraunces text-3xl text-charcoal font-semibold mb-2">
          Upload your CV / Resume
        </h2>
        <p className="text-warm-gray text-sm max-w-md mx-auto">
          Our AI will automatically parse your experience, skills, and target roles to match you with top job opportunities.
        </p>
      </div>

      {/* Upload Box or Parsed Preview */}
      {!cvData ? (
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cream rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200"
          style={{
            borderColor: dragOver ? "#B5654A" : "#D6C9B4",
            backgroundColor: dragOver ? "#F5ECE1" : "#FAF6F0",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
          />

          {isUploading ? (
            <div className="py-6 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta">
                <FileText size={28} className="animate-pulse" />
              </div>
              <div className="w-full max-w-xs">
                <div className="flex justify-between text-xs text-charcoal font-medium mb-1.5">
                  <span>{uploadStage}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-sand rounded-full overflow-hidden">
                  <m.div
                    className="h-full bg-terracotta rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta">
                <Upload size={28} />
              </div>
              <div>
                <p className="text-charcoal font-medium text-base mb-1">
                  Drag and drop your resume here
                </p>
                <p className="text-warm-gray text-xs mb-4">
                  Supports PDF, DOCX, DOC, TXT (Max 10MB)
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-primary inline-flex items-center gap-2 text-sm px-5 py-2.5"
                >
                  <Upload size={16} /> Select File
                </button>
              </div>
            </div>
          )}

          {error && (
            <m.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs flex items-center gap-2 justify-center"
            >
              <AlertCircle size={14} />
              {error}
            </m.div>
          )}
        </m.div>
      ) : (
        /* Parsed Result Box */
        <m.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-cream rounded-2xl border border-border p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-deep-green/10 text-deep-green flex items-center justify-center">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal text-base flex items-center gap-2">
                  {cvData.fileName}
                </h3>
                <p className="text-xs text-warm-gray">
                  {cvData.fileSize} · Uploaded at {cvData.uploadedAt}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCvData(null)}
              className="text-warm-gray hover:text-charcoal p-1 rounded-lg hover:bg-sand transition-colors"
              title="Remove file"
            >
              <X size={18} />
            </button>
          </div>

          {/* AI Extracted Highlights */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-warm-gray block mb-1.5">
                AI Detected Role Title
              </span>
              <p className="text-sm font-medium text-charcoal bg-sand px-3 py-2 rounded-xl inline-block">
                ✨ {cvData.suggestedTitle}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-warm-gray block mb-2">
                Extracted Key Skills ({cvData.parsedSkills?.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {cvData.parsedSkills?.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-cream border border-border text-xs font-medium text-charcoal shadow-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </m.div>
      )}

      {/* Navigation CTA */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNext()}
          className="text-xs text-warm-gray hover:text-charcoal font-medium transition-colors"
        >
          Skip for now
        </button>

        <button
          type="button"
          disabled={!cvData && !isUploading}
          onClick={onNext}
          className={`btn-primary flex items-center gap-2 text-sm px-6 py-3 ${
            !cvData ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Continue to Preferences <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
