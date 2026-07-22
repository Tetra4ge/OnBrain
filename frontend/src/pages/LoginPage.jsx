import { useEffect, useState } from 'react'
import { ArrowRight, BrainCircuit, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './HomePage.css'

function GoogleMark() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.5h3.2c1.9-1.8 3.1-4.4 3.1-7.4Z" /><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.5c-.9.6-2 .9-3.5.9-2.7 0-5-1.8-5.8-4.3H2.9v2.6A10 10 0 0 0 12 22Z" /><path fill="#FBBC05" d="M6.2 13.7a6 6 0 0 1 0-3.5V7.6H2.9a10 10 0 0 0 0 8.8l3.3-2.7Z" /><path fill="#EA4335" d="M12 6c1.6 0 3 .5 4.1 1.6l3-3A10 10 0 0 0 2.9 7.6l3.3 2.6C7 7.8 9.3 6 12 6Z" /></svg>
}

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { if (user) navigate('/app', { replace: true }) }, [user, navigate])

  const handleSignIn = async () => {
    setSubmitting(true)
    setError('')
    try { await signInWithGoogle() } catch (err) {
      setError(err.code === 'auth/popup-closed-by-user' ? 'Sign-in was cancelled. Please try again when you are ready.' : 'Google sign-in could not be completed. Check Firebase authorized domains and try again.')
    } finally { setSubmitting(false) }
  }

  return (
    <main className="ob-home ob-auth-page">
      <div className="ob-noise" aria-hidden="true" />
      <nav className="ob-nav wrap" aria-label="Authentication navigation">
        <Link className="ob-logo" to="/" aria-label="OnBrain home"><span>ONBRAIN</span></Link>
        <Link className="ob-nav-cta" to="/">Back to site <ArrowRight size={16} /></Link>
      </nav>
      <section className="ob-auth-wrap wrap">
        <div className="ob-auth-intro"><p className="ob-eyebrow"> -Secure workspace access</p><h1>Bring your<br /><em>evidence</em><br />to work.</h1><p>Sign in to access your team’s industrial intelligence workspace, connected source records and operational investigations.</p><div className="ob-auth-trust"></div></div>
        <section className="ob-auth-card" aria-labelledby="signin-title"><span className="ob-auth-index">01 / ACCESS</span><h2 id="signin-title">Sign in to<br />OnBrain.</h2><p>Use your Google account to continue to the workspace.</p><button type="button" onClick={handleSignIn} disabled={loading || submitting} className="ob-google-button"><GoogleMark /> <span>{submitting ? 'Opening Google…' : loading ? 'Checking session…' : 'Continue with Google'}</span><ArrowRight size={17} /></button>{error && <p className="ob-auth-error" role="alert">{error}</p>}<small>By continuing, you agree to use OnBrain only for authorized operational work.</small></section>
      </section>
    </main>
  )
}
