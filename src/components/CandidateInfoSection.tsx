import React from 'react';

interface Education {
  degree?: string;
  institution?: string;
  year?: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  location?: string;
}

interface CandidateInfo {
  candidate_name: string;
  experience_years: number;
  education: Education[] | string;
  skills: string[];
  contact_info: ContactInfo;
}

interface CandidateInfoSectionProps {
  candidateInfo: CandidateInfo;
  showCandidateDetails: boolean;
  setShowCandidateDetails: (show: boolean) => void;
}

const CandidateInfoSection: React.FC<CandidateInfoSectionProps> = ({
  candidateInfo,
  showCandidateDetails,
  setShowCandidateDetails
}) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setShowCandidateDetails(!showCandidateDetails)}
        className="w-full flex justify-between items-center p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <h4 className="text-lg font-semibold text-gray-900">Candidate Profile</h4>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
              {candidateInfo.experience_years} YOE
            </span>
            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
              {Array.isArray(candidateInfo.education) 
                ? candidateInfo.education[0]?.degree || 'N/A'
                : typeof candidateInfo.education === 'string' 
                  ? candidateInfo.education
                  : 'N/A'}
            </span>
          </div>
        </div>
        <span className="text-gray-500 text-xl font-medium">
          {showCandidateDetails ? '−' : '+'}
        </span>
      </button>
      
      {showCandidateDetails && (
        <div className="p-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div>
                <h5 className="text-sm font-medium text-gray-500 mb-4">Personal Information</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-sm text-gray-900 font-medium mt-1">{candidateInfo.candidate_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm text-gray-900 font-medium mt-1">{candidateInfo.experience_years} years</p>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div>
                <h5 className="text-sm font-medium text-gray-500 mb-4">Contact Information</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900 font-medium mt-1">{candidateInfo.contact_info.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900 font-medium mt-1">{candidateInfo.contact_info.phone}</p>
                  </div>
                  {candidateInfo.contact_info.location && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm text-gray-900 font-medium mt-1">{candidateInfo.contact_info.location}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-4">Education</h5>
              <div className="space-y-4">
                {Array.isArray(candidateInfo.education) ? (
                  candidateInfo.education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      {typeof edu === 'object' && edu !== null ? (
                        <>
                          <p className="text-sm font-medium text-gray-900">{edu.degree}</p>
                          <p className="text-sm text-gray-600 mt-1">{edu.institution}</p>
                          <p className="text-xs text-gray-500 mt-1">{edu.year}</p>
                        </>
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{String(edu)}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">
                      {candidateInfo.education || 'No education information available'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h5 className="text-sm font-medium text-gray-500 mb-4">Skills & Expertise</h5>
            <div className="flex flex-wrap gap-2">
              {candidateInfo.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateInfoSection;