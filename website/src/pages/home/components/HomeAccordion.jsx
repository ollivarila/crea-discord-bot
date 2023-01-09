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
		summary: 'About project',
		details:
			'This project has taken about two months of my time. I did this project because I have been very interested in how discord bots work and also wanted to get more hands on experience on fullstack development. This project uses turborepo for its monorepo solution. This project has been developed with the MERN stack. I have also setup a CI/CD pipeline with github actions.',
	},
	{
		summary: 'Website',
		details:
			'This website has been developed with Vite using React and Material UI',
	},
	{
		summary: 'Backend',
		details:
			'The backend has been developed using express and it uses various technologies like discord.js, discord-interactions and mongoose.',
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
