import { useContext } from 'react'
import { useDrop } from 'react-dnd'
import { MdAdd } from 'react-icons/md'

import BoardContext from '../Board/context'

import Card, { ICard } from '../Card'

import {
    Container
} from './styles'

interface Data {
    data: IList;
    index: number;
}
export interface IList {
    title: string;
    creatable: boolean;
    cards: Array<ICard>;
    done?: boolean;
}

export default function List({ data, index: listIndex }: Data) {
    const { move, getCoordinates } = useContext(BoardContext);

    const [, dropRef] = useDrop({
        accept: 'CARD',
        hover(item: any, monitor) {
            const fromList = item.listIndex;
            const toList = listIndex;

            const coordinates = getCoordinates() as any;

            if (data.cards.length === 0) {
                move(fromList, toList, item.index, 0);

                item.listIndex = toList;
                item.index = 0;
            } else if (coordinates.target === undefined || coordinates.target === null) { // add aqui a função de add item ao fim da lista
                console.log('entrou');

                // move(coordinates.fromList1, ListIndex, coordinates.from1, 1);

                // console.log("na lista");
            }

        }
    });

    return (
        <Container ref={dropRef} done={data?.done}>
            <header>
                <h2>
                    {data.title}
                </h2>

                {
                    data.creatable && (
                        <button type='button'>
                            <MdAdd size={24} color='#FFF' />
                        </button>
                    )
                }
            </header>

            <ul>
                {
                    data.cards.map((card: any, index: number) => (
                        <Card
                            key={card.id}
                            data={card}
                            listIndex={listIndex}
                            index={index}
                        />
                    ))
                }
            </ul>
        </Container>
    );
}