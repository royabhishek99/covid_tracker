import React from 'react'
import { ExpandMore } from '@material-ui/icons';
import {Typography, Accordion,AccordionSummary, AccordionDetails  } from '@material-ui/core';
import numeral from 'numeral';
import './InfoAccodion.css'

export default function InfoAccodion({title, sub_title, total, left_heading, right_heading, right_total}) {
    return (
        <div className="main">
            <Accordion >
                <AccordionSummary className="heading" expandIcon={<ExpandMore />}>
                    {title}
                </AccordionSummary>

                <AccordionDetails>
                    <div className="info">
                        <Typography className="AccordionSubTitle" variant="h4" align="center">
                        {numeral(total).format("0,0")}
                        </Typography>
                        <Typography className="AccordionTotal" variant="h5" align="center">
                            {sub_title}
                        </Typography>
                    </div>
                </AccordionDetails>

                <AccordionDetails>
                    <div className="moreInfo">
                            <div className="left">
                                <Typography variant="h5" align="center">
                                    {numeral(total - right_total).format("0,0")}
                                </Typography>
                                <Typography className="AccordionTotal" variant="h6" align="center">
                                    {left_heading}
                                </Typography>
                            </div>
                            <div className="right">
                                <Typography variant="h5" align="center">
                                    {numeral(right_total).format("0,0")}
                                </Typography>
                                <Typography className="AccordionTotal" variant="h6" align="center">
                                    {right_heading}
                                </Typography>
                            </div>
                        </div>
                </AccordionDetails>
            </Accordion>
        </div>
        
    )
}
