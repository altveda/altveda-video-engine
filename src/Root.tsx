import { Composition } from 'remotion';
import { CinematicScience } from './compositions/factory/CinematicScience';
import { SkepticsChoice } from './compositions/factory/SkepticsChoice';
import { AmlaVsOrange } from './compositions/static/AmlaVsOrange';
import React from 'react';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CinematicScience_Demo"
        component={CinematicScience}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          productName: "Ashwagandha",
          tagline: "Stop Guessing. Start Knowing.",
          finding: "27.9% Cortisol Reduction"
        }}
      />
      <Composition
        id="SkepticsChoice_Demo"
        component={SkepticsChoice}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          leftTitle: "1 Orange",
          leftValue: "50mg",
          rightTitle: "1 Amla",
          rightValue: "800mg",
          hook: "Vitamin C Purity Test"
        }}
      />
      <Composition
        id="AmlaVsOrange_Static"
        component={AmlaVsOrange}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
