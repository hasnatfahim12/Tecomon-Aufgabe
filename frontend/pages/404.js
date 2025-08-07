import React from "react";
import { useRouter } from "next/router";
import { Home, ArrowLeft, Cloud, Zap } from "lucide-react";

const Custom404 = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Background Elements - Orange Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* Weather Icons Animation */}
        <div className="mb-8 relative">
          {/* 404 Text - Orange Gradient */}
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 animate-pulse mb-4">
            404
          </h1>
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">Oops! Page Not Found</h2>

          <p className="text-gray-300 text-lg mb-2">The weather forecast for this page is...</p>

          <p className="text-xl font-semibold text-orange-300 mb-6">🔥 Completely missing!</p>

          <p className="text-gray-400 mb-8 text-sm">
            {`Looks like you've drifted into uncharted digital territory. Let's get you back to where the weather is always perfect!`}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </button>

            <button
              onClick={handleGoBack}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg border border-white/30 transition-all duration-300 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Fun Weather Fact - Orange Theme */}
          <div className="mt-8 p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-400/30">
            <p className="text-sm text-orange-200">
              <span className="font-semibold">☀️ Fun Fact:</span> The highest temperature ever recorded was 134°F (56.7°C) in
              Death Valley, California — hotter than most ovens!
            </p>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Need help? Check out the{" "}
            <button onClick={handleGoHome} className="text-orange-400 hover:text-orange-300 underline transition-colors">
              Weather Dashboard
            </button>
          </p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Custom404;
