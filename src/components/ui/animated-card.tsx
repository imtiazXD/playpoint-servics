import * as React from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  animationType?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'rotate';
  delay?: number;
  triggerOnce?: boolean;
  hoverEffect?: boolean;
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ 
    className, 
    children, 
    animationType = 'fade-up',
    delay = 0,
    triggerOnce = true,
    hoverEffect = true,
    ...props 
  }, ref) => {
    const { elementRef, isVisible } = useScrollAnimation({ triggerOnce });
    
    const getAnimationClass = () => {
      switch (animationType) {
        case 'fade-left': return 'animate-fade-in-left';
        case 'fade-right': return 'animate-fade-in-right';
        case 'scale': return 'animate-scale-in';
        case 'rotate': return 'animate-rotate-in';
        default: return 'animate-fade-in-up';
      }
    };

    return (
      <div
        ref={(node) => {
          elementRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "transition-all duration-300 ease-out",
          !isVisible && "opacity-0 translate-y-8",
          isVisible && getAnimationClass(),
          hoverEffect && "hover-lift",
          className
        )}
        style={{ animationDelay: `${delay}ms` }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

export { AnimatedCard };