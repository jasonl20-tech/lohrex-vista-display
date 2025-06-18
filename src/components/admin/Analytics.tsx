
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BarChart3, TrendingUp, Users, Eye, Clock, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  metric_name: string;
  metric_value: number;
  metric_date: string;
}

export const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics_data')
        .select('*')
        .order('metric_date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Analytics:', error);
      toast.error('Fehler beim Laden der Analytics');
    } finally {
      setLoading(false);
    }
  };

  const addSampleData = async () => {
    try {
      const sampleData = [
        { metric_name: 'page_views', metric_value: Math.floor(Math.random() * 1000) + 500 },
        { metric_name: 'unique_visitors', metric_value: Math.floor(Math.random() * 500) + 200 },
        { metric_name: 'bounce_rate', metric_value: Math.random() * 50 + 25 },
        { metric_name: 'conversion_rate', metric_value: Math.random() * 5 + 1 },
      ];

      const { error } = await supabase
        .from('analytics_data')
        .insert(sampleData);

      if (error) throw error;
      
      await loadAnalytics();
      toast.success('Beispieldaten hinzugefügt');
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Daten:', error);
      toast.error('Fehler beim Hinzufügen der Daten');
    }
  };

  const getCurrentMetrics = () => {
    const latest = analytics.filter(a => a.metric_date === analytics[0]?.metric_date);
    return {
      pageViews: latest.find(a => a.metric_name === 'page_views')?.metric_value || 0,
      uniqueVisitors: latest.find(a => a.metric_name === 'unique_visitors')?.metric_value || 0,
      bounceRate: latest.find(a => a.metric_name === 'bounce_rate')?.metric_value || 0,
      conversionRate: latest.find(a => a.metric_name === 'conversion_rate')?.metric_value || 0,
    };
  };

  const getChartData = () => {
    const dates = [...new Set(analytics.map(a => a.metric_date))].slice(0, 7);
    return dates.map(date => {
      const dayData = analytics.filter(a => a.metric_date === date);
      return {
        date: new Date(date).toLocaleDateString('de-DE'),
        pageViews: dayData.find(a => a.metric_name === 'page_views')?.metric_value || 0,
        uniqueVisitors: dayData.find(a => a.metric_name === 'unique_visitors')?.metric_value || 0,
      };
    }).reverse();
  };

  const metrics = getCurrentMetrics();
  const chartData = getChartData();

  if (loading) {
    return (
      <Card className="modern-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <Button onClick={addSampleData} className="modern-button">
          <TrendingUp className="w-4 h-4 mr-2" />
          Beispieldaten hinzufügen
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Seitenaufrufe</CardTitle>
            <Eye className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.pageViews.toLocaleString()}</div>
            <p className="text-xs text-green-400">+12% seit letzter Woche</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-green-400">+8% seit letzter Woche</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Bounce Rate</CardTitle>
            <Clock className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.bounceRate.toFixed(1)}%</div>
            <p className="text-xs text-red-400">-3% seit letzter Woche</p>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-green-400">+0.5% seit letzter Woche</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="text-white">Seitenaufrufe (7 Tage)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="pageViews" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="text-white">Besucher Vergleich</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="uniqueVisitors" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
