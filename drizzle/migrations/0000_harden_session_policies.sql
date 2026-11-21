DROP POLICY IF EXISTS "Anyone can update sessions" ON public.sessions;
DROP POLICY IF EXISTS "Anyone can create sessions" ON public.sessions;
DROP POLICY IF EXISTS "Anyone can create mission_responses" ON public.mission_responses;
DROP POLICY IF EXISTS "Anyone can create pledges" ON public.pledges;
DROP POLICY IF EXISTS "Anyone can create pre_survey_responses" ON public.pre_survey_responses;
DROP POLICY IF EXISTS "Anyone can create post_survey_responses" ON public.post_survey_responses;

CREATE OR REPLACE FUNCTION public.is_open_session(_session_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = _session_id
    AND s.completed_at IS NULL AND s.started_at > now() - interval '1 day')
$$;

CREATE POLICY "Create valid sessions" ON public.sessions FOR INSERT TO anon, authenticated
WITH CHECK (completed_at IS NULL AND started_at > now() - interval '5 minutes' AND started_at <= now() + interval '5 minutes'
  AND (nickname IS NULL OR char_length(nickname) <= 50)
  AND (class_code IS NULL OR char_length(class_code) <= 50));

CREATE POLICY "Add mission answers to open session" ON public.mission_responses FOR INSERT TO anon, authenticated
WITH CHECK (public.is_open_session(session_id) AND mission_number BETWEEN 1 AND 14 AND selected_option IN ('A','B','C'));

CREATE POLICY "Add pre survey answers to open session" ON public.pre_survey_responses FOR INSERT TO anon, authenticated
WITH CHECK (public.is_open_session(session_id) AND question_number BETWEEN 1 AND 20 AND answer IN (0,1));

CREATE POLICY "Add post survey answers to open session" ON public.post_survey_responses FOR INSERT TO anon, authenticated
WITH CHECK (public.is_open_session(session_id) AND question_number BETWEEN 1 AND 20 AND answer IN (0,1));

CREATE POLICY "Add pledge to session" ON public.pledges FOR INSERT TO anon, authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.sessions s WHERE s.id = session_id AND s.started_at > now() - interval '1 day')
  AND char_length(pledge_text) BETWEEN 1 AND 500);

-- Server computes mission score
CREATE OR REPLACE FUNCTION public.set_mission_score()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.score := CASE NEW.selected_option WHEN 'A' THEN 2 WHEN 'B' THEN 1 ELSE 0 END;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_set_mission_score ON public.mission_responses;
CREATE TRIGGER trg_set_mission_score BEFORE INSERT OR UPDATE ON public.mission_responses
FOR EACH ROW EXECUTE FUNCTION public.set_mission_score();

-- Completion only via verified function
CREATE OR REPLACE FUNCTION public.complete_session(_session_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_open_session(_session_id) THEN RETURN; END IF;
  IF (SELECT count(DISTINCT mission_number) FROM public.mission_responses WHERE session_id = _session_id) < 14 THEN RETURN; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.post_survey_responses WHERE session_id = _session_id) THEN RETURN; END IF;
  UPDATE public.sessions SET completed_at = now() WHERE id = _session_id;
END $$;
REVOKE ALL ON FUNCTION public.complete_session(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.complete_session(uuid) TO anon, authenticated;
REVOKE UPDATE ON public.sessions FROM anon, authenticated;