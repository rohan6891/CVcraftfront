import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Download, MoreVertical, Trash2 } from 'lucide-react';
import CandidateInfoSection from './CandidateInfoSection'; // Ensure this path is correct or update it to the correct path
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import config from '../config';

interface CircularProgressProps {
  percentage: number;
  color: string;
  label: string;
  animateCircles: boolean;
  animationKey: string | number;
}

const CircularProgress = ({ percentage, color, label, animateCircles, animationKey }: CircularProgressProps) => (
  <div className="flex flex-col items-center">
    <div className="relative w-24 h-24">
      <svg key={animationKey} className="w-24 h-24 transform -rotate-90">
        <circle cx="48" cy="48" r="45" fill="none" stroke="#E5E7EB" strokeWidth="6" />
        <circle
          cx="48" cy="48" r="45" fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={2 * Math.PI * 45}
          strokeDashoffset={
            animateCircles
              ? (2 * Math.PI * 45) - (2 * Math.PI * 45 * percentage) / 100
              : 2 * Math.PI * 45
          }
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-900">{percentage}%</span>
      </div>
    </div>
    <p className="mt-2 text-sm font-medium text-gray-600">{label}</p>
  </div>
);

interface QuestionDisplayProps {
  questions: string[];
  jobDetails: { jobTitle: string };
  jobId: string;
  candidateInfo: any;
  matchScore?: { overall_match: number; skill_match: number; experience_match: number };
  timestamp?: string;
  showInitialPreview?: boolean;
  deleteId?: string;
  menuType?: "menu" | "button";
}

const QuestionDisplay = ({
  questions,
  jobDetails,
  jobId,
  candidateInfo,
  matchScore,
  timestamp = new Date().toISOString(),
  showInitialPreview = false,
  deleteId, // For deletion (passed from InterviewHistory)
  menuType = "menu", // "menu" for InterviewHistory, "button" for Generate Form
}: QuestionDisplayProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!showInitialPreview);
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);
  const [showMatchAnalysis, setShowMatchAnalysis] = useState(false);
  const [animateCircles, setAnimateCircles] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (showMatchAnalysis) {
      setAnimationKey(prev => prev + 1);
      setAnimateCircles(false);
      setTimeout(() => setAnimateCircles(true), 50);
    }
  }, [showMatchAnalysis]);

  const formatDateFn = (dateString : any) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownloadClick = () => {
    setShowDownloadDialog(true);
  };

  const handleDownload = async (includeAnswers: boolean) => {
    try {
      setShowDownloadDialog(false);
      setIsDownloading(true);
      
      const userEmail = localStorage.getItem(config.auth.userKey);
      const token = localStorage.getItem(config.auth.tokenKey);
      
      if (!userEmail || !token || !jobId) {
        throw new Error('Missing required information for download. Please ensure you are logged in.');
      }
  
      const response = await fetch(
        `${config.api.baseUrl}${config.api.endpoints.report.get}/${jobId}?user_email=${encodeURIComponent(userEmail)}&include_answers=${includeAnswers}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to download report');
      }
  
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `interview_questions_${jobId}.pdf`; // Set the filename
      
      // Append link to body, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
      
      setError('');
    } catch (err) {
      console.error('Download error:', err);
      setError(`Download failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');
      const endpoint = `${config.api.baseUrl}${config.api.endpoints.history.get}/${deleteId || jobId}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Deletion failed');
      }
      // Refresh the page after deletion.
      window.location.reload();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Deletion failed. Please try again.');
    }
  };

  if (isDeleted) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="bg-gray-50 p-6 border-b flex justify-between items-center relative">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{jobDetails.jobTitle}</h3>
          <p className="text-sm text-gray-500 mt-2">
            📅 Generated on {formatDateFn(timestamp)}
          </p>
        </div>
        <div className="relative">
          {menuType === "menu" ? (
            <>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical size={24} className="text-gray-700" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                  <button
                    onClick={() => { setShowDownloadDialog(true); setIsMenuOpen(false); }}
                    className="w-full px-4 py-2 flex items-center text-gray-700 hover:bg-gray-100"
                  >
                    <Download size={18} className="mr-2" /> Download PDF
                  </button>
                  <button
                    onClick={() => { setShowDeleteDialog(true); setIsMenuOpen(false); }}
                    className="w-full px-4 py-2 flex items-center text-red-600 hover:bg-gray-100"
                  >
                    <Trash2 size={18} className="mr-2" /> Delete
                  </button>
                </div>
              )}
            </>
          ) : (
            <Button
              onClick={handleDownloadClick}
              disabled={isDownloading}
              className="bg-black text-white hover:bg-gray-800 px-6 py-2.5 text-base font-medium transition-all duration-200 flex items-center gap-2 min-w-[160px] justify-center"
            >
              <Download size={18} />
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </Button>
          )}
        </div>
      </div>

      {/* Extra spacing for Question Form */}
      {menuType === "button" && <div className="my-12"></div>}

      {error && <div className="px-6 py-3 bg-red-50 text-red-600 text-sm">{error}</div>}

      <div className="p-6 space-y-6">
        <CandidateInfoSection
          candidateInfo={candidateInfo}
          showCandidateDetails={showCandidateDetails}
          setShowCandidateDetails={setShowCandidateDetails}
        />

        {matchScore && (
          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setShowMatchAnalysis(!showMatchAnalysis)}
              className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 active:bg-gray-50 transition-colors"
            >
              <h4 className="text-lg font-semibold text-gray-900">Match Analysis</h4>
              <span className="text-gray-500 text-xl font-medium">{showMatchAnalysis ? '−' : '+'}</span>
            </button>
            {showMatchAnalysis && (
              <div className="p-4 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4">
                  <CircularProgress
                    percentage={matchScore.overall_match}
                    color="#3B82F6"
                    label="Overall Match"
                    animateCircles={animateCircles}
                    animationKey={animationKey}
                  />
                  <CircularProgress
                    percentage={matchScore.skill_match}
                    color="#10B981"
                    label="Skills Match"
                    animateCircles={animateCircles}
                    animationKey={`${animationKey}_skill`}
                  />
                  <CircularProgress
                    percentage={matchScore.experience_match}
                    color="#8B5CF6"
                    label="Experience Match"
                    animateCircles={animateCircles}
                    animationKey={`${animationKey}_exp`}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* View / Hide Questions */}
        {!isExpanded ? (
          <div className="text-center py-4">
            <Button
              onClick={() => setIsExpanded(true)}
              className="bg-black text-white hover:bg-gray-800 px-8 py-2 text-sm font-medium rounded-md transition-all duration-200"
            >
              View Questions
            </Button>
          </div>
        ) : (
          <div className="transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-bold text-gray-900">
                Generated Questions ({questions.length})
              </h4>
              {showInitialPreview && (
                <Button
                  onClick={() => setIsExpanded(false)}
                  className="border border-gray-300 text-sm font-medium rounded-md px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 outline-none"
                >
                  Hide Questions
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {questions.map((question : any, index: any) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <p className="text-gray-800 pt-1">{question}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Download Dialog */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-black">
              Download Interview Report
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Choose whether to include AI-generated sample answers in your report.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 py-2">
            <Button
              onClick={() => handleDownload(false)}
              className="flex items-center justify-center w-full h-12 border border-gray-300 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition text-sm font-medium"
              disabled={isDownloading}
            >
              Questions Only
            </Button>
            <Button
              onClick={() => handleDownload(true)}
              className="flex items-center justify-center w-full h-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:scale-105 transition-all shadow-lg"
              disabled={isDownloading}
            >
              With Answers
            </Button>
          </div>
          {isDownloading && (
            <div className="flex items-center justify-center mt-2">
              <div className="animate-spin h-6 w-6 border-4 border-gray-300 border-t-black rounded-full"></div>
              <span className="ml-2 text-sm text-gray-500">Generating report...</span>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-black">Delete Interview</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Are you sure you want to delete this interview? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2 py-2">
            <Button
              onClick={handleDelete}
              className="flex items-center justify-center w-full h-12 border border-red-600 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-medium"
            >
              Delete
            </Button>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowDeleteDialog(false)}
              className="flex items-center justify-center w-full h-12 border border-gray-300 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition text-sm font-medium"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionDisplay;
