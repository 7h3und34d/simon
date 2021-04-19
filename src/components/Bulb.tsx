import styled from "styled-components";

interface BulbProps {
  color: string;
  isOn?: boolean;
  isPlay?: boolean;
}

const Bulb = styled.button<BulbProps>`
  background: ${(props) => props.color};
  opacity: ${(props) => (props.isOn || props.isPlay ? "1" : "0.3")};
  transform: scale(${(props) => (props.isOn ? "1.3" : "1")});
  padding: 1rem;
`;

export default Bulb;
