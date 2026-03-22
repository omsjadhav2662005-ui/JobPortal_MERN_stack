import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getCompanyLogo, getCompanyCover } from '../utils/helpers';

export default function Companies() {
  const { jobs, companies } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');

  const enriched = [...new Set(jobs.map(j=>j.company))].map(name => {
    const co = companies.find(c=>c.name===name);
    const count = jobs.filter(j=>j.company===name).length;
    const avg = co?.reviews?.length ? (co.reviews.reduce((s,r)=>s+r.rating,0)/co.reviews.length).toFixed(1) : null;
    return { name, count, tagline:co?.tagline||'', industry:co?.industry||'', avg, employees:co?.employees||'', founded:co?.founded||'' };
  }).filter(c => c.name.toLowerCase().includes(search.toLowerCase()) && (industry==='All'||c.industry===industry))
    .sort((a,b)=>b.count-a.count);

  const industries = ['All',...new Set(companies.map(c=>c.industry).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden mb-10">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80" alt="companies" className="w-full h-44 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/60 flex flex-col justify-center px-8">
          <h1 className="text-3xl font-black text-white">Top Companies Hiring Now</h1>
          <p className="text-blue-100 mt-1">Discover great workplaces and open opportunities</p>
        </div>
      </div>

      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 shadow-sm">
          <i className="fas fa-search text-gray-400 text-sm"></i>
          <input className="flex-1 py-3 outline-none text-sm" placeholder="Search companies..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" value={industry} onChange={e=>setIndustry(e.target.value)}>
          {industries.map(i=><option key={i}>{i}</option>)}
        </select>
      </div>

      {enriched.length === 0 ? (
        <div className="text-center py-20"><i className="fas fa-building text-gray-200 text-5xl mb-3 block"></i><p className="text-gray-400">No companies found</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enriched.map(c => (
            <div key={c.name} onClick={()=>navigate(`/company/${encodeURIComponent(c.name)}`)}
              className="bg-white rounded-2xl border border-gray-100 cursor-pointer hover:shadow-xl hover:border-blue-200 transition-all group">
              {/* Cover image */}
              <div className="relative h-32 overflow-hidden rounded-t-2xl">
                <img
                  src={getCompanyCover(c.name)}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e=>{e.target.style.background='#EEF2FF';e.target.style.display='none';}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                {c.industry && <span className="absolute bottom-2 right-2 text-xs bg-black/40 text-white backdrop-blur-sm px-2 py-0.5 rounded-lg font-medium">{c.industry}</span>}
              </div>

              {/* Body */}
              <div className="p-4">
                <div className="flex items-center gap-3 -mt-8 mb-3 relative z-10">
                  <img src={getCompanyLogo(c.name)} alt={c.name} className="w-12 h-12 rounded-xl border-2 border-white shadow-md" />
                  <div className="pt-3">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">{c.name}</h3>
                    {c.tagline && <p className="text-xs text-gray-500 italic line-clamp-1">{c.tagline}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-semibold"><i className="fas fa-briefcase mr-1"></i>{c.count} open</span>
                  {c.avg && <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-lg font-semibold">⭐ {c.avg}</span>}
                  {c.employees && <span className="text-xs text-gray-400"><i className="fas fa-users mr-1"></i>{c.employees}</span>}
                  {c.founded && <span className="text-xs text-gray-400"><i className="fas fa-calendar mr-1"></i>Est. {c.founded}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
