import { site } from '../data/site.js'

export default function DemoBar({ onClose }) {
  return (
    <div className="demo-bar" role="status">
      <span className="demo-bar__dot" aria-hidden="true" />
      <span className="demo-bar__text">{site.demoNotice.text}</span>
      <button className="demo-bar__close" type="button" onClick={onClose} aria-label="Dismiss notice">
        ×
      </button>
    </div>
  )
}
