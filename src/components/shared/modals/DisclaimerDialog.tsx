import React from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonText,
  isPlatform
} from '@ionic/react';
import { closeCircle, informationCircle } from 'ionicons/icons';

interface DisclaimerDialogProps {
  isOpen: boolean;
  onAccept: () => void;
  onCancel: () => void;
  title: string;
  feature: 'ar' | 'tracker';
}

const DisclaimerDialog: React.FC<DisclaimerDialogProps> = ({ 
  isOpen, 
  onAccept,
  onCancel,
  title,
  feature 
}) => {
  const getDisclaimerContent = () => {
    if (feature === 'ar') {
      return {
        main: 'Scan image markers to view interactive 2D animated educational content.',
        points: [
          'Requires good lighting and stable surface',
          'Internet connection needed for content loading',
          'Best experienced in well-lit environments',
          'All content is for educational purposes'
        ],
        footer: 'Features work with printed AR markers only.'
      };
    } else {
      return {
        main: 'Educational tracker based on standard 28-day cycle model.',
        points: [
          'For awareness and educational purposes only',
          'Not a medical or diagnostic tool',
          'Data stored locally on your device',
          'Cycle predictions based on educational model'
        ],
        footer: 'For health concerns, consult a healthcare professional.'
      };
    }
  };

  const content = getDisclaimerContent();

  // Determine responsive breakpoints based on platform
  const getBreakpoints = () => {
    if (isPlatform('mobile')) {
      return [0, 0.6, 0.85]; // Mobile-specific breakpoints
    } else if (isPlatform('tablet')) {
      return [0, 0.5, 0.7]; // Tablet-specific breakpoints
    }
    return [0, 0.4, 0.6]; // Desktop breakpoints
  };

  // Add custom CSS using a <style> tag without jsx attribute
  const customStyles = `
    @media (max-width: 380px) {
      .ion-modal-rounded {
        --border-radius: 16px 16px 0 0;
      }
      
      .text-xs {
        font-size: 0.7rem;
      }
      
      .p-3 {
        padding: 0.6rem;
      }
    }

    @media (min-width: 768px) and (max-width: 1024px) {
      .ion-modal-rounded {
        --border-radius: 20px 20px 0 0;
      }
      
      .max-w-2xl {
        max-width: 90%;
      }
    }

    @media (min-width: 1024px) {
      .ion-modal-rounded {
        --border-radius: 24px 24px 0 0;
      }
      
      .max-w-2xl {
        max-width: 80%;
      }
    }

    /* Landscape mode adjustments */
    @media (orientation: landscape) and (max-height: 600px) {
      .ion-modal-rounded {
        --height: 90%;
      }
      
      .space-y-4 {
        space-y: 2;
      }
      
      .py-4 {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }
    }

    /* Touch device optimizations */
    .touch-manipulation {
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    /* Prevent text overflow on very small devices */
    .truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `;

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onCancel}
      initialBreakpoint={0.85}
      breakpoints={getBreakpoints()}
      handleBehavior="cycle"
      className={`ion-modal-rounded ${feature === 'ar' ? 'ar-modal' : 'tracker-modal'}`}
      mode="ios" // Force iOS mode for consistent appearance
    >
      {/* Add style tag in the head or at the beginning of content */}
      <style>
        {customStyles}
      </style>
      
      <IonHeader className="bg-white shadow-none ion-no-border">
        <IonToolbar className="bg-white">
          <div className="flex items-center justify-between px-3 py-2 bg-white sm:px-4">
            <div className="flex items-center flex-1 min-w-0 space-x-2 bg-white sm:space-x-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                feature === 'ar' 
                  ? 'bg-gradient-to-br from-[#7dbdc8] to-[#4e9dbf]'
                  : 'bg-gradient-to-br from-[#e2a31d] to-[#ffb347]'
              }`}>
                <IonIcon 
                  icon={informationCircle} 
                  className="text-base text-white sm:text-lg"
                />
              </div>
              <IonTitle className="p-0 text-base font-semibold truncate bg-white sm:text-lg">
                {title} Disclaimer
              </IonTitle>
            </div>
            <button
              onClick={onCancel}
              className="cursor-pointer w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gradient-to-br from-[#7dbdc8] to-[#4e9dbf] rounded-full flex-shrink-0 ml-2 active:opacity-80 transition-opacity"
              aria-label="Close"
            >
              <IonIcon icon={closeCircle} className="text-base text-white sm:text-lg" />
            </button>
          </div>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="bg-white" scrollY={true}>
        <div className="min-h-full px-3 py-4 bg-white sm:px-4 sm:py-6">
          <div className="max-w-2xl mx-auto space-y-4 bg-white sm:space-y-6">
            {/* Main Message */}
            <div className="p-3 border border-gray-200 sm:p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white">
              <IonText className="leading-relaxed text-gray-800">
                <p className="text-sm font-medium sm:text-base">{content.main}</p>
              </IonText>
            </div>

            {/* Key Points */}
            <div className="space-y-3 bg-white sm:space-y-4">
              <h3 className="text-xs font-semibold tracking-wide text-gray-700 uppercase sm:text-sm">
                Important Notes
              </h3>
              <ul className="space-y-2 bg-white sm:space-y-3">
                {content.points.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2 bg-white sm:space-x-3">
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 mt-1.5 sm:mt-2 rounded-full flex-shrink-0 ${
                      feature === 'ar' ? 'bg-[#4e9dbf]' : 'bg-[#e2a31d]'
                    }`}></div>
                    <IonText className="flex-1 text-xs leading-relaxed text-gray-600 bg-white sm:text-sm">
                      {point}
                    </IonText>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Note */}
            <div className={`p-3 sm:p-4 border rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 ${
              feature === 'ar' ? 'bg-opacity-50' : ''
            }`}>
              <IonText className="text-amber-800">
                <p className="text-xs font-medium text-center sm:text-sm">{content.footer}</p>
              </IonText>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-3 bg-white sm:pt-4 sm:space-y-4">
              <button
                onClick={onAccept}
                className="w-full py-3 sm:py-4 px-4 font-semibold text-sm sm:text-base text-white shadow-md rounded-xl bg-gradient-to-r from-[#7dbdc8] to-[#4e9dbf] hover:opacity-90 active:opacity-80 transition-opacity touch-manipulation"
              >
                I Understand - Continue
              </button>
              
              <div className="text-center bg-white">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-xs text-gray-500 transition-colors bg-transparent sm:text-sm hover:text-gray-700 active:text-gray-900 touch-manipulation"
                >
                  Cancel and go back
                </button>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default DisclaimerDialog;