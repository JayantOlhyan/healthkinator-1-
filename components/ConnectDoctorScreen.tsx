import React, { useState } from 'react';
import { ChevronLeftIcon } from './icons';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  availableNow: boolean;
}

const mockDoctors: Doctor[] = [
  { id: '1', name: 'Dr. Sarah Gupta', specialty: 'Gynecology', rating: 4.5, reviews: 120, availableNow: false },
  { id: '2', name: 'Dr. Vikram Singh', specialty: 'General Medicine', rating: 4.8, reviews: 340, availableNow: true },
  { id: '3', name: 'Dr. Priya Patel', specialty: 'Paediatrics', rating: 4.9, reviews: 210, availableNow: true },
  { id: '4', name: 'Dr. Rahul Sharma', specialty: 'Dermatology', rating: 4.7, reviews: 185, availableNow: false },
];

interface ConnectDoctorScreenProps {
  onBack: () => void;
}

const ConnectDoctorScreen: React.FC<ConnectDoctorScreenProps> = ({ onBack }) => {
  // Start with the center doctor (Vikram Singh) selected
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [connecting, setConnecting] = useState(false);

  const selectedDoctor = mockDoctors[selectedIndex];

  const handleConnect = () => {
    setConnecting(true);
    // Mock connection delay
    setTimeout(() => {
        alert(`Successfully connected to Apollo 24/7. Redirecting to video consultation with ${selectedDoctor.name}...`);
        window.location.href = 'https://www.apollo247.com/doctors';
        setConnecting(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full py-6 px-1 animate-fade-in text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[1px] border-brand-teal/10 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border-[1px] border-brand-teal/20 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border-[1px] border-brand-emerald/30 rounded-full pointer-events-none bg-brand-navy z-0"></div>

        {/* Top Header */}
        <div className="w-full flex justify-between items-start z-20 px-4">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                <ChevronLeftIcon className="w-6 h-6 text-white" />
            </button>
            <div className="bg-brand-teal/20 backdrop-blur-sm border border-brand-teal/30 px-3 py-1 rounded-lg">
                <span className="text-xs font-bold text-brand-emerald tracking-wide">eSanjeevani</span>
            </div>
        </div>

        {/* Title */}
        <div className="text-center z-20 mt-2 mb-10 w-full">
            <h1 className="text-4xl font-extrabold text-white leading-tight drop-shadow-md">
                Connect to <br/> a Doctor
            </h1>
        </div>

        {/* Doctor Carousel */}
        <div className="w-full relative z-20 flex-grow flex items-center justify-center -ml-2">
           <div className="flex w-full overflow-x-auto pb-8 pt-4 snap-x snap-mandatory hide-scrollbar justify-center px-[50%]">
               <div className="flex space-x-4 pr-[50%]">
                   {mockDoctors.map((doc, index) => {
                       const isSelected = index === selectedIndex;
                       
                       return (
                           <div 
                               key={doc.id}
                               onClick={() => setSelectedIndex(index)}
                               className={`snap-center flex-shrink-0 cursor-pointer transition-all duration-500 ease-out transform
                                  ${isSelected 
                                      ? 'w-56 scale-110 z-30 bg-[#0F292B]/90 border-2 border-brand-emerald glow-emerald-strong rounded-[2rem] p-5 opacity-100' 
                                      : 'w-48 scale-90 z-10 bg-[#14263A]/80 border border-brand-teal/30 rounded-[1.5rem] p-4 opacity-60 hover:opacity-100'}`}
                           >
                               <div className="flex flex-col items-center h-full">
                                    {/* Avatar Placeholder */}
                                   <div className={`rounded-full bg-brand-navy flex items-center justify-center overflow-hidden mb-3
                                         ${isSelected ? 'w-24 h-24 border-2 border-brand-emerald' : 'w-20 h-20 border border-brand-teal/50'}`}>
                                       <span className="text-4xl opacity-50">👤</span>
                                   </div>

                                   {/* Status Badge */}
                                   {doc.availableNow ? (
                                        <div className={`mb-3 px-3 py-1 rounded-full text-xs font-bold w-max transition-all
                                              ${isSelected ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange glow-orange-border shadow-lg' : 'bg-brand-teal/20 text-brand-teal'}`}>
                                            Available Now
                                        </div>
                                   ) : (
                                       <div className="mb-3 px-3 py-1 rounded-full text-xs font-medium text-gray-500 bg-gray-800/50 w-max">
                                            Offline
                                        </div>
                                   )}

                                   <h3 className={`font-bold text-center transition-colors ${isSelected ? 'text-lg text-white' : 'text-base text-gray-300'}`}>
                                       {doc.name}
                                   </h3>
                                   
                                   <div className="mt-auto pt-2 w-full flex flex-col items-center">
                                       <span className={`text-xs font-medium px-2 py-0.5 rounded-md text-center inline-block mb-2
                                              ${isSelected ? 'bg-brand-emerald/20 text-brand-emerald' : 'bg-gray-800 text-gray-400'}`}>
                                            {doc.specialty}
                                       </span>
                                       
                                       <div className="flex items-center space-x-1 text-sm">
                                            <span className={`${isSelected ? 'text-brand-emerald' : 'text-gray-500'}`}>●</span>
                                            <span className="font-bold">{doc.rating}</span>
                                            <span className="text-brand-orange">★</span>
                                       </div>
                                   </div>
                               </div>
                           </div>
                       );
                   })}
               </div>
           </div>
        </div>

        {/* Bottom Actions */}
        <div className="w-full px-6 flex flex-col items-center gap-4 z-20 pb-4">
            <button
                onClick={handleConnect}
                disabled={!selectedDoctor.availableNow || connecting}
                className={`w-full font-bold py-4 px-6 rounded-3xl text-lg transition-all duration-300 transform active:scale-95 shadow-lg
                    ${!selectedDoctor.availableNow 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed shadow-none' 
                        : 'bg-brand-teal text-white hover:bg-brand-emerald glow-emerald'}`}
            >
                {connecting ? 'Connecting...' : 'Start Video Consultation'}
            </button>
            <p className="text-xs text-gray-400">
                Powered by eSanjeevani — Free for all users
            </p>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .hide-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}} />
    </div>
  );
};

export default ConnectDoctorScreen;
