import React from 'react';
import styled from 'styled-components';

export default function PageHeader({title, subtitle}) {
  return (
    <div className="row">
    <div className="col-md-12 col-sm-12 col-xs-12">
      <Wrapper>
        <h4>{title}</h4>
        <p>{subtitle}</p>
      </Wrapper>
    </div>
    </div>
  )
}

const Wrapper = styled.div`
    margin-top: 0;
    background-color: #fff;
    padding-left: 20px !important;
    padding-top: 30px;
    padding-bottom: 20px;
    border-radius: 5px;
    h4{
        font-size: 27px;
    color: #0C3C54;
    font-weight: 600;
    margin: 0px !important;
    }
    p{
        color: #555555;
    font-size: 12px;
    margin-top: 15px;
    }
`
