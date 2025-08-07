import { useEffect } from "react";
import { X } from "lucide-react";

const LocationExistsPopup = ({ locationName, onClose }) => {
  // Auto-close after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Prevent event bubbling so clicking inside doesn't close
  const handleContentClick = e => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div
        className="relative bg-black text-white p-6 rounded-2xl shadow-2xl max-w-md w-full text-center animate-fade-in cursor-default"
        onClick={handleContentClick}
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-white hover:text-gray-200 opacity-80 hover:opacity-100">
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h3 className="text-md font-normal mb-2 text-left">Already Added</h3>

        {/* Message */}
        <p className="text-sm opacity-90 mb-1 mt-6">
          <span className="font-bold text-2xl">{locationName}</span>
        </p>
        <p className="text-sm opacity-80">is already in your dashboard.</p>

        {/* Timer Bar */}
        <div className="mt-4 h-1 bg-white/30 rounded overflow-hidden">
          <div className="h-full bg-white animate-progress-bar"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress-bar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-progress-bar {
          animation: progress-bar 3s linear forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LocationExistsPopup;
