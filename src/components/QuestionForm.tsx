import React, { useState } from 'react';
import config from '../config';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import LoadingAnimation from './LoadingAnimation';
import QuestionDisplay from './QuestionDisplay';

interface FormData {
  jobTitle: string;
  jobDescription: string;
  experienceLevel: string;
  competencies: string;
  interviewType: string;
}

interface JobDetails {
  jobTitle: string;
  jobDescription: string;
  experienceLevel: string;
  competencies: string;
  interviewType: string;
}

interface CandidateInfo {
  education?: Array<{ degree: string }>;
  experience_years?: number;
  skills?: string[];
  name?: string;
  contact_info?: Record<string, string>;
}

const QuestionForm: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    jobTitle: '',
    jobDescription: '',
    experienceLevel: '',
    competencies: '',
    interviewType: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [questions, setQuestions] = useState<string[] | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo | null>(null);
  const [matchScore, setMatchScore] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const formDataObj = new FormData();
      const userEmail = localStorage.getItem(config.auth.userKey); // Use the config key

      // Ensure all required fields are present
      if (!userEmail) {
        throw new Error('User not authenticated');
      }

      // Append all required fields
      formDataObj.append('user_email', userEmail);
      formDataObj.append('job_title', formData.jobTitle.trim());
      formDataObj.append('job_description', formData.jobDescription.trim());
      formDataObj.append('experience_level', formData.experienceLevel);
      formDataObj.append('competencies', formData.competencies.trim());
      formDataObj.append('interview_type', formData.interviewType);
      
      if (file) {
        formDataObj.append('candidate_resume', file);
      } else {
        throw new Error('Resume file is required');
      }

      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.questions.generate}`, {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate questions');
      }

      const data = await response.json();
      if (data && data.questions) {
        setQuestions(data.questions);
        setJobId(data.job_id);
        setCandidateInfo(data.candidate_info);
        setMatchScore(data.match_score);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <><div className="min-h-screen bg-gray-50  px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {loading && (
          <div className="flex justify-center items-start min-h-screen pt-10">
            <LoadingAnimation message="Generating Interview Questions..." />
          </div>
        )}
        {error && (
          <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded border border-red-200">
            {error}
          </div>
        )}
        {questions && !loading ? (
          // Extra margin-top (e.g., mt-12) adds roughly three lines of space
          <div className="mt-12">
            <QuestionDisplay
              questions={questions}
              jobDetails={{
                jobTitle: formData.jobTitle,
                jobDescription: formData.jobDescription,
                experienceLevel: formData.experienceLevel,
                competencies: formData.competencies,
                interviewType: formData.interviewType,
              }}
              jobId={jobId || ''}
              candidateInfo={{
                ...candidateInfo,
                education: Array.isArray(candidateInfo?.education)
                  ? candidateInfo.education
                  : candidateInfo?.education
                    ? [{ degree: candidateInfo.education }]
                    : [],
                experience_years: candidateInfo?.experience_years || 0,
                skills: candidateInfo?.skills || [],
                name: candidateInfo?.name || 'N/A',
                contact_info: candidateInfo?.contact_info || {},
              }}
              matchScore={matchScore}
              timestamp={new Date().toISOString()}
              showInitialPreview={false}
              deleteId={null}
              menuType="button" />
          </div>
        ) : (
          showForm && !loading && (
            <Card className="w-full bg-white shadow-xl max-w-4xl mx-auto ">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  Generate Interview Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                    <Input
                      required
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      placeholder="e.g. Senior Software Engineer"
                      className="focus:ring-2 focus:ring-blue-400 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Job Description</label>
                    <textarea
                      required
                      value={formData.jobDescription}
                      onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 transition-all"
                      rows={4}
                      placeholder="Enter detailed job description" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Experience Level required for Job</label>
                    <select
                      required
                      value={formData.experienceLevel}
                      onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 transition-all"
                    >
                      <option value="">Select experience level</option>
                      <option value="Entry">Entry Level</option>
                      <option value="Mid">Mid Level</option>
                      <option value="Senior">Senior Level</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Competencies/Skills required for Job (comma-separated)</label>
                    <Input
                      required
                      value={formData.competencies}
                      onChange={(e) => setFormData({ ...formData, competencies: e.target.value })}
                      placeholder="e.g. Python, React, AWS"
                      className="focus:ring-2 focus:ring-blue-400 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Interview Type</label>
                    <select
                      required
                      value={formData.interviewType}
                      onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 transition-all"
                    >
                      <option value="">Select interview type</option>
                      <option value="Technical">Technical</option>
                      <option value="Behavioral">Behavioral</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Upload Candidate's Resume</label>
                    <Input
                      type="file"
                      required
                      onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                      accept=".pdf,.docx"
                      className="w-full focus:ring-2 focus:ring-blue-400 transition-all" />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 
                 text-white rounded-lg py-3 font-bold hover:scale-105 
                 transition-all shadow-lg"
                  >
                    {loading ? 'Generating Questions...' : 'Generate Questions'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div></>
  );
};

export default QuestionForm;
