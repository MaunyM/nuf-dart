import DefsComponent from "@/app/component/Defs";
import DisplayPlayerComponent from "@/app/component/DisplayPlayer";
import { addPlayer, removePlayer, signOut, usePlayers } from "@/app/service/gameService";
import { interleaveByTeam, validateTeams } from "@/app/service/teamService";
import { Joueur, Team } from "@/app/Type/Game";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import "./choosePlayer.css";
import GameButtonComponent from "@/app/component/GameButton";

const getColumn = (index: number) => ~~(index / 2);
const getLine = (index: number) => index % 2;

const TEAM_COUNT = 2;
const MIN_PLAYERS_FOR_TEAM_MODE = 4;

type GameProps = {
  addPlayers(joueur: Joueur[]): void;
  seriesTarget: number;
  setSeriesTarget(n: number): void;
  teams: Team[];
  setTeams(teams: Team[]): void;
};

const SERIES_OPTIONS = [
  { label: "1", target: 1 },
  { label: "3", target: 3 },
  { label: "5", target: 5 },
  { label: "7", target: 7 },
];

function emptyTeams(): Team[] {
  return Array.from({ length: TEAM_COUNT }, (_, i) => ({
    id: i + 1,
    name: `Équipe ${i + 1}`,
    players: [],
  }));
}

function teamIdOf(teams: Team[], player: Joueur): number | undefined {
  return teams.find((team) => team.players.some((p) => p.id === player.id))?.id;
}

function cyclePlayerTeam(teams: Team[], player: Joueur): Team[] {
  const currentTeamId = teamIdOf(teams, player);
  const withoutPlayer = teams.map((team) => ({
    ...team,
    players: team.players.filter((p) => p.id !== player.id),
  }));
  const nextTeamId =
    currentTeamId === undefined
      ? withoutPlayer[0].id
      : withoutPlayer.findIndex((team) => team.id === currentTeamId) + 1 < withoutPlayer.length
      ? withoutPlayer[withoutPlayer.findIndex((team) => team.id === currentTeamId) + 1].id
      : undefined;
  if (nextTeamId === undefined) return withoutPlayer;
  return withoutPlayer.map((team) =>
    team.id === nextTeamId ? { ...team, players: [...team.players, player] } : team
  );
}

export default function Page(props: GameProps) {
  const router = useRouter();
  const auth = useAuth();
  const { players, isLoading } = usePlayers(auth);
  const [available, setAvailable] = useState<Joueur[]>([]);
  const [selected, setSelected] = useState<Joueur[]>([]);
  const [teamMode, setTeamMode] = useState(false);
  useEffect(() => {
    if (players) setAvailable(players);
  }, [players]);
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push("/");
    }
  }, [auth.isAuthenticated, auth.isLoading, router]);
  useEffect(() => {
    if (teamMode && selected.length < MIN_PLAYERS_FOR_TEAM_MODE) {
      setTeamMode(false);
      props.setTeams([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, teamMode]);

  const toggleTeamMode = () => {
    if (teamMode) {
      setTeamMode(false);
      props.setTeams([]);
    } else {
      setTeamMode(true);
      props.setTeams(emptyTeams());
    }
  };

  const monsterEnabled = teamMode
    ? validateTeams(props.teams, selected)
    : selected.length > 0;

  const launchIndividual = (path: string) => {
    if (selected.length === 0) return;
    props.setTeams([]);
    props.addPlayers(selected);
    router.push(path);
  };

  const launchMonster = () => {
    if (!monsterEnabled) return;
    if (teamMode) {
      const orderedPlayers = interleaveByTeam(props.teams);
      props.addPlayers(orderedPlayers);
    } else {
      props.setTeams([]);
      props.addPlayers(selected);
    }
    router.push("/monster");
  };

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
                      if (teamMode) return;
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
                  selected.map((player, index) => {
                    const teamId = teamMode ? teamIdOf(props.teams, player) : undefined;
                    return (
                      <g
                        key={player.id}
                        transform={`translate(${230 * getColumn(index)},${
                          90 * getLine(index)
                        })`}
                        onClick={() => {
                          if (teamMode) {
                            props.setTeams(cyclePlayerTeam(props.teams, player));
                          } else {
                            setSelected(removePlayer(selected, player));
                            setAvailable(addPlayer(available, player));
                          }
                        }}
                      >
                        <DisplayPlayerComponent
                          player={player}
                        ></DisplayPlayerComponent>
                        {teamMode && (
                          <g transform="translate(85,-25)">
                            <circle
                              r="14"
                              className={`team-badge ${
                                teamId ? `team-${teamId}` : "team-none"
                              }`}
                            />
                            <text
                              className="team-badge-text"
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              {teamId ?? "?"}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
              </g>
            </g>
          </g>
          {selected.length >= MIN_PLAYERS_FOR_TEAM_MODE && (
            <g transform="translate(1000,142)" onClick={toggleTeamMode}>
              <GameButtonComponent text="Mode équipe" size={300} selected={teamMode} />
            </g>
          )}
          <g transform="translate(140,400)">
          <g
            onClick={() => launchIndividual("/cricket")}
          >
           <GameButtonComponent text="Cricket" disabled={selected.length === 0}/>
          </g>
          <g
            transform="translate(240,00)"
            onClick={() => launchIndividual("/x01/501")}
          >
            <GameButtonComponent text="501" disabled={selected.length === 0}/>
          </g>
          <g
            transform="translate(240,80)"
            onClick={() => launchIndividual("/x01/301")}
          >
            <GameButtonComponent text="301" disabled={selected.length === 0}/>
          </g>
          <g
            transform="translate(480,00)"
            onClick={launchMonster}
          >
            <GameButtonComponent text="Monster" disabled={!monsterEnabled}/>
          </g>
          </g>
          <text transform="translate(10,592)" className="text">Nombre de série :</text>
          <g transform="translate(140,635)">
            {SERIES_OPTIONS.map((opt, i) => (
              <g key={opt.target} transform={`translate(${i * 160}, 0)`} onClick={() => props.setSeriesTarget(opt.target)}>
                <GameButtonComponent text={opt.label} size={140} selected={props.seriesTarget === opt.target} />
              </g>
            ))}
          </g>
        </svg>
        <button onClick={() => signOut(auth)}>Sign out</button>
      </div>
    );
  }
}
