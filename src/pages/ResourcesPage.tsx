import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, User, Heart, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Resource {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  author: string | null;
  category: string | null;
  link: string | null;
  created_at: string;
}

const STORAGE_KEY = 'upwc_saved_resources';

const loadSavedIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set((JSON.parse(raw) as string[]).map(String));
  } catch {
    return new Set();
  }
};

const persistSavedIds = (ids: Set<string>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
};

/* ─── Skeleton Card ─── */
const SkeletonCard: React.FC = () => (
  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col min-h-[420px]">
    <div className="h-[180px] w-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
    <div className="p-5 flex flex-col flex-grow gap-3">
      <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
      <div className="h-4 w-2/5 bg-slate-200 rounded animate-pulse" />
      <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
      <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
      <div className="h-3 w-4/5 bg-slate-200 rounded animate-pulse" />
      <div className="mt-auto h-10 w-full bg-slate-200 rounded-lg animate-pulse" />
    </div>
  </div>
);

/* ─── Resource Card ─── */
const ResourceCard: React.FC<{
  resource: Resource;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpen: () => void;
}> = ({ resource, isSaved, onToggleSave, onOpen }) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave(String(resource.id));
  };

  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300"
      onClick={onOpen}
    >
      <div className="w-full h-[180px] relative bg-gradient-to-br from-sky-100 to-slate-100 border-b border-slate-200">
        {resource.image_url ? (
          <img src={resource.image_url} alt={resource.title} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#9cbce2] font-bold text-lg opacity-80">
            Resource
          </span>
        )}
        {resource.category && (
          <span className="absolute top-3 left-3 bg-white/95 text-[#5c8ab9] px-3 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider shadow-sm">
            {resource.category}
          </span>
        )}
        <button
          onClick={handleSaveClick}
          title="Save Resource"
          className={`absolute top-2.5 right-2.5 bg-white/90 border-none rounded-full w-9 h-9 flex items-center justify-center cursor-pointer shadow-md transition-all duration-200 z-10 ${
            isSaved ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:text-red-500 hover:bg-white'
          } hover:scale-110`}
        >
          <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="m-0 mb-2.5 text-lg font-bold leading-tight text-slate-900">{resource.title}</h3>
        <p className="text-sm text-slate-500 mb-3 flex items-center gap-1.5">
          <User size={14} />
          <strong>{resource.author || 'Unknown'}</strong>
        </p>
        <p className="text-sm leading-relaxed text-slate-600 mb-5 flex-grow">
          {resource.description ? resource.description.substring(0, 100) + '...' : 'No description provided.'}
        </p>
        <div className="mt-auto text-center py-2.5 px-3.5 text-[0.95rem] bg-[#9cbce2] text-white rounded-lg font-bold transition-all hover:bg-[#8baad1]">
          View Details
        </div>
      </div>
    </div>
  );
};

/* ─── Detail Modal ─── */
const ResourceModal: React.FC<{
  resource: Resource | null;
  onClose: () => void;
}> = ({ resource, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (resource) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [resource, onClose]);

  if (!resource) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[2000] flex items-center justify-center p-5"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl max-w-[600px] w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/90 border-none rounded-full w-9 h-9 cursor-pointer flex items-center justify-center text-slate-900 font-bold shadow-md transition-all hover:bg-slate-200 hover:scale-105 z-10"
        >
          <X size={18} />
        </button>
        {resource.image_url ? (
          <img src={resource.image_url} alt={resource.title} className="w-full h-[250px] object-cover" />
        ) : (
          <div className="w-full h-[250px] bg-sky-100 flex items-center justify-center text-[#9cbce2] text-2xl font-bold">
            Resource Details
          </div>
        )}
        <div className="p-8">
          <h2 className="m-0 mb-4 text-3xl text-slate-900 leading-tight">{resource.title}</h2>
          <div className="flex items-center gap-2 text-[0.95rem] text-slate-500 mb-6 pb-4 border-b border-slate-200 w-full">
            {resource.category && (
              <span className="bg-slate-100 px-2.5 py-1 rounded-md font-semibold text-[#5c8ab9] text-sm">
                {resource.category}
              </span>
            )}
            <span>
              By <strong>{resource.author || 'Unknown'}</strong>
            </span>
          </div>
          <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-wrap mb-8">
            {resource.description || 'No detailed description provided.'}
          </p>
          {resource.link && (
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-3 px-8 bg-[#9cbce2] text-white rounded-lg font-bold transition-all hover:bg-[#8baad1] hover:shadow-lg no-underline"
            >
              Access Full Resource Here
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Author Autocomplete ─── */
const AuthorInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  authors: string[];
}> = ({ value, onChange, authors }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    if (!value) return [];
    return authors.filter((a) => a.toLowerCase().includes(value.toLowerCase()));
  }, [value, authors]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="flex-1 min-w-[200px] relative" ref={wrapperRef}>
      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => value && setShowSuggestions(true)}
        placeholder="Search by Author..."
        autoComplete="off"
        className="w-full py-3 pl-10 pr-4 border border-slate-200 rounded-xl text-[0.95rem] bg-slate-50 transition-all focus:outline-none focus:border-[#9cbce2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(156,188,226,0.4)] box-border"
      />
      {showSuggestions && matches.length > 0 && (
        <ul className="absolute top-[calc(100%+5px)] left-0 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-[9999] max-h-[250px] overflow-y-auto m-0 p-2 list-none">
          {matches.map((author) => (
            <li
              key={author}
              onClick={() => {
                onChange(author);
                setShowSuggestions(false);
              }}
              className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer text-[0.95rem] rounded-md text-slate-900 transition-colors hover:bg-sky-50 hover:text-[#5c8ab9]"
            >
              <User size={16} className="text-slate-400" />
              {author}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ─── Main Page ─── */
const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [allAuthors, setAllAuthors] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [showingSavedOnly, setShowingSavedOnly] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(loadSavedIds);

  const [modalResource, setModalResource] = useState<Resource | null>(null);

  // Fetch filter metadata (categories + authors) once
  useEffect(() => {
    const fetchFilterData = async () => {
      const { data } = await supabase.from('resources').select('category, author');
      if (!data) return;

      const uniqueCats = [...new Set(data.map((r) => r.category).filter(Boolean))].slice(0, 3) as string[];
      setCategories(uniqueCats);

      const normalizedAuthors = new Map<string, string>();
      data
        .map((r) => r.author)
        .filter(Boolean)
        .forEach((author: string) => {
          const trimmed = author.trim();
          normalizedAuthors.set(trimmed.toLowerCase(), trimmed);
        });
      setAllAuthors(Array.from(normalizedAuthors.values()).sort());
    };
    fetchFilterData();
  }, []);

  // Fetch resources whenever filters change
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);

      if (showingSavedOnly && savedIds.size === 0) {
        setResources([]);
        setLoading(false);
        return;
      }

      let query = supabase.from('resources').select('*');

      if (searchTitle) query = query.ilike('title', `%${searchTitle}%`);
      if (searchAuthor) query = query.ilike('author', `%${searchAuthor}%`);

      if (showingSavedOnly) {
        query = query.in('id', [...savedIds].map(Number));
      } else if (activeCategory) {
        query = query.eq('category', activeCategory);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching resources:', error.message);
        setResources([]);
      } else {
        setResources(data ?? []);
      }
      setLoading(false);
    };

    const debounce = setTimeout(fetchResources, 300);
    return () => clearTimeout(debounce);
  }, [searchTitle, searchAuthor, activeCategory, showingSavedOnly, savedIds]);

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      persistSavedIds(next);
      return next;
    });
  }, []);

  const clearFilters = () => {
    setSearchTitle('');
    setSearchAuthor('');
    setActiveCategory('');
    setShowingSavedOnly(false);
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setShowingSavedOnly(false);
  };

  const handleSavedClick = () => {
    setShowingSavedOnly(true);
    setActiveCategory('');
  };

  const emptyMessage = showingSavedOnly
    ? "You haven't saved any resources yet. Click the heart icon on a resource to save it!"
    : 'Try adjusting your search terms or clearing the filters.';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <header className="bg-gradient-to-br from-sky-50 to-white border-b border-slate-200 py-16 px-5 overflow-hidden">
        <div className="max-w-[1200px] mx-auto flex items-center gap-16 max-lg:flex-col max-lg:text-center max-lg:gap-10">
          <div className="flex-[1.1]">
            <span className="inline-block px-4 py-1.5 bg-sky-100 text-[#5c8ab9] rounded-full text-sm font-bold uppercase tracking-wider mb-5">
              Knowledge Hub
            </span>
            <h1 className="m-0 mb-5 text-5xl font-extrabold tracking-tight text-slate-900 leading-tight max-lg:text-4xl">
              Resources Library
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-[95%] max-lg:max-w-full max-lg:mx-auto">
              Explore our curated collection of insights, tools, and practitioner materials designed to support your
              journey and understanding of the Three Principles.
            </p>
          </div>
          <div className="flex-[0.9] rounded-2xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] h-[400px] max-lg:w-full max-lg:max-w-[600px]">
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Bright Modern Library"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto py-12 px-5">
        {/* Category Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => handleCategoryClick('')}
            className={`px-6 py-2.5 rounded-full border font-semibold text-[0.95rem] cursor-pointer transition-all ${
              !showingSavedOnly && activeCategory === ''
                ? 'bg-[#9cbce2] text-white border-[#9cbce2] shadow-md'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-6 py-2.5 rounded-full border font-semibold text-[0.95rem] cursor-pointer transition-all ${
                !showingSavedOnly && activeCategory === cat
                  ? 'bg-[#9cbce2] text-white border-[#9cbce2] shadow-md'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={handleSavedClick}
            className={`px-6 py-2.5 rounded-full border font-semibold text-[0.95rem] cursor-pointer transition-all flex items-center gap-1.5 ${
              showingSavedOnly
                ? 'bg-red-500 text-white border-red-500 shadow-md'
                : 'text-red-500 border-red-100 bg-red-50 hover:bg-red-100 hover:text-red-500'
            }`}
          >
            <Heart size={16} fill={showingSavedOnly ? 'currentColor' : 'currentColor'} />
            Saved
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex gap-5 mb-10 flex-wrap items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="Search by Title..."
              className="w-full py-3 pl-10 pr-4 border border-slate-200 rounded-xl text-[0.95rem] bg-slate-50 transition-all focus:outline-none focus:border-[#9cbce2] focus:bg-white focus:shadow-[0_0_0_3px_rgba(156,188,226,0.4)] box-border"
            />
          </div>
          <AuthorInput value={searchAuthor} onChange={setSearchAuthor} authors={allAuthors} />
          <button
            onClick={clearFilters}
            className="py-3 px-5 bg-transparent text-[#5c8ab9] border border-slate-200 rounded-xl text-[0.95rem] font-semibold cursor-pointer transition-all hover:bg-sky-50 hover:border-[#9cbce2]"
          >
            Clear Filters
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-16 text-slate-500 col-span-full">
            <Search size={60} className="mx-auto mb-4 text-slate-300" />
            <h2 className="mb-2 text-slate-900 text-2xl">No resources found</h2>
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                isSaved={savedIds.has(String(resource.id))}
                onToggleSave={toggleSave}
                onOpen={() => setModalResource(resource)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      <ResourceModal resource={modalResource} onClose={() => setModalResource(null)} />
    </div>
  );
};

export { ResourcesPage };
