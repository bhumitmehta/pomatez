import React, { useRef, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import autoSize from "autosize";
import {
  StyledCard,
  StyledCardText,
  StyledCardEditButton,
  StyledCardSaveButton,
  StyledCardTextArea,
  StyledCardActionWrapper,
  StyledCardDeleteButton,
  StyledPomodoroInfo,
} from "styles";
import { SVG } from "components";
import { useTargetOutside } from "hooks";
import { on } from "events";

type Props = {
  id: string;
  text: string;
  index: number;
  done: boolean;
  onClick?:
    | ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void)
    | undefined;
  onSaveCardText?: (text: string, pomodoroCount: number) => void;
  onDeleteCard?: () => void;
  pomodoroCount: number;
  children?: React.ReactNode;
};

const TaskCard: React.FC<Props> = ({
  id,
  text,
  index,
  done,
  onClick,
  onDeleteCard,
  onSaveCardText,
  pomodoroCount,
}) => {
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const [editing, setEditing] = useTargetOutside({ ref: areaRef });

  useEffect(() => {
    if (editing) {
      if (areaRef.current) {
        areaRef.current.focus();
        areaRef.current.value = text;

        autoSize(areaRef.current);

        areaRef.current.onkeypress = (e: KeyboardEvent) => {
          if (e.keyCode !== 10 || !areaRef.current) return;
          e.preventDefault();
          if (onSaveCardText && areaRef.current.value) {
            onSaveCardText(areaRef.current.value, pomodoroCount);
          }
          setEditing(false);
        };
      }
    }
  }, [editing, text, onSaveCardText, setEditing, pomodoroCount]);

  const onEditCardAction = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setEditing(true);
  };

  const onDeleteCardAction = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (onDeleteCard) {
      onDeleteCard();
    }
  };

  const onSaveCardAction = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (areaRef.current) {
      if (onSaveCardText && areaRef.current.value) {
        onSaveCardText(areaRef.current.value, pomodoroCount);
      }
      setEditing(false);
    }
  };

  const onPomodoroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      console.log(e.target.value);
    }
  };

  const renderCardText = () =>
    editing ? (
      <StyledCardTextArea
        ref={areaRef}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    ) : (
      <StyledCardText done={done}>{text}</StyledCardText>
    );

  // const renderPomodoro = () => {
  const renderPomodoroInfo = () => {
    if (editing) {
      return (
        <div>
          <label>
            Pomodoro:
            <input
              type="number"
              value={pomodoroCount}
              onChange={(e) => onPomodoroChange(e)}
            />
          </label>
        </div>
      );
    } else {
      return (
        <div>
          {console.log("here")}
          <p>{pomodoroCount} </p>
        </div>
      );
    }
  };

  const renderActionButton = () =>
    editing ? (
      <StyledCardSaveButton onClick={onSaveCardAction}>
        <SVG name="save" />
      </StyledCardSaveButton>
    ) : (
      <StyledCardActionWrapper>
        <StyledPomodoroInfo>
          {renderPomodoroInfo()}
          <SVG name="timer" />
        </StyledPomodoroInfo>
        <StyledCardEditButton onClick={onEditCardAction}>
          <SVG name="pencil" />
        </StyledCardEditButton>
        <StyledCardDeleteButton onClick={onDeleteCardAction}>
          <SVG name="trash" />
        </StyledCardDeleteButton>
      </StyledCardActionWrapper>
    );

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <StyledCard
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
          focused={editing}
          onClick={onClick}
        >
          {renderCardText()}

          {renderActionButton()}
        </StyledCard>
      )}
    </Draggable>
  );
};

export default React.memo(TaskCard);
