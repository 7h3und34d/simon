import { useMachine } from "@xstate/react";
import { Machine, assign, send as xSend } from "xstate";

interface GameContext {
  index: number;
  seq: string[];
  uSeq: string[];
  score: number;
}

const machineConfig = {
  id: "simon",
  context: {
    index: 0,
    seq: [] as string[],
    uSeq: [] as string[],
    score: 0,
  },
  initial: "gameOver" as const,
  states: {
    gameOver: {
      entry: ["resetGame"],
      on: {
        PLAY: "showSeq",
      },
    },
    showSeq: {
      entry: ["addItem"],
      on: {
        START: "play",
      },
      initial: "onn" as const,
      states: {
        onn: {
          after: {
            1000: [{
              target: "off",
              cond: "hasMore",
            }, {
              target: "done",
            }]
          }
        },
        off: {
          entry: ["increaseIndex"],
          after: {
            1000: "onn",
          }
        },
        done: {
          entry: ["resetIndex", "triggerPlay"],
        },
      },
    },
    play: {
      on: {
        PRESS: [
          {
            target: "gameOver",
            cond: "hasDismatch",
          },
          {
            target: "showSeq",
            actions: ["addPoints"],
            cond: "hasAllSeq",
          },
          {
            target: "play",
            actions: ["updateUSeq"],
          },
        ],
      },
    },
  },
};

type GameEvent = { type: string; color?: string };
interface GameStates {
  states: {
    gameOver: {};
    play: {};
    showSeq: {
      states: {
        onn: {};
        off: {};
        done: {};
      };
    };
  };
}

function selectNewColor() {
  const colors = ["yellow", "blue", "green", "red", "pink", "purple"];
  const value = Math.floor(Math.random() * colors.length);
  return colors[value];
}

export function useGameMachine() {
  const machine = Machine<GameContext, GameStates, GameEvent>(machineConfig, {
    actions: {
      triggerPlay: xSend("START"),
      increaseIndex: assign((ctx: GameContext) => {
        return {
          ...ctx,
          index: ctx.index+1,
        }
      }),
      resetIndex: assign((ctx: GameContext) => {
        return {
          ...ctx,
          index: 0,
        }
      }),
      updateUSeq: assign((ctx: GameContext, evt: GameEvent) => {
        return {
          ...ctx,
          uSeq: [...ctx.uSeq, evt.color || ""],
        };
      }),
      addItem: assign((ctx: GameContext) => ({
        ...ctx,
        uSeq: [],
        seq: [...ctx.seq, selectNewColor()],
      })),
      resetGame: assign(() => ({
        seq: [] as string[],
        uSeq: [] as string[],
        score: 0,
        index: 0,
      })),
      addPoints: assign((ctx: GameContext) => {
        return {
          ...ctx,
          score: 10 + ctx.score,
        };
      }),
    },
    guards: {
      hasMore: (ctx: GameContext) => {
        return ctx.seq.length > ctx.index
      },
      hasDismatch: (ctx: GameContext, evt: GameEvent) => {
        const seq = [...ctx.uSeq, evt.color];
        for (let i = 0; i < seq.length; i++) {
          if (seq[i] !== ctx.seq[i]) {
            return true;
          }
        }
        return false;
      },
      hasAllSeq: (ctx: GameContext, evt: GameEvent) => {
        const seq = [...ctx.uSeq, evt.color];
        return seq.length === ctx.seq.length;
      },
    },
  });
  const [current, send] = useMachine(machine);
  return { status: current.value, matches: current.matches, ...current.context, dispatch: send };
}

export function startNewGame(dispatch: (event: GameEvent) => void) {
  return function () {
    dispatch({ type: "PLAY" });
  };
}

export function startPlay(dispatch: (event: GameEvent) => void) {
  return function () {
    dispatch({ type: "START" });
  };
}
