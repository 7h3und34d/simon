import MainLayout from "./components/Layout";
import GameContainer from "./components/GameContainer";
import Bulb from "./components/Bulb";
import {
  useGameMachine,
  startNewGame,
} from "./hooks/useGameMachine";

interface ShowSeqqProps {
  matches: (value: string) => boolean;
  index: number;
  seq: string[];
}

function ShowSeqq({ matches, index, seq }: ShowSeqqProps) {

  return (
    <>
      <Bulb disabled id="yellow" color="yellow" isOn={matches("showSeq.onn") && seq[index] === "yellow"} />
      <Bulb disabled id="blue" color="blue" isOn={matches("showSeq.onn") && seq[index] === "blue"} />
      <Bulb disabled id="green" color="green" isOn={matches("showSeq.onn") && seq[index] === "green"} />
      <Bulb disabled id="red" color="red" isOn={matches("showSeq.onn") && seq[index] === "red"} />
      <Bulb disabled id="pink" color="pink" isOn={matches("showSeq.onn") && seq[index] === "pink"} />
      <Bulb disabled id="purple" color="purple" isOn={matches("showSeq.onn") && seq[index] === "purple"} />
    </>
  );
}

interface PlayProps {
  press: (color: string) => () => void;
}

function Play({ press }: PlayProps) {
  return (
    <>
      <Bulb isPlay id="yellow" color="yellow" onClick={press("yellow")} />
      <Bulb isPlay id="blue" color="blue" onClick={press("blue")} />
      <Bulb isPlay id="green" color="green" onClick={press("green")} />
      <Bulb isPlay id="red" color="red" onClick={press("red")} />
      <Bulb isPlay id="pink" color="pink" onClick={press("pink")} />
      <Bulb isPlay id="purple" color="purple" onClick={press("purple")} />
    </>
  );
}

function App() {
  const { status, matches, dispatch, seq, uSeq, index } = useGameMachine();
  console.log(status, seq, uSeq, index);
  return (
    <MainLayout>
      <GameContainer>
        {matches("gameOver") ? (
          <button onClick={startNewGame(dispatch)}>Start a new game</button>
        ) : null}
        {matches("showSeq") ? (
          <ShowSeqq matches={matches} index={index} seq={seq} />
        ) : null}
        {matches("play") ? (
          <Play
            press={(color: string) => () => dispatch({ type: "PRESS", color })}
          />
        ) : null}
      </GameContainer>
    </MainLayout>
  );
}

export default App;
