import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { site } from '../data/site';

const ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * Contact form.
 *
 * Submits over fetch rather than as a native form POST: a plain POST to
 * web3forms navigates the visitor away to a third-party confirmation page and
 * they lose the site. Here the result is reported inline and the page stays put.
 */
const ContactForm = () => {
  // 'idle' | 'sending' | 'sent' | 'error'
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;

    const form = event.currentTarget;
    setStatus('sending');
    setError('');

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success !== false) {
        setStatus('sent');
        form.reset();
      } else {
        setStatus('error');
        setError(result.message || 'The message could not be sent.');
      }
    } catch {
      setStatus('error');
      setError('Network error — check your connection and try again.');
    }
  };

  const sending = status === 'sending';

  return (
    <div className="sketch-box sketch-contact-card">
      <h3 className="sketch-contact-heading">Send me a message</h3>
      <p className="sketch-contact-sub">
        Interested in collaborating or just want to say hi? Drop a message below, or email{' '}
        <a className="sketch-contact-link" href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <form onSubmit={handleSubmit} className="sketch-contact-form">
        <input type="hidden" name="access_key" value={site.web3formsKey} />
        <input type="hidden" name="subject" value="New message from shreyashmishra.in" />
        {/* Honeypot: web3forms drops the submission when this is filled. */}
        <input type="checkbox" name="botcheck" className="sketch-hidden" tabIndex={-1} aria-hidden="true" />

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          aria-label="Your name"
          autoComplete="name"
          required
          disabled={sending}
          className="sketch-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          aria-label="Your email address"
          autoComplete="email"
          required
          disabled={sending}
          className="sketch-input"
        />
        <textarea
          name="message"
          placeholder="What's on your mind?"
          aria-label="Your message"
          required
          rows="4"
          disabled={sending}
          className="sketch-input sketch-textarea"
        ></textarea>

        <button type="submit" className="sketch-btn sketch-submit-btn" disabled={sending}>
          {sending ? (
            <>Sending <Loader2 size={20} className="sketch-spin" aria-hidden="true" /></>
          ) : (
            <>Send It <Send size={20} aria-hidden="true" /></>
          )}
        </button>
      </form>

      {/* Always mounted and live, so the outcome is announced to screen readers
          instead of only appearing visually. */}
      <div className="sketch-form-status" role="status" aria-live="polite">
        {status === 'sent' && (
          <p className="sketch-form-msg sketch-form-msg--ok">
            <CheckCircle2 size={20} aria-hidden="true" /> Thanks! Your message is on its way.
          </p>
        )}
        {status === 'error' && (
          <p className="sketch-form-msg sketch-form-msg--err">
            <AlertCircle size={20} aria-hidden="true" /> {error} You can also email{' '}
            <a className="sketch-contact-link" href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
