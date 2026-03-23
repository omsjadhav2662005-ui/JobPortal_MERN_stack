import { useState, useCallback, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { getCategoryImage } from '../utils/helpers';

const TYPES  = ['All','Full Time','Part Time','Remote','Internship','Contract'];
const CATS   = ['All','Technology','Design','Marketing','Finance','Operations','Sales','HR'];
const LEVELS = ['All','Entry Level','Mid Level','Senior Level','Lead','Manager'];

const CAT_ICONS = {
  Technology:'fa-laptop-code', Design:'fa-palette', Marketing:'fa-bullhorn',
  Finance:'fa-chart-line', Operations:'fa-cogs', Sales:'fa-handshake',
  HR:'fa-users', Other:'fa-briefcase'
};

export default function Home() {
  const { jobs, loading, jobMeta, fetchJobs } = useData();
  const navigate = useNavigate();
  const [search, setSearch]   = useState('');
  const [location, setLoc]    = useState('');
  const [type, setType]       = useState('All');
  const [cat, setCat]         = useState('All');
  const [level, setLevel]     = useState('All');
  const [sort, setSort]       = useState('recent');
  const [page, setPage]       = useState(1);
  const [showCategories, setShowCats] = useState(true);

  const doSearch = useCallback((overrides={}) => {
    const p = { page:1, sort, ...(search&&{search}), ...(location&&{location}), ...(type!=='All'&&{type}), ...(cat!=='All'&&{category:cat}), ...(level!=='All'&&{level}), ...overrides };
    setPage(1); fetchJobs(p);
  }, [search, location, type, cat, level, sort, fetchJobs]);

  const goToPage = (p) => {
    if (p < 1 || p > jobMeta.pages) return;
    setPage(p);
    fetchJobs({ page:p, sort, ...(search&&{search}), ...(location&&{location}), ...(type!=='All'&&{type}), ...(cat!=='All'&&{category:cat}), ...(level!=='All'&&{level}) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const reset    = () => { setSearch(''); setLoc(''); setType('All'); setCat('All'); setLevel('All'); setSort('recent'); fetchJobs({}); };

  const handleCatClick = (c) => { setCat(c); setShowCats(false); doSearch({ category:c }); };

  return (
    <div>
      {/* Hero section with background image */}
      <section className="relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80" alt="hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/75"></div>
        <div className="relative py-20 px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
              Find Your Dream <span className="text-yellow-300">Career</span>
            </h1>
            <p className="text-blue-100 text-lg mb-8">Search thousands of jobs from top companies worldwide</p>

            {/* Search box */}
            <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl max-w-3xl mx-auto">
              <div className="flex items-center gap-2 flex-1 px-3 py-1">
                <i className="fas fa-search text-gray-400"></i>
                <input className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-sm" placeholder="Job title, skill, keyword..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doSearch()} />
                {search && <button onClick={()=>setSearch('')} className="text-gray-300 hover:text-gray-500"><i className="fas fa-times text-xs"></i></button>}
              </div>
              <div className="flex items-center gap-2 sm:border-l border-gray-200 px-3 py-1">
                <i className="fas fa-map-pin text-gray-400"></i>
                <input className="outline-none text-gray-800 placeholder-gray-400 text-sm w-32" placeholder="Location..." value={location} onChange={e=>setLoc(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doSearch()} />
              </div>
              <button onClick={()=>doSearch()} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition text-sm">Search Jobs</button>
            </div>

            {/* Quick stats */}
            <div className="flex justify-center gap-8 mt-8 flex-wrap">
              {[['fa-briefcase',jobMeta.total+'+ Jobs'],['fa-building','9+ Companies'],['fa-map-marker-alt','Global Locations']].map(([ic,txt])=>(
                <div key={txt} className="flex items-center gap-2 text-blue-100 text-sm"><i className={`fas ${ic}`}></i>{txt}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category visual cards */}
      {showCategories && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATS.filter(c=>c!=='All').map(c=>(
              <button key={c} onClick={()=>handleCatClick(c)} className="group relative rounded-2xl overflow-hidden aspect-square hover:shadow-lg transition-all">
                <img src={getCategoryImage(c)} alt={c} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" onError={e=>{e.target.style.background='#EEF2FF';e.target.style.display='none';}} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10 group-hover:from-blue-900/80 transition-all"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <i className={`fas ${CAT_ICONS[c]} text-xl mb-1`}></i>
                  <span className="text-xs font-bold">{c}</span>
                  <span className="text-xs text-white/70">{jobs.filter(j=>j.category===c).length} jobs</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sticky filter bar */}
      <div className="bg-white border-y border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-2 items-center">
          {TYPES.map(t=>(
            <button key={t} onClick={()=>{ setType(t); doSearch({ type:t==='All'?undefined:t }); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${type===t?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t}</button>
          ))}
          <div className="h-5 w-px bg-gray-200 mx-1 hidden sm:block"></div>
          <select value={cat} onChange={e=>{ setCat(e.target.value); doSearch({ category:e.target.value==='All'?undefined:e.target.value }); }} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            {CATS.map(c=><option key={c}>{c}</option>)}
          </select>
          <select value={level} onChange={e=>{ setLevel(e.target.value); doSearch({ level:e.target.value==='All'?undefined:e.target.value }); }} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            {LEVELS.map(l=><option key={l}>{l}</option>)}
          </select>
          <select value={sort} onChange={e=>{ setSort(e.target.value); doSearch({ sort:e.target.value }); }} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="salary">Highest Salary</option>
          </select>
          {(search||location||type!=='All'||cat!=='All') && (
            <button onClick={reset} className="text-xs text-red-500 hover:text-red-700 px-2 py-1.5 rounded-lg hover:bg-red-50 transition flex items-center gap-1"><i className="fas fa-times"></i>Clear all</button>
          )}
          <span className="ml-auto text-xs text-gray-500 hidden sm:block">{jobMeta.total} jobs found</span>
        </div>
      </div>

      {/* Job grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_,i)=>(
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-28 bg-gray-200"></div>
                <div className="p-4"><div className="flex gap-3 mb-3"><div className="w-11 h-11 bg-gray-200 rounded-xl -mt-5"></div><div className="flex-1 pt-2"><div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div><div className="h-3 bg-gray-100 rounded w-1/2"></div></div></div><div className="h-3 bg-gray-100 rounded w-full mb-2"></div><div className="h-3 bg-gray-100 rounded w-2/3"></div></div>
              </div>
            ))}
          </div>
        ) : jobs.length===0 ? (
          <div className="text-center py-20">
            <i className="fas fa-search text-gray-200 text-5xl mb-4 block"></i>
            <h3 className="text-xl font-bold text-gray-500 mb-2">No jobs found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
            <button onClick={reset} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition">Clear filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map(job=><JobCard key={job._id} job={job} />)}
            </div>
            {/* Pagination */}
            {jobMeta.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                {/* Previous */}
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  <i className="fas fa-chevron-left text-xs"></i> Previous
                </button>

                {/* Page numbers */}
                {Array.from({ length: jobMeta.pages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === jobMeta.pages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '...'
                      ? <span key={`dot-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                      : <button
                          key={p}
                          onClick={() => goToPage(p)}
                          className={`w-10 h-10 rounded-xl text-sm font-bold transition
                            ${page === p
                              ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                              : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                          {p}
                        </button>
                  )}

                {/* Next */}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === jobMeta.pages}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  Next <i className="fas fa-chevron-right text-xs"></i>
                </button>
              </div>
            )}
            {/* Page info */}
            {jobMeta.pages > 1 && (
              <p className="text-center text-xs text-gray-400 mt-3">
                Page {page} of {jobMeta.pages} · {jobMeta.total} jobs total
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}