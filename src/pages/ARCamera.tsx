import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton,
  IonIcon,
  IonBadge
} from '@ionic/react';
import { 
  arrowBack,
  flashOutline,
  flashOffOutline,
  gridOutline,
  warningOutline,
  checkmarkCircleOutline,
  wifiOutline
} from 'ionicons/icons';
import { useState } from 'react';

const ARCamera: React.FC = () => {
  const [flashOn, setFlashOn] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [markerDetected, setMarkerDetected] = useState(false);
  const [lightingCondition] = useState<'good' | 'poor'>('good');

  const simulateMarkerDetection = () => {
    // Simulate marker detection for demo
    setTimeout(() => {
      setMarkerDetected(true);
      setTimeout(() => setMarkerDetected(false), 3000);
    }, 1000);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border bg-black/90 backdrop-blur-xl">
        <IonToolbar className="bg-transparent">
          <IonButtons slot="start">
            <IonButton onClick={() => window.history.back()} className="text-white">
              <IonIcon icon={arrowBack} className="text-xl text-[#4e9dbf]" />
            </IonButton>
          </IonButtons>
          <IonTitle className="font-semibold text-black">AR Storybooks Scanner</IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent className="bg-black" forceOverscroll={false}>
        <div className="relative h-full">
          {/* Camera Preview Area */}
          <div className="relative h-full overflow-hidden">
            {/* Camera overlay grid */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-80 h-80">
                {/* Outer frame with lighting indicator */}
                <div className={`
                  absolute inset-0 border-2 rounded-3xl animate-pulse-glow
                  ${markerDetected 
                    ? 'border-[#4e9dbf]' 
                    : lightingCondition === 'good' 
                    ? 'border-white/30' 
                    : 'border-[#e2a31d]/50'
                  }
                `}></div>
                
                {/* Corner decorations */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-[#7dbdc8] rounded-tl-lg"></div>
                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-[#7dbdc8] rounded-tr-lg"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-[#7dbdc8] rounded-bl-lg"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-[#7dbdc8] rounded-br-lg"></div>
                
                {/* Grid lines if enabled */}
                {gridVisible && (
                  <>
                    <div className="absolute left-0 right-0 h-px top-1/3 bg-white/20"></div>
                    <div className="absolute left-0 right-0 h-px top-2/3 bg-white/20"></div>
                    <div className="absolute top-0 bottom-0 w-px left-1/3 bg-white/20"></div>
                    <div className="absolute top-0 bottom-0 w-px left-2/3 bg-white/20"></div>
                  </>
                )}
                
                {/* Scanning animation */}
                <div className="absolute top-0 w-1 h-full transform -translate-x-1/2 left-1/2">
                  <div className="h-20 bg-gradient-to-b from-transparent via-[#7dbdc8] to-transparent animate-scan"></div>
                </div>
                
                {/* Center guide */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`
                    w-16 h-16 border-2 rounded-xl flex items-center justify-center
                    ${markerDetected ? 'border-[#4e9dbf] bg-[#4e9dbf]/20' : 'border-white/50'}
                    smooth-transition
                  `}>
                    {markerDetected ? (
                      <IonIcon icon={checkmarkCircleOutline} className="text-[#4e9dbf] text-2xl" />
                    ) : (
                      <span className="text-white/50">+</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status indicators */}
            <div className="absolute left-0 right-0 px-6 top-20">
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center px-3 py-2 space-x-2 rounded-full bg-black/60 backdrop-blur-xl">
                  <div className={`w-2 h-2 rounded-full ${
                    markerDetected ? 'bg-[#4e9dbf] animate-pulse' : 'bg-[#7dbdc8]'
                  }`}></div>
                  <span className="text-sm font-medium text-white">
                    {markerDetected ? 'Marker Detected!' : 'Ready to Scan'}
                  </span>
                </div>
                
                <div className={`flex items-center space-x-2 backdrop-blur-xl rounded-full px-3 py-2 ${
                  lightingCondition === 'good' ? 'bg-black/60' : 'bg-[#e2a31d]/20'
                }`}>
                  <IonIcon 
                    icon={lightingCondition === 'good' ? checkmarkCircleOutline : warningOutline} 
                    className={lightingCondition === 'good' ? 'text-[#4e9dbf]' : 'text-[#e2a31d]'}
                  />
                  <span className="text-sm text-white">
                    {lightingCondition === 'good' ? 'Good Lighting' : 'Low Light'}
                  </span>
                </div>
                
                <div className="flex items-center px-3 py-2 space-x-2 rounded-full bg-black/60 backdrop-blur-xl">
                  <IonIcon icon={wifiOutline} className="text-[#7dbdc8]" />
                  <span className="text-sm text-white">Online</span>
                </div>
              </div>
            </div>

            {/* Instructions overlay */}
            <div className="absolute left-0 right-0 px-6 bottom-32">
              <div className="p-5 border bg-black/70 backdrop-blur-xl rounded-2xl border-white/20">
                <div className="flex items-center mb-3 space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7dbdc8]/20 flex items-center justify-center">
                    <span className="text-[#7dbdc8] text-xl">📸</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">How to Scan</p>
                    <p className="text-sm text-white/70">Follow these steps for best results:</p>
                  </div>
                </div>
                
                <div className="mb-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-[#4e9dbf]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#4e9dbf] text-xs">1</span>
                    </div>
                    <span className="text-sm text-white/80">Ensure good lighting conditions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-[#7dbdc8]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#7dbdc8] text-xs">2</span>
                    </div>
                    <span className="text-sm text-white/80">Hold device steady and level</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-[#e2a31d]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#e2a31d] text-xs">3</span>
                    </div>
                    <span className="text-sm text-white/80">Align marker within frame</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-white/60">
                  <IonIcon icon={warningOutline} />
                  <span>Internet required for AR content</span>
                </div>
              </div>
            </div>
          </div>

          {/* Camera Controls */}
          <div className="absolute left-0 right-0 px-6 bottom-8">
            <div className="flex items-center justify-between">
              {/* Flash toggle */}
              <button 
                className="flex items-center justify-center border rounded-full w-14 h-14 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 smooth-transition"
                onClick={() => setFlashOn(!flashOn)}
              >
                <IonIcon 
                  icon={flashOn ? flashOutline : flashOffOutline} 
                  className="text-xl text-white"
                />
              </button>

              {/* Capture button */}
              <div className="relative">
                <button 
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-[#7dbdc8] to-[#4e9dbf] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 smooth-transition active:scale-95"
                  onClick={simulateMarkerDetection}
                >
                  <div className="flex items-center justify-center w-16 h-16 border-4 rounded-full border-white/30">
                    <span className="text-lg text-white">Scan</span>
                  </div>
                </button>
                {markerDetected && (
                  <div className="absolute -top-2 -right-2">
                    <IonBadge className="bg-[#4e9dbf] text-white animate-bounce">✓</IonBadge>
                  </div>
                )}
              </div>

              {/* Grid toggle */}
              <button 
                className="flex items-center justify-center border rounded-full w-14 h-14 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 smooth-transition"
                onClick={() => setGridVisible(!gridVisible)}
              >
                <IonIcon 
                  icon={gridOutline} 
                  className={`text-white text-xl ${gridVisible ? 'opacity-100' : 'opacity-50'}`}
                />
              </button>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ARCamera;