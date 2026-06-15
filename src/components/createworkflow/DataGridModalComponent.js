import React, { useState, useEffect } from 'react'
import {Modal} from 'react-bootstrap';


function DataGridModalComponent(props) {
    return (
     
        <Modal.Dialog
        className='newmodel1'
        show={props.show}
        onHide={props.onHide}
        dialogClassName="my-dgmodal"
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >


        <Modal.Body className='newmoderlbody1' >
        <div>
                        <button type="button" onClick={props.onHide} class="close"><iconify-icon icon="material-symbols:close"></iconify-icon></button>
                    </div>
                    <div class="col-md-12 col-sm-12 col-xs-12 padding">
                        <div class="dealerpoptitle">FOC</div>
                    </div>
                    <div class="col-md-12 col-sm-12 col-xs-12 padding space1">
                        <div class="col-md-3 col-sm-6 col-xs-12">
                            <div class="form-group1">
                                <label for="email">SKU Name</label>
                                <select class="form-control" id="sel1">
                                    <option>Select Here</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                  </select>
                             </div>
                        </div>
                        <div class="col-md-3 col-sm-6 col-xs-12">
                            <div class="form-group1">
                                <label for="email">Search By Dealer</label>
                                <input type="email" class="form-control" id="email" placeholder="Enter Dealer" />
                                <iconify-icon icon="material-symbols:search"></iconify-icon>
                             </div>
                        </div>
                        <div class="col-md-2 col-sm-6 col-xs-12">
                            <div class="form-group1">
                                <label for="email">Search By Week</label>
                                <select class="form-control" id="sel1">
                                    <option>Select Here</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                  </select>
                             </div>
                        </div>
                        <div class="col-md-4 col-sm-6 col-xs-12">
                            <div class="form-group1">
                                <label for="email">Upload ExcelSheet</label>
                                <div class="choosefile">
                                     <input type="email" class="form-control" id="email" placeholder="No File Choosen" />
                                     <span class="input-group-addon">Choose File</span>
                                </div>
                                <div class="txt1">File Type: Excel & CSV</div>
                             </div>
                        </div>
                    </div>
        </Modal.Body>

    </Modal.Dialog>
    )
}

// return <>
// <DataGridModalComponent show={} onHide={} />
// </>

export default DataGridModalComponent;
