import React, { useState } from 'react';
import { X, GitBranch, Check, Copy, Terminal, ExternalLink, ShieldCheck, FolderGit2 } from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [repoName, setRepoName] = useState('national-accounts-framework');
  const [username, setUsername] = useState('GuillaumeAB');

  if (!isOpen) return null;

  const repoUrl = `https://github.com/GuillaumeAB/national-accounts-framework`;
  const terminalCommands = `# Votre dépôt est déjà synchronisé sur GitHub !
# Pour récupérer les futures modifications en local :
git pull origin main

# Pour ajouter de nouveaux commits :
git add .
git commit -m "update: nouvelles données ou visualisations"
git push origin main`;

  const handleCopy = () => {
    navigator.clipboard.writeText(terminalCommands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-slate-100 animate-in fade-in zoom-in duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <FolderGit2 size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Dépôt Git & Export GitHub
            </h3>
            <div className="text-xs text-slate-400">
              Le code source complet est prêt, initialisé et versionné dans Git.
            </div>
          </div>
        </div>

        {/* Status banner */}
        <div className="bg-emerald-950/50 border border-emerald-700/70 rounded-xl p-4 mb-5 flex items-start justify-between gap-3 text-xs text-emerald-200">
          <div className="flex items-start gap-2.5">
            <ShieldCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-300 text-sm block mb-0.5">Dépôt GitHub synchronisé et en ligne !</span>
              Le code source complet avec toutes les arborescences de comptabilité nationale (SEC 2010), visualisations et serveur est publié sur votre compte GitHub.
            </div>
          </div>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors text-xs"
          >
            <span>Voir sur GitHub</span>
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Personalization Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Votre identifiant GitHub :
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim() || 'votre-compte')}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="ex: gb-bayona"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nom du repo souhaité :
            </label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value.trim() || 'national-accounts-framework')}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="national-accounts-framework"
            />
          </div>
        </div>

        {/* Code Terminal Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 mb-4 relative">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
              <Terminal size={13} />
              Commandes Bash pour lier et pousser vers votre compte
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400">Copié !</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>
          <pre className="font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {terminalCommands}
          </pre>
        </div>

        {/* Help footer */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
          <a
            href="https://github.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
          >
            Ouvrir GitHub.com/new pour créer le repo <ExternalLink size={12} />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
