import React, { useState } from 'react';
import { X, GitBranch, Check, Copy, Terminal, ExternalLink, ShieldCheck, FolderGit2 } from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [repoName, setRepoName] = useState('national-accounts-framework');
  const [username, setUsername] = useState('votre-compte');

  if (!isOpen) return null;

  const terminalCommands = `# 1. Créez un nouveau dépôt sur https://github.com/new (nommé "${repoName}")
# 2. Dans votre terminal ou dans ce répertoire, exécutez :
git remote add origin https://github.com/${username}/${repoName}.git
git branch -M main
git push -u origin main

# Ou en 1 seule commande avec GitHub CLI :
gh repo create ${repoName} --public --source=. --remote=origin --push`;

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
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3.5 mb-5 flex items-start gap-2.5 text-xs text-emerald-200">
          <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-300">Dépôt Git initialisé :</span> Tous les fichiers
            (données de comptabilité nationale France/Norvège/Suisse/USA/Allemagne, composants React, serveur Express, visualisations Recharts)
            sont préparés et committés proprement sur la branche <code className="bg-emerald-900/60 px-1 py-0.5 rounded font-mono text-white">main</code>.
          </div>
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
