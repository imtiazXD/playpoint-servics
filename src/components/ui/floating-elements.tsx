import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingElementProps extends React.HTMLAttributes<HTMLDivElement> {
  floatDirection?: 'up' | 'down' | 'left' | 'right' | 'circular';
  duration?: number;
  intensity?: number;
}

const FloatingElement = React.forwardRef<HTMLDivElement, FloatingElementProps>(
  ({ 
    className, 
    children,
    floatDirection = 'up',
    duration = 3,
    intensity = 10,
    ...props 
  }, ref) => {
    const getFloatAnimation = () => {
      const keyframes = `
        @keyframes float-${floatDirection}-${duration} {
          0%, 100% { transform: translate(0, 0) ${floatDirection === 'circular' ? 'rotate(0deg)' : ''}; }
          ${floatDirection === 'up' ? `50% { transform: translateY(-${intensity}px); }` : ''}
          ${floatDirection === 'down' ? `50% { transform: translateY(${intensity}px); }` : ''}
          ${floatDirection === 'left' ? `50% { transform: translateX(-${intensity}px); }` : ''}
          ${floatDirection === 'right' ? `50% { transform: translateX(${intensity}px); }` : ''}
          ${floatDirection === 'circular' ? `
            25% { transform: translate(${intensity}px, -${intensity}px) rotate(90deg); }
            50% { transform: translate(0, -${intensity * 2}px) rotate(180deg); }
            75% { transform: translate(-${intensity}px, -${intensity}px) rotate(270deg); }
          ` : ''}
        }
      `;
      
      // Inject keyframes into document head
      React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
      }, []);

      return `float-${floatDirection}-${duration} ${duration}s ease-in-out infinite`;
    };

    return (
      <div
        ref={ref}
        className={cn("inline-block", className)}
        style={{ 
          animation: getFloatAnimation(),
          animationFillMode: 'both'
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FloatingElement.displayName = "FloatingElement";

export { FloatingElement };