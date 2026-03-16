"use client";

import React from "react";

interface LiquidGlassProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const LiquidGlass: React.FC<LiquidGlassProps> = ({ children, className, style }) => {
    return (
        <div
            className={className}
            style={{
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                background: "rgba(182, 145, 97, 0.18)",
                border: "1px solid rgba(182, 145, 97, 0.35)",
                boxShadow: "0 8px 32px 0 rgba(182, 145, 97, 0.15)",
                ...style,
            }}
        >
            {children}
        </div>
    );
};

export default LiquidGlass;
