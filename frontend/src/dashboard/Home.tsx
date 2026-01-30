import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../login/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-16 animate-fade-in">
      <div className="relative py-20 border-b-2 border-white overflow-hidden isolate">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover -z-20 opacity-50 mix-blend-screen pointer-events-none"
        >
          {/* TODO: Replace with user-uploaded video file later */}
          <source src="/hero_video1.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent -z-10"></div>

        <div className="absolute top-0 left-0 text-[200px] font-display font-bold text-gray-800 -z-10 select-none opacity-20 leading-none overflow-hidden whitespace-nowrap">
          LOST & FOUND
        </div>
        <div className="max-w-4xl">
          <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-none text-white">
            Welcome<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              {user?.name}
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-400 max-w-2xl tracking-wide border-l-4 border-white pl-6 mt-8">
            Manage your lost and found items efficiently. Connect with the community to recover what matters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Lost Section */}
        <div className="group relative">
          <div className="absolute -inset-2 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
          <div className="border-2 border-white p-8 md:p-12 h-full bg-surface transition-transform duration-300 group-hover:-translate-y-2 relative z-10">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-4xl md:text-5xl font-black uppercase text-white">Lost</h2>
              <span className="text-6xl font-display font-bold text-gray-800 group-hover:text-white transition-colors duration-300">01</span>
            </div>
            
            <p className="text-gray-400 mb-10 text-lg font-light leading-relaxed min-h-[80px]">
              Have you lost something valuable? Report it immediately to the community or search through our found items database.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
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
        <div className="group relative">
          <div className="absolute -inset-2 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
          <div className="border-2 border-white p-8 md:p-12 h-full bg-surface transition-transform duration-300 group-hover:-translate-y-2 relative z-10">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-4xl md:text-5xl font-black uppercase text-white">Found</h2>
              <span className="text-6xl font-display font-bold text-gray-800 group-hover:text-white transition-colors duration-300">02</span>
            </div>
            
            <p className="text-gray-400 mb-10 text-lg font-light leading-relaxed min-h-[80px]">
              Did you find something that doesn't belong to you? Help it find its way back home by reporting it here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
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
