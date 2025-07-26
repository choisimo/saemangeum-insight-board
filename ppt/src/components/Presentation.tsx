import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TitleSlide } from "./slides/TitleSlide";
import { ProblemSlide } from "./slides/ProblemSlide";
import { WhyJeonbukSlide } from "./slides/WhyJeonbukSlide";
import { SolutionSlide } from "./slides/SolutionSlide";
import { GoalsSlide } from "./slides/GoalsSlide";
import { Strategy1Slide } from "./slides/Strategy1Slide";
import { Strategy2Slide } from "./slides/Strategy2Slide";
import { ExpectedEffectsSlide } from "./slides/ExpectedEffectsSlide";
import { TeamSlide } from "./slides/TeamSlide";
import { ThankYouSlide } from "./slides/ThankYouSlide";

const slides = [
  { component: TitleSlide, title: "표지" },
  { component: ProblemSlide, title: "문제 제기" },
  { component: WhyJeonbukSlide, title: "왜 전북인가?" },
  { component: SolutionSlide, title: "해결책" },
  { component: GoalsSlide, title: "프로젝트 목표" },
  { component: Strategy1Slide, title: "추진 전략 1" },
  { component: Strategy2Slide, title: "추진 전략 2" },
  { component: ExpectedEffectsSlide, title: "기대 효과" },
  { component: TeamSlide, title: "팀 소개" },
  { component: ThankYouSlide, title: "감사합니다" },
];

export const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation Bar */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevSlide}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {currentSlide + 1} / {slides.length} - {slides[currentSlide].title}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextSlide}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Slide thumbnails */}
        <div className="flex gap-1">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide
                  ? "bg-primary-foreground"
                  : "bg-primary-foreground/30 hover:bg-primary-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 overflow-hidden">
        <CurrentSlideComponent />
      </div>

      {/* Keyboard navigation hint */}
      <div className="text-xs text-muted-foreground p-2 text-center">
        키보드 ← → 화살표 키로도 슬라이드 이동 가능
      </div>
    </div>
  );
};

// Add keyboard event listener
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    document.dispatchEvent(new CustomEvent("nextSlide"));
  } else if (e.key === "ArrowLeft") {
    document.dispatchEvent(new CustomEvent("prevSlide"));
  }
});