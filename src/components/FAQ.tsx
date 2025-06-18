
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTheme } from "@/contexts/ThemeContext";

const faqs = [
  {
    question: "Wie lange dauert die Entwicklung einer Website?",
    answer: "Die Entwicklungszeit hängt vom Umfang des Projekts ab. Eine einfache Website dauert 2-4 Wochen, komplexere Anwendungen 2-6 Monate. Wir erstellen immer einen detaillierten Zeitplan."
  },
  {
    question: "Welche Technologien verwenden Sie?",
    answer: "Wir setzen auf moderne Technologien wie React, TypeScript, Node.js, Python und Cloud-Services. Die Auswahl richtet sich nach den spezifischen Anforderungen Ihres Projekts."
  },
  {
    question: "Bieten Sie auch Wartung und Support an?",
    answer: "Ja, wir bieten umfassende Wartungs- und Support-Pakete an. Diese umfassen Updates, Sicherheitspatches, Performance-Optimierungen und technischen Support."
  },
  {
    question: "Können Sie bestehende Systeme modernisieren?",
    answer: "Absolut! Wir haben umfangreiche Erfahrung in der Modernisierung bestehender Systeme und der Migration zu modernen Technologien ohne Datenverlust."
  },
  {
    question: "Wie läuft die Zusammenarbeit ab?",
    answer: "Wir arbeiten agil und transparent. Nach einem ausführlichen Briefing erstellen wir Prototypen, setzen in Sprints um und halten Sie kontinuierlich über den Fortschritt auf dem Laufenden."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation();
  const { theme } = useTheme();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getThemeAccent = () => {
    const themeColors = {
      red: 'text-red-300',
      silver: 'text-gray-600',
      blue: 'text-blue-300',
      purple: 'text-purple-300',
      green: 'text-green-300',
      orange: 'text-orange-300',
      pink: 'text-pink-300',
      cyan: 'text-cyan-300',
      amber: 'text-amber-300',
      emerald: 'text-emerald-300',
      indigo: 'text-indigo-300',
      rose: 'text-rose-300'
    };
    return themeColors[theme] || 'text-red-300';
  };

  const getThemeBorder = () => {
    const themeColors = {
      red: 'border-red-500/30',
      silver: 'border-gray-500/30',
      blue: 'border-blue-500/30',
      purple: 'border-purple-500/30',
      green: 'border-green-500/30',
      orange: 'border-orange-500/30',
      pink: 'border-pink-500/30',
      cyan: 'border-cyan-500/30',
      amber: 'border-amber-500/30',
      emerald: 'border-emerald-500/30',
      indigo: 'border-indigo-500/30',
      rose: 'border-rose-500/30'
    };
    return themeColors[theme] || 'border-red-500/30';
  };

  const getThemeHover = () => {
    const themeColors = {
      red: 'hover:border-red-500/30',
      silver: 'hover:border-gray-500/30',
      blue: 'hover:border-blue-500/30',
      purple: 'hover:border-purple-500/30',
      green: 'hover:border-green-500/30',
      orange: 'hover:border-orange-500/30',
      pink: 'hover:border-pink-500/30',
      cyan: 'hover:border-cyan-500/30',
      amber: 'hover:border-amber-500/30',
      emerald: 'hover:border-emerald-500/30',
      indigo: 'hover:border-indigo-500/30',
      rose: 'hover:border-rose-500/30'
    };
    return themeColors[theme] || 'hover:border-red-500/30';
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/10 to-background relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className={`text-center mb-16 scroll-reveal ${titleVisible ? 'revealed' : ''}`}>
          <div className={`inline-block px-6 py-2 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full ${getThemeBorder()} border mb-6`}>
            <HelpCircle className="inline mr-2" size={16} />
            <span className={`${getThemeAccent()} font-semibold`}>Häufige Fragen</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            <span className="text-foreground font-light">Fragen &</span>
            <br />
            <span className="modern-lava-text">Antworten</span>
          </h2>
        </div>

        <div ref={faqRef} className={`space-y-4 scroll-reveal ${faqVisible ? 'revealed' : ''}`}>
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`glass-effect rounded-2xl border-border ${getThemeHover()} transition-all duration-300`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full p-6 text-left flex justify-between items-center hover:bg-primary/10 transition-colors rounded-2xl`}
              >
                <h3 className="text-lg font-semibold text-foreground pr-4">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className={getThemeAccent().replace('text-', 'text-').split(' ')[0] + ' flex-shrink-0'} size={24} />
                ) : (
                  <ChevronDown className={getThemeAccent().replace('text-', 'text-').split(' ')[0] + ' flex-shrink-0'} size={24} />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
