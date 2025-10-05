import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Users, BarChart3 } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">SAMEBI</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/privacy" className="text-gray-500 hover:text-gray-900">Datenschutz</Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-900">AGB</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Lebensbalance-Check
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Ein professioneller, wissenschaftlich validierter Check Ihres aktuellen Wohlbefindens. 
              Entwickelt für Psychologen und Berater zur Unterstützung ihrer Klienten.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/schnellcheck"
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
              >
                ⚡ Schnell-Check (2 Min)
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/test"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Vollständiger Test
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              💡 Tipp: Starten Sie mit dem Schnell-Check für eine erste Einschätzung
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Warum unser Lebensbalance-Check?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Wissenschaftlich fundiert, professionell entwickelt und sofort einsatzbereit
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Vertraulich</h3>
              <p className="text-gray-600">
                Alle Daten werden sicher und vertraulich behandelt. DSGVO-konform.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Schnell</h3>
              <p className="text-gray-600">
                Nur 5-10 Minuten für einen umfassenden Check aller Lebensbereiche.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professionell</h3>
              <p className="text-gray-600">
                Entwickelt von Experten für Psychologen und Berater.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailliert</h3>
              <p className="text-gray-600">
                Umfassende Auswertung mit konkreten Handlungsempfehlungen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              So funktioniert es
            </h2>
            <p className="text-lg text-gray-600">
              Einfach, schnell und professionell
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fragen beantworten</h3>
              <p className="text-gray-600">
                Beantworten Sie 40 kurze Fragen zu verschiedenen Lebensbereichen. 
                Alle Fragen sind neutral formuliert und nicht bedrohlich.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sofortige Auswertung</h3>
              <p className="text-gray-600">
                Erhalten Sie sofort eine detaillierte Auswertung Ihrer Lebensbalance 
                mit konkreten Bereichen für Verbesserungen.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Handlungsempfehlungen</h3>
              <p className="text-gray-600">
                Basierend auf Ihren Antworten erhalten Sie konkrete, 
                umsetzbare Empfehlungen für Ihre weitere Entwicklung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bereit für Ihren Lebensbalance-Check?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Starten Sie jetzt und erhalten Sie in wenigen Minuten eine professionelle Einschätzung.
          </p>
          <Link
            to="/test"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Jetzt starten
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="ml-2 text-xl font-bold">SAMEBI</span>
              </div>
              <p className="text-gray-400">
                Professionelle Tools für Psychologen und Berater. 
                Wissenschaftlich fundiert, sofort einsatzbereit.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Rechtliches</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Datenschutz</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white">AGB</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
              <p className="text-gray-400">
                Für Fragen und Support wenden Sie sich an Ihren Berater 
                oder nutzen Sie die Kontaktmöglichkeiten in Ihrer Praxis.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SAMEBI Tools. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
