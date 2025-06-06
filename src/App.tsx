import React from 'react';
import { Users, Settings } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <header className="w-full max-w-4xl p-6 flex justify-between items-center border-b">
        <div className="text-xl font-bold">Navigator Front</div>
        <nav className="space-x-4">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">Features</a>
          <a href="#" className="nav-link">Contact</a>
        </nav>
      </header>
      <main className="p-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Unifiez la gestion de vos équipes et outils</h1>
        <p className="text-lg text-muted-foreground mb-6">Une plateforme tout-en-un pour le recrutement, l'onboarding, la gestion des coûts et l'intégration d'outils.</p>
        <div className="flex gap-4 justify-center">
          <button className="btn btn-primary px-4 py-2 rounded-lg">Commencer</button>
          <button className="btn btn-outline px-4 py-2 rounded-lg">Voir la démo</button>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card"><Users /> Recrutement</div>
          <div className="card"><Settings /> Onboarding</div>
          <div className="card"><Users /> Équipes</div>
          <div className="card"><Settings /> Coûts</div>
        </div>
      </main>
      <footer className="mt-auto p-4 border-t w-full text-center text-sm text-muted-foreground">
        © 2025 Navigator Front. Tous droits réservés.
      </footer>
    </div>
  );
}

export default App;
