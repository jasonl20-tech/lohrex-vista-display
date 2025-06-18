
interface WelcomeSectionProps {
  userEmail: string;
}

export const WelcomeSection = ({ userEmail }: WelcomeSectionProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-white mb-2">
        Willkommen zurück, {userEmail}
      </h2>
      <p className="text-gray-400">
        Verwalten Sie Ihre Website und überwachen Sie wichtige Metriken.
      </p>
    </div>
  );
};
