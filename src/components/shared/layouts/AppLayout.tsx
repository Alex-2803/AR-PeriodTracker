import { IonContent, IonPage } from '@ionic/react';
import { ReactNode } from 'react';
import BottomNavigation from '../navigation/BottomNavigation';

interface AppLayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
  className?: string;
}

const BOTTOM_NAV_HEIGHT = 64; // px
const EXTRA_SPACING = 16;    // px breathing room

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  showBottomNav = true,
  className = ''
}) => {
  return (
    <IonPage>
      {/* IonContent - Only for scrollable content that should animate */}
      <IonContent
        className={`bg-gradient-to-b from-gray-50 to-white ${className}`}
        fullscreen
        scrollY
        forceOverscroll
      >
        {/* Content wrapper */}
        <div
          className="min-h-screen safe-area-bottom"
          style={{
            paddingBottom: showBottomNav
              ? `calc(${BOTTOM_NAV_HEIGHT}px + ${EXTRA_SPACING}px + env(safe-area-inset-bottom))`
              : `calc(${EXTRA_SPACING}px + env(safe-area-inset-bottom))`,
          }}
        >
          {children}
        </div>
      </IonContent>

      {/* Bottom Navigation - OUTSIDE IonContent so it doesn't animate */}
      {showBottomNav && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <BottomNavigation />
        </div>
      )}
    </IonPage>
  );
};

export default AppLayout;