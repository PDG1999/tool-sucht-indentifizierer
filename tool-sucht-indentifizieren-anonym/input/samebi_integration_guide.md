# 🔗 SAMEBI INTEGRATION GUIDE
## Sucht-Screening ins bestehende System integrieren

---

## 📊 BESTANDSAUFNAHME: Aktuelle SAMEBI Tests

### **Existierende Tools**:
1. **Burnout-Test** → Screent berufliche Erschöpfung
2. **Stress-Test** → Screent allgemeinen Stress-Level
3. **[weitere Tests]** → uvam.

### **Neues Tool**:
4. **Lebensbalance-Check** → Screent getarnt multiple Süchte

---

## 🎯 STRATEGISCHE POSITIONIERUNG

### **Öffentlicher Name** (für Marketing):
**"Lebensbalance & Wohlbefinden Check"**

**Beschreibung für Website**:
```
Ein umfassender Test, der verschiedene Aspekte Ihres Wohlbefindens 
untersucht: Wie ausbalanciert ist Ihr Leben in Bezug auf Zeit, 
Finanzen, Emotionen, Beziehungen und Gesundheit? Erhalten Sie 
wertvolle Einblicke und personalisierte Empfehlungen.

⏱ Dauer: 10-12 Minuten
📊 Auswertung: Sofort verfügbar
🔒 100% vertraulich
```

**SEO Keywords**:
- Lebensbalance Test
- Wohlbefinden Check
- Persönliche Selbstreflexion
- Gewohnheiten analysieren
- **NICHT**: Sucht-Test, Spielsucht-Screening (→ schreckt ab!)

---

## 🔀 DECISION TREE: Welcher Test für wen?

```
Erstkontakt / Website-Besucher
    │
    ├─→ Berufliche Probleme erwähnt?
    │   └─→ Burnout-Test
    │
    ├─→ Allgemeiner Stress erwähnt?
    │   └─→ Stress-Test
    │
    ├─→ "Alles irgendwie schwierig"?
    │   └─→ Lebensbalance-Check (Sucht-Screening)
    │
    ├─→ Beziehungsprobleme?
    │   └─→ Lebensbalance-Check (zeigt soziale Isolation)
    │
    ├─→ Finanzielle Sorgen?
    │   └─→ Lebensbalance-Check (Spielsucht/Kaufsucht)
    │
    └─→ Unsicher was los ist?
        └─→ Start mit Stress-Test
            └─→ Falls Score kritisch → Lebensbalance-Check anbieten
```

---

## 🔄 CROSS-REFERENCING: Tests kombinieren

### **Szenario 1: Burnout + Sucht-Risiko**

**Muster**: Jemand hat hohen Burnout-Score UND hohen Alkohol-Score

**Interpretation**:
```
Klassisches Muster: Arbeitsbedingter Stress wird mit Alkohol 
"bewältigt" → Teufelskreis

Intervention:
1. Primär: Sucht-Intervention (Alkohol muss zuerst adressiert werden)
2. Sekundär: Burnout-Prävention parallel
3. Arbeits-Situation muss mittelfristig verändert werden
```

---

### **Szenario 2: Depression + Kaufsucht**

**Muster**: Hohe depressive Symptome (F3.8) + Kaufsucht-Score

**Interpretation**:
```
Shopping als emotionale Selbstmedikation gegen Depression

Intervention:
1. Beide Themen müssen parallel behandelt werden
2. Antidepressiva erwägen (ärztliche Anbindung)
3. Kaufsucht-Therapie + kognitive Verhaltenstherapie
```

---

### **Szenario 3: Hoher Stress + Digital-Sucht**

**Muster**: Stress-Test kritisch + Digital-Sucht-Score hoch

**Interpretation**:
```
Social Media / Gaming als Eskapismus vor Stress

Intervention:
1. Stress-Quellen identifizieren und reduzieren
2. Digital-Detox als Teil der Stress-Bewältigung
3. Gesunde Coping-Strategien entwickeln
```

---

## 🖥️ WEBSITE-INTEGRATION

### **Navigation-Struktur**:

```
SAMEBI.net
├── Tests & Selbstchecks
│   ├── 🔥 Burnout-Test
│   ├── 😰 Stress-Test
│   ├── ⚖️ Lebensbalance-Check [NEU]
│   ├── 💔 Beziehungs-Test
│   └── ...weitere Tests
│
├── Für Psychologen
│   ├── Marketing-Tools (bestehend)
│   ├── Praxis-Management (bestehend)
│   └── 🔒 Professionelles Screening-Dashboard [NEU]
│
└── Ressourcen
    ├── Blog
    ├── Ratgeber
    └── Notfall-Kontakte [NEU]
```

---

### **Landing-Page** (für Lebensbalance-Check):

**Hero-Section**:
```html
<h1>Wie ausbalanciert ist Ihr Leben?</h1>
<p>Entdecken Sie in 10 Minuten, wie es um Ihre Lebensbalance 
   in den Bereichen Zeit, Finanzen, Emotionen, Beziehungen 
   und Gesundheit steht.</p>

[Test starten Button]

✓ Wissenschaftlich fundiert
✓ Sofortige Auswertung
✓ 100% anonym möglich
```

**Social Proof**:
```
"Der Test hat mir die Augen geöffnet. Ich hatte nicht realisiert, 
wie sehr meine Gewohnheiten mein Leben bestimmen."
- Maria, 34

"Endlich ein Test, der nicht nur Symptome abfragt, sondern 
wirklich in die Tiefe geht."
- Carlos, 42
```

---

## 💼 BERATER-WORKFLOW

### **Integration ins Dashboard**:

**Übersicht aller Clients**:
```
╔═══════════════════════════════════════════════════════════╗
║ Client: Maria S. #2845                                    ║
╠═══════════════════════════════════════════════════════════╣
║ Durchgeführte Tests:                                      ║
║   • Stress-Test (15.09.2025): Hoch (72/100)              ║
║   • Burnout-Test (18.09.2025): Mittel (58/100)           ║
║   • Lebensbalance (22.09.2025): Kritisch (85/100) 🔴     ║
║                                                           ║
║ Primäre Verdachtsdiagnose: Alkohol-Missbrauch            ║
║ Komorbidität: Arbeitsbedingter Stress                    ║
║                                                           ║
║ [Gesamtbild anzeigen] [Behandlungsplan erstellen]        ║
╚═══════════════════════════════════════════════════════════╝
```

---

### **Automatische Alerts**:

**Regel 1**: 
```
WENN (Lebensbalance-Check Score > 60)
DANN → Email an Berater: "Kritischer Fall - Review erforderlich"
```

**Regel 2**:
```
WENN (Stress-Test hoch) UND (Lebensbalance Alkohol-Score hoch)
DANN → Popup: "Mögliche Alkohol-Problematik als Stress-Bewältigung"
```

**Regel 3**:
```
WENN (Lebensbalance Score > 80)
DANN → Automatische Termin-Anfrage generieren
```

---

## 📧 EMAIL-AUTOMATION

### **Sequenz für Selbst-Tests** (ohne Berater):

**Tag 0** - Direkt nach Test:
```
Betreff: Ihre Lebensbalance-Auswertung

Liebe/r [Name],

vielen Dank für Ihre Teilnahme am Lebensbalance-Check.

Ihre Ergebnisse zeigen [allgemeine Zusammenfassung].

[Falls Score > 40]:
Ich sehe, dass Sie in einigen Bereichen unter Druck stehen. 
Das ist nichts, womit Sie alleine bleiben müssen.

Möchten Sie mit einem unserer Berater sprechen?

[Termin buchen Button]

Herzliche Grüße,
Ihr SAMEBI Team

P.S.: Falls Sie akut Hilfe brauchen:
Telefonseelsorge: 0800 111 0 111 (24/7)
```

---

**Tag 3** - Follow-Up:
```
Betreff: Wie geht es Ihnen?

Liebe/r [Name],

vor 3 Tagen haben Sie unseren Lebensbalance-Check gemacht.

Ich wollte nachfragen: Wie geht es Ihnen heute?

[Falls kein Termin gebucht]:
Viele Menschen zögern, Hilfe zu suchen. Das ist verständlich.
Aber oft ist der erste Schritt der wichtigste.

Hier sind einige Ressourcen, die helfen können:
• [Link zu Selbsthilfegruppen]
• [Link zu Ratgeber-Artikeln]
• [Link zu Krisenhotlines]

Sie müssen das nicht alleine durchstehen.

[Termin buchen Button]
```

---

**Tag 7** - Ressourcen-Email:
```
Betreff: 5 Strategien für mehr Lebensbalance

[Allgemeine Tipps - nicht sucht-spezifisch, um nicht abzuschrecken]

1. Routinen etablieren
2. Bewusste Pausen einplanen
3. Soziale Kontakte pflegen
4. Grenzen setzen
5. Professionelle Hilfe nutzen

[Blog-Links, Podcast-Empfehlungen, etc.]
```

---

## 🔐 DATENSCHUTZ & COMPLIANCE

### **DSGVO-Konformität**:

**Informed Consent** (vor Test):
```
Datenschutz-Hinweis:

Dieser Test erfasst persönliche Informationen über Ihre 
Lebensgewohnheiten und Ihr Wohlbefinden.

• Ihre Daten werden verschlüsselt gespeichert
• Sie können Ihre Daten jederzeit löschen
• Bei Tests MIT Berater: Ergebnisse werden mit Berater geteilt
• Bei Selbst-Tests: Komplett anonym möglich

Mit "Test starten" stimmen Sie der Datenverarbeitung zu.

[Datenschutzerklärung vollständig lesen]
```

---

### **Haftungsausschluss**:

```
Wichtiger Hinweis:

Dieser Test ist ein Screening-Instrument und ersetzt keine 
klinische Diagnose. Die Ergebnisse dienen zur Orientierung 
und als Gesprächsgrundlage.

Bei akuten Krisen wenden Sie sich bitte an:
• Notarzt: 112
• Telefonseelsorge: 0800 111 0 111
• Nächste Notaufnahme

SAMEBI übernimmt keine Haftung für Handlungen, die auf Basis 
der Test-Ergebnisse vorgenommen werden.
```

---

## 📊 ANALYTICS & TRACKING

### **KPIs tracken**:

**Funnel-Analyse**:
```
1. Landing Page Besuche → [Tracking]
2. Test gestartet → Conversion Rate?
3. Test abgeschlossen → Completion Rate?
4. Termin gebucht (bei kritisch) → Booking Rate?
5. Erscheinen zum Termin → Show-up Rate?
```

**Risiko-Verteilung**:
```
Monatlicher Report:
• X Tests durchgeführt
• Y% Kritisches Risiko (>80)
• Z% Hohes Risiko (60-80)
• W% Mittleres Risiko (40-60)
• V% Niedriges Risiko (<40)

Top-Kategorien:
1. Spielsucht: XX%
2. Alkohol: YY%
3. Digital: ZZ%
```

---

## 💰 MONETARISIERUNG

### **Für Psychologen (B2B)**:

**Lizenz-Modell**:
```
BASIC (19€/Monat):
• 10 Tests/Monat
• Standard-Auswertung
• Email-Support

PROFESSIONAL (49€/Monat):
• Unbegrenzte Tests
• Erweiterte Analytics
• Berater-Dashboard
• Priority-Support

PREMIUM (99€/Monat):
• Alles aus Professional
• White-Label Option
• Custom Branding
• API-Zugang
```

---

### **Für Endverbraucher (B2C)**:

**Freemium-Modell**:
```
KOSTENLOS:
• Basis-Test
• Öffentliche Scores
• Allgemeine Empfehlungen

DETAILLIERTER REPORT (9.90€):
• Vollständige professionelle Auswertung (anonymisiert)
• Detaillierte Handlungsempfehlungen
• Ressourcen-Guide
• 3 Monate Zugriff auf Ergebnis

COACHING PAKET (147€):
• Detaillierter Report
• 3x 50-Min Einzel-Coaching
• Personalisierter Aktionsplan
• 6 Monate Follow-Up Zugang
```

---

## 🚀 LAUNCH-STRATEGIE

### **Phase 1: Soft Launch** (Woche 1-4)

**Zielgruppe**: Bestehende SAMEBI-Psychologen
```
• Beta-Zugang für 20-30 Psychologen
• Feedback sammeln
• Fragen kalibrieren
• Scoring optimieren
```

**Kommunikation**:
```
"Neues Tool: Lebensbalance-Check - Exklusiv für unsere Partner"

Email an Psychologen:
"Wir haben ein innovatives Screening-Tool entwickelt, das Ihnen 
hilft, versteckte Problematiken frühzeitig zu erkennen.

Als Beta-Tester erhalten Sie:
• Kostenlosen Zugang für 3 Monate
• Priority-Support
• Ihr Feedback fließt in Entwicklung ein

[Beta-Zugang anfordern]"
```

---

### **Phase 2: Public Launch** (Woche 5-8)

**Marketing-Kanäle**:
1. **Social Media Kampagne**:
   ```
   Instagram/LinkedIn:
   "Wie steht es um deine Lebensbalance? 🤔
   Unser neuer Test gibt dir in 10 Minuten wertvolle Einblicke.
   
   Kostenlos & anonym
   Link in Bio ↗️"
   ```

2. **Blog-Serie**:
   - "5 Zeichen, dass Ihre Lebensbalance gestört ist"
   - "Warum Selbstreflexion der erste Schritt ist"
   - "Von Gewohnheiten zu Abhängigkeit - der schleichende Prozess"

3. **SEO-Optimierung**:
   - Keyword-Research: "Lebensbalance Test", "Gewohnheiten ändern"
   - Content-Marketing rund um Thema Wohlbefinden

4. **Influencer-Kooperation**:
   - Mental Health Influencer
   - Lifestyle-Blogger
   - Finanz-Coaches (für Kaufsucht/Spielsucht)

---

### **Phase 3: Skalierung** (Monat 3+)

**B2B-Expansion**:
```
• Betriebliche Gesundheitsförderung (Unternehmen)
• Krankenkassen (Präventions-Angebot)
• Universitäten (Studenten-Support)
• Suchtberatungsstellen (Tool-Lizenz)
```

**B2C-Wachstum**:
```
• Google Ads (Keyword: Spielsucht Hilfe, etc.)
• YouTube-Serie: Mental Health & Balance
• Podcast-Sponsorships
• PR in relevanten Medien
```

---

## ✅ IMPLEMENTIERUNGS-CHECKLISTE

### **Technical**:
- [ ] Backend fertig (PostgreSQL + PostgREST)
- [ ] Frontend fertig (React + alle 40 Fragen)
- [ ] Scoring-Engine validiert
- [ ] Berater-Dashboard funktional
- [ ] PDF-Export funktioniert
- [ ] Email-Automation setup
- [ ] Analytics integriert

### **Content**:
- [ ] Landing-Page erstellt
- [ ] Datenschutzerklärung angepasst
- [ ] Haftungsausschluss formuliert
- [ ] Gesprächsleitfäden für Berater verfügbar
- [ ] Ressourcen-Links gesammelt
- [ ] Blog-Artikel vorbereitet

### **Legal & Compliance**:
- [ ] DSGVO-Compliance geprüft
- [ ] Informed Consent implementiert
- [ ] Berufshaftpflicht aktualisiert (für Berater)
- [ ] AGB angepasst

### **Marketing**:
- [ ] Social Media Posts vorbereitet
- [ ] Email-Sequenzen geschrieben
- [ ] Beta-Tester rekrutiert
- [ ] Launch-Plan finalisiert

---

## 🎯 SUCCESS METRICS (nach 6 Monaten)

**Quantitativ**:
- 500+ durchgeführte Tests
- 15-20% kritische Fälle identifiziert
- 40%+ Termin-Buchungsrate bei kritischen Fällen
- 50+ Psychologen nutzen Tool aktiv

**Qualitativ**:
- Positive Feedback von Beratern: "Hilft mir, versteckte Probleme zu erkennen"
- Klienten-Feedback: "Test hat mir die Augen geöffnet"
- Erfolgsgeschichten: "Dank Früherkennung konnte geholfen werden"

---

**Status**: Integration-Guide komplett ✅  
**Ready für**: Sofortige Implementierung  
**Nächster Schritt**: Technical Setup mit Cursor starten! 🚀