import React from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonText
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

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onCancel}
      initialBreakpoint={0.75}
      breakpoints={[0, 0.5, 0.75]}
      handleBehavior="cycle"
      className="ion-modal-rounded"
    >
      <IonHeader className="bg-white shadow-none ion-no-border">
        <IonToolbar className="bg-white">
          <div className="flex items-center justify-between px-4 py-2 bg-white">
            <div className="flex items-center space-x-2 bg-white">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                feature === 'ar' 
                  ? 'bg-gradient-to-br from-[#7dbdc8] to-[#4e9dbf]'
                  : 'bg-gradient-to-br from-[#e2a31d] to-[#ffb347]'
              }`}>
                <IonIcon 
                  icon={informationCircle} 
                  className="text-lg text-white"
                />
              </div>
              <IonTitle className="p-0 text-lg font-semibold bg-white">
                {title} Disclaimer
              </IonTitle>
            </div>
            <div 
  onClick={onCancel}
  className="cursor-pointer w-8 h-8 flex items-center justify-center bg-gradient-to-br from-[#7dbdc8] to-[#4e9dbf] rounded-full"
>
  <IonIcon icon={closeCircle} className="text-lg text-white" />
</div>
          </div>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="bg-white ion-padding">
        <div className="space-y-6 bg-white">
          {/* Main Message */}
          <div className="p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white">
            <IonText className="leading-relaxed text-gray-800">
              <p className="font-medium">{content.main}</p>
            </IonText>
          </div>

          {/* Key Points */}
          <div className="space-y-3 bg-white">
            <h3 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
              Important Notes
            </h3>
            <ul className="space-y-3 bg-white">
              {content.points.map((point, index) => (
                <li key={index} className="flex items-start space-x-3 bg-white">
                  <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                    feature === 'ar' ? 'bg-[#4e9dbf]' : 'bg-[#e2a31d]'
                  }`}></div>
                  <IonText className="text-sm leading-relaxed text-gray-600 bg-white">
                    {point}
                  </IonText>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Note */}
          <div className="p-4 border rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
            <IonText className="text-amber-800">
              <p className="text-sm font-medium text-center">{content.footer}</p>
            </IonText>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 bg-white">
            <button
              onClick={onAccept}
              className="w-full py-3 mb-4 font-semibold text-white shadow-md rounded-xl bg-gradient-to-r from-[#7dbdc8] to-[#4e9dbf] hover:opacity-90 transition-opacity"
            >
              I Understand - Continue
            </button>
            
            <div className="mt-4 text-center bg-white">
              <button
                onClick={onCancel}
                className="text-sm text-gray-500 transition-colors bg-transparent hover:text-gray-700"
              >
                Cancel and go back
              </button>
            </div>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default DisclaimerDialog;