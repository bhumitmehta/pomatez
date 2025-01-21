import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  StyledTaskForm,
  StyledButtonPrimary,
  StyledButtonNormal,
  StyledTaskInput,
  StyledTaskTextArea,
  StyledTaskCardCancel,
  StyledButton,
  StyledTaskPomodoroInput,
} from "styles";
import { SVG } from "components";
import autoSize from "autosize";
import { useTargetOutside } from "hooks";

type Props = {
  forList?: boolean;
  onSubmit?: (value: string, pomodoros: number) => void;
};

const TaskFormButton: React.FC<Props> = ({ forList, onSubmit }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const pomodoroRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useTargetOutside({ ref: formRef });
  const [pomodoroCount, setPomodoroCount] = useState(1);
  const doSubmit = useCallback(
    (
      ref: HTMLInputElement | HTMLTextAreaElement,
      pomodoroCount: number,
      keepOpen = false
    ) => {
      const { value } = ref;
      if (!value) return false;
      console.log(pomodoroCount);
      if (onSubmit) {
        onSubmit(value, Number(pomodoroCount));
        ref.focus();
        if (formRef.current) {
          formRef.current.reset();
          setPomodoroCount(1);
        }
      }
      if (!keepOpen) setOpen(false);

      return true;
    },
    [onSubmit, setOpen]
  );
  // Initial value for pomodoro count

  const incrementPomodoro = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setPomodoroCount(pomodoroCount + 1);
  };
  const decrementPomodoro = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (pomodoroCount > 0) setPomodoroCount(pomodoroCount - 1); // Prevent negative count
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) setPomodoroCount(value); // Update count if valid
  };

  useEffect(() => {
    if (isOpen) {
      if (!forList && formRef.current) {
        formRef?.current?.scrollIntoView({ block: "center" });
      }
      if (forList) {
        if (inputRef.current) {
          inputRef.current.focus();

          inputRef.current.onkeypress = (e: KeyboardEvent) => {
            if (e.code === "Enter" && inputRef.current) {
              e.preventDefault();
              doSubmit(inputRef.current, pomodoroCount, e.ctrlKey);
            }
          };
        }
      } else {
        if (areaRef.current) {
          areaRef.current.focus();
          autoSize(areaRef.current);

          areaRef.current.onkeypress = (e: KeyboardEvent) => {
            if (e.code === "Enter" && areaRef.current) {
              e.preventDefault();
              if (
                doSubmit(areaRef.current, pomodoroCount, e.ctrlKey) &&
                areaRef?.current?.style?.height
              )
                areaRef.current.style.height = "inherit";
            }
          };
        }
      }
    }
  }, [isOpen, forList, doSubmit, pomodoroCount]);

  const onSubmitAction = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (forList) {
        inputRef.current &&
          doSubmit(inputRef.current, pomodoroCount, false);
      } else {
        if (
          areaRef.current &&
          doSubmit(areaRef.current, pomodoroCount, false)
        ) {
          areaRef.current.style.height = "inherit";
        }
      }
    },
    [forList, doSubmit, pomodoroCount]
  );

  const showFormAction = () => setOpen && setOpen(true);

  const hideFormAction = () => setOpen && setOpen(false);

  const renderButton = () =>
    forList ? (
      <StyledButtonNormal
        style={{ justifyContent: "flex-start" }}
        onClick={showFormAction}
      >
        <SVG name="add" />
        Add another list
      </StyledButtonNormal>
    ) : (
      <StyledButton
        style={{ justifyContent: "flex-start" }}
        onClick={showFormAction}
      >
        <SVG name="add" />
        Add another card
      </StyledButton>
    );

  const renderFormInput = () =>
    forList ? (
      <StyledTaskInput placeholder="Enter list title" ref={inputRef} />
    ) : (
      <StyledTaskTextArea
        placeholder="Enter a title for this card..."
        ref={areaRef}
      />
    );

  const renderCancelButton = () =>
    forList ? (
      <StyledButtonNormal onClick={hideFormAction}>
        Cancel
      </StyledButtonNormal>
    ) : (
      <StyledTaskCardCancel onClick={hideFormAction}>
        Cancel
      </StyledTaskCardCancel>
    );

  const renderPomodoroInput = () => {
    return (
      // a button to add pomodoro that can increment the pomodoro count abd decrement the pomodoro count
      // with a input field in the middle to show the current pomodoro count
      // remove upward and downward arrow from the input field
      <>
        <p>Pomodoro</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0px",
            color: "black",
            fontSize: "1.5rem",
            border: "none",
            height: "30px",
          }}
        >
          <button
            onClick={decrementPomodoro}
            style={{
              padding: "2px 6px",
              borderRadius: "5px 0 0 5px ",
              border: "none",
            }}
          >
            -
          </button>
          <label>
            <input
              type="number"
              value={pomodoroCount}
              onChange={handleInputChange}
              ref={pomodoroRef}
              style={{
                width: "30px",
                textAlign: "center",
                marginLeft: "0px",
                marginRight: "0px",
                border: "none",
                height: "26px",
              }}
            />
          </label>
          <button
            onClick={incrementPomodoro}
            style={{
              padding: "2px 6px",
              borderRadius: "0px 5px 5px 0px",
              border: "none",
            }}
          >
            +
          </button>
        </div>
      </>
    );
  };

  const renderForm = () => (
    <StyledTaskForm onSubmit={onSubmitAction} ref={formRef}>
      {renderFormInput()}
      <StyledTaskPomodoroInput>
        {renderPomodoroInput()}
      </StyledTaskPomodoroInput>
      <StyledButtonPrimary type="submit">
        {forList ? "Add List" : "Add Card"}
      </StyledButtonPrimary>
      {renderCancelButton()}
    </StyledTaskForm>
  );

  return isOpen ? renderForm() : renderButton();
};

export default React.memo(TaskFormButton);
