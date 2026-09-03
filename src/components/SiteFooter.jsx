import { Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { site } from '../data/site';

const SiteFooter = () => (
  <footer className="sketch-footer">
    <div className="sketch-footer-signature">Handcrafted by {site.name}</div>

    <div className="sketch-footer-links">
      <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub size={22} /></a>
      <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin size={22} /></a>
      <a href={`mailto:${site.email}`} aria-label={`Email ${site.email}`}><Mail size={22} /></a>
    </div>

    <a className="sketch-footer-email sketch-contact-link" href={`mailto:${site.email}`}>{site.email}</a>

    {/* Derived from the clock so the notice doesn't silently go stale. */}
    <div className="sketch-footer-copy">&copy; {new Date().getFullYear()} All rights reserved</div>
  </footer>
);

export default SiteFooter;
