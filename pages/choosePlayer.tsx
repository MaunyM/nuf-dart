import DefsComponent from "@/app/component/Defs";
import DisplayPlayerComponent from "@/app/component/DisplayPlayer";
import { addPlayer, removePlayer, usePlayers } from "@/app/service/gameService";
import { Game, Game_Type, Joueur } from "@/app/Type/Game";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import "./choosePlayer.css";
import GameButtonComponent from "@/app/component/GameButton";

const getColumn = (index: number) => ~~(index / 2);
const getLine = (index: number) => index % 2;

type GameProps = {
  addPlayers(joueur: Joueur[]): Game;
};

export default function Page(props: GameProps) {
  const router = useRouter();
  const auth = useAuth();
  const { players, isLoading } = usePlayers(auth);
  const [available, setAvailable] = useState<Joueur[]>([]);
  const [selected, setSelected] = useState<Joueur[]>([]);
  useEffect(() => {
    if (players) setAvailable(players);
  }, [players]);
  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push("/");
    }
  }, [auth.isAuthenticated, router]);
  if (auth.isAuthenticated) {
    return (
      <div className="choosePlayer">
        <svg
          version="1.1"
          width="1500"
          height="800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text transform={`translate(10,50)`} className="text">
            Qui va jouez ?
          </text>

          {players && (
            <defs>
              <DefsComponent players={players} />
            </defs>
          )}
          <g transform={`translate(0,50)`}>
            <g transform={`translate(130,52) scale(0.7)`}>
              {available &&
                available.map((player, index) => (
                  <g
                    key={player.id}
                    transform={`translate(${230 * index},0)`}
                    onClick={() => {
                      setSelected(addPlayer(selected, player));
                      setAvailable(removePlayer(available, player));
                    }}
                  >
                    <DisplayPlayerComponent
                      player={player}
                    ></DisplayPlayerComponent>
                  </g>
                ))}
            </g>
            <g transform={`translate(30,142) scale(1)`}>
              <text className="text">&#62;</text>
              <g transform={`translate(130,0)`}>
                {selected &&
                  selected.map((player, index) => (
                    <g
                      key={player.id}
                      transform={`translate(${230 * getColumn(index)},${
                        90 * getLine(index)
                      })`}
                      onClick={() => {
                        setSelected(removePlayer(selected, player));
                        setAvailable(addPlayer(available, player));
                      }}
                    >
                      <DisplayPlayerComponent
                        player={player}
                      ></DisplayPlayerComponent>
                    </g>
                  ))}
              </g>
            </g>
          </g>
          <g transform="translate(140,400)">
          <g
            
            onClick={() => {
              props.addPlayers(selected);
              router.push("/cricket");
            }}
          >
           <GameButtonComponent text="Cricket"/>
          </g>
          <g
            transform="translate(240,00)"
            onClick={() => {
              props.addPlayers(selected);
              router.push("/501");
            }}
          >
            <GameButtonComponent text="501"/>
          </g>
          <g
            transform="translate(480,00)"
            onClick={() => {
              props.addPlayers(selected);
              router.push("/monster");
            }}
          >
            <GameButtonComponent text="Monster"/>
          </g>
          </g>
        </svg>
        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }
}
