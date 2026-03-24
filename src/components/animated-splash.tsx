import { useEffect } from "react";
import {Animated, Image, StyleSheet } from "react-native";

export default function AnimatedLogoSplash({
    onFinish,
}: Readonly<{ onFinish: () => void }>) {
    useEffect(() => {
        const timer = setTimeout(onFinish, 1800);
        return () => clearTimeout(timer);
    }, [onFinish]);


    return (
        <Animated.View style={styles.container}>
            <Image
                source={require("../../assets/usetri_splash.png")}
                style={styles.splashImage}
                resizeMode="contain"
                accessibilityLabel="App splash image"
            />

            <Image
                source={require("../../assets/images/other/vozik.png")}
                style={styles.vozikImage}
                resizeMode="contain"
                accessibilityLabel="Vozik splash image"
            />
        </Animated.View>
     );
 }

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#ffffff",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "40%",
        paddingBottom: 32,
        zIndex: 999,
    },
    vozikImage: {
        height: 180,
        width: "100%",
        alignSelf: "stretch",
    },
    splashImage: {
        marginTop: "25%",
        height: 100,
        width: "100%",
        alignSelf: "center",
    }
});

