import type { SVGProps } from 'react'

const defaults: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
  width: 22,
  height: 22,
  fill: 'currentColor',
  'aria-hidden': true,
}

export function IconNavChat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaults} {...props}>
      <path d="M20 2H4a2 2 0 00-2 2v12a2 2 0 002 2h4l3 3 3-3h7a2 2 0 002-2V4a2 2 0 00-2-2z" />
    </svg>
  )
}

export function IconNavDashboard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaults} {...props}>
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </svg>
  )
}

export function IconNavHistory(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaults} {...props}>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v7l4.73 2.85.8-1.21-4.03-2.44V7z" />
    </svg>
  )
}

export function IconNavAdmin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaults} {...props}>
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v5h-2V7zm0 7h2v2h-2v-2z" />
    </svg>
  )
}

export function IconUserCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaults} {...props}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  )
}

export function IconLogout(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaults} {...props}>
      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
    </svg>
  )
}

export function IconLoginKey(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaults} {...props}>
      <path d="M12.65 10A5.99 5.99 0 007 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 005.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </svg>
  )
}

export function IconSparkle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...defaults} {...props}>
      <path d="M9.21 1.87L10.5 5l3.5.5-3.5.5-1.29 3.13L8.21 6 4.71 5.5 8.21 5l1-3.13zM19 8l-1.26 2.5L15 11l2.74.5L19 14l1.26-2.5L23 11l-2.74-.5L19 8zM5 14l-1.1 2.13L1.77 17l2.13.87L5 20l1.1-2.13L8.23 17l-2.13-.87L5 14z" />
    </svg>
  )
}
