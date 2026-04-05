import { useEffect, useState } from "react";

const EVENT_FORM_STYLES = `
  .event-form-grid {
    display: grid;
    gap: 16px;
  }

  .event-form-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .event-form-field {
    display: grid;
    gap: 7px;
  }

  .event-form-label {
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #94A3B8;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .event-form-input,
  .event-form-textarea {
    width: 100%;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    padding: 13px 14px;
    color: #E2E8F0;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .event-form-input:focus,
  .event-form-textarea:focus {
    border-color: rgba(99, 102, 241, 0.55);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    background: rgba(99, 102, 241, 0.06);
  }

  .event-form-textarea {
    resize: vertical;
    min-height: 96px;
  }

  .event-form-input::placeholder,
  .event-form-textarea::placeholder {
    color: #475569;
  }

  .event-form-input[readonly] {
    cursor: not-allowed;
    opacity: 0.9;
  }

  .event-form-file-wrap {
    display: grid;
    gap: 10px;
  }

  .event-form-file-box {
    position: relative;
    border-radius: 16px;
    border: 1px dashed rgba(99, 102, 241, 0.34);
    background: rgba(255, 255, 255, 0.03);
    overflow: hidden;
  }

  .event-form-file-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .event-form-file-ui {
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .event-form-file-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(99, 102, 241, 0.14);
    border: 1px solid rgba(99, 102, 241, 0.24);
    flex-shrink: 0;
  }

  .event-form-file-title {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #CBD5E1;
  }

  .event-form-file-subtitle {
    margin-top: 2px;
    font-size: 12px;
    color: #64748B;
  }

  .event-form-preview {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 18px;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.03);
  }

  .event-form-error {
    font-size: 12px;
    color: #FCA5A5;
    margin-top: -1px;
  }

  .event-form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 6px;
    flex-wrap: wrap;
  }

  .event-form-button {
    padding: 12px 18px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  }

  .event-form-button.secondary {
    background: rgba(255, 255, 255, 0.05);
    color: #CBD5E1;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .event-form-button.primary {
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    color: white;
    box-shadow: 0 8px 22px rgba(99, 102, 241, 0.3);
  }

  .event-form-button:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .event-form-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .event-form-spinner {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: white;
    animation: eventSpin 0.75s linear infinite;
  }

  @keyframes eventSpin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 640px) {
    .event-form-row,
    .event-form-actions {
      grid-template-columns: 1fr;
    }

    .event-form-button {
      width: 100%;
    }
  }
`;

function EventForm({
  values,
  errors,
  onChange,
  onFileChange,
  onSubmit,
  onCancel,
  submitting,
  defaultDepartment,
}) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!values.poster || !(values.poster instanceof File)) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(values.poster);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [values.poster]);

  return (
    <>
      <style>{EVENT_FORM_STYLES}</style>
      <form className="event-form-grid" onSubmit={onSubmit}>
        <div className="event-form-field">
          <label className="event-form-label" htmlFor="title">Event Title</label>
          <input
            id="title"
            className="event-form-input"
            type="text"
            value={values.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="e.g. Annual Tech Hackathon"
            required
          />
          {errors.title && <div className="event-form-error">{errors.title}</div>}
        </div>

        <div className="event-form-field">
          <label className="event-form-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="event-form-textarea"
            value={values.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Write a short event summary"
            rows={4}
          />
        </div>

        <div className="event-form-row">
          <div className="event-form-field">
            <label className="event-form-label" htmlFor="date">Event Date</label>
            <input
              id="date"
              className="event-form-input"
              type="date"
              value={values.date}
              onChange={(e) => onChange("date", e.target.value)}
              required
            />
            {errors.date && <div className="event-form-error">{errors.date}</div>}
          </div>

          <div className="event-form-field">
            <label className="event-form-label" htmlFor="deadline">Registration Deadline</label>
            <input
              id="deadline"
              className="event-form-input"
              type="date"
              value={values.deadline}
              onChange={(e) => onChange("deadline", e.target.value)}
              required
            />
            {errors.deadline && <div className="event-form-error">{errors.deadline}</div>}
          </div>
        </div>

        <div className="event-form-row">
          <div className="event-form-field">
            <label className="event-form-label" htmlFor="venue">Venue</label>
            <input
              id="venue"
              className="event-form-input"
              type="text"
              value={values.venue}
              onChange={(e) => onChange("venue", e.target.value)}
              placeholder="e.g. Main Auditorium"
              required
            />
          </div>

          <div className="event-form-field">
            <label className="event-form-label" htmlFor="department">Department</label>
            <input
              id="department"
              className="event-form-input"
              type="text"
              value={values.department || defaultDepartment || ""}
              onChange={(e) => onChange("department", e.target.value)}
              placeholder="Department"
              readOnly={Boolean(defaultDepartment)}
              required
            />
          </div>
        </div>

        <div className="event-form-row">
          <div className="event-form-field">
            <label className="event-form-label" htmlFor="maxParticipants">Max Participants</label>
            <input
              id="maxParticipants"
              className="event-form-input"
              type="number"
              min="1"
              value={values.maxParticipants}
              onChange={(e) => onChange("maxParticipants", e.target.value)}
              placeholder="e.g. 100"
              required
            />
            {errors.maxParticipants && <div className="event-form-error">{errors.maxParticipants}</div>}
          </div>

          <div className="event-form-field">
            <label className="event-form-label" htmlFor="poster">Event Poster</label>
            <div className="event-form-file-wrap">
              <div className="event-form-file-box">
                <input
                  id="poster"
                  className="event-form-file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                />
                <div className="event-form-file-ui">
                  <div className="event-form-file-icon">+</div>
                  <div>
                    <div className="event-form-file-title">{values.poster ? values.poster.name : "Choose poster image"}</div>
                    <div className="event-form-file-subtitle">PNG, JPG, JPEG or WEBP</div>
                  </div>
                </div>
              </div>
              {previewUrl && <img className="event-form-preview" src={previewUrl} alt="Poster preview" />}
            </div>
          </div>
        </div>

        {errors.submit && <div className="event-form-error">{errors.submit}</div>}

        <div className="event-form-actions">
          <button type="button" className="event-form-button secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="event-form-button primary" disabled={submitting}>
            {submitting ? <><span className="event-form-spinner" />Creating...</> : "Create Event"}
          </button>
        </div>
      </form>
    </>
  );
}

export default EventForm;