import type { FC } from "react";

import update from "immutability-helper";
import { useCallback, useState, useEffect, useRef } from "react";

import { IBasicQuestion, initQuestionValues } from "../BasicQuestion";

import { Card } from "./Card";
import { BasicDragProps } from "./BasicDrag";

const style = {
  width: "100%",
};

export interface Item {
  id: string;
  text: string;
  dataCard: IBasicQuestion;
}

export interface ContainerState {
  cards: Item[];
}

export const generateUniqueId = () => {
  const elments =
    "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  for (let i = 0; i < 16; i++) {
    result += elments.charAt(Math.floor(Math.random() * elments.length));
  }

  return result;
};

export const Container: FC<BasicDragProps> = ({
  dataCards,
  updateOrderQuestions,
  updateDataCard,
  handleSelectQuestion,
}) => {
  {
    const [cards, setCards] = useState([
      {
        id: "1",
        text: "Write a cool JS library",
        dataCard: initQuestionValues,
      },
      {
        id: "2",
        text: "Make it generic enough",
        dataCard: initQuestionValues,
      },
      {
        id: "3",
        text: "Write README",
        dataCard: initQuestionValues,
      },
      {
        id: "4",
        text: "Create some examples",
        dataCard: initQuestionValues,
      },
      {
        id: "5",
        text: "Spam in Twitter and IRC to promote it (note that this element is taller than the others)",
        dataCard: initQuestionValues,
      },
      {
        id: "6",
        text: "???",
        dataCard: initQuestionValues,
      },
      {
        id: "7",
        text: "PROFIT",
        dataCard: initQuestionValues,
      },
    ]);
    //const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      handleParseDataCards();
    }, [dataCards]);

    /* useEffect(() => {
      //eslint-disable-next-line
      console.log("Container Cards:", cards);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        //Update dataCards
        //setDataCards(cards.map((card) => card.dataCard));
        const tempInternalDataCardsIds = cards.map((card) => card.dataCard.id);
        const tempExternalDataCardsIds = dataCards.map((card) => card.id);
        //comparamos los ids de las tarjetas internas con las externas para ver si hay cambios

        if (
          JSON.stringify(tempInternalDataCardsIds) !==
          JSON.stringify(tempExternalDataCardsIds)
        ) {
          setDataCards(cards.map((card) => card.dataCard));
        }
      }, 1500);
    }, [cards]); */

    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
      setCards((prevCards: Item[]) => {
        const newCards = update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex] as Item],
          ],
        });

        updateOrderQuestions(newCards.map((card) => card?.dataCard?._id || ""));

        return newCards;
      });
    }, []);

    const renderCard = useCallback(
      (
        card: { id: string; text: string; dataCard: IBasicQuestion },
        index: number
      ) => {
        return (
          <Card
            key={card.id}
            dataCard={card.dataCard}
            handleSelectQuestion={handleSelectQuestion}
            id={card.id}
            index={index}
            moveCard={moveCard}
            text={card.text}
            updateDataCard={updateDataCard}
          />
        );
      },
      []
    );

    const handleParseDataCards = () => {
      const tempCards = dataCards.map((card: IBasicQuestion) => {
        return {
          id: generateUniqueId(),
          text: card.title,
          dataCard: card,
        };
      });

      setCards([...tempCards]);
    };

    return (
      <>
        <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
      </>
    );
  }
};
