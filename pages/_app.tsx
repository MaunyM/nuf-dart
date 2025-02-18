import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider } from "react-oidc-context";
import {
  addPlayers,
  delay,
} from "@/app/service/gameService";
import {
  DartThrow,
  Game,
  Game_Event,
  Game_State,
  Game_Type,
  Joueur,
  Ring,
} from "@/app/Type/Game";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import plopSfx from "/public/664624__luis0413__plop-bonk-sound.mp3";
import tululuSfx from "/public/Tululu.mp3";
import nextPlayerSfx from "/public/nextPlayer.mp3";
import doubleSfx from "/public/double.mp3";
import tripleSfx from "/public/triple.mp3";
import { cricketReduce } from "@/app/service/cricketService";
import { CricketScore } from "@/app/Type/Cricket";
import _, { set } from 'lodash';

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-3.amazonaws.com/eu-west-3_hdaUJXlME",
  client_id: "1cusrvvn01cc7dq61lk8g7mr1a",
  redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
  response_type: "code",
  lang: "fr",
  scope: "aws.cognito.signin.user.admin email openid profile",
};

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const initGame: Game<Game_Type.CRICKET> = {
    status: Game_State.UNSTARTED,
    throws: [],
    scores: [],
    dart_count: 3,
    players: [],
  };

  const [playPlop] = useSound(plopSfx);
  const [playTululu] = useSound(tululuSfx,{volume: 0.1});
  const [playNextPlayer] = useSound(nextPlayerSfx,{volume: 0.1});
  const [playDouble] = useSound(doubleSfx,{volume: 0.1});
  const [playTriple] = useSound(tripleSfx,{volume: 0.1});
  const [startingGame, setStartingGame] = useState(initGame);
  const [game, setGame] = useState(initGame);
  const [dartThrows, setDartThrows] = useState<DartThrow[]>([]);

  const addPlayersToState = function (joueurs: Joueur[]) {
    const scores :CricketScore[] =  joueurs.map((player: Joueur) => new CricketScore (player));
    setDartThrows([]);
    setStartingGame(addPlayers(joueurs, {...initGame, scores, status: Game_State.THROWING, current_player: joueurs[0]}));
  };

  const startGame = function () {
    setGame({ ...startingGame, current_player: startingGame.players[0], status: Game_State.WAITING_NEXT_PLAYER });
  };

  const ready =  function () {
    if (game.current_player) {
      setGame({ ...game, status: Game_State.THROWING });
    }
  };

  const undo =  function () {
    setDartThrows(dartThrows.slice(0, -1) );
  };

  const miss =  async function () {
    if (game.current_player && game.status === Game_State.THROWING) {
      const newThrow: DartThrow= {player: game.current_player, value:0, ring: Ring.SIMPLE_BOTTOM, date: new Date()};
      playTululu();
      await delay(1000);
      setDartThrows([...dartThrows, newThrow])
    }
  };


  const tapHandler = async function  (value: number, ring: Ring) {
    if (game.current_player && game.status === Game_State.THROWING) {
      const newThrow: DartThrow= {player: game.current_player, value, ring, date: new Date()};

      playPlop();
      if (ring === Ring.DOUBLE) {
        playDouble();
        await delay(1000)
      }
      if (ring === Ring.TRIPLE) {
        playTriple();
        await delay(1000)
      }
      setDartThrows([...dartThrows, newThrow])
    }
  };

  useEffect(() => {
    const newGame = dartThrows.reduce(cricketReduce, _.cloneDeep(startingGame));
    setGame(newGame);
  }, [dartThrows,startingGame]);

  useEffect(() => {
    if (game.status === Game_State.WAITING_NEXT_PLAYER) {
      playNextPlayer();
    }
  }, [game, playNextPlayer]);

  return (
    <AuthProvider {...cognitoAuthConfig}>
      <Component
        className={inter.className}
        {...pageProps}
        game={game}
        addPlayers={addPlayersToState}
        tapHandler={tapHandler}
        startGame={startGame}
        ready={ready}
        undo={undo}
        miss={miss}
      />
    </AuthProvider>
  );
}
