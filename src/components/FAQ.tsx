
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-black via-gray-900/10 to-black relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className={`text-center mb-16 scroll-reveal ${titleVisible ? 'revealed' : ''}`}>
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-full border border-blue-500/30 mb-6">
            <HelpCircle className="inline mr-2" size={16} />
            <span className="text-blue-300 font-semibold">Häufige Fragen</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-8">
            <span className="text-white font-light">Fragen &</span>
            <br />
            <span className="modern-lava-text">Antworten</span>
          </h2>
        </div>

        <div ref={faqRef} className={`space-y-4 scroll-reveal ${faqVisible ? 'revealed' : ''}`}>
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="glass-effect rounded-2xl border border-gray-700/50 hover:border-red-500/30 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-red-900/10 transition-colors rounded-2xl"
              >
                <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="text-red-400 flex-shrink-0" size={24} />
                ) : (
                  <ChevronDown className="text-red-400 flex-shrink-0" size={24} />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
