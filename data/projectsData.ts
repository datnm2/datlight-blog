interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Beincom - A Community Social Platform',
    description: `Beincom - The Future Of Community Engagement
Beincom is a social hub and community platform.

We commit our users reach the contents without interference.`,
    imgSrc: '/static/images/bic-logo-300x70.webp',
    href: 'https://www.beincom.com/',
  },
  {
    title: 'Crypto Technical Indicator Alert System',
    description: `A Telegram bot that sends alerts based on technical indicators for cryptocurrencies.
    Base on the data of Binance exchange.`,
    imgSrc: '/static/images/dat09signal.png',
    href: 'https://t.me/dat09signal',
  },
]

export default projectsData
