import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import PreSurveyPage from "./pages/PreSurveyPage";
import MissionPage from "./pages/MissionPage";
import FeedbackPage from "./pages/FeedbackPage";
import PostSurveyPage from "./pages/PostSurveyPage";
import ResultPage from "./pages/ResultPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/pre-survey" element={<PreSurveyPage />} />
          <Route path="/mission/:missionId" element={<MissionPage />} />
          <Route path="/mission/:missionId/feedback" element={<FeedbackPage />} />
          <Route path="/post-survey" element={<PostSurveyPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
