import { Composition } from 'remotion';
import { CinematicScience } from './compositions/factory/CinematicScience';
import { SkepticsChoice } from './compositions/factory/SkepticsChoice';
import { FoundersHeart } from './compositions/factory/FoundersHeart';
import { DataScroll } from './compositions/factory/DataScroll';
import { BentoSpotlight } from './compositions/factory/BentoSpotlight';
import { AmlaVsOrange } from './compositions/static/AmlaVsOrange';
import React from 'react';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CinematicScience-Demo"
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
        id="SkepticsChoice-Demo"
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
        id="FoundersHeart-Demo"
        component={FoundersHeart}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          quote: "If you cannot explain what is in it, you should not be selling it.",
          subtext: "My journey to Ayurveda started with a need for truth in wellness. No fillers. No binders. Just pure extracts.",
          storyPoint: "THE ALTVEDA MISSION"
        }}
      />
      <Composition
        id="DataScroll-Demo"
        component={DataScroll}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          label: "CORTISOL CONTROL",
          value: "27.9%",
          metricName: "REDUCTION",
          studySource: "Chandrasekhar et al. (2012)"
        }}
      />
      <Composition
        id="BentoSpotlight-Demo"
        component={BentoSpotlight}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          productName: "Amla",
          finding: "20x More Vit C",
          badge: "VAIDYA CHOICE"
        }}
      />
      <Composition
        id="AmlaVsOrange-Static"
        component={AmlaVsOrange}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
