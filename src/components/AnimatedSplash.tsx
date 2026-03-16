import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    runOnJS,
} from "react-native-reanimated";
import type { SharedValue } from 'react-native-reanimated';
import Svg, { Path, Rect, G, Defs, Mask, ClipPath, Image as SvgImage } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedSVGPath = Animated.createAnimatedComponent(Path);

function LogoPath({ d, index, progress }: { readonly d: string; readonly index: number; readonly progress: SharedValue<number> }) {
    const animatedProps = useAnimatedProps(() => {
        const delay = 0.25 + index * 0.012;
        const window = 0.5;
        const t = (progress.value - delay) / window;
        const clamped = Math.max(0, Math.min(1, t));
        const opacity = 1 - Math.pow(1 - clamped, 3);
        return {
            opacity,
        } as any;
    });

    return <AnimatedSVGPath animatedProps={animatedProps} d={d} fill="#5645cc" />;
}

// All `d` attributes copied from assets/usetri_splash.svg
const PATHS = [
    `M207.15,261.33l50.97-28.47c7.06,12.48,17.64,18.72,35.29,18.72,14.51,0,21.17-5.07,21.17-11.31,0-23.79-103.52.39-103.52-75.28,0-36.66,31.37-66.31,84.7-66.31,46.66,0,72.15,22.62,83.52,44.46l-50.97,28.86c-4.31-11.7-17.65-18.72-30.98-18.72-10.2,0-15.68,4.29-15.68,10.14,0,24.18,103.52,1.95,103.52,75.28,0,40.95-40.39,67.48-88.23,67.48-44.31,0-72.93-15.21-89.79-44.85ZM207.94,7.41h67.84l20.39,28.86,20.39-28.86h67.84l-30.19,42.51c-27.05,38.22-89.01,38.22-116.07,0l-30.19-42.51Z`,
    `M393.01,200.09c0-56.17,42.35-102.97,104.3-102.97s99.99,47.59,99.99,99.85v17.55h-136.46c4.71,19.5,19.61,31.2,41.17,31.2,18.82,0,33.72-10.14,40.78-25.35l54.11,26.91c-16.86,36.27-50.19,58.11-94.11,58.11-62.74,0-109.79-41.34-109.79-105.31ZM527.11,178.25c-3.14-10.92-14.12-21.06-30.58-21.06s-28.23,9.75-32.54,21.06h63.13Z`,
    `M634.55,216.86v-53.43h-33.33v-58.51h33.33v-48.75h70.58v48.75h64.31v58.51h-64.31v51.1c0,18.72,11.37,29.25,29.8,29.25,9.8,0,25.1-2.73,34.51-7.8v62.02c-9.8,5.46-27.84,8.19-41.17,8.19-63.91,0-93.72-37.44-93.72-89.32Z`,
    `M915.3,42.12c0-23.01,19.21-42.12,42.35-42.12s42.35,19.11,42.35,42.12-19.21,42.12-42.35,42.12-42.35-19.11-42.35-42.12ZM992.94,104.92v195.02h-70.58V104.92h70.58Z`,
    `M116.52,105.02c6.01,9.44,11.82,19.9,17.17,31.14,25.3,53.15,30.61,103.46,11.27,112.67l-8.67,4.13c-18.77,8.93-55.02-26.67-80.3-79.82-11.67-24.52-18.93-48.52-21.55-68.12H0v97.18C0,259.46,33.97,305.69,99.14,305.69s99.55-46.22,99.55-103.49v-97.18h-82.17Z`,
    `M41.95,393.19v-27.34h-9.76v-9.68h30.75v9.68h-9.76v27.34h-11.23Z`,
    `M83.94,393.19l-14.09-37.02h12.09l11.47,31.26h-7.19l11.81-31.26h11.04l-14.09,37.02h-11.04Z`,
    `M135.77,394.03c-2.73,0-5.24-.48-7.55-1.43-2.3-.95-4.29-2.3-5.97-4.05-1.68-1.75-2.99-3.8-3.93-6.16-.94-2.36-1.4-4.94-1.4-7.72s.47-5.4,1.4-7.75c.94-2.34,2.24-4.39,3.93-6.13s3.67-3.09,5.97-4.05,4.8-1.43,7.5-1.43,5.24.48,7.52,1.43c2.28.95,4.27,2.3,5.95,4.05s2.99,3.79,3.93,6.13c.94,2.35,1.4,4.93,1.4,7.75s-.47,5.36-1.4,7.72-2.24,4.42-3.93,6.16-3.67,3.09-5.95,4.05c-2.28.95-4.78,1.43-7.47,1.43ZM135.72,383.93c1.05,0,2.02-.21,2.93-.63s1.7-1.03,2.38-1.83c.68-.79,1.21-1.76,1.6-2.91.38-1.15.57-2.44.57-3.89s-.19-2.74-.57-3.89-.91-2.12-1.6-2.91c-.68-.79-1.48-1.4-2.38-1.83s-1.88-.63-2.93-.63-2.02.21-2.93.63-1.7,1.03-2.38,1.83c-.68.79-1.21,1.76-1.6,2.91s-.57,2.44-.57,3.89.19,2.74.57,3.89c.38,1.15.91,2.12,1.6,2.91.68.79,1.48,1.4,2.38,1.83s1.88.63,2.93.63Z`,
    `M174.9,394.03c-2.6,0-4.95-.47-7.04-1.4-2.09-.93-3.84-2.3-5.24-4.1l6.04-7.93c.89,1.2,1.76,2.11,2.62,2.72.86.62,1.75.93,2.67.93,2.41,0,3.62-1.53,3.62-4.6v-14.07h-11.33v-9.41h22.42v22.74c0,5.08-1.17,8.87-3.52,11.37-2.35,2.5-5.76,3.75-10.23,3.75Z`,
    `M237.63,394.03c-2.79,0-5.49-.35-8.09-1.06-2.6-.71-4.74-1.62-6.43-2.75l3.62-9.1c1.59,1.02,3.36,1.84,5.31,2.46,1.95.62,3.85.93,5.69.93,1.08,0,1.93-.08,2.55-.24.62-.16,1.07-.39,1.36-.69.28-.3.43-.66.43-1.08,0-.67-.33-1.2-1-1.59-.67-.39-1.55-.71-2.64-.98-1.09-.26-2.29-.55-3.59-.85s-2.61-.7-3.93-1.19c-1.32-.49-2.52-1.15-3.62-1.96-1.09-.81-1.98-1.88-2.64-3.2-.67-1.32-1-2.97-1-4.94,0-2.29.58-4.38,1.74-6.27s2.89-3.39,5.19-4.52c2.3-1.13,5.16-1.69,8.59-1.69,2.25,0,4.47.26,6.66.79,2.19.53,4.16,1.34,5.9,2.43l-3.38,9.04c-1.65-.92-3.25-1.6-4.78-2.06-1.54-.46-3.04-.69-4.5-.69-1.08,0-1.94.1-2.57.32-.63.21-1.09.49-1.36.85-.27.35-.4.74-.4,1.16,0,.63.33,1.14,1,1.51.67.37,1.55.68,2.64.93,1.09.25,2.3.51,3.62.79,1.32.28,2.63.67,3.93,1.16,1.3.49,2.5,1.15,3.59,1.96,1.09.81,1.98,1.87,2.64,3.17.67,1.3,1,2.93,1,4.87,0,2.26-.58,4.33-1.74,6.21-1.16,1.89-2.88,3.4-5.16,4.55-2.29,1.15-5.16,1.72-8.62,1.72Z`,
    `M265.05,393.19v-37.02h16.04c3.11,0,5.8.56,8.07,1.69,2.27,1.13,4.02,2.74,5.26,4.84,1.24,2.1,1.86,4.57,1.86,7.43s-.62,5.32-1.86,7.4c-1.24,2.08-2.99,3.7-5.26,4.84-2.27,1.15-4.96,1.72-8.07,1.72h-9.81l5-5.34v14.44h-11.23ZM276.28,380.13l-5-5.66h9.09c1.55,0,2.7-.39,3.45-1.16.75-.77,1.12-1.83,1.12-3.17s-.37-2.4-1.12-3.17c-.75-.77-1.9-1.16-3.45-1.16h-9.09l5-5.66v19.99Z`,
    `M308.51,393.19v-37.02h15.56c5.11,0,9,1.25,11.66,3.76,2.67,2.5,4,5.91,4,10.21,0,2.86-.62,5.32-1.86,7.38-1.24,2.06-2.99,3.64-5.26,4.73-2.27,1.09-4.96,1.64-8.07,1.64h-9.81l5-5.13v14.44h-11.23ZM319.74,380.13l-5-5.66h9.09c1.55,0,2.7-.39,3.45-1.16.75-.77,1.12-1.83,1.12-3.17s-.37-2.4-1.12-3.17c-.75-.77-1.9-1.16-3.45-1.16h-9.09l5-5.66v19.99ZM328.45,393.19l-8.19-13.49h11.9l8.28,13.49h-11.99Z`,
    `M352.54,393.19v-37.02h11.23v37.02h-11.23Z`,
    `M377.77,393.19v-37.02h27.08v9.41h-16.04v18.19h16.66v9.41h-27.7ZM388.05,378.91v-8.99h14.85v8.99h-14.85Z`,
    `M428.36,393.19l-14.09-37.02h12.09l11.47,31.26h-7.19l11.81-31.26h11.04l-14.09,37.02h-11.04Z`,
    `M480.2,394.03c-2.73,0-5.24-.48-7.55-1.43-2.3-.95-4.29-2.3-5.97-4.05-1.68-1.75-2.99-3.8-3.93-6.16-.94-2.36-1.4-4.94-1.4-7.72s.47-5.4,1.4-7.75c.94-2.34,2.24-4.39,3.93-6.13,1.68-1.75,3.67-3.09,5.97-4.05s4.8-1.43,7.5-1.43,5.24.48,7.52,1.43c2.28.95,4.27,2.3,5.95,4.05s2.99,3.79,3.93,6.13c.94,2.35,1.4,4.93,1.4,7.75s-.47,5.36-1.4,7.72c-.94,2.36-2.24,4.42-3.93,6.16-1.68,1.75-3.67,3.09-5.95,4.05-2.28.95-4.78,1.43-7.47,1.43ZM480.15,383.93c1.05,0,2.02-.21,2.93-.63s1.7-1.03,2.38-1.83c.68-.79,1.21-1.76,1.6-2.91.38-1.15.57-2.44.57-3.89s-.19-2.74-.57-3.89-.91-2.12-1.6-2.91c-.68-.79-1.48-1.4-2.38-1.83s-1.88-.63-2.93-.63-2.02.21-2.93.63-1.7,1.03-2.38,1.83c-.68.79-1.21,1.76-1.6,2.91s-.57,2.44-.57,3.89.19,2.74.57,3.89c.38,1.15.91,2.12,1.6,2.91.68.79,1.48,1.4,2.38,1.83s1.88.63,2.93.63Z`,
    `M511.61,393.19v-37.02h16.42c3.71,0,6.98.75,9.81,2.25,2.82,1.5,5.03,3.62,6.62,6.37,1.59,2.75,2.38,6.05,2.38,9.89s-.79,7.1-2.38,9.86c-1.59,2.77-3.79,4.9-6.62,6.4-2.83,1.5-6.09,2.25-9.81,2.25h-16.42ZM522.85,383.46h4.71c1.59,0,2.97-.33,4.17-1,1.19-.67,2.12-1.66,2.78-2.99.67-1.32,1-2.92,1-4.79s-.33-3.51-1-4.81c-.67-1.3-1.6-2.29-2.78-2.96-1.19-.67-2.58-1-4.17-1h-4.71v17.56Z`,
    `M576.73,394.03c-2.67,0-5.13-.47-7.4-1.4-2.27-.93-4.24-2.27-5.9-3.99-1.67-1.73-2.96-3.77-3.88-6.14-.92-2.36-1.38-4.97-1.38-7.83s.46-5.46,1.38-7.83c.92-2.36,2.21-4.41,3.88-6.14,1.67-1.73,3.63-3.06,5.9-3.99,2.27-.93,4.74-1.4,7.4-1.4,3.27,0,6.16.63,8.69,1.9,2.52,1.27,4.61,3.1,6.26,5.5l-7.09,7.03c-.98-1.38-2.07-2.44-3.26-3.2-1.19-.76-2.53-1.14-4.02-1.14-1.17,0-2.24.21-3.19.63s-1.77,1.04-2.45,1.85c-.68.81-1.21,1.79-1.6,2.94-.38,1.15-.57,2.42-.57,3.83s.19,2.69.57,3.83c.38,1.15.91,2.12,1.6,2.94.68.81,1.5,1.43,2.45,1.85s2.02.63,3.19.63c1.49,0,2.83-.38,4.02-1.14,1.19-.76,2.28-1.82,3.26-3.2l7.09,7.03c-1.65,2.36-3.74,4.19-6.26,5.47s-5.42,1.93-8.69,1.93Z`,
    `M599.05,393.19l14.56-37.02h11.04l14.56,37.02h-11.61l-10.76-31.1h4.38l-10.76,31.1h-11.42ZM607.72,386.74l2.86-8.99h15.33l2.86,8.99h-21.04Z`,
    `M672.45,393.19v-37.02h9.23l16.95,22.53h-4.28v-22.53h10.95v37.02h-9.23l-16.95-22.53h4.28v22.53h-10.95Z`,
    `M715.67,393.19l14.56-37.02h11.04l14.56,37.02h-11.61l-10.76-31.1h4.38l-10.76,31.1h-11.42ZM724.33,386.74l2.86-8.99h15.33l2.86,8.99h-21.04ZM730.76,353.15l6.28-8.46h10.23l-9.38,8.46h-7.14Z`,
    `M766.22,393.19v-37.02h11.04v37.02h-11.04ZM776.26,385.26l-.62-13.7,12.57-15.39h12.23l-14.09,17.24-6.24,7.09-3.85,4.76ZM788.12,393.19l-9.8-14.38,7.28-8.57,15.52,22.95h-12.99Z`,
    `M826.67,394.03c-5.11,0-9.09-1.53-11.95-4.6-2.86-3.07-4.28-7.37-4.28-12.9v-20.36h11.23v19.99c0,2.82.46,4.82,1.38,6,.92,1.18,2.16,1.77,3.71,1.77s2.83-.59,3.74-1.77c.9-1.18,1.36-3.18,1.36-6v-19.99h11.04v20.36c0,5.54-1.43,9.84-4.28,12.9-2.86,3.07-6.84,4.6-11.95,4.6Z`,
    `M856.61,393.19v-37.02h16.04c3.11,0,5.8.56,8.07,1.69,2.27,1.13,4.02,2.74,5.26,4.84,1.24,2.1,1.86,4.57,1.86,7.43s-.62,5.32-1.86,7.4c-1.24,2.08-2.99,3.7-5.26,4.84-2.27,1.15-4.96,1.72-8.07,1.72h-9.81l5-5.34v14.44h-11.23ZM867.85,380.13l-5-5.66h9.09c1.55,0,2.7-.39,3.45-1.16.75-.77,1.12-1.83,1.12-3.17s-.37-2.4-1.12-3.17c-.75-.77-1.9-1.16-3.45-1.16h-9.09l5-5.66v19.99Z`,
    `M900.07,393.19v-37.02h9.23l13.33,24.17h-4.85l12.95-24.17h9.23l.1,37.02h-10.23l-.1-19.89h1.62l-8.85,16.55h-4.95l-9.23-16.55h2v19.89h-10.23Z`,
    `M954.05,393.19v-37.02h11.23v37.02h-11.23Z`,
    `M909.16,169.47c-7.77-2.93-16.26-4.48-23.65-4.48-18.43,0-29.8,10.53-29.8,29.25v105.7h-70.58v-108.04c0-51.87,29.8-93.22,93.72-93.22,13.33,0,27.84,2.34,37.64,6.63l-7.33,64.16Z`,
];

// The embedded PNG used in the original SVG (keep as data URI)
const IMAGE_DATA_URI =
    'data:image/png;base64,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';

export default function AnimatedLogoSplash({
    onFinish,
}: Readonly<{ onFinish: () => void }>) {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(1, { duration: 1800 }, () => {
            runOnJS(onFinish)();
        });
    }, []);

    const animatedRectProps = useAnimatedProps(() => ({
        width: 1000 * progress.value,
    }));

    const groupAnimatedProps = useAnimatedProps(() => {
        const opacity = 0.85 + 0.15 * (1 - Math.pow(1 - progress.value, 3));
        return { opacity } as any;
    });


    return (
        <Animated.View style={styles.container}>
            <Svg viewBox="0 0 1000 394" width={260} height={110}>

                <Defs>
                    <Mask id="revealMask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
                        <AnimatedRect
                            width={0}
                            animatedProps={animatedRectProps}
                            x={0}
                            y={0}
                            height={394}
                            fill="white"
                        />
                    </Mask>

                    <ClipPath id="clippath">
                        <Path d={`M146.85,247.74c-.6.41-1.24.77-1.89,1.09l-8.67,4.13c-18.78,8.93-55-26.66-80.3-79.83-25.28-53.15-29.87-103.8-11.27-112.65l8.69-4.13c.68-.33,1.37-.59,2.09-.8-7.18,20.91.38,63.47,21.4,107.65,21.02,44.18,49.17,76.94,69.96,84.55Z`} />
                    </ClipPath>
                </Defs>

                <AnimatedG animatedProps={groupAnimatedProps} mask="url(#revealMask)">
                    {PATHS.map((d, i) => (
                        <LogoPath key={d} d={d} index={i} progress={progress} />
                    ))}
                    <G clipPath="url(#clippath)">
                        <SvgImage
                            x={10}
                            y={54.52}
                            width={137}
                            height={215}
                            href={{ uri: IMAGE_DATA_URI }}
                            xlinkHref={{ uri: IMAGE_DATA_URI }}
                            preserveAspectRatio="xMidYMid slice"
                            opacity={1}
                        />
                    </G>
                </AnimatedG>
             </Svg>
         </Animated.View>
     );
 }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#9595F3",
        justifyContent: "center",
        alignItems: "center",
    },
});

