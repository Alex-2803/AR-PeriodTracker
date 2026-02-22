import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

import Splash from './pages/Splash';
import Home from './pages/Home';
import ARCamera from './pages/ARCamera';
import PeriodTracker from './pages/PeriodTracker';
import Settings from './pages/Settings';

/* Optional Ionic CSS */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

setupIonicReact({
  mode: 'ios' // Use iOS style for consistent cross-platform appearance
});

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/splash" component={Splash} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/ar" component={ARCamera} />
        <Route exact path="/tracker" component={PeriodTracker} />
        <Route exact path="/settings" component={Settings} />
        <Redirect exact from="/" to="/splash" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;