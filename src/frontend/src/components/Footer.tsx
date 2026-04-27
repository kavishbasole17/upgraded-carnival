import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-auto text-center relative z-20 flex flex-col items-center justify-center gap-2 border-t border-slate-200/50 bg-white/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-1">
        <p className="text-[13px] font-medium text-slate-500">
          Made with ❤️ — Team <span className="font-bold text-slate-700">K-Means Nothing</span> (Solution Challenge - 2026)
        </p>
        <a 
          href="https://github.com/kavishbasole17/upgraded-carnival" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 hover:text-slate-800 transition-colors mt-1"
        >
          <Github className="w-3.5 h-3.5" />
          View Source Code
        </a>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] font-bold text-blue-600/80 mt-2">
        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 transition-colors">Kavish Basole</a>
        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 transition-colors">Y Sai Darahaas Reddy</a>
        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 transition-colors">Nishik Varma</a>
        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800 transition-colors">Navya Nair</a>
      </div>
    </footer>
  );
}
