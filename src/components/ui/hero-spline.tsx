"use client";

import Spline from '@splinetool/react-spline';

export function HeroSplineBackground() {
    return (
        <div className="absolute inset-0 w-full h-screen overflow-hidden" aria-hidden="true">
            <div className="w-full h-full absolute inset-0 z-0 filter invert grayscale contrast-[1.2] brightness-[1.1] opacity-60 mix-blend-multiply dark:invert-0 dark:grayscale-0 dark:contrast-100 dark:brightness-100 dark:opacity-100 dark:mix-blend-normal dark:saturate-[1.2]">
                <Spline
                    className="w-full h-full"
                    scene="https://prod.spline.design/dJqTIQ-tE3ULUPMi/scene.splinecode"
                />
            </div>

            {/* Gradient Overlays to blend with theme */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-background via-transparent to-background opacity-80" />
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>
    );
}
