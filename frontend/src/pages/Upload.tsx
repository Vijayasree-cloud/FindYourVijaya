import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, AlertCircle, Loader2 } from 'lucide-react';
import { uploadResume, getScore, getRecommendations } from '@/services/api';
import { useMascot } from '../context/MascotContext';
import { useResume } from '../context/ResumeContext';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setMascotState, playSound } = useMascot();
  const { setResumeText, setResumeScore, setRecommendedRoles } = useResume();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      setFile(null);
      return;
    }
    setError('');
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setMascotState('thinking');
    playSound('typing');

    try {
      const uploadRes = await uploadResume(file);
      
      // Step 2: Get recommended roles based on resume
      const rolesRes = await getRecommendations(uploadRes.text);
      const newRoles = rolesRes.recommendations || [];
      const topRole = newRoles.length > 0 ? newRoles[0].roleName : 'Professional';
      
      // Step 3: Score the resume against the best matching role (not hardcoded)
      const scoreResult = await getScore(uploadRes.text, topRole);
      
      // Save everything to context (which syncs to localStorage)
      setResumeText(uploadRes.text);
      setRecommendedRoles(newRoles);
      setResumeScore(scoreResult);
      
      setMascotState('success');
      playSound('success');
      
      setLoading(false);
      setTimeout(() => {
        setMascotState('idle');
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to upload and parse resume.');
      }
      setMascotState('error');
      playSound('error');
      setLoading(false);
      setTimeout(() => setMascotState('idle'), 3000);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Upload Your Resume</h1>
          <p className="mt-2 text-muted-foreground">We'll analyze your profile against market demands.</p>
        </div>

        <div
          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/20 hover:bg-muted/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
            accept=".pdf"
            onChange={handleFileChange}
          />
          
          {file ? (
            <div className="flex flex-col items-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <File className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <UploadCloud className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium text-foreground">Click or drag file to this area to upload</p>
              <p className="mt-1 text-sm text-muted-foreground">Supports PDF files up to 10MB</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}

        <div className="mt-8 flex justify-end gap-4">
          <button
            className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted"
            onClick={() => setFile(null)}
            disabled={!file || loading}
          >
            Cancel
          </button>
          <button
            className="flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Scan Resume'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
