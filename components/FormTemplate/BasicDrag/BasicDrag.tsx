"use client";
import React, { FC } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

//import Example from "./Example";
import { IBasicQuestion } from "../BasicQuestion";

import { Container } from "./Container";

export interface BasicDragProps {
  dataCards: IBasicQuestion[];
  updateOrderQuestions: (data: string[]) => void;
  updateDataCard: (data: IBasicQuestion) => Promise<IBasicQuestion>;
  handleSelectQuestion: (dataQ: IBasicQuestion) => void;
}

const BasicDrag: FC<BasicDragProps> = ({
  dataCards,
  updateOrderQuestions,
  updateDataCard,
  handleSelectQuestion,
}) => {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Container
          dataCards={dataCards}
          handleSelectQuestion={handleSelectQuestion}
          updateOrderQuestions={updateOrderQuestions}
          updateDataCard={updateDataCard}
        />
      </DndProvider>
    </div>
  );
};

export default BasicDrag;
