interface LoadingAnimationProps {
  message?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  message = "Generating Questions..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
      <div className="text-lg font-medium text-gray-700">{message}</div>
      <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
    </div>
  );
};

export default LoadingAnimation;
