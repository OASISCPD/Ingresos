import { Home } from "./pages/Home.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login.tsx";
import { VideoEntrada } from "./pages/VideoEntrada.tsx";
import { AutoExcluidoContextProvider } from "./context/excludeClientContext.tsx";
import { Test2 } from "./components/test/test2.tsx";
import { Test1 } from "./components/test/test1.tsx";
import { AppProvider } from "./context/AppContext.tsx";
import { SideBarContex } from "./context/SideBarContext.tsx";
import { SelfExcludesPage } from "./pages/SelfExcludesPage.tsx";
import { IsAuth, IsAuthLogin } from "./middlewares/CheckSession.ts";
import { BooleanProvider } from "./context/FormBooleanContext.tsx";
import { Sala4 } from "./pages/Sala4.tsx";
import { Other } from "./components/test/Other.tsx";
import { NotAllowed } from "./pages/NotAllowed.tsx";
import { AbmSecurity } from "./pages/AbmSecurity.tsx";
import { Test3 } from "./components/test/Test3.tsx";
import { VideoSala4 } from "./pages/VideoSala4.tsx";
import { ReportsPage } from "./pages/ReportsPage.tsx";
export function App() {
  return (
    <section >
      <Router>
        <AutoExcluidoContextProvider>
          <AppProvider>
            <BooleanProvider>
              <SideBarContex>
                <Routes>
                  <Route path="/" element={<IsAuthLogin route="/home"><Login /></IsAuthLogin>} />
                  <Route path="/home" element={<IsAuth route="/home"> <Home /></IsAuth>} />
                  <Route path="/autoExclude" element={<IsAuth route="/autoExclude"> <SelfExcludesPage /></IsAuth>} />
                  <Route path="/abmSecurity" element={<IsAuth route="/abmSecurity"> <AbmSecurity /></IsAuth>} />
                  <Route path="/abmSecurity123" element={<AbmSecurity />} />
                  <Route path="/notAllowed" element={<IsAuth route="/notAllowed"> <NotAllowed /></IsAuth>} />
                  <Route path="/sala4" element={<IsAuth route="/sala4"> <Sala4 /></IsAuth>} />
                  <Route path="/reports" element={<IsAuth route="/reports"> <ReportsPage /></IsAuth>} />
                  <Route path="/video" element={<VideoEntrada />} />
                  <Route path="/video2" element={<VideoSala4 />} />
                  <Route path="/test3" element={<Test3 />} />
                  <Route path="/test1" element={<Test1 />} />
                  <Route path="/test2" element={<Test2 />} />
                  <Route path="*" element={<Other />} />
                </Routes>
              </SideBarContex>
            </BooleanProvider>
          </AppProvider>
        </AutoExcluidoContextProvider>
      </Router>
    </section>
  );
}
