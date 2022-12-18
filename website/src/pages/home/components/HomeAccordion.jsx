import React from 'react'
import {
	Accordion,
	AccordionSummary,
	Typography,
	AccordionDetails,
} from '@mui/material'
import { Rocket } from '@mui/icons-material'

const accordionItems = [
	{
		summary: 'This is one summary',
		details: 'These are the details for this item',
	},
	{
		summary: 'This is the second summary',
		details: 'Here are more details',
	},
]

const AccordionItem = ({ summary, details }) => {
	return (
		<Accordion>
			<AccordionSummary expandIcon={<Rocket />}>
				<Typography>{summary}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Typography>{details}</Typography>
			</AccordionDetails>
		</Accordion>
	)
}

const HomeAccordion = () => {
	return (
		<div
			style={{
				width: '100%',
			}}>
			{accordionItems.map((item, i) => {
				return <AccordionItem {...item} key={i} />
			})}
		</div>
	)
}

export default HomeAccordion
