import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../login/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <div className="space-y-12 md:space-y-16 animate-fade-in">
      <div className="relative py-12 md:py-20 border-b-2 border-white overflow-hidden isolate">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover -z-20 opacity-50 mix-blend-screen pointer-events-none"
        >
          {/* TODO: Replace with user-uploaded video file later */}
          <source src="/hero_video2.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent -z-10"></div>

        <div className="absolute top-0 left-0 text-[100px] md:text-[200px] font-display font-black text-gray-800 -z-10 select-none opacity-10 md:opacity-20 leading-none overflow-hidden whitespace-nowrap">
          LOST & FOUND
        </div>
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-[0.9] text-white">
            Welcome<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              {user?.name}
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-400 max-w-2xl tracking-wide border-l-4 border-white pl-6 mt-8">
            Manage your lost and found items efficiently. Connect with the community to recover what matters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Lost Section */}
        <div className="group relative animate-slide-up [animation-delay:200ms]">
          <div className="absolute -inset-2 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-700 blur-xl"></div>
          <div className="glass-card p-8 md:p-12 h-full relative z-10 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity duration-700">
              <span className="text-8xl font-display font-black">01</span>
            </div>

            <div>
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter">Lost</h2>
              </div>

              <p className="text-gray-400 mb-10 text-lg font-light leading-relaxed min-h-[80px] max-w-sm">
                Have you lost something valuable? Report it immediately to the community or search through our found items database.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Link
                to="/create-lost"
                className="btn-mappa text-center flex-1"
              >
                Report Lost
              </Link>
              <Link
                to="/lost-items"
                className="btn-mappa-outline text-center flex-1"
              >
                Browse
              </Link>
            </div>
          </div>
        </div>

        {/* Found Section */}
        <div className="group relative animate-slide-up [animation-delay:400ms]">
          <div className="absolute -inset-2 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-700 blur-xl"></div>
          <div className="glass-card p-8 md:p-12 h-full relative z-10 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity duration-700">
              <span className="text-8xl font-display font-black">02</span>
            </div>

            <div>
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter">Found</h2>
              </div>

              <p className="text-gray-400 mb-10 text-lg font-light leading-relaxed min-h-[80px] max-w-sm">
                Did you find something that doesn't belong to you? Help it find its way back home by reporting it here.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Link
                to="/create-found"
                className="btn-mappa text-center flex-1"
              >
                Report Found
              </Link>
              <Link
                to="/found-items"
                className="btn-mappa-outline text-center flex-1"
              >
                Browse
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
