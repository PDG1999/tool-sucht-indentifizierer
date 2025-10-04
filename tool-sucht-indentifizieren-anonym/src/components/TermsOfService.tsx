import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService: React.FC = () => {
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
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Allgemeine Geschäftsbedingungen</h1>
          
          <div className="prose max-w-none">
            <h2>1. Geltungsbereich</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung des 
              Lebensbalance-Checks von SAMEBI Tools.
            </p>

            <h2>2. Beschreibung der Dienstleistung</h2>
            <p>
              Der Lebensbalance-Check ist ein professionelles Screening-Tool für Psychologen 
              und Berater zur Unterstützung ihrer Klienten. Es handelt sich um ein 
              wissenschaftlich fundiertes, aber nicht-diagnostisches Instrument.
            </p>

            <h2>3. Nutzungsbedingungen</h2>
            <h3>3.1 Professionelle Nutzung</h3>
            <p>
              Dieses Tool ist ausschließlich für professionelle Psychologen, Berater und 
              andere qualifizierte Fachkräfte bestimmt. Eine Nutzung durch Laien ist 
              nicht vorgesehen.
            </p>

            <h3>3.2 Verantwortung des Nutzers</h3>
            <p>
              Der Nutzer ist verantwortlich für die ordnungsgemäße Anwendung des Tools 
              und die Interpretation der Ergebnisse. Die Ergebnisse dienen nur als 
              Orientierungshilfe und ersetzen keine professionelle Diagnose.
            </p>

            <h2>4. Haftungsausschluss</h2>
            <p>
              SAMEBI Tools haftet nicht für Schäden, die durch die Nutzung oder 
              Fehlinterpretation der Ergebnisse entstehen. Das Tool ist ein 
              Screening-Instrument und keine diagnostische Methode.
            </p>

            <h2>5. Datenschutz</h2>
            <p>
              Die Nutzung erfolgt anonym. Es werden keine personenbezogenen Daten 
              gespeichert, es sei denn, der Nutzer gibt diese freiwillig an. 
              Weitere Details finden Sie in unserer Datenschutzerklärung.
            </p>

            <h2>6. Urheberrecht</h2>
            <p>
              Alle Inhalte, Texte, Grafiken und das Design dieser Anwendung sind 
              urheberrechtlich geschützt und dürfen nicht ohne Genehmigung verwendet werden.
            </p>

            <h2>7. Verfügbarkeit</h2>
            <p>
              Wir bemühen uns um eine hohe Verfügbarkeit des Services, können aber 
              keine Garantie für eine ununterbrochene Nutzbarkeit geben.
            </p>

            <h2>8. Änderungen</h2>
            <p>
              Wir behalten uns vor, diese AGB bei Bedarf zu ändern. Die aktuelle 
              Version finden Sie stets auf dieser Seite.
            </p>

            <h2>9. Schlussbestimmungen</h2>
            <p>
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die 
              Wirksamkeit der übrigen Bestimmungen unberührt.
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

export default TermsOfService;
