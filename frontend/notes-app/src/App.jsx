import "./App.css";
import AppRoutes from "./Routes/AppRoutes";
/* import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react"; */

const App = () => {
  return (
    <div>
      <AppRoutes />
     {/*  <Analytics />
      <SpeedInsights /> */}
    </div>
  );
};

export default App;
