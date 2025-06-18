
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface AdminHeaderProps {
  userEmail: string;
}

export const AdminHeader = ({ userEmail }: AdminHeaderProps) => {
  return (
    <div className="border-b border-gray-800 bg-black/50 backdrop-blur-xl mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Shield className="w-8 h-8 text-red-400" />
            <h1 className="text-2xl font-bold modern-lava-text">Admin Dashboard</h1>
          </div>
          <Badge variant="secondary" className="bg-red-900/20 text-red-400 border-red-500/30">
            Administrator
          </Badge>
        </div>
      </div>
    </div>
  );
};
