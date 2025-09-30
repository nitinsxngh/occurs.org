export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="newspaper-loading rounded-full h-16 w-16 border-4 border-gray-300 border-t-black dark:border-t-white"></div>
      <span className="mt-4 newspaper-caption text-gray-600 dark:text-gray-400">LOADING NEWS...</span>
    </div>
  );
}
