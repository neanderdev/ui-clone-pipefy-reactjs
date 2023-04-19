import { useState } from 'react'
import { produce } from 'immer'

import BoardContext from './context'

import List, { IList } from '../List'

import { loadLists } from '../../services/api'

import {
    Container
} from './styles'

const data = loadLists();

export default function Board() {
    const [lists, setLists] = useState(data);
    const [fromList1, setFromList] = useState(0);
    const [toList1, setToList1] = useState(0);
    const [from1, setFrom1] = useState(0);
    const [to1, setTo1] = useState(0);
    const [target, setTarget] = useState(0);

    function move(
        fromList: number,
        toList: number,
        from: number,
        to: number
    ) {
        setLists(produce(lists, draft => {
            const dragged = draft[fromList].cards[from];

            draft[fromList].cards.splice(from, 1);
            draft[toList].cards.splice(to, 0, dragged);
        }));
    }

    function coordinatesUP(
        fromList: number,
        toList: number,
        from: number,
        to: number,
        target: number
    ) {
        setTarget(target);
        setFromList(fromList);
        setToList1(toList);
        setFrom1(from);
        setTo1(to);
    }

    function getCoordinates() {
        const coord = {
            fromList1,
            toList1,
            from1,
            to1,
            target,
        };

        return coord;
    }

    return (
        <BoardContext.Provider value={{ lists, move, coordinatesUP, getCoordinates }}>
            <Container>
                {
                    lists.map((list: IList, index) => (
                        <List
                            key={list.title}
                            data={list}
                            index={index}
                        />
                    ))
                }
            </Container>
        </BoardContext.Provider>
    );
}