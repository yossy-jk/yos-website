'use client'

export default function PrivacySettingsButton() {
  return <button type="button" className="footer-privacy-settings" onClick={() => window.dispatchEvent(new Event('yos-open-privacy-choices'))}>Privacy settings</button>
}
