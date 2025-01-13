import type { AppProps } from 'next/app'
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Game, Game_State } from "../app/Type/Game";
import { CRICKET_ZONES, CricketScore } from "../app/Type/Cricket";
import { getIndexFromPlayers } from "../app/service/gameService";
import { isWon } from "../app/service/cricketService";
import { useEffect, useState } from 'react';
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-3.amazonaws.com/eu-west-3_hdaUJXlME",
  client_id: "1cusrvvn01cc7dq61lk8g7mr1a",
  redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
  response_type: "code",
  lang:"fr",
  scope: "aws.cognito.signin.user.admin email openid profile",
};

const inter = Inter({ subsets: ["latin"] });
 
export default function App({ Component, pageProps }: AppProps) {
  const initGame: Game<CricketScore> = {
    status: Game_State.UNSTARTED,
    dart_count: 3,
    sectionsOrder: [
      6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5, 20, 1, 18, 4, 13,
    ],

    players: [
      {
        id: 1,
        nom: "Matthieu",
        color: {h:205.9, s:99.1, l:45.3},
        score: new CricketScore(
          CRICKET_ZONES.reduce<Record<number, number>>(
            (acc, current) => ({ ...acc, [current]: 0 }),
            {}
          )
        ),
      },
      {
        id:2,
        nom: "Célia",
        color: {h:38.8, s:100, l:45},
        score: new CricketScore(
          CRICKET_ZONES.reduce<Record<number, number>>(
            (acc, current) => ({ ...acc, [current]: 0 }),
            {}
          )
        ),
      },
      {
        id:3,
        nom: "Patate",
        color: {h:145.4, s:94.8, l:30.3},
        score: new CricketScore(
          CRICKET_ZONES.reduce<Record<number, number>>(
            (acc, current) => ({ ...acc, [current]: 0 }),
            {}
          )
        ),
      },
    ],
    sections: {
      1: {
        value: 1,
        status: false,
      },
      2: {
        value: 2,
        status: false,
      },
      3: {
        value: 3,
        status: false,
      },
      4: {
        value: 4,
        status: false,
      },
      5: {
        value: 5,
        status: false,
      },
      6: {
        value: 6,
        status: false,
      },
      7: {
        value: 7,
        status: false,
      },
      8: {
        value: 8,
        status: false,
      },
      9: {
        value: 15,
        status: false,
      },
      10: {
        value: 10,
        status: false,
      },
      11: {
        value: 11,
        status: false,
      },
      12: {
        value: 12,
        status: false,
      },
      13: {
        value: 13,
        status: false,
      },
      14: {
        value: 14,
        status: false,
      },
      15: {
        value: 15,
        status: true,
      },
      16: {
        value: 16,
        status: true,
      },
      17: {
        value: 17,
        status: true,
      },
      18: {
        value: 18,
        status: true,
      },
      19: {
        value: 19,
        status: true,
      },
      20: {
        value: 20,
        status: true,
      },
    },
    tapHandler: function (value, ring) {
      if (this.current_player && this.current_player.dart_count) {
        this.current_player = {
          ...this.current_player,
          score: this.current_player.score.add(value, ring),
          dart_count: this.current_player.dart_count - 1,
        };
        if (this.current_player.dart_count === 0) {
          this.status = Game_State.WAITING_NEXT_PLAYER;
        }
        if(isWon(this.current_player, this.players)) {
          this.status = Game_State.WON;
        }
        const index = getIndexFromPlayers(this.current_player, this.players)
        this.players[index] = this.current_player;
        setGame({ ...this });
      }
    },
    startGame: function () {
      this.current_player = this.players[0];
      this.current_player.dart_count = this.dart_count;
      this.next_player = this.players[1];
      this.status = Game_State.THROWING;
      setGame({ ...this });
    },
    ready: function () {
      if (this.current_player) {
        const index = getIndexFromPlayers(this.current_player, this.players)
        this.players[index] = this.current_player;

        if (this.next_player) {
          this.current_player = this.next_player;
          this.current_player.dart_count = this.dart_count;

          const index = getIndexFromPlayers(this.current_player, this.players)
          const new_index = index + 1 >= this.players.length ? 0 : index + 1;
          this.next_player = this.players[new_index];
          this.status = Game_State.THROWING;
        }

        setGame({ ...this });
      }
    },
  };

  const [game, setGame] = useState(initGame)
  useEffect(()=>{ if (game.status===Game_State.UNSTARTED) game.startGame()},[game])

  return <AuthProvider {...cognitoAuthConfig}>
    <Component className={inter.className} {...pageProps} game={game}/>
    </AuthProvider>
}