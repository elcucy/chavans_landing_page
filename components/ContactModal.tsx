import React, { useRef, useEffect } from 'react';

const ContactModal: React.FC<{ isOpen: boolean; closeModal: () => void }> = ({ isOpen, closeModal }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the first input field when the modal opens
      nameInputRef.current?.focus();
    }
  }, [isOpen]);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (!form.reportValidity()) return;
    
    alert('Thanks! We received your request. We will contact you shortly.');
    
    if (formRef.current) {
        formRef.current.reset();
    }
    closeModal();
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-back" id="modal" aria-hidden="false" style={{display: 'flex'}} onClick={(e) => { if (e.currentTarget === e.target) closeModal() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="contactTitle">
        <h3 id="contactTitle">Request a Callback</h3>
        <p style={{ color: 'var(--muted)', marginTop: '6px' }}>Leave your details and we'll get back within 1 business day.</p>

        <form id="contactForm" onSubmit={submitForm} noValidate ref={formRef}>
          <div className="form-row" style={{ marginTop: '12px' }}>
            <div className="col">
              <label htmlFor="name">Full name *</label>
              <input id="name" name="name" required ref={nameInputRef} />
            </div>
            <div className="col">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" />
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <label htmlFor="email">Email address *</label>
            <input id="email" name="email" type="email" required />
          </div>

          <div style={{ marginTop: '10px' }}>
            <label htmlFor="phone">Main phone number *</label>
            <input id="phone" name="phone" type="tel" placeholder="+1 555 555 5555" required />
          </div>

          <div style={{ marginTop: '10px' }}>
            <label htmlFor="interest">Interested in</label>
            <select id="interest" name="interest">
              <option>AI & Intelligence</option>
              <option>Infrastructure</option>
              <option>Security</option>
              <option>Professional Services</option>
              <option>Managed Services</option>
              <option>Educational Services</option>
              <option>Other</option>
            </select>
          </div>

          <div style={{ marginTop: '10px' }}>
            <label htmlFor="msg">Message</label>
            <textarea id="msg" name="msg" placeholder="Tell us more (optional)"></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn secondary" onClick={closeModal}>Cancel</button>
            <button className="btn" type="submit">Request Callback</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
