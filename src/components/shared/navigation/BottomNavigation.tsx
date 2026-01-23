import { IonIcon } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { home, camera, calendar, informationCircle } from 'ionicons/icons';

const BottomNavigation = () => {
  const history = useHistory();
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: home, path: '/home' },
    { name: 'AR', icon: camera, path: '/ar' },
    { name: 'Tracker', icon: calendar, path: '/tracker' },
    { name: 'Credits', icon: informationCircle, path: '/settings' }
  ];

  // Only show on these specific routes
  const showRoutes = ['/home', '/tracker', '/settings'];
  const shouldShowNav = showRoutes.includes(location.pathname);

  if (!shouldShowNav) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 px-6 py-3 bg-white border-t border-gray-100 safe-area-bottom shadow-top"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999
      }}
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.name}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-[#4e9dbf]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              onClick={() => history.push(item.path)}
            >
              <IonIcon 
                icon={item.icon} 
                className={`text-2xl ${isActive ? 'scale-110' : ''} transition-transform duration-200`}
              />
              <span className={`text-xs mt-1 font-medium ${
                isActive 
                  ? 'text-[#4e9dbf]' 
                  : 'text-gray-500'
              }`}>
                {item.name}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-[#4e9dbf] rounded-full mt-1 animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;