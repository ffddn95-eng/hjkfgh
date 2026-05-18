import { useState } from "react";
import { updateActionEvidence } from "../../lib/ideaService";
import { Check, Lock } from "lucide-react";

export function ProofChecklist({ ideaId, actionId, requiredInputs, status }: { ideaId: string, actionId: string, requiredInputs: any[], status: string }) {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handlePhotoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 800; // max dimension to keep size small
        if (width > height && width > maxDim) {
          height *= maxDim / width;
          width = maxDim;
        } else if (height > maxDim) {
          width *= maxDim / height;
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        // reduce quality to 0.7 for smaller payload
        setPhotoDataUrl(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    // Validate required
    setLocalError(null);
    for (const req of requiredInputs) {
      if (req.required && (inputs[req.key] === undefined || inputs[req.key] === '')) {
        setLocalError(`Please fill out: ${req.label}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const finalEvidence = { ...inputs };
      if (photoDataUrl) {
        finalEvidence._photo = photoDataUrl;
      }
      await updateActionEvidence(ideaId, actionId, finalEvidence);
      // Let parent reload or mutate optimistically
      window.location.reload(); 
    } catch (e) {
      setLocalError("Failed to save evidence. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'locked') {
    return (
      <div className="flex flex-col items-center justify-center p-6 border border-dashed border-white/20 rounded-xl bg-white/5 opacity-50">
        <Lock className="w-5 h-5 mb-2 text-white/40" />
        <span className="text-[12px] uppercase tracking-widest font-bold text-white/40">Complete previous step to unlock</span>
      </div>
    );
  }

  if (status === 'completed') {
    return (
       <div className="flex items-center gap-3 p-4 border border-[#00ff9d]/30 bg-[#00ff9d]/5 rounded-xl text-[#00ff9d]">
         <Check className="w-5 h-5" />
         <span className="text-[12px] uppercase font-bold tracking-widest">Evidence Verified & Logged</span>
       </div>
    );
  }

  return (
    <div className="p-6 border border-white/10 bg-[#050505] rounded-xl flex flex-col gap-5">
      {localError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[12px] font-medium animate-pulse">
           {localError}
        </div>
      )}
      {requiredInputs.map(req => (
        <div key={req.key} className="flex flex-col gap-2 relative">
          <label className="text-[11px] uppercase tracking-widest font-bold text-white/70">
            {req.label} {req.required && <span className="text-red-500">*</span>}
          </label>
          {req.type === 'boolean' ? (
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={!!inputs[req.key]}
                onChange={e => setInputs(prev => ({...prev, [req.key]: e.target.checked}))}
                className="w-5 h-5 rounded border-white/20 bg-transparent text-[#00ff9d] focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-sm text-white/50">Yes, completed.</span>
            </label>
          ) : (
            <input 
               type={req.type === 'number' ? 'number' : 'text'}
               placeholder={`Enter ${req.type}...`}
               value={inputs[req.key] || ''}
               onChange={e => setInputs(prev => ({...prev, [req.key]: e.target.value}))}
               className="bg-[#111] border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00ff9d]/50"
            />
          )}
        </div>
      ))}
      
      {/* Evidence Photo Upload */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="text-[11px] uppercase tracking-widest font-bold text-white/70">
          Upload Evidence Photo (Optional)
        </label>
        {photoDataUrl ? (
           <div className="relative w-full max-w-[200px] rounded-xl border border-[#00ff9d]/30 overflow-hidden">
             <img src={photoDataUrl} alt="Evidence" className="w-full h-auto" />
             <button onClick={() => setPhotoDataUrl(null)} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 text-xs hover:bg-black">✕</button>
           </div>
        ) : (
           <label className="cursor-pointer bg-[#111] border border-dashed border-white/20 rounded-md px-4 py-8 text-center text-sm text-white/50 hover:bg-[#1a1a1a] hover:text-white transition-colors">
             Click to Upload Evidence Image
             <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
           </label>
        )}
      </div>

      <button 
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-6 py-4 bg-[#00ff9d] text-black font-black text-[14px] uppercase tracking-[2px] rounded-xl hover:bg-[#00e08a] transition-all disabled:opacity-50"
      >
        {submitting ? 'Verifying...' : 'Finish'}
      </button>
    </div>
  );
}
