import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { missions } from '@/data/missions';
import { surveyQuestions } from '@/data/surveyQuestions';
import { Download, Users, BarChart3, TrendingUp, ArrowLeft } from 'lucide-react';

interface ClassStats {
  totalStudents: number;
  avgPreScore: number;
  avgPostScore: number;
  avgMissionScore: number;
  missionStats: {
    missionId: number;
    title: string;
    avgScore: number;
    optionDistribution: { A: number; B: number; C: number };
  }[];
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [classCode, setClassCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<ClassStats | null>(null);
  const [error, setError] = useState('');

  const fetchClassStats = async () => {
    if (!classCode.trim()) {
      setError('학급 코드를 입력하세요');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Fetch sessions for this class
      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('id')
        .eq('class_code', classCode.trim())
        .not('completed_at', 'is', null);

      if (sessionsError) throw sessionsError;

      if (!sessions || sessions.length === 0) {
        setError('해당 학급 코드로 완료된 응답이 없습니다');
        setStats(null);
        setIsLoading(false);
        return;
      }

      const sessionIds = sessions.map((s) => s.id);

      // Fetch pre-survey responses
      const { data: preResponses } = await supabase
        .from('pre_survey_responses')
        .select('*')
        .in('session_id', sessionIds);

      // Fetch post-survey responses
      const { data: postResponses } = await supabase
        .from('post_survey_responses')
        .select('*')
        .in('session_id', sessionIds);

      // Fetch mission responses
      const { data: missionResponses } = await supabase
        .from('mission_responses')
        .select('*')
        .in('session_id', sessionIds);

      // Calculate stats
      const totalStudents = sessions.length;

      // Pre-survey average (correct answers)
      const preCorrectCount = (preResponses || []).filter((r) => {
        const question = surveyQuestions.find((q) => q.id === r.question_number);
        return question && (question.correctAnswer ? r.answer === 1 : r.answer === 0);
      }).length;
      const avgPreScore = preResponses?.length ? (preCorrectCount / preResponses.length) * 100 : 0;

      // Post-survey average (correct answers)
      const postCorrectCount = (postResponses || []).filter((r) => {
        const question = surveyQuestions.find((q) => q.id === r.question_number);
        return question && (question.correctAnswer ? r.answer === 1 : r.answer === 0);
      }).length;
      const avgPostScore = postResponses?.length ? (postCorrectCount / postResponses.length) * 100 : 0;

      // Mission average
      const totalMissionScore = (missionResponses || []).reduce((sum, r) => sum + r.score, 0);
      const avgMissionScore =
        missionResponses?.length ? (totalMissionScore / (missionResponses.length * 2)) * 100 : 0;

      // Per-mission stats
      const missionStats = missions.map((mission) => {
        const responses = (missionResponses || []).filter((r) => r.mission_number === mission.id);
        const avgScore = responses.length
          ? responses.reduce((sum, r) => sum + r.score, 0) / (responses.length * 2) * 100
          : 0;

        const optionDistribution = {
          A: responses.filter((r) => r.selected_option === 'A').length,
          B: responses.filter((r) => r.selected_option === 'B').length,
          C: responses.filter((r) => r.selected_option === 'C').length,
        };

        return {
          missionId: mission.id,
          title: mission.title,
          avgScore,
          optionDistribution,
        };
      });

      setStats({
        totalStudents,
        avgPreScore,
        avgPostScore,
        avgMissionScore,
        missionStats,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError('데이터를 불러오는 데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSV = async () => {
    if (!classCode.trim()) return;

    try {
      const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .eq('class_code', classCode.trim())
        .not('completed_at', 'is', null);

      if (!sessions) return;

      const sessionIds = sessions.map((s) => s.id);

      const { data: missionResponses } = await supabase
        .from('mission_responses')
        .select('*')
        .in('session_id', sessionIds);

      const { data: pledges } = await supabase
        .from('pledges')
        .select('*')
        .in('session_id', sessionIds);

      // Create CSV
      const headers = [
        '닉네임',
        '완료시간',
        ...missions.map((m) => `미션${m.id}_${m.title}`),
        '총점',
        '실천약속',
      ];

      const rows = sessions.map((session) => {
        const sessionResponses = (missionResponses || []).filter(
          (r) => r.session_id === session.id
        );
        const pledge = (pledges || []).find((p) => p.session_id === session.id);
        const totalScore = sessionResponses.reduce((sum, r) => sum + r.score, 0);

        return [
          session.nickname || '익명',
          new Date(session.completed_at!).toLocaleString('ko-KR'),
          ...missions.map((m) => {
            const response = sessionResponses.find((r) => r.mission_number === m.id);
            return response ? `${response.selected_option}(${response.score}점)` : '-';
          }),
          totalScore,
          pledge?.pledge_text || '',
        ];
      });

      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ethics-pick-${classCode}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (error) {
      console.error('Failed to download CSV:', error);
    }
  };

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">교사용 대시보드</h1>
            <p className="text-muted-foreground">학급 통계 및 분석</p>
          </div>
        </div>

        {/* Class Code Input */}
        <Card className="border-border/50 bg-card/80 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Input
                placeholder="학급 코드 입력"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && fetchClassStats()}
              />
              <Button onClick={fetchClassStats} disabled={isLoading}>
                {isLoading ? '조회 중...' : '조회하기'}
              </Button>
            </div>
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>

        {stats && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-border/50 bg-card/80">
                <CardContent className="pt-6 text-center">
                  <Users className="w-8 h-8 mx-auto text-primary mb-2" />
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                  <p className="text-sm text-muted-foreground">참여 학생</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/80">
                <CardContent className="pt-6 text-center">
                  <BarChart3 className="w-8 h-8 mx-auto text-info mb-2" />
                  <p className="text-2xl font-bold">{stats.avgPreScore.toFixed(0)}%</p>
                  <p className="text-sm text-muted-foreground">사전 정답률</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/80">
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto text-success mb-2" />
                  <p className="text-2xl font-bold">{stats.avgPostScore.toFixed(0)}%</p>
                  <p className="text-sm text-muted-foreground">사후 정답률</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-card/80">
                <CardContent className="pt-6 text-center">
                  <BarChart3 className="w-8 h-8 mx-auto text-accent mb-2" />
                  <p className="text-2xl font-bold">{stats.avgMissionScore.toFixed(0)}%</p>
                  <p className="text-sm text-muted-foreground">미션 평균</p>
                </CardContent>
              </Card>
            </div>

            {/* Pre/Post Comparison */}
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">사전 → 사후 변화</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">사전 진단</span>
                      <span className="text-sm font-medium">{stats.avgPreScore.toFixed(0)}%</span>
                    </div>
                    <div className="h-4 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-info rounded-full transition-all duration-1000"
                        style={{ width: `${stats.avgPreScore}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">사후 진단</span>
                      <span className="text-sm font-medium">{stats.avgPostScore.toFixed(0)}%</span>
                    </div>
                    <div className="h-4 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success rounded-full transition-all duration-1000"
                        style={{ width: `${stats.avgPostScore}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-center">
                    {stats.avgPostScore > stats.avgPreScore ? (
                      <span className="text-success">
                        📈 {(stats.avgPostScore - stats.avgPreScore).toFixed(1)}%p 향상!
                      </span>
                    ) : stats.avgPostScore < stats.avgPreScore ? (
                      <span className="text-destructive">
                        📉 {(stats.avgPreScore - stats.avgPostScore).toFixed(1)}%p 하락
                      </span>
                    ) : (
                      <span className="text-muted-foreground">변화 없음</span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Mission Stats */}
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">문항별 분석</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {stats.missionStats.map((mission) => (
                  <div key={mission.missionId} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        미션 {mission.missionId}: {mission.title}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        평균 {mission.avgScore.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <div
                        className="h-6 bg-success/80 rounded flex items-center justify-center text-success-foreground"
                        style={{
                          width: `${
                            (mission.optionDistribution.A /
                              (mission.optionDistribution.A +
                                mission.optionDistribution.B +
                                mission.optionDistribution.C || 1)) *
                            100
                          }%`,
                          minWidth: mission.optionDistribution.A > 0 ? '30px' : '0',
                        }}
                      >
                        {mission.optionDistribution.A > 0 && `A: ${mission.optionDistribution.A}`}
                      </div>
                      <div
                        className="h-6 bg-warning/80 rounded flex items-center justify-center text-warning-foreground"
                        style={{
                          width: `${
                            (mission.optionDistribution.B /
                              (mission.optionDistribution.A +
                                mission.optionDistribution.B +
                                mission.optionDistribution.C || 1)) *
                            100
                          }%`,
                          minWidth: mission.optionDistribution.B > 0 ? '30px' : '0',
                        }}
                      >
                        {mission.optionDistribution.B > 0 && `B: ${mission.optionDistribution.B}`}
                      </div>
                      <div
                        className="h-6 bg-destructive/80 rounded flex items-center justify-center text-destructive-foreground"
                        style={{
                          width: `${
                            (mission.optionDistribution.C /
                              (mission.optionDistribution.A +
                                mission.optionDistribution.B +
                                mission.optionDistribution.C || 1)) *
                            100
                          }%`,
                          minWidth: mission.optionDistribution.C > 0 ? '30px' : '0',
                        }}
                      >
                        {mission.optionDistribution.C > 0 && `C: ${mission.optionDistribution.C}`}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Download Button */}
            <Button onClick={downloadCSV} className="w-full" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              CSV 다운로드 (연구대회 증거자료)
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
