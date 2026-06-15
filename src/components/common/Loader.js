import React from "react";
import styled from "styled-components";

export default function Loader({size}) {

  return (
    <Wrapper size={size}>
      <div className="loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  @import url("https://fonts.googleapis.com/css2?family=Exo:ital,wght@0,100..900;1,100..900&display=swap");

  .loadertitle {
    color: #0c3c54;
    font-size: 13px !important;
    font-family: "Exo";
    font-weight: 500 !important;
    margin-top: 23%;
  }

  .loader {
    display: ruby-text;
    column-gap: 25px;
    width: 100%;
    text-align: center;
    margin:2% auto 0px auto;
    margin-top : ${props => props.size === 'large' ? '2%' : props.size === 'small' ? '0%' : '1%'}; 
    font-family: "Exo", sans-serif;
  }

  .loader .dot {
    width: ${props => props.size === 'large' ? '30px' : props.size === 'small' ? '10px' : '20px'};
    height: ${props => props.size === 'large' ? '30px' : props.size === 'small' ? '10px' : '20px'};
    background-color: black;
    border-radius: 50%;
    animation: loading 1s infinite alternate;
  }

  .loader .dot:nth-child(1) {
    background-color: #0c3c54;
    animation-delay: -0.25s;
  }

  .loader .dot:nth-child(2) {
    background-color: #ac1424;
    animation-delay: -0.5s;
  }

  .loader .dot:nth-child(3) {
    background-color: #ffdd00;
    animation-delay: -0.75s;
  }

  .loader .dot:nth-child(4) {
    background-color: #ac1424;
    animation-delay: -1s;
  }

  .loader .dot:nth-child(5) {
    background-color: #0c3c54;
    animation-delay: -1s;
  }

  @keyframes loading {
    0% {
      transform: translateY(${(props) => (props.size === 'large' ? '-15px' : props.size === 'small' ? '0px' : '-5px')});
    }
    100% {
      transform: translateY(5px);
    }
  }
`;
