'use client';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface BlurTextProps {
    text: string;
    delay?: number;
    className?: string;
    animateBy?: 'words' | 'letters';
    direction?: 'top' | 'bottom';
    threshold?: number;
    rootMargin?: string;
    animationFrom?: Record<string, any>;
    animationTo?: Record<string, any>;
    easing?: any;
    onAnimationComplete?: () => void;
}

const BlurText = ({
    text = '',
    delay = 200,
    className = '',
    animateBy = 'words',
    direction = 'top',
    threshold = 0.1,
    rootMargin = '0px',
    animationFrom,
    animationTo,
    easing = 'easeOut',
    onAnimationComplete,
}: BlurTextProps) => {
    const elements = animateBy === 'words' ? text.split(' ') : text.split('');
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLParagraphElement>(null);

    const defaultFrom = animationFrom || {
        filter: 'blur(10px)',
        opacity: 0,
        y: direction === 'top' ? -50 : 50,
    };
    const defaultTo = animationTo || {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    if (ref.current) observer.unobserve(ref.current);
                }
            },
            { threshold, rootMargin }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return (
        <p ref={ref} className={`flex flex-wrap ${className}`}>
            {elements.map((el, i) => (
                <motion.span
                    key={i}
                    initial={defaultFrom}
                    animate={inView ? defaultTo : defaultFrom}
                    transition={{
                        duration: 0.5,
                        delay: i * (delay / 1000),
                        ease: easing,
                    }}
                    onAnimationComplete={
                        i === elements.length - 1 ? onAnimationComplete : undefined
                    }
                    className="inline-block will-change-[filter,opacity,transform]"
                >
                    {el === ' ' ? '\u00A0' : el}
                    {animateBy === 'words' && i < elements.length - 1 && '\u00A0'}
                </motion.span>
            ))}
        </p>
    );
};

export default BlurText;
