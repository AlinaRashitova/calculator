import React from 'react'
import './Button.css'

const Button = (props) => {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.text}
      <span className="span">{props.spanText}</span>
    </button>
  )
}

export default Button
