const mainCategories = [
    "Ausbildung",
    "Baugewerbe",
    "Design",
    "Dienstleistungen für Unternehmen",
    "Einzelhandel",
    "Energie & Bergbau",
    "Fertigung",
    "Finanzwesen",
    "Freizeit & Reisen",
    "Geisteswissenschaften",
    "Gesundheitspflege",
    "Hardware & Networking",
    "Immobilien",
    "Juristische Dienstleistungen",
    "Konsumgüter",
    "Landwirtschaft",
    "Medien & Kommunikation",
    "Nonprofit",
    "Software & IT-Services",
    "Transportwesen & Logistik",
    "Unterhaltung",
    "Wellness & Fitness",
    "Öffentliche Sicherheit",
    "Öffentliche Verwaltung",
] as const;

export const industries: { [key in (typeof mainCategories)[number]]: readonly string[] } = {
    Ausbildung: [
        //
        "Bildungsmanagement",
        "E-Learning",
        "Forschung",
        "Hochschulwesen",
        "Pädagogik",
    ],
    Baugewerbe: [
        //
        "Baugewerbe",
        "Baumaterialien",
        "Hoch- und Tiefbau",
    ],
    Design: [
        //
        "Architektur & Bauplanung",
        "Design",
        "Grafikdesign",
    ],
    "Dienstleistungen für Unternehmen": [
        "Berufliche Schulungen & Coaching",
        "Buchhaltung",
        "Büromaterial und -ausstattung",
        "Gebäudeverwaltung",
        "Informationsdienste",
        "Management-Beratung",
        "Outsourcing & Offshoring",
        "Personalberatung & -vermittlung",
        "Personalwesen",
        "Sicherheits- & Ermittlungsdienste",
        "Umweltdienste",
        "Veranstaltungsdienste",
        "Ämter & Behörden",
    ],
    Einzelhandel: [
        //
        "Einzelhandel",
        "Grosshandel",
        "Supermärkte",
    ],
    "Energie & Bergbau": [
        //
        "Bergbau & Metallverarbeitung",
        "Energieversorgung",
        "Erdöl & Energiewissenschaften",
    ],
    Fertigung: [
        "Automobil",
        "Chemie",
        "Eisenbahnbau",
        "Elektro- / Elektronik-Herstellung",
        "Erneuerbare Energie & Umwelt",
        "Glas, Keramik & Zement",
        "Industrielle Automatisierung",
        "Kunststoffe",
        "Lebensmittelherstellung",
        "Luft- & Raumfahrt",
        "Maschinenbau",
        "Maschinenbau & Betriebstechnik",
        "Papier & Forstprodukte",
        "Schiffbau",
        "Textilien",
        "Verpackungsindustrie",
        "Verteidigung & Raumfahrt",
    ],
    Finanzwesen: [
        //
        "Bankwesen",
        "Finanzdienstleistungen",
        "Investment Banking",
        "Kapitalmärkte",
        "Venture Capital und Private Equity",
        "Vermögensverwaltung",
        "Versicherungswesen",
    ],
    "Freizeit & Reisen": [
        //
        "Fluggesellschaften",
        "Freizeiteinrichtungen & -dienste",
        "Glücksspiel & Casinos",
        "Hotel- und Gaststättengewerbe",
        "Restaurants",
        "Sport",
        "Tourismus und Freizeit",
    ],
    Geisteswissenschaften: [
        //
        "Darstellende Künste",
        "Fotografie",
        "Kunstgewerbe",
        "Schöne Künste",
    ],
    Gesundheitspflege: [
        //
        "Biotechnologie",
        "Humanmedizin",
        "Krankenhaus & Gesundheitsbereich",
        "Medizintechnik",
        "Pharmazie",
        "Psychologie & Psychotherapie",
        "Tiermedizin",
    ],
    "Hardware & Networking": [
        //
        "Computer-Hardware",
        "Computer-Netzwerke",
        "Halbleiter",
        "Nanotechnologie",
        "Telekommunikation",
        "Wireless",
    ],
    Immobilien: [
        //
        "Gewerbeimmobilien",
        "Immobilien",
    ],
    "Juristische Dienstleistungen": [
        //
        "Alternative Schlichtungsmethoden",
        "Juristische Dienstleistungen",
        "Rechtswesen",
    ],
    Konsumgüter: [
        //
        "Bekleidung & Mode",
        "Konsumgüter",
        "Kosmetik",
        "Lebensmittel & Getränke",
        "Luxusgüter & Schmuck",
        "Möbel",
        "Sportartikel",
        "Tabak",
        "Unterhaltungselektronik",
        "Verbraucherdienste",
        "Weine und Spirituosen",
    ],
    Landwirtschaft: [
        //
        "Fischereiwirtschaft",
        "Landwirtschaft",
        "Milchwirtschaft",
        "Viehwirtschaft",
    ],
    "Medien & Kommunikation": [
        //
        "Druckwesen",
        "Marketing und Werbung",
        "Marktforschung",
        "Online-Medien",
        "Presse",
        "Schreiben und Redigieren",
        "Verlagswesen",
        "Öffentlichkeitsarbeit",
        "Übersetzung und Lokalisierung",
    ],
    Nonprofit: [
        //
        "Bibliothekswesen",
        "Fundraising",
        "Intl. Handel & Entwicklung",
        "Management von Nonprofit-Organisationen",
        "Museen und Kulturstätten",
        "Philanthropie",
        "Programmentwicklung",
        "Religiöse Einrichtungen",
        "Soziale Dienstleistungen",
        "Soziale Einrichtungen",
        "Think Tanks",
    ],
    "Software & IT-Services": [
        //
        "Computer- & Netzwerksicherheit",
        "Computer-Software",
        "IT und Services",
        "Internet",
    ],
    "Transportwesen & Logistik": [
        //
        "Import und Export",
        "Lagerhaltung",
        "Logistik und Beschaffung",
        "Paket- und Frachttransport",
        "Seefahrt",
        "Transportwesen & Bahnverkehr",
    ],
    Unterhaltung: [
        //
        "Animation",
        "Computerspiele",
        "Kino & Film",
        "Medienproduktion",
        "Musik",
        "Rundfunk & Fernsehen",
        "Spiele für Mobilgeräte",
        "Unterhaltung",
    ],
    "Wellness & Fitness": [
        //
        "Alternative Medizin",
        "Gesundheit, Wellness & Fitness",
    ],
    "Öffentliche Sicherheit": [
        //
        "Militär",
        "Polizeidienst",
        "Öffentliche Sicherheit",
    ],
    "Öffentliche Verwaltung": [
        //
        "Beziehung zu Regierungen",
        "Diplomatischer Dienst",
        "Justiz",
        "Legislative",
        "Politische Organisationen",
        "Öffentliche Ordnung",
        "Öffentlicher Dienst",
    ],
} as const;

export const countries = ["Deutschland", "Österreich", "Schweiz"] as const;
