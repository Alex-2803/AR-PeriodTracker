import { IonContent, IonPage } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import appLogo from '../assets/applogotalk.png'; // Import from assets folder

const Splash: React.FC = () => {
  const history = useHistory();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress from 0% to 100%
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 22); // 22ms per 1% = ~2200ms total

    // Navigate to home after 2500ms
    const timer = setTimeout(() => {
      history.replace('/home');
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [history]);

  return (
    <IonPage>
      <IonContent className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7dbdc8]/10 via-white to-[#4e9dbf]/10"></div>
        
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-64 h-64 rounded-full -top-20 -left-20 bg-[#7dbdc8]/20 blur-3xl"></div>
          <div className="absolute w-64 h-64 rounded-full -bottom-20 -right-20 bg-[#4e9dbf]/20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-[#7dbdc8]/15 to-[#4e9dbf]/15 blur-3xl"></div>
        </div>

        {/* Centered content */}
        <div className="absolute w-full max-w-md px-6 text-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          {/* Logo container */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-[#7dbdc8]/20 rounded-3xl shadow-2xl p-4">
              <img 
                src={appLogo} 
                alt="The Talk AR Logo" 
                className="object-contain w-full h-full"
              />
            </div>
            
            {/* Progress ring (optional - remove if you don't want it) */}
            <div className="absolute -inset-4">
              <div className="w-full h-full border-4 border-transparent rounded-full border-t-[#7dbdc8]/40 border-r-[#4e9dbf]/30 animate-spin"></div>
            </div>
          </div>

          {/* App name with gradient */}
          <h1 className="mb-4 text-5xl font-bold bg-gradient-to-r from-[#7dbdc8] to-[#4e9dbf] bg-clip-text text-transparent">
            The Talk AR
          </h1>
          
          {/* Tagline */}
          <p className="mb-10 text-lg font-medium tracking-wide text-gray-700">
            Journey Through AR & Health
          </p>
          
          {/* Progress indicator */}
          <div className="w-full max-w-xs mx-auto">
            <div className="h-2 mb-2 overflow-hidden bg-gray-200 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-[#7dbdc8] to-[#4e9dbf] rounded-full transition-all duration-100 ease-linear"
                style={{ 
                  width: `${progress}%`
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              Loading content... {progress}%
            </p>
          </div>
          
          {/* Privacy note */}
          <div className="max-w-xs p-4 mx-auto mt-12 border border-[#7dbdc8]/20 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm animate-fadeIn">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-[#4e9dbf]">Privacy First:</span> All data stored locally on your device
            </p>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#7dbdc8" fillOpacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Splash;