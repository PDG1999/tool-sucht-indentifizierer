# Änderungen für ScreeningTest.tsx

## 1. Imports hinzufügen (nach Zeile 6):
```typescript
import { getShuffledQuestions } from '../utils/questionUtils';
import { detectAddictionDirection, generateCounselorReport } from '../utils/addictionAnalysis';
```

## 2. State für gemischte Fragen (nach Zeile 12):
```typescript
const [shuffledQuestions] = useState(() => getShuffledQuestions(questions, 'interleave'));
const [addictionDirection, setAddictionDirection] = useState<any>(null);
```

## 3. Alle Referenzen zu "questions" durch "shuffledQuestions" ersetzen:
- Zeile 20: `shuffledQuestions[0].id`
- Zeile 28: `shuffledQuestions[currentStep].id`
- Zeile 42: `shuffledQuestions[currentStep].id`
- Zeile 46: `shuffledQuestions[currentStep]`
- Zeile 47: `shuffledQuestions.length`
- Zeile 67: `if (currentStep < shuffledQuestions.length - 1)`
- Alle weiteren Vorkommen

## 4. In handleNext() nach calculateProfessionalScores (ca. Zeile 72):
```typescript
const proScores = calculateProfessionalScores(responses);

// Addiction Direction analysieren
const direction = detectAddictionDirection(responses, proScores);
setAddictionDirection(direction);
console.log('Addiction Direction:', generateCounselorReport(direction));
```

## 5. Im Pro-View Results (ca. Zeile 180), nach den Categories:
```typescript
{addictionDirection && (
  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-4">
      🎯 Sucht-Richtungs-Analyse
    </h3>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-700">Primäre Richtung:</span>
        <span className="font-bold text-purple-900">
          {addictionDirection.primary} ({addictionDirection.primaryScore}%)
        </span>
      </div>
      {addictionDirection.secondary && (
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Sekundäre Richtung:</span>
          <span className="font-bold text-orange-600">
            {addictionDirection.secondary} ({addictionDirection.secondaryScore}%)
          </span>
        </div>
      )}
      <div className="flex justify-between items-center">
        <span className="text-gray-700">Konfidenz:</span>
        <span className="font-medium text-gray-900">
          {(addictionDirection.confidence * 100).toFixed(0)}%
        </span>
      </div>
      <div className="mt-4 pt-4 border-t border-purple-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Risiko-Muster:</p>
        <p className="text-gray-900">{addictionDirection.riskPattern}</p>
      </div>
      {addictionDirection.coMorbidity && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800 font-medium">
            ⚠️ Ko-Morbidität erkannt: Mehrere Suchtformen gleichzeitig vorhanden
          </p>
        </div>
      )}
    </div>
  </div>
)}
```

## Testing:
1. Starte Dev-Server: `npm run dev`
2. Teste `/test` - Fragen sollten durchmischt sein
3. Teste `/test/short` - Schnell-Version mit Upgrade
4. Teste `/supervisor` - Supervisor Dashboard mit Analytics
