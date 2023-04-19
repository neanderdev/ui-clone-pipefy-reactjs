import { createContext } from "react";

import { IList } from "../List";

export default createContext({
  lists: <IList[]>[],
  move: (fromList: number, toList: number, from: number, to: number) => {},
  coordinatesUP: (
    fromList: number,
    toList: number,
    from: number,
    to: number,
    target: number
  ) => {},
  getCoordinates: () => {},
});
