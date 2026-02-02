import { CategoryGroup } from "./types";

export const CATEGORY_GROUPS: CategoryGroup[] = [
    {
        id: 'principles',
        label: 'General 3 Principles Understanding',
        color: '#2A81CB',
        items: ['Foundations', 'Key Concepts', 'Getting Started']
    },
    {
        id: 'listening',
        label: 'Deep Listening',
        color: '#2AAD27',
        items: ['Presence', 'Understanding', 'Connection']
    },
    {
        id: 'communities',
        label: 'Working with Communities',
        color: '#CB8427',
        items: ['Community Support', 'Collective Wellbeing', 'Local Impact']
    },
    {
        id: 'business',
        label: 'Working with Businesses',
        color: '#CB2B3E',
        items: ['Leadership', 'Workplace Wellbeing', 'Performance']
    },
    {
        id: 'schools',
        label: 'Schools & Education',
        color: '#9C2BCB',
        items: ['Students', 'Educators', 'Learning Environments']
    },
    {
        id: 'corrections',
        label: 'Corrections, Probation & Parole',
        color: '#CAC428',
        items: ['Rehabilitation', 'Staff Support', 'Reintegration']
    },
    {
        id: 'health',
        label: 'Physical Health',
        color: '#20B2AA',
        items: ['General']
    },
    {
        id: 'books',
        label: 'Book Clubs',
        color: '#FF69B4',
        items: ['General']
    }
];

export const CONTINENT_ICONS: Record<string, string> = {
    "europe": "https://pic.onlinewebfonts.com/thumbnails/icons_303482.svg",
    "africa": "https://pic.onlinewebfonts.com/thumbnails/icons_465264.svg",
    "north america": "https://pic.onlinewebfonts.com/thumbnails/icons_465277.svg",
    "south america": "https://pic.onlinewebfonts.com/thumbnails/icons_465278.svg",
    "asia": "https://pic.onlinewebfonts.com/thumbnails/icons_303501.svg",
    "oceania": "https://pic.onlinewebfonts.com/thumbnails/icons_303484.svg"
};

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=random&name=";

export const COUNTRY_CODES: Record<string, string> = { 
    "United States": "us", "USA": "us", "United Kingdom": "gb", "UK": "gb", "Canada": "ca", "Australia": "au", 
    "Germany": "de", "France": "fr", "Spain": "es", "Italy": "it", "Netherlands": "nl", "Brazil": "br", 
    "India": "in", "China": "cn", "Japan": "jp", "South Africa": "za", "New Zealand": "nz", "Mexico": "mx", 
    "Russia": "ru", "Sweden": "se", "Norway": "no", "Denmark": "dk", "Finland": "fi", "Switzerland": "ch", 
    "Ireland": "ie", "Belgium": "be", "Austria": "at", "Portugal": "pt", "Greece": "gr", "Poland": "pl", 
    "Czech Republic": "cz", "Hungary": "hu", "Turkey": "tr", "Israel": "il", "Egypt": "eg", "Thailand": "th", 
    "Vietnam": "vn", "Indonesia": "id", "Malaysia": "my", "Singapore": "sg", "Philippines": "ph", 
    "Argentina": "ar", "Chile": "cl", "Colombia": "co", "Peru": "pe", "Morocco": "ma" 
};

export const getCategoryColor = (cat: string) => {
    if (!cat) return '#555';
    const match = CATEGORY_GROUPS.find(g => cat.toLowerCase().includes(g.id) || g.label.toLowerCase().includes(cat.toLowerCase()));
    return match ? match.color : '#555';
};