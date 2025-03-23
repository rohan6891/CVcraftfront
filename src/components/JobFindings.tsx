import React, { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';

interface SearchSite {
  name: string;
  icon: string;
  getSearchUrl: (jobTitle: string, skills: string[]) => string;
}

function App() {
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState('');

  const searchSites: SearchSite[] = [
    {
      name: 'LinkedIn Jobs',
      icon: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?auto=format&fit=crop&w=32&h=32&q=80',
      getSearchUrl: (jobTitle, skills) => {
        const keywords = [jobTitle, ...skills].join(' ');
        return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}`;
      }
    },
    {
      name: 'Indeed',
      icon: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=32&h=32&q=80',
      getSearchUrl: (jobTitle, skills) => {
        const keywords = [jobTitle, ...skills].join(' ');
        return ` https://www.indeed.com/jobs?q=${encodeURIComponent(keywords)}` ;
      }
    },
    {
      name: 'Glassdoor',
      icon: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=32&h=32&q=80',
      getSearchUrl: (jobTitle, skills) => {
        const keywords = [jobTitle, ...skills].join(' ');
        return `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(keywords)} `;
      }
    }
  ];

  const handleSearch = (site: SearchSite) => {
    if (!jobTitle.trim()) return;
    
    const skillsArray = skills.split(',').map(skill => skill.trim()).filter(Boolean);
    const searchUrl = site.getSearchUrl(jobTitle, skillsArray);
    window.open(searchUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Job Search Helper
          </h1>
          <p className="text-lg text-gray-600">
            Search job listings directly on popular platforms
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                id="jobTitle"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Skills (comma-separated)
              </label>
              <input
                id="skills"
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. React, TypeScript, Node.js"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {searchSites.map((site, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(site)}
                  className="flex items-center justify-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                  <img
                    src={site.icon}
                    alt={site.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium text-gray-700">{site.name}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;