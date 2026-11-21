DROP POLICY IF EXISTS "Anyone can read post_survey_responses" ON public.post_survey_responses;
DROP POLICY IF EXISTS "Anyone can read mission_responses" ON public.mission_responses;
DROP POLICY IF EXISTS "Anyone can read pledges" ON public.pledges;
DROP POLICY IF EXISTS "Anyone can read pre_survey_responses" ON public.pre_survey_responses;

REVOKE SELECT ON TABLE public.post_survey_responses, public.mission_responses, public.pledges, public.pre_survey_responses FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.post_survey_responses, public.mission_responses, public.pledges, public.pre_survey_responses TO service_role;