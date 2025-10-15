interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Beincom - A Community Social Platform',
    description: `Beincom is a modern social hub and community platform designed for seamless engagement.
Users can access content freely, without interference or distractions.`,
    imgSrc: '/static/images/bic-logo-300x70.webp',
    href: 'https://www.beincom.com/',
  },
  {
    title: 'Crypto Technical Indicator Alert System',
    description: `A Telegram bot that delivers alerts based on technical indicators for cryptocurrencies,
using data from the Binance exchange.`,
    imgSrc: '/static/images/dat09signal.png',
    href: 'https://t.me/dat09signal',
  },
]

export default projectsData
