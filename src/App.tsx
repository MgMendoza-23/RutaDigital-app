import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Componentes */
import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes/AppRoutes";

/* CSS Ionic */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/flex-utils.css";

/* Tema */
import "./CSS/variables.css";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <Sidebar />
      <AppRoutes />
    </IonReactRouter>
  </IonApp>
);

export default App;
