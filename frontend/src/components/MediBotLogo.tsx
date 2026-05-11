import { MEDIBOT_LOGO_URL } from '../constants/brand'
import './MediBotLogo.css'

export type MediBotLogoSize = 'nav' | 'footer' | 'mobile' | 'hero' | 'chat' | 'auth' | 'admin'

type Props = {
  size?: MediBotLogoSize
  className?: string
  alt?: string
}

export default function MediBotLogo({ size = 'nav', className = '', alt = 'MediBot' }: Props) {
  const imgAlt = alt === '' ? '' : alt || 'MediBot'

  return (
    <span
      className={`medibot-logo-3d medibot-logo-3d--${size} ${className}`.trim()}
      aria-hidden={alt === '' ? true : undefined}
    >
      <span className="medibot-logo-3d__prism" aria-hidden />
      <span className="medibot-logo-3d__ambient" aria-hidden />
      <span className="medibot-logo-3d__ambient medibot-logo-3d__ambient--alt" aria-hidden />
      <span className="medibot-logo-3d__sonar" aria-hidden />
      <span className="medibot-logo-3d__orbit" aria-hidden>
        <span className="medibot-logo-3d__orb-dot" />
        <span className="medibot-logo-3d__orb-dot" />
        <span className="medibot-logo-3d__orb-dot" />
      </span>
      <span className="medibot-logo-3d__shine-sweep" aria-hidden />
      <span className="medibot-logo-3d__shine-sweep medibot-logo-3d__shine-sweep--echo" aria-hidden />
      <img
        src={MEDIBOT_LOGO_URL}
        alt={imgAlt}
        className="medibot-logo-3d__img"
        width={220}
        height={66}
        decoding="async"
        loading="eager"
        draggable={false}
      />
    </span>
  )
}
