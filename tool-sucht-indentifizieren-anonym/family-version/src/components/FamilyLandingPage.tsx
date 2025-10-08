import React from 'react';
import { Heart, Shield, MessageCircle, Users, Phone, CheckCircle, AlertTriangle } from 'lucide-react';

interface FamilyLandingPageProps {
  onStartTest: () => void;
}

export const FamilyLandingPage: React.FC<FamilyLandingPageProps> = ({ onStartTest }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sucht-Check</h1>
              <p className="text-xs text-gray-500">für Familie & Freunde</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">SAMEBI</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <Users className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Du machst dir Sorgen um jemanden?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Dieser Test hilft dir einzuschätzen, ob ein Freund oder Familienmitglied 
            möglicherweise ein Suchtproblem hat – diskret, wissenschaftlich fundiert und anonym.
          </p>
        </div>

        {/* Call-to-Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={onStartTest}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
          >
            Test jetzt starten (15-20 Min)
          </button>
          <a
            href="#how-it-works"
            className="bg-white hover:bg-gray-50 text-blue-600 font-semibold px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-all text-lg border-2 border-blue-600"
          >
            Mehr erfahren
          </a>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
            <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">100% Anonym</p>
              <p className="text-sm text-gray-600">Keine Registrierung</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
            <CheckCircle className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Wissenschaftlich</p>
              <p className="text-sm text-gray-600">Validierte Methoden</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
            <MessageCircle className="w-8 h-8 text-purple-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Mit Gesprächshilfe</p>
              <p className="text-sm text-gray-600">Konkrete Empfehlungen</p>
            </div>
          </div>
        </div>
      </section>

      {/* Wann ist dieser Test richtig? */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Wann ist dieser Test richtig für dich?
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
              <h4 className="font-bold text-green-900 text-lg mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Du bist hier richtig, wenn:
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Du Verhaltensänderungen beobachtet hast, die dich beunruhigen</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Du nicht sicher bist, ob deine Sorge berechtigt ist</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Du wissen möchtest, wie du das Thema ansprechen kannst</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Du Hinweise auf professionelle Hilfe suchst</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
              <h4 className="font-bold text-orange-900 text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Wichtig zu wissen:
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">!</span>
                  <span>Dieser Test ersetzt KEINE professionelle Diagnose</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">!</span>
                  <span>Er ist eine Orientierungshilfe für Angehörige</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">!</span>
                  <span>Bei hohem Risiko: Sofort professionelle Hilfe suchen</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">!</span>
                  <span>Achte auch auf deine eigene psychische Gesundheit</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Wie funktioniert's */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Wie funktioniert der Test?
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h4 className="font-bold text-xl mb-3">40 Fragen beantworten</h4>
            <p className="text-gray-600">
              Beschreibe deine Beobachtungen der letzten 6-12 Monate. 
              Ehrlichkeit ist wichtig für ein gutes Ergebnis.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">2</span>
            </div>
            <h4 className="font-bold text-xl mb-3">Detaillierte Auswertung</h4>
            <p className="text-gray-600">
              Sofortige Einschätzung des Risikos für verschiedene Sucht-Arten. 
              Mit Confidence-Score und Verhaltensmustern.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">3</span>
            </div>
            <h4 className="font-bold text-xl mb-3">Handeln & Helfen</h4>
            <p className="text-gray-600">
              Konkrete Empfehlungen, Gesprächsleitfäden und Kontakte zu 
              professionellen Beratungsstellen.
            </p>
          </div>
        </div>
      </section>

      {/* Sucht-Kategorien */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Welche Sucht-Arten werden untersucht?
          </h3>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { name: 'Spielsucht', emoji: '🎰', desc: 'Glücksspiel, Wetten, Casino' },
              { name: 'Alkohol', emoji: '🍺', desc: 'Erhöhter Alkoholkonsum' },
              { name: 'Substanzen', emoji: '💊', desc: 'Drogen, Medikamente' },
              { name: 'Kaufsucht', emoji: '🛍️', desc: 'Unkontrolliertes Shopping' },
              { name: 'Digital', emoji: '📱', desc: 'Gaming, Social Media' }
            ].map((category) => (
              <div key={category.name} className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{category.emoji}</div>
                <h4 className="font-bold text-lg mb-2">{category.name}</h4>
                <p className="text-sm text-gray-600">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notfall-Kontakte */}
      <section className="bg-red-50 border-t-4 border-red-400 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Phone className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-red-900 mb-4">
            Notfall-Kontakte
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-bold text-lg mb-2">Sucht & Drogen Hotline</h4>
              <p className="text-2xl font-bold text-red-600 mb-2">01805 313 031</p>
              <p className="text-sm text-gray-600">24/7 erreichbar • Anonym • Kostenlos</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-bold text-lg mb-2">Telefonseelsorge</h4>
              <p className="text-2xl font-bold text-red-600 mb-2">0800 111 0 111</p>
              <p className="text-sm text-gray-600">24/7 erreichbar • Anonym • Kostenlos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Bereit, Klarheit zu gewinnen?
        </h3>
        <p className="text-lg text-gray-600 mb-8">
          Der Test dauert 15-20 Minuten. Deine Antworten bleiben vollständig anonym.
        </p>
        <button
          onClick={onStartTest}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-5 rounded-lg shadow-lg hover:shadow-xl transition-all text-xl"
        >
          Jetzt Test starten →
        </button>
        <p className="text-sm text-gray-500 mt-6">
          💙 Mut zur Hilfe – Du bist nicht allein!
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-3">Über SAMEBI</h4>
              <p className="text-sm text-gray-400">
                Professionelle Tools für psychische Gesundheit und Suchtprävention.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Rechtliches</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li><a href="#datenschutz" className="hover:text-white">Datenschutz</a></li>
                <li><a href="#impressum" className="hover:text-white">Impressum</a></li>
                <li><a href="#agb" className="hover:text-white">AGB</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Weitere Sprachen</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>🇩🇪 Deutsch (aktiv)</li>
                <li>🇪🇸 Spanisch (bald)</li>
                <li>🇬🇧 Englisch (bald)</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 SAMEBI. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};







