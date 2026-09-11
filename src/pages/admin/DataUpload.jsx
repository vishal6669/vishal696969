import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const EXPECTED_COLUMNS = [
  'Student_ID', 'Name', 'Department', 'Semester', 'CGPA', '10th_Percentage',
  '12th_Percentage', 'Backlogs', 'Programming_Skills', 'Certifications',
  'Projects', 'Internships', 'Aptitude_Score', 'Coding_Score',
  'Communication_Score', 'Presentation_Score', 'Hackathons', 'Leadership',
  'Placement_Status'
];

export default function DataUpload() {
  const toast = useToast();
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }
    setFile(f);
    setUploadResult(null);
    setErrors([]);

    // Parse CSV preview
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1, 6).map(line => {
        const vals = line.split(',').map(v => v.trim());
        const row = {};
        headers.forEach((h, i) => { row[h] = vals[i] || ''; });
        return row;
      });

      // Validate columns
      const errs = [];
      const missing = EXPECTED_COLUMNS.filter(c => !headers.some(h => h.toLowerCase() === c.toLowerCase()));
      if (missing.length > 0) errs.push(`Missing columns: ${missing.join(', ')}`);

      setPreview({ headers, rows, totalRows: lines.length - 1 });
      setErrors(errs);
    };
    reader.readAsText(f);
  };

  const handleUpload = async () => {
    if (errors.length > 0) {
      toast.error('Please fix validation errors before uploading');
      return;
    }
    setUploading(true);
    // Simulate upload
    await new Promise(r => setTimeout(r, 1500));
    setUploading(false);
    setUploadResult({ inserted: preview?.totalRows || 0, skipped: 0 });
    toast.success(`Successfully imported ${preview?.totalRows || 0} student records`);
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setUploadResult(null);
    setErrors([]);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-ink">Data Upload</h1>
        <p className="text-sm text-surface-500 mt-0.5">Import student data via CSV file</p>
      </div>

      {/* Expected format */}
      <div className="card p-5">
        <h2 className="text-sm font-heading font-semibold text-ink mb-2">Expected CSV Format</h2>
        <div className="bg-surface-50 rounded-lg p-3 overflow-x-auto">
          <code className="text-xs text-surface-600 whitespace-nowrap">
            {EXPECTED_COLUMNS.join(', ')}
          </code>
        </div>
      </div>

      {/* Upload area */}
      {!file ? (
        <div
          className="card border-2 border-dashed border-surface-300 p-12 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="w-10 h-10 text-surface-400 mx-auto mb-4" />
          <p className="text-base font-medium text-ink">Drop your CSV file here or click to browse</p>
          <p className="text-sm text-surface-500 mt-1">Supports .csv files</p>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
        </div>
      ) : (
        <div className="space-y-4">
          {/* File info */}
          <div className="card p-4 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{file.name}</p>
              <p className="text-xs text-surface-500">{(file.size / 1024).toFixed(1)} KB | {preview?.totalRows || 0} rows detected</p>
            </div>
            <button onClick={handleClear} className="p-1.5 rounded hover:bg-surface-100">
              <X className="w-4 h-4 text-surface-500" />
            </button>
          </div>

          {/* Validation */}
          {errors.length > 0 && (
            <div className="card p-4 bg-danger-50 border border-danger-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-danger-600" />
                <p className="text-sm font-medium text-danger-700">Validation Issues</p>
              </div>
              {errors.map((err, i) => (
                <p key={i} className="text-xs text-danger-600 ml-6">{err}</p>
              ))}
            </div>
          )}

          {errors.length === 0 && preview && (
            <div className="card p-4 bg-success-50 border border-success-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success-600" />
              <p className="text-sm text-success-700 font-medium">CSV validated successfully. {preview.totalRows} rows ready for import.</p>
            </div>
          )}

          {/* Preview table */}
          {preview && (
            <div className="card overflow-hidden">
              <div className="px-4 py-3 border-b border-surface-100 bg-surface-50">
                <p className="text-sm font-medium text-ink">Preview (first 5 rows)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-surface-100">
                      {preview.headers.slice(0, 10).map((h, i) => (
                        <th key={i} className="table-header text-[10px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.map((row, i) => (
                      <tr key={i} className="table-row">
                        {preview.headers.slice(0, 10).map((h, j) => (
                          <td key={j} className="table-cell text-xs">{row[h] || '—'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Upload button */}
          {!uploadResult && (
            <button
              onClick={handleUpload}
              disabled={uploading || errors.length > 0}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                  </svg>
                  Importing...
                </span>
              ) : 'Import Student Data'}
            </button>
          )}

          {/* Result */}
          {uploadResult && (
            <div className="card p-6 bg-success-50 border border-success-200 text-center">
              <CheckCircle2 className="w-10 h-10 text-success-500 mx-auto mb-2" />
              <p className="font-heading font-semibold text-ink">Import Complete</p>
              <p className="text-sm text-surface-600 mt-1">
                {uploadResult.inserted} records imported, {uploadResult.skipped} skipped
              </p>
              <button onClick={handleClear} className="btn-secondary mt-4 text-sm">Upload Another File</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
