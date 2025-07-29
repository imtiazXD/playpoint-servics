import * as React from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  speed?: number;
  showCursor?: boolean;
  startDelay?: number;
}

const TypewriterText = React.forwardRef<HTMLDivElement, TypewriterTextProps>(
  ({ 
    className, 
    text, 
    speed = 50,
    showCursor = true,
    startDelay = 0,
    ...props 
  }, ref) => {
    const [displayText, setDisplayText] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(false);

    React.useEffect(() => {
      const timer = setTimeout(() => {
        setIsTyping(true);
        let index = 0;
        
        const typeInterval = setInterval(() => {
          if (index < text.length) {
            setDisplayText(text.slice(0, index + 1));
            index++;
          } else {
            setIsTyping(false);
            clearInterval(typeInterval);
          }
        }, speed);

        return () => clearInterval(typeInterval);
      }, startDelay);

      return () => clearTimeout(timer);
    }, [text, speed, startDelay]);

    return (
      <div
        ref={ref}
        className={cn("inline-block", className)}
        {...props}
      >
        {displayText}
        {showCursor && (
          <span className={cn(
            "inline-block w-0.5 h-5 bg-current ml-1",
            isTyping ? "animate-blink" : "opacity-0"
          )} />
        )}
      </div>
    );
  }
);

TypewriterText.displayName = "TypewriterText";

export { TypewriterText };