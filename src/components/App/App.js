import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Button from '../Button/Button';
import Input from '../Input/Input';

const App = () => {
  const [stringArray, setStringArray] = useState("0");
  const dataRef = useRef(["0"])

  useEffect(() => {
    document.addEventListener('keydown', (event) => {
      if (event.code === "Digit2" && event.shiftKey) {
        handleClick("√");
      } else if (event.key === "2" && event.altKey) {
        handleClick("х²");
      } else if (event.key === "1") {
        handleClick("1");
      } else if (event.key === "2") {
        handleClick("2");
      } else if (event.key === "3") {
        handleClick("3");
      } else if (event.key === "4") {
        handleClick("4");
      } else if (event.key === "5") {
        handleClick("5");
      } else if (event.key === "6") {
        handleClick("6");
      } else if (event.key === "7") {
        handleClick("7");
      } else if (event.key === "8") {
        handleClick("8");
      } else if (event.key === "9") {
        handleClick("9");
      } else if (event.key === "0") {
        handleClick("0");
      } else if (event.key === ".") {
        handleClick(".");
      } else if (event.key === "-") {
        handleClick("-");
      } else if (event.key === "+") {
        handleClick("+");
      } else if (event.key === "*") {
        handleClick("*");
      } else if (event.key === "/") {
        handleClick("/");
      } else if (event.key === "=" || event.key === "Enter") {
        handleClick("=");
      } else if (event.key === "(") {
        handleClick("(");
      } else if (event.key === ")") {
        handleClick(")");
      } else if (event.key === "s" || event.key === "S") {
        handleClick("sin");
      } else if (event.key === "c" || event.key === "C") {
        handleClick("cos");
      } else if (event.key === "t" || event.key === "T") {
        handleClick("tan");
      } else if (event.key === "q" || event.key === "Q") {
        handleClick("cotan");
      } else if (event.code === "Backspace") {
        handleClick("delete");
      } else if (event.code === "Escape" || event.code === "Delete") {
        clear();
      }
    })
  }, [])

  const clear = () => {
    dataRef.current = ["0"];
    setStringArray("0");
  }

  const handleClick = (value) => {
    const lastElement = dataRef.current[dataRef.current.length - 1];

    if (!isNaN(value)) { // число
      if (isNaN(lastElement)) {
        dataRef.current.push(value);
      } else if (lastElement === "0") {
        dataRef.current[dataRef.current.length - 1] = value;
      } else {
        dataRef.current[dataRef.current.length - 1] = lastElement + value;
      }
    } else if (value === "delete") { // delete
      if (lastElement.length > 1) {
        dataRef.current[dataRef.current.length - 1] = lastElement.slice(0, -1);
      } else {
        if (lastElement === "(" && ["√", "х²", "sin", "cos", "tan", "cotan"].includes(dataRef.current[dataRef.current.length - 2])) {
          dataRef.current.pop();
          dataRef.current.pop();
        } else {
          dataRef.current.pop();
        }
        if (dataRef.current.length === 0) {
          dataRef.current.push("0");
        }
      }
    } else if (value === ".") { // .
      if (isNaN(lastElement)) {
        dataRef.current[dataRef.current.length] = "0.";
      } else {
        if (!lastElement.includes(".")) {
          dataRef.current[dataRef.current.length - 1] = lastElement + value;
        }
      }
    } else if (value === "=") { // =
      try {
        const result = calculate(dataRef.current);
        dataRef.current = ["0"];
        if (result.length === 1 && Number.isFinite(Number(result[0]))) {
          if (result[0] % 1 !== 0) {
            dataRef.current = [Number(result[0]).toFixed(5)];
          } else {
            dataRef.current = [result[0].toString()];
          }
        }
      } catch (err) {
        dataRef.current = ["0"];
      }
    } else if (value === "(") { // (
      if (dataRef.current.length === 1 && lastElement === "0") {
        dataRef.current[dataRef.current.length - 1] = value;
      } else if (["+", "-", "*", "/", "("].includes(lastElement)) {
        dataRef.current.push(value);
      }
    } else if (value === ")") { // )
      if ((!isNaN(lastElement[lastElement.length - 1]) || lastElement === ")") && dataRef.current.length > 1) {
        dataRef.current.push(value);
      }
    } else if (["√", "х²", "sin", "cos", "tan", "cotan"].includes(value)) {
      if (["+", "-", "*", "/", "("].includes(lastElement)) {
        dataRef.current.push(value, "(");
      } else if (dataRef.current.length === 1 && lastElement === "0") {
        dataRef.current[dataRef.current.length - 1] = value;
        dataRef.current.push("(");
      }
    } else if (["+", "-", "*", "/"].includes(value)) { // operator
      if (["+", "-", "*", "/"].includes(lastElement)) {
        dataRef.current[dataRef.current.length - 1] = value;
      } else if ((!isNaN(lastElement[lastElement.length - 1]) || lastElement === ")")) {
        dataRef.current.push(value);
      }
    }
    setStringArray(dataRef.current.join(' '));
  }

  const calculate = (arr, count = 0) => {
    count++;
    const arrCopy = [...arr];
    const multiply = arrCopy.indexOf("*");
    const divide = arrCopy.indexOf("/");
    const plus = arrCopy.indexOf("+");
    const minus = arrCopy.indexOf("-");

    const [firstBracketIndex, lastBracketIndex] = countBrackets(arrCopy);
    if (firstBracketIndex >= 0 && lastBracketIndex >= 0) {
      const slicedArray = arrCopy.slice(firstBracketIndex + 1, lastBracketIndex);
      const noBracketsArray = calculate(slicedArray, count);
      if (arrCopy[firstBracketIndex - 1] === "√") {
        let resultSqrt = Math.sqrt(noBracketsArray);
        arrCopy.splice(firstBracketIndex - 1, slicedArray.length + 3, resultSqrt)
      } else if (arrCopy[firstBracketIndex - 1] === "х²") {
        let resultSquare = Math.pow(noBracketsArray, 2);
        arrCopy.splice(firstBracketIndex - 1, slicedArray.length + 3, resultSquare);
      } else if (arrCopy[firstBracketIndex - 1] === "sin") {
        let resultSinus = Number(Math.sin(noBracketsArray[0] * (Math.PI / 180)).toFixed(10));
        arrCopy.splice(firstBracketIndex - 1, slicedArray.length + 3, resultSinus);
      } else if (arrCopy[firstBracketIndex - 1] === "cos") {
        let resultCosine = Number(Math.cos(noBracketsArray[0] * (Math.PI / 180)).toFixed(10));
        arrCopy.splice(firstBracketIndex - 1, slicedArray.length + 3, resultCosine);
      } else if (arrCopy[firstBracketIndex - 1] === "tan") {
        let resultTangent = Number(Math.tan(noBracketsArray[0] * (Math.PI / 180)).toFixed(10));
        arrCopy.splice(firstBracketIndex - 1, slicedArray.length + 3, resultTangent);
      } else if (arrCopy[firstBracketIndex - 1] === "cotan") {
        let resultCotangent = 1 / Number(Math.tan(noBracketsArray[0] * (Math.PI / 180)).toFixed(10));
        arrCopy.splice(firstBracketIndex - 1, slicedArray.length + 3, resultCotangent);
      } else {
        arrCopy.splice(firstBracketIndex, slicedArray.length + 2, noBracketsArray[0]);
      }
    } else if (multiply >= 0 && (divide < 0 || multiply < divide)) {
      let result = arrCopy[multiply - 1] * arrCopy[multiply + 1];
      arrCopy.splice(multiply - 1, 3, result);
    } else if (divide >= 0 && (multiply < 0 || divide < multiply)) {
      let result = arrCopy[divide - 1] / arrCopy[divide + 1];
      arrCopy.splice(divide - 1, 3, result);
    } else if (plus >= 0 && (minus < 0 || plus < minus)) {
      let result = Number(arrCopy[plus - 1]) + Number(arrCopy[plus + 1]);
      arrCopy.splice(plus - 1, 3, result);
    } else if (minus >= 0 && (plus < 0 || minus < plus)) {
      let result = arrCopy[minus - 1] - arrCopy[minus + 1];
      arrCopy.splice(minus - 1, 3, result);
    } else {
      return arrCopy;
    }

    return calculate(arrCopy, count);
  }

  const countBrackets = (arr) => {
    let counter = 0;
    let firstBracketIndex = arr.indexOf("(");
    let lastBracketIndex = -1;

    for (let i = firstBracketIndex + 1; i < arr.length; i++) {
      let currentElement = arr[i];
      if (currentElement === ")" && counter === 0) {
        lastBracketIndex = i;
        break;
      } else {
        if (currentElement === "(") {
          counter++;
        } else if (currentElement === ")") {
          counter--;
        }
      }
    }
    if ((firstBracketIndex >= 0 && lastBracketIndex < 0) || (lastBracketIndex >= 0 && firstBracketIndex < 0)) {
      throw new Error("No pair bracket!");
    }
    return [firstBracketIndex, lastBracketIndex];
  }

  return (
    <div className="container">
      <Input value={stringArray} />
      <div className="keypad">
        <Button text="Clear" onClick={clear} className="button button_highlight" />
        <Button text="C" onClick={() => handleClick("delete")} className="button button_highlight" />
        <Button text="&#40;" onClick={() => handleClick("(")} className="button button_highlight" />
        <Button text="&#41;" onClick={() => handleClick(")")} className="button button_highlight" />
        <Button text="sin" spanText="S" onClick={() => handleClick("sin")} className="button button_highlight" />
        <Button text="7" onClick={() => handleClick("7")} className="button" />
        <Button text="8" onClick={() => handleClick("8")} className="button" />
        <Button text="9" onClick={() => handleClick("9")} className="button" />
        <Button text="&radic;" spanText="shift + 2" onClick={() => handleClick("√")} className="button button_highlight" />
        <Button text="cos" spanText="C" onClick={() => handleClick("cos")} className="button button_highlight" />
        <Button text="4" onClick={() => handleClick("4")} className="button" />
        <Button text="5" onClick={() => handleClick("5")} className="button" />
        <Button text="6" onClick={() => handleClick("6")} className="button" />
        <Button text="x&sup2;" spanText="alt + 2" onClick={() => handleClick("х²")} className="button button_highlight" />
        <Button text="tan" spanText="T" onClick={() => handleClick("tan")} className="button button_highlight" />
        <Button text="1" onClick={() => handleClick("1")} className="button" />
        <Button text="2" onClick={() => handleClick("2")} className="button" />
        <Button text="3" onClick={() => handleClick("3")} className="button" />
        <Button text="&divide;" onClick={() => handleClick("/")} className="button button_highlight" />
        <Button text="cotan" spanText="Q" onClick={() => handleClick("cotan")} className="button button_highlight" />
        <Button text="0" onClick={() => handleClick("0")} className="button" />
        <Button text="." onClick={() => handleClick(".")} className="button" />
        <Button text="&times;" onClick={() => handleClick("*")} className="button button_highlight" />
        <Button text="&minus;" onClick={() => handleClick("-")} className="button button_highlight" />
        <Button text="+" onClick={() => handleClick("+")} className="button button_highlight button_plus" />
        <Button text="=" onClick={() => handleClick("=")} className="button button_highlight button_equal" />
      </div>
    </div>
  )
}

export default App;
