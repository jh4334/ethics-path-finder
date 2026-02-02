-- Sessions table: stores user session data
CREATE TABLE public.sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nickname TEXT,
    class_code TEXT,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Pre-survey responses table
CREATE TABLE public.pre_survey_responses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    answer INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Post-survey responses table
CREATE TABLE public.post_survey_responses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    answer INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mission responses table
CREATE TABLE public.mission_responses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    mission_number INTEGER NOT NULL,
    selected_option TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Pledges table
CREATE TABLE public.pledges (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    pledge_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public insert and select (no auth required for students)
-- Sessions: anyone can create and read sessions
CREATE POLICY "Anyone can create sessions" ON public.sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read sessions" ON public.sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can update sessions" ON public.sessions FOR UPDATE USING (true);

-- Pre-survey responses: anyone can insert and read
CREATE POLICY "Anyone can create pre_survey_responses" ON public.pre_survey_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read pre_survey_responses" ON public.pre_survey_responses FOR SELECT USING (true);

-- Post-survey responses: anyone can insert and read
CREATE POLICY "Anyone can create post_survey_responses" ON public.post_survey_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read post_survey_responses" ON public.post_survey_responses FOR SELECT USING (true);

-- Mission responses: anyone can insert and read
CREATE POLICY "Anyone can create mission_responses" ON public.mission_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read mission_responses" ON public.mission_responses FOR SELECT USING (true);

-- Pledges: anyone can insert and read
CREATE POLICY "Anyone can create pledges" ON public.pledges FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read pledges" ON public.pledges FOR SELECT USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_sessions_class_code ON public.sessions(class_code);
CREATE INDEX idx_pre_survey_session ON public.pre_survey_responses(session_id);
CREATE INDEX idx_post_survey_session ON public.post_survey_responses(session_id);
CREATE INDEX idx_mission_session ON public.mission_responses(session_id);
CREATE INDEX idx_pledges_session ON public.pledges(session_id);