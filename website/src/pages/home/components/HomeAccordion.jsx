import React from 'react'
import {
	Accordion,
	AccordionSummary,
	Typography,
	AccordionDetails,
	Grow,
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

const AccordionItem = ({ summary, details, timeout }) => {
	return (
		<Grow in timeout={timeout}>
			<Accordion sx={{ marginBottom: '12px' }}>
				<AccordionSummary expandIcon={<Rocket />}>
					<Typography>{summary}</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>{details}</Typography>
				</AccordionDetails>
			</Accordion>
		</Grow>
	)
}

const HomeAccordion = () => {
	return (
		<div
			style={{
				width: '100%',
			}}>
			{accordionItems.map((item, i) => (
				<AccordionItem {...item} timeout={i * 500 + 500} key={i} />
			))}
		</div>
	)
}

export default HomeAccordion
