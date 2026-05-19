import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-md border border-white/20 bg-[#000] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#111] border-b border-white/10 font-mono text-[10px] uppercase text-[#888] tracking-widest">
        <span>{label}</span>
        <button 
           onClick={handleCopy}
           className="hover:text-white flex items-center gap-1 transition-colors bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer pointer-events-auto"
        >
          {copied ? <Check className="w-3 h-3 text-[#00ff9d]" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="p-4 text-sm text-white/80 whitespace-pre-wrap font-sans leading-relaxed">
        {text}
      </div>
    </div>
  );
}
