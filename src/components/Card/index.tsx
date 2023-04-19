import { useRef, useContext } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import BoardContext from '../Board/context'

import {
    Container,
    Label,
} from './styles'

export interface ICard {
    id: number;
    content: string;
    labels: Array<string>;
    user?: string;
}

interface Data {
    data: ICard;
    index: number;
    listIndex: number;
}

interface CardItem {
    type: string;
    index: number;
    listIndex: number;
}

export default function Card({ data, index, listIndex }: Data) {
    const ref = useRef<HTMLDivElement>(null);
    const { move, coordinatesUP } = useContext(BoardContext);

    const [{ isDragging }, dragRef] = useDrag({
        type: "CARD",
        item: {
            index,
            listIndex,
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, dropRef] = useDrop({
        accept: 'CARD',
        hover(item: CardItem, monitor) {
            const draggedListIndex = item.listIndex;
            const targetListIndex = listIndex;

            const draggedIndex = item.index;
            const targetIndex = index;

            if (draggedIndex === targetIndex && draggedListIndex === targetListIndex) {
                return;
            }

            const targetSize = ref.current?.getBoundingClientRect(); // Retorna o tamanho do card
            const targetCenter = targetSize
                ? (targetSize.bottom - targetSize.top) / 2
                : 0; // Retorna o centro do item que estou por cima

            const draggedOffset = monitor.getClientOffset(); // Isso pega a coordenada do item que está sendo arrastado
            const draggedTop =
                draggedOffset && targetSize ? draggedOffset.y - targetSize.top : 0; // Isso pega a coordenada(distancia) do item que estou arrastando sobre o item que está por baixo, pois ele subtrai a minha distancia do topo do tamanho do card

            if (draggedIndex < targetIndex && draggedTop < targetCenter) {
                return; // Aqui só arrasta pra itens depois
            }

            if (draggedIndex > targetIndex && draggedTop > targetCenter) {
                return; // Aqui só arrasta se puder ir pra cima, ou seja um item que já está em baixo não vai mais pra baixo ainda
            }

            coordinatesUP(draggedListIndex, targetListIndex, draggedIndex, targetIndex, targetIndex);

            move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);

            item.index = targetIndex;
            item.listIndex = targetListIndex;
        }
    });

    dragRef(dropRef(ref));

    return (
        <Container ref={ref} isDragging={isDragging}>
            <header>
                {data.labels.map((label: any) => (
                    <Label
                        key={label}
                        color={label}
                    />
                ))}
            </header>

            <p>
                {data.content}
            </p>

            {
                data.user &&
                <img
                    src={data.user}
                    alt='Avatar User'
                />
            }
        </Container>
    );
}