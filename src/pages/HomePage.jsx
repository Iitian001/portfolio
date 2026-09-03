import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import PageShell from '../components/PageShell';
import ContactForm from '../components/ContactForm';
import SectionTitle from '../components/SectionTitle';
import Reveal from '../components/Reveal';
import SkillsBoard from '../components/SkillsBoard';
import { site } from '../data/site';
import { usePageTitle } from '../hooks/usePageTitle';

const HomePage = () => {
  usePageTitle(null);

  return (
    <PageShell>
      {/* Hero Section */}
      {/* The hero is above the fold, so it enters on plain CSS delays rather
          than through an observer — nothing here waits on JavaScript. The h1
          slides without fading and the portrait does not animate at all,
          because one of the two is the Largest Contentful Paint element. */}
      <section className="sketch-hero">
        <div className="sketch-hero-text">
          <span className="sketch-greeting sketch-enter">Hi, I am</span>
          <h1 className="sketch-title sketch-enter sketch-enter--slide">{site.name}</h1>
          {/* Read from site.js rather than repeated here: this exact string also
              appears in the page title, the OG tags and the Person schema. */}
          <h2 className="sketch-subtitle sketch-enter sketch-enter--2">{site.role}</h2>
          <p className="sketch-description sketch-enter sketch-enter--3">
            I build robust web applications and intelligent systems. Currently available for freelance work and new opportunities!
          </p>
          <div className="sketch-socials sketch-enter sketch-enter--4">
            <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub size={28} /></a>
            <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin size={28} /></a>
            <a href={`mailto:${site.email}`} aria-label={`Email ${site.email}`}><Mail size={28} /></a>
          </div>
          <Link to="/projects" className="sketch-btn sketch-enter sketch-enter--5">Explore Projects <ArrowRight size={22} /></Link>
        </div>

        <div className="sketch-hero-visual">
          <div className="sketch-avatar-frame">
            <img
              src="/sketch-avatar.webp"
              alt="Pencil sketch portrait of Shreyash"
              className="sketch-avatar"
              width="819"
              height="1024"
              fetchPriority="high"
              decoding="sync"
            />
          </div>
          <div className="sketch-arrow-annotation">That's me! &uarr;</div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="sketch-section">
        <SectionTitle>Who Am I?</SectionTitle>
        <div className="sketch-about-grid">
          <Reveal className="sketch-box sketch-about-bio">
            <p>I'm Shreyash, a passionate creative developer specializing in building stunning, high-performance web applications and intelligent systems.</p>
            <p>I blend bleeding-edge technology with bold, unapologetic design. When I'm not writing code or automating workflows, you can find me exploring new AI architectures or refining my design systems.</p>
          </Reveal>
          <Reveal className="sketch-box sketch-fast-facts" delay={120}>
            <h3 className="sketch-facts-title">Fast Facts</h3>
            <div className="sketch-fact"><strong>Location:</strong> {site.location}</div>
            <div className="sketch-fact">
              <strong>Email:</strong>{' '}
              <a className="sketch-contact-link" href={`mailto:${site.email}`}>{site.email}</a>
            </div>
            <div className="sketch-fact"><strong>Experience:</strong> Full Stack &amp; AI</div>
            <div className="sketch-fact"><strong>Status:</strong> Open to Work</div>
          </Reveal>
        </div>
      </section>

      {/* Skills Section */}
      {/* The list itself lives in SkillsBoard, which is also where it may be
          handed over to a physics engine. The section stays here so the anchor
          and the heading are the page's, not the enhancement's. */}
      <section id="skills" className="sketch-section">
        <SectionTitle>My Skills</SectionTitle>
        <SkillsBoard />
      </section>

      {/* Contact Section */}
      <section id="contact" className="sketch-section">
        <SectionTitle>Let's Talk</SectionTitle>
        <ContactForm />
      </section>
    </PageShell>
  );
};

export default HomePage;
