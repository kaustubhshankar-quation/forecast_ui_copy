import React from 'react';
import styled from 'styled-components';

export default function PageContainer({children}) {
  return (
    <Wrapper>{children}</Wrapper>
  )
}


const Wrapper = styled.div`
    background-color: #fff !important;
    border-radius: 5px;
    box-shadow: 0px 0px 16px 1px rgba(0, 0, 0, 0.12);
    width: 85% !important;
    font-family: "Exo";
    padding: 15px;
    margin: 2vh auto 0 auto;
`