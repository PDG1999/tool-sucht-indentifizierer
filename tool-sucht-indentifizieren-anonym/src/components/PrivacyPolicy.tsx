import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Datenschutzerklärung</h1>
          
          <div className="prose max-w-none">
            <h2>1. Verantwortlicher</h2>
            <p>
              Verantwortlicher für die Datenverarbeitung auf dieser Website ist SAMEBI Tools. 
              Die Kontaktdaten können dem Impressum dieser Website entnommen werden.
            </p>

            <h2>2. Datenerhebung und -verwendung</h2>
            <p>
              Wir erheben und verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung 
              unserer Dienstleistungen erforderlich ist. Die Nutzung unseres Lebensbalance-Checks 
              erfolgt vollständig anonym.
            </p>

            <h3>2.1 Anonyme Nutzung</h3>
            <p>
              Der Lebensbalance-Check kann vollständig anonym durchgeführt werden. Es werden keine 
              personenbezogenen Daten wie Name, E-Mail-Adresse oder IP-Adresse gespeichert, 
              es sei denn, Sie geben diese freiwillig an.
            </p>

            <h3>2.2 Freiwillige Angaben</h3>
            <p>
              Falls Sie sich für eine detaillierte Auswertung registrieren, werden nur die 
              von Ihnen freiwillig angegebenen Daten (E-Mail-Adresse) gespeichert und verwendet.
            </p>

            <h2>3. Cookies und Tracking</h2>
            <p>
              Diese Website verwendet keine Tracking-Cookies oder andere Technologien zur 
              Verfolgung Ihrer Aktivitäten. Technisch notwendige Cookies werden nur zur 
              Funktionalität der Website verwendet.
            </p>

            <h2>4. Datenübertragung</h2>
            <p>
              Eine Übertragung Ihrer Daten an Dritte erfolgt nicht, es sei denn, dies ist 
              gesetzlich vorgeschrieben oder Sie haben ausdrücklich zugestimmt.
            </p>

            <h2>5. Ihre Rechte</h2>
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung 
              der Verarbeitung Ihrer personenbezogenen Daten. Da wir keine personenbezogenen 
              Daten speichern, ist eine Auskunft oder Löschung in der Regel nicht erforderlich.
            </p>

            <h2>6. Datensicherheit</h2>
            <p>
              Wir verwenden geeignete technische und organisatorische Sicherheitsmaßnahmen, 
              um Ihre Daten vor unbefugtem Zugriff, Verlust oder Missbrauch zu schützen.
            </p>

            <h2>7. Änderungen dieser Datenschutzerklärung</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf zu aktualisieren. 
              Die aktuelle Version finden Sie stets auf dieser Seite.
            </p>

            <h2>8. Kontakt</h2>
            <p>
              Bei Fragen zum Datenschutz wenden Sie sich bitte an Ihren Berater oder 
              die Kontaktperson in Ihrer Praxis.
            </p>

            <p className="text-sm text-gray-600 mt-8">
              Stand: {new Date().toLocaleDateString('de-DE')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
