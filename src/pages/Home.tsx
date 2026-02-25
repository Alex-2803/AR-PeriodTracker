import { 
  IonHeader, 
  IonToolbar, 
  IonIcon 
} from '@ionic/react';
import { useHistory } from 'react-router';
import { 
  camera,
  calendar,
  sparkles,
  chevronForward,
  informationCircle
} from 'ionicons/icons';
import { AppLayout } from '../components/shared';
import DisclaimerDialog from '../components/shared/modals/DisclaimerDialog';
import { useState, useEffect } from 'react';
import { getFormattedLastPeriodDay, getDaysSinceLastPeriod } from '../utils/periodTrackerUtils';

const Home: React.FC = () => {
  const history = useHistory();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<'ar' | 'tracker'>('ar');
  const [featureToNavigate, setFeatureToNavigate] = useState<string | null>(null);
  const [lastPeriodDay, setLastPeriodDay] = useState<string | null>(null);
  const [daysSinceLastPeriod, setDaysSinceLastPeriod] = useState<number | null>(null);

  // Load last period data on component mount and when component gains focus
  useEffect(() => {
    const loadPeriodData = () => {
      setLastPeriodDay(getFormattedLastPeriodDay());
      setDaysSinceLastPeriod(getDaysSinceLastPeriod());
    };

    // Load immediately
    loadPeriodData();

    // Set up interval to check for updates (every 10 seconds)
    const interval = setInterval(loadPeriodData, 10000);

    // Clean up
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      id: 1,
      title: 'AR Storybook',
      description: 'Scan image markers to view interactive 2D animated educational content.',
      icon: camera,
      color: 'from-[#7dbdc8] to-[#4e9dbf]',
      buttonColor: 'bg-gradient-to-r from-[#7dbdc8] to-[#4e9dbf]',
      path: '/ar',
      type: 'ar' as const
    },
    {
      id: 2,
      title: 'Period Tracker',
      description: 'Educational tracker based on standard 28-day cycle.',
      icon: calendar,
      color: 'from-[#e2a31d] to-[#ffb347]',
      buttonColor: 'bg-gradient-to-r from-[#e2a31d] to-[#ffb347]',
      path: '/tracker',
      type: 'tracker' as const
    }
  ];

  const handleFeatureClick = (feature: typeof features[0]) => {
    setSelectedFeature(feature.type);
    setFeatureToNavigate(feature.path);
    setShowDisclaimer(true);
  };

  const handleAcceptDisclaimer = () => {
    setShowDisclaimer(false);
    if (featureToNavigate) {
      history.push(featureToNavigate);
    }
    setFeatureToNavigate(null);
  };

  const handleCancelDisclaimer = () => {
    setShowDisclaimer(false);
    setFeatureToNavigate(null);
  };

  // Format date without year for preview
  const formatPreviewDate = (dateString: string): string => {
    try {
      // Extract the date part (assuming format like "Wed, Feb 18, 2026")
      // Remove the year and comma
      return dateString.replace(/, \d{4}$/, '');
    } catch {
      return dateString;
    }
  };

  return (
    <AppLayout>
      <IonHeader className="ion-no-border">
        <IonToolbar className="bg-white">
          <div className="px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7dbdc8] to-[#4e9dbf] flex items-center justify-center shadow-lg">
                  <IonIcon icon={sparkles} className="text-lg text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 sm:text-xl">Welcome back!</h1>
                  <p className="text-xs text-gray-500 sm:text-sm">Continue your learning journey</p>
                </div>
              </div>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      {/* Hero section with Last Period Date */}
      <div className="px-4 pt-4 pb-2 sm:px-6 md:px-8">
        <div className="bg-gradient-to-r from-[#7dbdc8]/10 to-[#4e9dbf]/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#7dbdc8]/20">
          
          {/* Last Period Date Display - Top Section */}
          {lastPeriodDay ? (
            <div className="mb-3 sm:mb-4 p-3 bg-white rounded-xl border border-[#7dbdc8]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#7dbdc8] to-[#4e9dbf] flex items-center justify-center">
                    <IonIcon icon={calendar} className="text-sm text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 sm:text-base">Last Period</h3>
                    <p className="text-xs text-gray-600">Most recent day</p>
                  </div>
                </div>
                <div className="text-right">
                  {/* Format the date to remove year */}
                  <p className="text-sm font-bold text-[#4e9dbf] sm:text-base">
                    {formatPreviewDate(lastPeriodDay)}
                  </p>
                  {daysSinceLastPeriod !== null && (
                    <p className="text-xs text-gray-500">
                      {daysSinceLastPeriod === 0 ? 'Today' : 
                       daysSinceLastPeriod === 1 ? 'Yesterday' : 
                       `${daysSinceLastPeriod} days ago`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-3 sm:mb-4 p-3 bg-white rounded-xl border border-[#7dbdc8]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#7dbdc8]/30 to-[#4e9dbf]/30 flex items-center justify-center">
                    <IonIcon icon={calendar} className="text-sm text-[#4e9dbf]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 sm:text-base">No Period Tracked Yet</h3>
                    <p className="text-xs text-gray-600">Start tracking your cycle</p>
                  </div>
                </div>
                <button
                  onClick={() => history.push('/tracker')}
                  className="text-xs px-3 py-1.5 bg-gradient-to-r from-[#7dbdc8] to-[#4e9dbf] text-white rounded-lg font-medium whitespace-nowrap"
                >
                  Start Tracking
                </button>
              </div>
            </div>
          )}

          {/* Main Hero Content */}
          <div className="mt-2 sm:mt-4">
            <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
              Interactive Puberty Education
            </h2>
            <p className="mb-3 text-xs text-gray-600 sm:text-sm md:text-base">
              Explore anatomy and health through immersive AR experiences and period tracking
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#4e9dbf] rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">All content loaded locally</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features grid - reduced bottom padding */}
      <div className="px-4 pb-6 space-y-4 sm:px-6 md:px-8 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800 sm:text-lg">Learning Features</h3>
        </div>
        
        {features.map((feature) => (
          <div 
            key={feature.id}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-card overflow-hidden smooth-transition hover:shadow-lg active:scale-[0.99] border border-gray-100"
            onClick={() => handleFeatureClick(feature)}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md`}>
                    <IonIcon icon={feature.icon} className="text-base text-white sm:text-xl" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 sm:text-lg">{feature.title}</h3>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-gray-500">Tap to explore</p>
                      <button 
                        className="text-[#4e9dbf] hover:text-[#2c5c6c] smooth-transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFeature(feature.type);
                          setFeatureToNavigate(feature.path);
                          setShowDisclaimer(true);
                        }}
                      >
                        <IonIcon icon={informationCircle} className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
                <IonIcon icon={chevronForward} className="text-lg text-gray-400 sm:text-xl" />
              </div>
              
              <p className="mb-4 text-xs leading-relaxed text-gray-600 sm:text-sm sm:mb-6">
                {feature.description}
              </p>
              
              <button
                className={`w-full ${feature.buttonColor} text-white font-medium py-3 sm:py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-md hover:shadow-lg smooth-transition active:opacity-90 text-sm sm:text-base`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFeatureClick(feature);
                }}
              >
                <span>Open Feature</span>
                <IonIcon icon={chevronForward} className="text-sm text-white sm:text-base" />
              </button>
            </div>
          </div>
        ))}

        {/* Educational notice - with proper spacing */}
        <div className="p-3 border border-gray-200 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#7dbdc8]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[#4e9dbf] text-xs sm:text-sm font-semibold">i</span>
            </div>
            <div>
              <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">
                <span className="font-semibold">All features include detailed usage guidance.</span> Tap the info icon for specific feature details before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Disclaimer Modal */}
      <DisclaimerDialog
        isOpen={showDisclaimer}
        onAccept={handleAcceptDisclaimer}
        onCancel={handleCancelDisclaimer}
        title={features.find(f => f.type === selectedFeature)?.title || ''}
        feature={selectedFeature}
      />
    </AppLayout>
  );
};

export default Home;