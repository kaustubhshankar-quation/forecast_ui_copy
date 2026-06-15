import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import styled from "styled-components";

const Example = (props) => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <div>
      <Button
        href="#"
        className="popup-btn"
        bsSize="large"
        onClick={handleShow}
      >
        {props.ModuleName}{" "}
        <iconify-icon icon="iconamoon:arrow-right-2-thin"></iconify-icon>
      </Button>
      <Wrapper>
        <Modal
          show={show}
          backdrop="static"
          dialogClassName="modal-dialog newmodel1"
          onHide={handleClose}
        >
          <Modal.Body className="modal-body newmoderlbody1">
            <div>
              <CloseButton
                type="button"
                onClick={handleClose}
                className="close"
              >
                <iconify-icon icon="material-symbols:close"></iconify-icon>
              </CloseButton>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 padding">
              <div className="dealerpoptitle">{props.ModuleName}</div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 padding space1">
              <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="form-group1">
                  <label htmlFor="email">SKU Name</label>
                  <select className="form-control" id="sel1">
                    <option>Select Here</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="form-group1">
                  <label htmlFor="email">Search By Dealer</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter Dealer"
                  />
                  <iconify-icon icon="material-symbols:search"></iconify-icon>
                </div>
              </div>
              <div className="col-md-2 col-sm-6 col-xs-12">
                <div className="form-group1">
                  <label htmlFor="email">Search By Week</label>
                  <select className="form-control" id="sel1">
                    <option>Select Here</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4 col-sm-6 col-xs-12">
                <div className="form-group1">
                  <label htmlFor="email">Upload ExcelSheet</label>
                  <div className="choosefile">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="No File Chosen"
                    />
                    <span className="input-group-addon">Choose File</span>
                  </div>
                  <div className="txt1">File Type: Excel & CSV</div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </Wrapper>
    </div>
  );
};

export default Example;

const CloseButton = styled.button`
  top: -25px;
  right: -30px;
  font-size: 33px;
  position: absolute;
  z-index: 99;
  color: #fff;
  opacity: 1;
`;

const Wrapper = styled.div``;
