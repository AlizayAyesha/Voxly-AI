import React from "react";
import dynamic from "next/dynamic";
import { MediaQuery } from "shared/ui/media-query";
import css from "./hero-lottie.module.scss";

const Player = dynamic(() => import("@lottiefiles/react-lottie-player").then(mod => mod.Player), { ssr: false });

const HeroLottie: React.FC = () => {
    return (
        <>
            <MediaQuery
                query="(min-width: 769px)"
                children={
                    <Player
                        className={css.lottie}
                        src="/img/intro-loop.json"
                        rendererSettings={{
                            preserveAspectRatio: 'xMidYMid slice',
                        }}
                        autoplay
                        loop
                    />
                }
            />
            <MediaQuery
                query="(min-width: 466px) and (max-width: 768px)"
                children={
                    <Player
                        className={css.lottie}
                        src="/img/intro-loop-mob.json"
                        rendererSettings={{
                            preserveAspectRatio: 'xMidYMid slice',
                        }}
                        autoplay
                        loop
                    />
                }
            />
            <MediaQuery
                query="(max-width: 465px)"
                children={
                    <Player
                        className={css.lottie}
                        src="/img/intro-loop-mob.v3.json"
                        rendererSettings={{
                            preserveAspectRatio: 'xMidYMid slice',
                        }}
                        autoplay
                        loop
                    />
                }
            />
        </>
    );
};

export default HeroLottie;