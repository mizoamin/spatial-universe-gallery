
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search as SearchIcon, 
  Globe, 
  Trophy, 
  Dna, 
  Tv, 
  ArrowRight, 
  Heart, 
  Zap, 
  Star,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { ArchiveItem, ManifestEntry } from '../types';

const Archive: React.FC = () => {
  const [data, setData] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [hearts, setHearts] = useState<Set<string>>(new Set());

  const USER = 'mizoamin';
  const REPO = 'mizo-assets-media-1';
  const DATA_URL = `https://raw.githubusercontent.com/${USER}/${REPO}/main/assets_manifest_v8.json`;

  useEffect(() => {
    const saved = localStorage.getItem('mizo_hearts_v2');
    if (saved) setHearts(new Set(JSON.parse(saved)));

    fetch(DATA_URL)
      .then(res => res.json())
      .then(json => {
        const items = Object.entries(json).map(([key, value]: [string, any]) => {
          const entry = value as ManifestEntry;
          const rawPath = entry.path.replace('/content/drive/MyDrive/mizo_production_assets/', '');
          const encodedPath = rawPath.split('/').map(p => encodeURIComponent(p)).join('/');
          return {
            id: key,
            url: `https://raw.githubusercontent.com/${USER}/${REPO}/main/${encodedPath}`,
            title: entry.data.Title || 'Untitled Moment',
            year: entry.data.Year || 'Archival',
            tags: entry.data.Tags || []
          };
        });
        setData(items);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleHeart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHearts = new Set(hearts);
    if (newHearts.has(id)) newHearts.delete(id);
    else newHearts.add(id);
    setHearts(newHearts);
    localStorage.setItem('mizo_hearts_v2', JSON.stringify(Array.from(newHearts)));
  };

  const filtered = useMemo(() => {
    return data.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.year.toString().includes(searchTerm) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm]);

  // Featured: Only images that have been "Hearted"
  const featured = useMemo(() => {
    return data.filter(item => hearts.has(item.id));
  }, [data, hearts]);

  return (
    <div className="relative min-h-screen pb-40 z-10 animate-[bigBang_1.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      
      {/* Spatial Header */}
      <header className="relative pt-32 px-6 md:px-12 mb-24 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-8">
               <span className="h-px w-20 bg-[#8A2BE2] block"></span>
               <span className="text-[#8A2BE2] font-black tracking-[0.5em] text-[10px] uppercase">
                 The Architect's Dimension
               </span>
            </div>
            <h1 className="text-impact text-7xl md:text-[10rem] transition-all duration-1000">
              MIZO <br /> <span className="outline-text">ARCHIVE</span>
            </h1>
          </div>
          
          <div className="lg:w-1/3 space-y-8 glass p-8 rounded-[2rem]">
             <p className="text-zinc-400 text-sm leading-relaxed tracking-wide">
               A high-fidelity spatial repository documenting the visionary journey of Mizo Amin. 
               Mapping the intersections of professional legacy and future computing.
             </p>
             <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <div>
                   <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Records</p>
                   <p className="text-3xl font-black text-white">{data.length}</p>
                </div>
                <div className="w-[1px] h-10 bg-zinc-800"></div>
                <div>
                   <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Curation</p>
                   <p className="text-3xl font-black text-[#8A2BE2]">{hearts.size}</p>
                </div>
                <div className="w-[1px] h-10 bg-zinc-800"></div>
                <div className="p-3 bg-white/5 rounded-full">
                   <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Universe Navigation Planets */}
      <nav className="px-6 md:px-12 mb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <PlanetCard 
            icon={<Dna className="w-6 h-6 animate-dna text-indigo-400" />}
            title="Timeline"
            subtitle="The DNA Sequence"
            color="border-indigo-500/20"
            accentColor="#818cf8"
          />
          <PlanetCard 
            icon={<Trophy className="w-6 h-6 text-[#8A2BE2]" />}
            title="Legacy"
            subtitle="Basketball Career"
            color="border-purple-500/20"
            accentColor="#8A2BE2"
            onClick={() => window.open('https://mizoamin.com/basketball', '_blank')}
          />
          <PlanetCard 
            icon={<Globe className="w-6 h-6 text-blue-500 animate-pulse" />}
            title="World Map"
            subtitle="Global Exploration"
            color="border-blue-500/20"
            accentColor="#3b82f6"
            onClick={() => window.open('https://mizoamin.com/travel', '_blank')}
          />
          <PlanetCard 
            icon={<Tv className="w-6 h-6 text-emerald-400" />}
            title="Press"
            subtitle="Media & Interviews"
            color="border-emerald-500/20"
            accentColor="#34d399"
            onClick={() => window.open('https://mizoamin.com/press', '_blank')}
          />
        </div>
      </nav>

      {/* Featured Highlights (Curated) */}
      {featured.length > 0 && !searchTerm && (
        <section className="mb-32">
          <div className="px-6 md:px-12 max-w-7xl mx-auto flex items-center gap-6 mb-12">
            <Star className="w-5 h-5 text-[#8A2BE2] fill-[#8A2BE2]" />
            <h2 className="text-impact text-3xl tracking-widest text-zinc-300">
              Curated <span className="text-white">Universe</span>
            </h2>
            <div className="h-[1px] flex-1 bg-zinc-900"></div>
          </div>
          <div className="flex gap-8 overflow-x-auto pb-12 px-6 md:px-12 snap-x no-scrollbar">
            {featured.map(item => (
              <div key={`feat-${item.id}`} className="min-w-[320px] md:min-w-[500px] aspect-[16/10] snap-center relative group overflow-hidden rounded-[2.5rem] bg-zinc-900/40 border border-white/5 shadow-2xl">
                <img src={item.url} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt={item.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-10">
                   <span className="text-[#8A2BE2] text-[10px] font-black uppercase tracking-[0.4em] mb-3">{item.year}</span>
                   <h3 className="text-3xl font-bold text-white mb-4 leading-tight">{item.title}</h3>
                   <button className="flex items-center gap-2 text-xs font-bold text-zinc-400 group-hover:text-white transition-colors">
                      VIEW RECORD <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Archival Matrix */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-16">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                 <MapPin className="w-4 h-4 text-[#8A2BE2]" />
              </div>
              <div>
                 <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Records Database</h2>
                 <p className="text-[10px] text-zinc-600 font-bold">Querying the Mizo-Verse...</p>
              </div>
           </div>
        </div>

        {loading ? (
          <div className="masonry-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="masonry-item h-80 bg-zinc-900/20 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-40 text-center glass rounded-[3rem] p-16 max-w-2xl mx-auto border-dashed">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
               <SearchIcon className="w-6 h-6 text-zinc-700" />
            </div>
            <h3 className="text-4xl font-black text-zinc-800 mb-4 uppercase">Null Result</h3>
            <p className="text-zinc-500 text-sm">The dimension requested does not exist in the current archive manifest.</p>
            <button 
              onClick={() => setSearchTerm('')} 
              className="mt-10 px-8 py-3 bg-zinc-800 rounded-full text-[10px] font-black tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all"
            >
              Reset Dimension
            </button>
          </div>
        ) : (
          <div className="masonry-grid">
            {filtered.map((item, idx) => (
              <div 
                key={item.id} 
                className="masonry-item group relative overflow-hidden rounded-[2rem] bg-zinc-900/40 border border-white/5 hover:border-white/20 transition-all duration-700 hover:translate-y-[-12px] shadow-2xl"
              >
                <div className="relative overflow-hidden aspect-auto">
                  <img 
                    src={item.url} 
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-auto block grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 brightness-90" 
                  />
                  
                  {/* Spatial Action Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                     <button 
                      onClick={(e) => toggleHeart(item.id, e)}
                      className="w-12 h-12 glass rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all delay-75"
                    >
                      <Heart className={`w-5 h-5 ${hearts.has(item.id) ? 'fill-[#8A2BE2] text-[#8A2BE2]' : 'text-white'}`} />
                     </button>
                     <button className="w-12 h-12 glass rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all delay-150">
                        <ArrowRight className="w-5 h-5 text-white" />
                     </button>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-zinc-200 leading-tight pr-6">{item.title}</h4>
                    <span className="text-[10px] font-black text-zinc-600 px-3 py-1 border border-zinc-800 rounded-lg">{item.year}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[9px] uppercase font-bold text-zinc-600 hover:text-[#8A2BE2] transition-colors cursor-pointer">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Spatial Command Bar */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-[90%] md:w-[700px] z-[500]">
        <div className="glass px-8 py-6 rounded-full flex items-center shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] border-white/10 group">
          <SearchIcon className="text-[#8A2BE2] w-6 h-6 mr-6" />
          <input 
            type="text" 
            placeholder="Search titles, eras, or categories..."
            className="bg-transparent border-none outline-none text-white w-full placeholder:text-zinc-700 font-bold text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="hidden lg:flex items-center gap-3 ml-6 opacity-30">
             <div className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-tighter">Enter</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bigBang {
          0% { transform: scale(0.95); opacity: 0; filter: blur(40px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

interface PlanetCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  accentColor: string;
  onClick?: () => void;
}

const PlanetCard: React.FC<PlanetCardProps> = ({ icon, title, subtitle, color, accentColor, onClick }) => (
  <div 
    onClick={onClick}
    style={{ '--accent-color': accentColor } as React.CSSProperties}
    className={`group relative p-10 rounded-[3rem] border ${color} bg-zinc-950/40 hover:bg-zinc-900 transition-all duration-700 cursor-pointer overflow-hidden transform hover:scale-105 hover:translate-y-[-10px]`}
  >
    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:opacity-100 transition-colors" style={{ backgroundColor: `${accentColor}10` }}></div>
    <div className="mb-8 w-16 h-16 rounded-2xl glass flex items-center justify-center transition-transform duration-700 group-hover:rotate-12">
      {icon}
    </div>
    <div className="relative z-10 space-y-2">
      <h4 className="text-3xl font-black text-white transition-colors tracking-tighter">
          {/* Use Tailwind arbitrary value with CSS variable for dynamic hover color */}
          <span className="group-hover:text-[var(--accent-color)] transition-colors">
            {title}
          </span>
      </h4>
      <p className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-600 group-hover:text-zinc-400">
        {subtitle}
      </p>
    </div>
    <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-all translate-x-10 group-hover:translate-x-0">
      <ArrowRight className="w-6 h-6 text-white" />
    </div>
  </div>
);

export default Archive;
