import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Plus, X, Calendar, MapPin, ExternalLink, Trash2, Edit3,
  LogOut, ChevronDown, Shield, Users as UsersIcon, Eye, EyeOff,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, DEFAULT_AVATAR_URL } from '../lib/supabase';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */
interface DashboardEvent {
  id: string;
  title: string;
  image_url: string | null;
  start_time: string;
  end_time: string;
  location_type: string;
  lat: number | null;
  lng: number | null;
  city: string;
  country: string;
  continent: string;
  link: string;
  category: string;
  subcategory: string;
  format: string;
  description: string;
  organizer: string;
  co_facilitators: CoFacilitator[];
  user_id: string;
  status: string;
  is_hidden: boolean;
}

interface DashboardResource {
  id: string;
  title: string;
  link: string;
  category: string;
  description: string | null;
  image_url: string | null;
  user_id: string;
}

interface CoFacilitator {
  id?: string;
  name: string;
  avatar?: string;
}

interface AdminProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  role: string;
  is_blocked: boolean;
  membership_status: string | null;
}

/* ═══════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════ */
const CATEGORIES = [
  'General 3 Principles Understanding',
  'Deep Listening',
  'Working with Communities',
  'Working with Businesses and Organizations',
  'Working with schools and education',
  'Working in Corrections, Probation & Parole',
  'Physical Health and The Body-Mind Connection',
  'Book Clubs',
  'Other',
];

const FORMATS = ['Workshops', 'Courses', 'Retreats'];

const RESOURCE_CATEGORIES = ['Book', 'Video', 'Article', 'Podcast', 'Tool'];

const CONTINENTS = ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'];

const COUNTRIES_BY_CONTINENT: Record<string, string[]> = {
  Africa: ['Algeria','Angola','Benin','Botswana','Burkina Faso','Burundi','Cabo Verde','Cameroon','Central African Republic','Chad','Comoros','Congo (Democratic Republic of the)','Congo (Republic of the)',"Cote d'Ivoire",'Djibouti','Egypt','Equatorial Guinea','Eritrea','Eswatini','Ethiopia','Gabon','Gambia','Ghana','Guinea','Guinea-Bissau','Kenya','Lesotho','Liberia','Libya','Madagascar','Malawi','Mali','Mauritania','Mauritius','Morocco','Mozambique','Namibia','Niger','Nigeria','Rwanda','Sao Tome and Principe','Senegal','Seychelles','Sierra Leone','Somalia','South Africa','South Sudan','Sudan','Tanzania','Togo','Tunisia','Uganda','Zambia','Zimbabwe'],
  Antarctica: ['Antarctica'],
  Asia: ['Afghanistan','Armenia','Azerbaijan','Bahrain','Bangladesh','Bhutan','Brunei','Cambodia','China','Cyprus','Georgia','India','Indonesia','Iran','Iraq','Israel','Japan','Jordan','Kazakhstan','Kuwait','Kyrgyzstan','Laos','Lebanon','Malaysia','Maldives','Mongolia','Myanmar','Nepal','North Korea','Oman','Pakistan','Palestine','Philippines','Qatar','Russia','Saudi Arabia','Singapore','South Korea','Sri Lanka','Syria','Taiwan','Tajikistan','Thailand','Timor-Leste','Turkey','Turkmenistan','United Arab Emirates','Uzbekistan','Vietnam','Yemen'],
  Europe: ['Albania','Andorra','Austria','Belarus','Belgium','Bosnia and Herzegovina','Bulgaria','Croatia','Czech Republic','Denmark','Estonia','Finland','France','Germany','Greece','Hungary','Iceland','Ireland','Italy','Kosovo','Latvia','Liechtenstein','Lithuania','Luxembourg','Malta','Moldova','Monaco','Montenegro','Netherlands','North Macedonia','Norway','Poland','Portugal','Romania','Russia','San Marino','Serbia','Slovakia','Slovenia','Spain','Sweden','Switzerland','Ukraine','United Kingdom','Vatican City'],
  'North America': ['Antigua and Barbuda','Bahamas','Barbados','Belize','Canada','Costa Rica','Cuba','Dominica','Dominican Republic','El Salvador','Grenada','Guatemala','Haiti','Honduras','Jamaica','Mexico','Nicaragua','Panama','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Trinidad and Tobago','United States'],
  Oceania: ['Australia','Fiji','Kiribati','Marshall Islands','Micronesia','Nauru','New Zealand','Palau','Papua New Guinea','Samoa','Solomon Islands','Tonga','Tuvalu','Vanuatu'],
  'South America': ['Argentina','Bolivia','Brazil','Chile','Colombia','Ecuador','Guyana','Paraguay','Peru','Suriname','Uruguay','Venezuela'],
};

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */
const toLocalDatetime = (iso: string) => iso?.slice(0, 16) ?? '';

const greeting = (name: string) => {
  const h = new Date().getHours();
  const g = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  return `${g}, ${name || 'User'}`;
};

/* ═══════════════════════════════════════════
   Toast
   ═══════════════════════════════════════════ */
const useToast = () => {
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: 'success' | 'error' }[]>([]);
  const show = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);
  const ToastContainer = () => (
    <div className="fixed bottom-6 right-6 z-[3000] flex flex-col gap-2.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`bg-white ${t.type === 'error' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-indigo-600'} py-4 px-5 rounded shadow-lg flex items-center gap-3 min-w-[300px] text-sm font-medium animate-[slideIn_0.3s_ease-out]`}
        >
          <span>{t.type === 'error' ? '⚠️' : '✅'}</span>{t.msg}
        </div>
      ))}
    </div>
  );
  return { show, ToastContainer };
};

/* ═══════════════════════════════════════════
   Co-facilitator Input
   ═══════════════════════════════════════════ */
const CoFacilitatorInput: React.FC<{
  value: CoFacilitator[];
  onChange: (v: CoFacilitator[]) => void;
  allProfiles: { id: string; full_name: string; avatar_url: string | null }[];
  currentUserName: string;
  currentUserAvatar: string;
}> = ({ value, onChange, allProfiles, currentUserName, currentUserAvatar }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const matches = query
    ? allProfiles.filter((p) => p.full_name?.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const add = (fac: CoFacilitator) => {
    if (fac.id && value.some((f) => f.id === fac.id)) return;
    if (!fac.id && value.some((f) => f.name === fac.name)) return;
    onChange([...value, fac]);
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-300">
      <h4 className="m-0 mb-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">Lead Facilitator</h4>
      <div className="flex items-center gap-3 mb-4">
        <img src={currentUserAvatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
        <span className="text-sm font-semibold">{currentUserName}</span>
        <span className="text-xs font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded">Lead</span>
      </div>

      <h4 className="m-0 mb-2 text-xs uppercase tracking-wider text-slate-500 font-semibold">Co-Facilitators</h4>
      <div className="relative" ref={ref}>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              e.preventDefault();
              add({ name: query.trim() });
            }
          }}
          placeholder="+ Add co-facilitator (Enter to add custom)..."
          className="w-full py-2.5 px-3 border border-dashed border-gray-300 bg-slate-50 rounded-lg text-sm focus:outline-none focus:border-indigo-600 focus:border-solid focus:bg-white box-border"
        />
        {showSuggestions && matches.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-[150px] overflow-y-auto mt-1">
            {matches.map((p) => (
              <div
                key={p.id}
                onClick={() => add({ id: p.id, name: p.full_name, avatar: p.avatar_url ?? undefined })}
                className="flex items-center gap-2 py-2 px-3 cursor-pointer text-sm hover:bg-slate-100"
              >
                <img src={p.avatar_url || `${DEFAULT_AVATAR_URL}${encodeURIComponent(p.full_name)}`} alt="" className="w-6 h-6 rounded-full object-cover" />
                {p.full_name}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-2.5">
        {value.map((f, i) => (
          <div key={f.id || f.name} className="inline-flex items-center gap-1.5 bg-white border border-gray-300 py-1 px-2.5 rounded-full text-sm font-medium">
            {f.avatar ? (
              <img src={f.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <span className="w-5 h-5 rounded-full bg-gray-300 inline-flex items-center justify-center text-[10px] text-white font-bold">
                {f.name.charAt(0).toUpperCase()}
              </span>
            )}
            {f.name}
            <span
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="cursor-pointer text-slate-400 ml-1 hover:text-red-500"
            >
              ×
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Event Drawer
   ═══════════════════════════════════════════ */
const EventDrawer: React.FC<{
  open: boolean;
  event: DashboardEvent | null;
  onClose: () => void;
  onSave: (payload: Partial<DashboardEvent>, status: string) => Promise<void>;
  allProfiles: { id: string; full_name: string; avatar_url: string | null }[];
  userName: string;
  userAvatar: string;
}> = ({ open, event, onClose, onSave, allProfiles, userName, userAvatar }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [locationType, setLocationType] = useState('In-Person');
  const [continent, setContinent] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subcategory, setSubcategory] = useState('');
  const [format, setFormat] = useState(FORMATS[0]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [coFacilitators, setCoFacilitators] = useState<CoFacilitator[]>([]);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (event) {
      setTitle(event.title);
      setStartTime(toLocalDatetime(event.start_time));
      setEndTime(toLocalDatetime(event.end_time));
      setLocationType(event.location_type);
      setContinent(event.continent);
      setCountry(event.country);
      setCity(event.city);
      setLink(event.link);
      setCategory(event.category);
      setSubcategory(event.subcategory);
      setFormat(event.format);
      setDescription(event.description || '');
      setImageUrl(event.image_url || '');
      setCoFacilitators(event.co_facilitators || []);
    } else {
      setTitle(''); setStartTime(''); setEndTime(''); setLocationType('In-Person');
      setContinent(''); setCountry(''); setCity(''); setLink('');
      setCategory(CATEGORIES[0]); setSubcategory(''); setFormat(FORMATS[0]);
      setDescription(''); setImageUrl(''); setCoFacilitators([]);
    }
  }, [open, event]);

  const handleImageUpload = async (file: File) => {
    const fileName = `event_${Date.now()}.jpg`;
    const { error } = await supabase.storage.from('events_images').upload(fileName, file);
    if (error) return;
    const { data } = supabase.storage.from('events_images').getPublicUrl(fileName);
    setImageUrl(data.publicUrl);
  };

  const handleSave = async (status: string) => {
    setSaving(true);
    await onSave({
      id: event?.id,
      title,
      image_url: imageUrl || null,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      location_type: locationType,
      lat: null,
      lng: null,
      city,
      country,
      continent,
      link,
      category,
      subcategory,
      format,
      description,
      co_facilitators: coFacilitators,
      status,
    }, status);
    setSaving(false);
  };

  const countries = continent ? (COUNTRIES_BY_CONTINENT[continent] ?? []).sort() : [];

  if (!open) return null;

  return (
    <>
      <div className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[900] transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-screen w-[600px] max-w-full bg-white z-[1000] shadow-xl flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="py-5 px-8 border-b border-slate-200 flex justify-between items-center">
          <h2 className="m-0 text-xl font-semibold">{event ? 'Edit Event' : 'Create New Event'}</h2>
          <button onClick={onClose} className="p-2 bg-transparent border-none cursor-pointer text-slate-500 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 3 Principles Workshop" className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 focus:shadow-[0_0_0_3px_#eef2ff] box-border mb-4" />

          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cover Image</label>
          <div className="border border-slate-200 rounded-lg p-5 text-center bg-slate-50 mb-4">
            <input type="file" ref={fileRef} accept="image/*" hidden onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
            {imageUrl ? (
              <div className="relative">
                <img src={imageUrl} alt="" className="w-full rounded border border-slate-200" />
                <button onClick={() => setImageUrl('')} className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 border-none rounded-lg cursor-pointer hover:bg-red-100"><Trash2 size={14} /></button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} className="py-2.5 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-50">Choose Image</button>
            )}
          </div>

          <div className="flex gap-5 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Time</label>
              <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 box-border" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Time</label>
              <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 box-border" />
            </div>
          </div>

          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location Type</label>
          <select value={locationType} onChange={(e) => setLocationType(e.target.value)} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 bg-white box-border mb-4">
            <option value="In-Person">In-Person</option>
            <option value="Online">Online</option>
          </select>

          {locationType === 'In-Person' && (
            <>
              <div className="flex gap-5 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Continent</label>
                  <select value={continent} onChange={(e) => { setContinent(e.target.value); setCountry(''); }} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 bg-white box-border">
                    <option value="">Select...</option>
                    {CONTINENTS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country</label>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 bg-white box-border">
                    <option value="">{continent ? 'Select...' : 'Select Continent First'}</option>
                    {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 box-border mb-4 capitalize" />
            </>
          )}

          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Join/Details Link</label>
          <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Paste link here..." className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 box-border mb-4" />

          <div className="flex gap-5 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 bg-white box-border">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subcategory</label>
              <input type="text" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 box-border" />
            </div>
          </div>

          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 bg-white box-border mb-4">
            {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>

          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Facilitator Team</label>
          <CoFacilitatorInput
            value={coFacilitators}
            onChange={setCoFacilitators}
            allProfiles={allProfiles}
            currentUserName={userName}
            currentUserAvatar={userAvatar}
          />

          <label className="block text-sm font-semibold text-gray-700 mb-1.5 mt-4">Event Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 box-border resize-y"
          />
        </div>

        {/* Footer */}
        <div className="py-5 px-8 border-t border-slate-200 bg-slate-50 flex gap-4">
          <button onClick={() => handleSave('draft')} disabled={saving} className="flex-1 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-50 disabled:opacity-50">
            Save Draft
          </button>
          <button onClick={() => handleSave('live')} disabled={saving} className="flex-1 py-2.5 bg-indigo-600 text-white border-none rounded-lg text-sm font-medium cursor-pointer hover:bg-indigo-700 shadow-sm disabled:opacity-50">
            Publish Event
          </button>
        </div>
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════
   Resource Drawer
   ═══════════════════════════════════════════ */
const ResourceDrawer: React.FC<{
  open: boolean;
  resource: DashboardResource | null;
  onClose: () => void;
  onSave: (payload: Partial<DashboardResource>) => Promise<void>;
}> = ({ open, resource, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [resLink, setResLink] = useState('');
  const [category, setCategory] = useState(RESOURCE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (resource) {
      setTitle(resource.title);
      setResLink(resource.link);
      setCategory(resource.category);
      setDescription(resource.description || '');
      setImageUrl(resource.image_url || '');
    } else {
      setTitle(''); setResLink(''); setCategory(RESOURCE_CATEGORIES[0]); setDescription(''); setImageUrl('');
    }
  }, [open, resource]);

  const handleImageUpload = async (file: File) => {
    const fileName = `res_${Date.now()}.jpg`;
    const { error } = await supabase.storage.from('Ressources').upload(fileName, file);
    if (error) return;
    const { data } = supabase.storage.from('Ressources').getPublicUrl(fileName);
    setImageUrl(data.publicUrl);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ id: resource?.id, title, link: resLink, category, description, image_url: imageUrl || null });
    setSaving(false);
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[900]" onClick={onClose} />
      <div className="fixed top-0 right-0 h-screen w-[600px] max-w-full bg-white z-[1000] shadow-xl flex flex-col">
        <div className="py-5 px-8 border-b border-slate-200 flex justify-between items-center">
          <h2 className="m-0 text-xl font-semibold">{resource ? 'Edit Resource' : 'Share Resource'}</h2>
          <button onClick={onClose} className="p-2 bg-transparent border-none cursor-pointer text-slate-500 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-8 overflow-y-auto flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Resource Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. The Power of Now" className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 box-border mb-4" />

          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cover Image</label>
          <div className="border border-slate-200 rounded-lg p-5 text-center bg-slate-50 mb-4">
            <input type="file" ref={fileRef} accept="image/*" hidden onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
            {imageUrl ? (
              <div className="relative">
                <img src={imageUrl} alt="" className="w-full rounded border border-slate-200" />
                <button onClick={() => setImageUrl('')} className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 border-none rounded-lg cursor-pointer hover:bg-red-100"><Trash2 size={14} /></button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} className="py-2.5 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-50">Choose Image</button>
            )}
          </div>

          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link (URL)</label>
          <input type="text" value={resLink} onChange={(e) => setResLink(e.target.value)} placeholder="https://..." className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 box-border mb-4" />

          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 bg-white box-border mb-4">
            {RESOURCE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="Why are you sharing this resource?" className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 box-border resize-y" />
        </div>
        <div className="py-5 px-8 border-t border-slate-200 bg-slate-50">
          <button onClick={handleSave} disabled={saving} className="w-full py-2.5 bg-indigo-600 text-white border-none rounded-lg text-sm font-medium cursor-pointer hover:bg-indigo-700 shadow-sm disabled:opacity-50">
            {saving ? 'Saving...' : 'Publish Resource'}
          </button>
        </div>
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════
   Admin Panel
   ═══════════════════════════════════════════ */
const AdminPanel: React.FC<{
  onExit: () => void;
  toast: (msg: string, type?: 'success' | 'error') => void;
}> = ({ onExit, toast }) => {
  const [section, setSection] = useState<'users' | 'events'>('users');
  const [users, setUsers] = useState<AdminProfile[]>([]);
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [facFilter, setFacFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const loadData = useCallback(async () => {
    const { data: u } = await supabase.from('profiles').select('*').order('full_name');
    if (u) setUsers(u as AdminProfile[]);
    const { data: e } = await supabase.from('events').select('*').neq('status', 'draft').order('created_at', { ascending: false });
    if (e) setEvents(e as DashboardEvent[]);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleBlock = async (id: string, block: boolean) => {
    await supabase.from('profiles').update({ is_blocked: block }).eq('id', id);
    loadData();
  };

  const toggleVisibility = async (id: string, hidden: boolean) => {
    const { error } = await supabase.from('events').update({ is_hidden: !hidden }).eq('id', id);
    if (error) toast(error.message, 'error');
    else { toast('Visibility Updated'); loadData(); }
  };

  const filteredEvents = events.filter((e) => {
    const matchFac = (e.organizer || '').toLowerCase().includes(facFilter.toLowerCase());
    let matchDate = true;
    if (dateFilter) {
      matchDate = new Date(e.start_time).setHours(0, 0, 0, 0) >= new Date(dateFilter).setHours(0, 0, 0, 0);
    }
    return matchFac && matchDate;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.is_blocked).length;
  const blockedUsers = users.filter((u) => u.is_blocked).length;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-[250px] bg-white border-r border-slate-200 p-5 flex flex-col fixed left-0 top-0 h-screen max-md:hidden">
        <h2 className="text-indigo-600 mb-8 text-lg font-bold">AdminCore</h2>
        <div
          onClick={() => setSection('users')}
          className={`p-2.5 rounded-md cursor-pointer mb-1 font-medium ${section === 'users' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <UsersIcon size={14} className="inline mr-2" /> Users
        </div>
        <div
          onClick={() => setSection('events')}
          className={`p-2.5 rounded-md cursor-pointer mb-1 font-medium ${section === 'events' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <Calendar size={14} className="inline mr-2" /> All Events
        </div>
        <div className="flex-1" />
        <div onClick={onExit} className="p-2.5 rounded-md cursor-pointer text-slate-500 hover:bg-slate-100 font-medium">
          ⬅ Exit Admin
        </div>
      </div>

      {/* Main */}
      <div className="ml-[250px] max-md:ml-0 p-10 bg-slate-50 min-h-screen flex-1">
        {section === 'users' && (
          <>
            <div className="flex justify-between items-center mb-5">
              <h2 className="m-0">User Management</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-5 rounded-lg border border-slate-200">Total Users<div className="text-2xl font-bold">{totalUsers}</div></div>
              <div className="bg-white p-5 rounded-lg border border-slate-200">Active<div className="text-2xl font-bold">{activeUsers}</div></div>
              <div className="bg-white p-5 rounded-lg border border-slate-200">Blocked<div className="text-2xl font-bold text-red-500">{blockedUsers}</div></div>
            </div>
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr>
                  <th className="bg-slate-100 text-left py-3 px-5 text-xs uppercase text-slate-500">User</th>
                  <th className="bg-slate-100 text-left py-3 px-5 text-xs uppercase text-slate-500">Role</th>
                  <th className="bg-slate-100 text-left py-3 px-5 text-xs uppercase text-slate-500">Status</th>
                  <th className="bg-slate-100 text-left py-3 px-5 text-xs uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-200">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2">
                        <img src={u.avatar_url || `${DEFAULT_AVATAR_URL}${encodeURIComponent(u.full_name || 'U')}`} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                        <div>
                          <div className="font-semibold text-sm">{u.full_name || 'No Name'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-sm">{u.role}</td>
                    <td className="py-3 px-5 text-sm">{u.is_blocked ? <span className="text-red-500">Blocked</span> : <span className="text-emerald-600">Active</span>}</td>
                    <td className="py-3 px-5">
                      <button onClick={() => toggleBlock(u.id, !u.is_blocked)} className="py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-50">
                        {u.is_blocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {section === 'events' && (
          <>
            <div className="flex justify-between items-center mb-5">
              <h2 className="m-0">Global Event Monitor</h2>
              <button onClick={loadData} className="py-2 px-4 bg-transparent border-none text-slate-500 cursor-pointer hover:bg-slate-100 rounded-lg text-sm font-medium">Refresh</button>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 mb-5 flex gap-4 items-end flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Filter by Facilitator</label>
                <input type="text" value={facFilter} onChange={(e) => setFacFilter(e.target.value)} placeholder="Search name..." className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 box-border" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Filter by Date</label>
                <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-600 box-border" />
              </div>
              <button onClick={() => { setFacFilter(''); setDateFilter(''); }} className="py-2.5 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-50">Reset</button>
            </div>
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr>
                  <th className="bg-slate-100 text-left py-3 px-5 text-xs uppercase text-slate-500">Event</th>
                  <th className="bg-slate-100 text-left py-3 px-5 text-xs uppercase text-slate-500">Dates</th>
                  <th className="bg-slate-100 text-left py-3 px-5 text-xs uppercase text-slate-500">Organizer</th>
                  <th className="bg-slate-100 text-left py-3 px-5 text-xs uppercase text-slate-500">Visibility</th>
                  <th className="bg-slate-100 text-left py-3 px-5 text-xs uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((e) => (
                  <tr key={e.id} className="border-b border-slate-200">
                    <td className="py-3 px-5 font-medium text-sm">{e.title}</td>
                    <td className="py-3 px-5 text-sm text-slate-500">
                      {new Date(e.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(e.end_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 px-5 text-sm">{e.organizer}</td>
                    <td className="py-3 px-5 text-sm">
                      {e.is_hidden ? (
                        <span className="text-xs uppercase font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded border border-slate-200">Hidden</span>
                      ) : (
                        <span className="text-xs uppercase font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200">Visible</span>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <button onClick={() => toggleVisibility(e.id, e.is_hidden)} className="py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-50">
                        {e.is_hidden ? 'Unhide' : 'Hide'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Event Card
   ═══════════════════════════════════════════ */
const EventCard: React.FC<{
  event: DashboardEvent;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ event, onEdit, onDelete }) => {
  const start = new Date(event.start_time);
  const loc = event.location_type === 'Online' ? 'Online' : `${event.city || ''}, ${event.country || ''}`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-md hover:border-gray-300">
      <div className="w-full pt-[56.25%] relative bg-gradient-to-br from-slate-50 to-gray-100 border-b border-slate-50">
        {event.image_url && <img src={event.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />}
      </div>
      <div className="p-3.5 flex-1 flex flex-col">
        <h3 className="text-[0.95rem] font-semibold m-0 mb-2 leading-snug">{event.title}</h3>
        <div className="flex flex-col gap-1.5 text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-2"><Calendar size={12} />{start.toLocaleDateString()} at {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="flex items-center gap-2"><MapPin size={12} />{loc}</div>
        </div>
        <div className="mt-2">
          {event.status === 'draft' ? (
            <span className="text-[0.65rem] uppercase font-bold bg-orange-50 text-orange-700 px-2 py-1 rounded border border-orange-200">Draft</span>
          ) : (
            <span className="text-[0.65rem] uppercase font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200">Published</span>
          )}
        </div>
      </div>
      <div className="mt-auto flex gap-2 border-t border-slate-50 py-3 px-3.5 items-center bg-[#fafafa]">
        <button onClick={onEdit} className="flex-1 py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-50">Edit Details</button>
        <button onClick={onDelete} className="p-1.5 border border-slate-200 rounded-lg cursor-pointer text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 bg-transparent">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Resource Card (Dashboard)
   ═══════════════════════════════════════════ */
const DashResourceCard: React.FC<{
  resource: DashboardResource;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ resource, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-md">
    <div className="w-full pt-[56.25%] relative bg-gradient-to-br from-slate-50 to-gray-100 border-b border-slate-50">
      {resource.image_url && <img src={resource.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />}
    </div>
    <div className="p-3.5 flex-1 flex flex-col">
      <div className="mb-2"><span className="text-[0.65rem] uppercase font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-200">{resource.category}</span></div>
      <h3 className="text-[0.95rem] font-semibold m-0 mb-2 leading-snug">{resource.title}</h3>
      <p className="text-sm text-slate-500 line-clamp-2 overflow-hidden">{resource.description || ''}</p>
    </div>
    <div className="mt-auto flex gap-2 border-t border-slate-50 py-3 px-3.5 items-center bg-[#fafafa]">
      <button onClick={onEdit} className="flex-1 py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-50">Edit</button>
      {resource.link && (
        <a href={resource.link} target="_blank" rel="noopener noreferrer" className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 bg-transparent no-underline">
          <ExternalLink size={16} />
        </a>
      )}
      <button onClick={onDelete} className="p-1.5 border border-slate-200 rounded-lg cursor-pointer text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 bg-transparent">
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   Main Dashboard Page
   ═══════════════════════════════════════════ */
const DashboardPage: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tab, setTab] = useState<'events' | 'resources'>('events');
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [resources, setResources] = useState<DashboardResource[]>([]);
  const [allProfiles, setAllProfiles] = useState<{ id: string; full_name: string; avatar_url: string | null }[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [eventDrawerOpen, setEventDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<DashboardEvent | null>(null);
  const [resourceDrawerOpen, setResourceDrawerOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<DashboardResource | null>(null);

  const [showAdmin, setShowAdmin] = useState(false);

  const { show: showToast, ToastContainer } = useToast();

  const userName = profile?.fullName || 'User';
  const userAvatar = profile?.avatarUrl || `${DEFAULT_AVATAR_URL}${encodeURIComponent(userName)}`;
  const isAdmin = profile?.role === 'admin';

  // Auto-open event drawer if action=new-event
  useEffect(() => {
    if (searchParams.get('action') === 'new-event') {
      setEventDrawerOpen(true);
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams]);

  // Load events
  const loadEvents = useCallback(async () => {
    if (!user) return;
    setLoadingEvents(true);
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_hidden', false)
      .order('start_time', { ascending: true });
    setEvents((data ?? []) as DashboardEvent[]);
    setLoadingEvents(false);
  }, [user]);

  // Load resources
  const loadResources = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('resources')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setResources((data ?? []) as DashboardResource[]);
  }, [user]);

  // Load profiles for co-facilitator autocomplete
  const loadProfiles = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('id, full_name, avatar_url');
    if (data) setAllProfiles(data.filter((p) => p.id !== user.id));
  }, [user]);

  useEffect(() => { loadEvents(); loadResources(); loadProfiles(); }, [loadEvents, loadResources, loadProfiles]);

  // Save event
  const saveEvent = async (payload: Partial<DashboardEvent>, status: string) => {
    if (!user) return;
    const { id, ...data } = payload;
    const finalPayload = { ...data, organizer: userName, user_id: user.id, status };

    if (id) {
      const { error } = await supabase.from('events').update(finalPayload).eq('id', id);
      if (error) { showToast(error.message, 'error'); return; }
    } else {
      const { error } = await supabase.from('events').insert([finalPayload]);
      if (error) { showToast(error.message, 'error'); return; }
    }

    showToast('Event Saved!');
    setEventDrawerOpen(false);
    setEditingEvent(null);
    loadEvents();
  };

  // Delete event (soft delete via is_hidden)
  const deleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to remove this event?')) return;
    const { error } = await supabase.from('events').update({ is_hidden: true }).eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Event removed'); loadEvents(); }
  };

  // Save resource
  const saveResource = async (payload: Partial<DashboardResource>) => {
    if (!user) return;
    const { id, ...data } = payload;
    const finalPayload = { ...data, user_id: user.id };

    if (id) {
      const { error } = await supabase.from('resources').update(finalPayload).eq('id', id);
      if (error) { showToast(error.message, 'error'); return; }
    } else {
      const { error } = await supabase.from('resources').insert([finalPayload]);
      if (error) { showToast(error.message, 'error'); return; }
    }

    showToast('Resource Published!');
    setResourceDrawerOpen(false);
    setEditingResource(null);
    loadResources();
  };

  // Delete resource
  const deleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Resource deleted'); loadResources(); }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Split events into upcoming/past
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.start_time) >= now || e.status === 'draft');
  const past = events.filter((e) => new Date(e.start_time) < now && e.status !== 'draft');

  if (showAdmin) {
    return (
      <>
        <AdminPanel onExit={() => setShowAdmin(false)} toast={showToast} />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1200px] mx-auto py-10 px-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-5 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <img src="https://vlrbeemaxxdqiczdxomd.supabase.co/storage/v1/object/public/Assets/LOGO2%20UPWC@4x.png" alt="UPWC Logo" className="h-[88px] w-auto object-contain" />
            <div>
              <h1 className="m-0 text-xl font-semibold tracking-tight">{greeting(userName)}</h1>
              <p className="m-0 mt-0.5 text-sm text-slate-500">Manage your events and resources.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button onClick={() => setShowAdmin(true)} className="py-2 px-4 border border-indigo-600 text-indigo-600 bg-indigo-50 rounded-lg font-semibold text-sm cursor-pointer hover:bg-indigo-600 hover:text-white transition-colors">
                <Shield size={14} className="inline mr-1" /> Admin Dashboard
              </button>
            )}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full cursor-default border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-sm transition-all">
              <img src={userAvatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
              <span className="text-sm font-semibold">{userName}</span>
            </div>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <button onClick={handleLogout} title="Sign Out" className="p-2 bg-transparent border-none cursor-pointer text-slate-500 hover:bg-slate-100 rounded-lg">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 mb-6">
          <button
            onClick={() => setTab('events')}
            className={`py-2.5 px-4 text-[0.95rem] font-semibold cursor-pointer border-none bg-transparent border-b-2 transition-all ${
              tab === 'events' ? 'text-indigo-600 border-b-indigo-600' : 'text-slate-500 border-b-transparent hover:text-slate-900 hover:bg-slate-200 rounded-t-md'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setTab('resources')}
            className={`py-2.5 px-4 text-[0.95rem] font-semibold cursor-pointer border-none bg-transparent border-b-2 transition-all ${
              tab === 'resources' ? 'text-indigo-600 border-b-indigo-600' : 'text-slate-500 border-b-transparent hover:text-slate-900 hover:bg-slate-200 rounded-t-md'
            }`}
          >
            Resources
          </button>
        </div>

        {/* Action button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              if (tab === 'events') { setEditingEvent(null); setEventDrawerOpen(true); }
              else { setEditingResource(null); setResourceDrawerOpen(true); }
            }}
            className="inline-flex items-center gap-2 py-2.5 px-4 bg-indigo-600 text-white border-none rounded-lg text-sm font-medium cursor-pointer hover:bg-indigo-700 shadow-sm"
          >
            <Plus size={18} />
            {tab === 'events' ? 'Create New Event' : 'Add Resource'}
          </button>
        </div>

        {/* Events View */}
        {tab === 'events' && (
          <>
            {loadingEvents ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-[220px] rounded-xl bg-white border border-slate-200 animate-pulse" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <h3 className="m-0 mb-2 text-slate-900">No events found</h3>
                <p>Get started by creating your first workshop or retreat.</p>
                <button onClick={() => { setEditingEvent(null); setEventDrawerOpen(true); }} className="mt-3 py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-50">Create Event</button>
              </div>
            ) : (
              <>
                {upcoming.length > 0 && (
                  <>
                    <div className="flex items-center gap-2.5 text-lg font-semibold mb-4 mt-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Upcoming
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 mb-8">
                      {upcoming.map((e) => (
                        <EventCard key={e.id} event={e} onEdit={() => { setEditingEvent(e); setEventDrawerOpen(true); }} onDelete={() => deleteEvent(e.id)} />
                      ))}
                    </div>
                  </>
                )}
                {past.length > 0 && (
                  <>
                    <div className="flex items-center gap-2.5 text-lg font-semibold mb-4 mt-10">
                      <span className="w-2 h-2 bg-slate-400 rounded-full" /> Past Events
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
                      {past.map((e) => (
                        <EventCard key={e.id} event={e} onEdit={() => { setEditingEvent(e); setEventDrawerOpen(true); }} onDelete={() => deleteEvent(e.id)} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* Resources View */}
        {tab === 'resources' && (
          <>
            {resources.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <h3 className="m-0 mb-2 text-slate-900">No resources found</h3>
                <p>Share knowledge with your community.</p>
                <button onClick={() => { setEditingResource(null); setResourceDrawerOpen(true); }} className="mt-3 py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-50">Add Resource</button>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
                {resources.map((r) => (
                  <DashResourceCard key={r.id} resource={r} onEdit={() => { setEditingResource(r); setResourceDrawerOpen(true); }} onDelete={() => deleteResource(r.id)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Drawers */}
      <EventDrawer
        open={eventDrawerOpen}
        event={editingEvent}
        onClose={() => { setEventDrawerOpen(false); setEditingEvent(null); }}
        onSave={saveEvent}
        allProfiles={allProfiles}
        userName={userName}
        userAvatar={userAvatar}
      />
      <ResourceDrawer
        open={resourceDrawerOpen}
        resource={editingResource}
        onClose={() => { setResourceDrawerOpen(false); setEditingResource(null); }}
        onSave={saveResource}
      />

      <ToastContainer />
    </div>
  );
};

export { DashboardPage };
