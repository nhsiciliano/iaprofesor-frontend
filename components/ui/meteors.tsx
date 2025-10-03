"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useMemo } from "react";

export const Meteors = ({
    number,
    className,
}: {
    number?: number;
    className?: string;
}) => {
    const meteorCount = number || 20;
    
    // Generate consistent meteor data based on number prop to avoid hydration mismatch
    const meteors = useMemo(() => {
        return new Array(meteorCount).fill(null).map((_, idx) => {
            // Use index-based calculations for consistent values between server and client
            const position = idx * (800 / meteorCount) - 400;
            
            // Create deterministic "random" values based on index
            const seedDelay = (idx * 1234.567) % 5000; // Pseudo-random delay 0-5000ms
            const seedDuration = 5 + ((idx * 987.654) % 5); // Duration between 5-10s
            
            return {
                id: `meteor-${idx}`,
                position,
                animationDelay: `${seedDelay / 1000}s`,
                animationDuration: `${Math.floor(seedDuration)}s`
            };
        });
    }, [meteorCount]);
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {meteors.map((meteor) => (
                <span
                    key={meteor.id}
                    className={cn(
                        "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
                        "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
                        className
                    )}
                    style={{
                        top: "-40px",
                        left: `${meteor.position}px`,
                        animationDelay: meteor.animationDelay,
                        animationDuration: meteor.animationDuration,
                    }}
                ></span>
            ))}
        </motion.div>
    );
};
