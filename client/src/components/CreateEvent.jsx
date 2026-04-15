import { useEffect, useMemo, useState } from "react";
import EventForm from "./EventForm";
import { apiUrl } from "../constants/api";

const CREATE_EVENT_STYLES = `
  .create-event-overlay {
    position: fixed;
    inset: 0;
    z-index: 220;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(7, 9, 26, 0.84);
    backdrop-filter: blur(12px);
    animation: createFadeIn 0.2s ease;
  }

  .create-event-modal {
    width: min(100%, 760px);
    max-height: 92vh;
    overflow-y: auto;
    border-radius: 28px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(7, 9, 26, 0.98));
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.55);
    animation: createSlideIn 0.24s ease;
  }

  .create-event-modal::-webkit-scrollbar { width: 4px; }
  .create-event-modal::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.35); border-radius: 999px; }

  .create-event-head {
    padding: 24px 26px 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .create-event-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    padding: 4px 12px;
    border-radius: 999px;
    border: 1px solid rgba(99, 102, 241, 0.22);
    background: rgba(99, 102, 241, 0.12);
    color: #A5B4FC;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .create-event-title {
    margin: 0;
    font-family: 'Outfit', sans-serif;
    font-size: 1.35rem;
    font-weight: 800;
    color: #E2E8F0;
    letter-spacing: -0.03em;
  }

  .create-event-subtitle {
    margin-top: 6px;
    color: #64748B;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .create-event-close {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
    color: #CBD5E1;
    cursor: pointer;
    flex-shrink: 0;
  }

  .create-event-body {
    padding: 22px 26px 26px;
  }

  .create-event-success {
    margin-bottom: 16px;
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.18);
    color: #6EE7B7;
    font-size: 0.95rem;
  }

  @keyframes createFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes createSlideIn {
    from { opacity: 0; transform: translateY(18px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @media (max-width: 640px) {
    .create-event-head,
    .create-event-body {
      padding-left: 18px;
      padding-right: 18px;
    }
  }
`;

const buildInitialForm = (department) => ({
  title: "",
  description: "",
  date: "",
  venue: "",
  department: department || "",
  eventType: "",
  customEventType: "",
  maxParticipants: "",
  deadline: "",
  poster: null,
});

function CreateEvent({ open, onClose, onCreated, department }) {
  const defaultDepartment = useMemo(() => department || localStorage.getItem("deptId") || "", [department]);
  const [form, setForm] = useState(() => buildInitialForm(defaultDepartment));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (open) {
      setForm(buildInitialForm(defaultDepartment));
      setErrors({});
      setSuccess("");
    }
  }, [open, defaultDepartment]);

  const handleChange = (field, value) => {
    setForm((previous) => {
      if (field === "eventType" && value !== "Other") {
        return { ...previous, eventType: value, customEventType: "" };
      }

      return { ...previous, [field]: value };
    });
  };

  const handleFileChange = (file) => {
    setForm((previous) => ({ ...previous, poster: file }));
  };

  const validate = () => {
    const nextErrors = {};

    const resolvedEventType = form.eventType === "Other"
      ? form.customEventType.trim()
      : form.eventType.trim();

    if (!form.title.trim()) nextErrors.title = "Event title is required.";
    if (!form.date) nextErrors.date = "Event date is required.";
    if (!form.deadline) nextErrors.deadline = "Registration deadline is required.";
    if (!form.eventType.trim()) nextErrors.eventType = "Event type is required.";
    if (form.eventType === "Other" && !form.customEventType.trim()) {
      nextErrors.customEventType = "Please enter a custom event type.";
    }
    if (!resolvedEventType) nextErrors.eventType = "Event type is required.";

    const maxParticipants = Number(form.maxParticipants);
    if (!Number.isFinite(maxParticipants) || maxParticipants <= 0) {
      nextErrors.maxParticipants = "Max participants must be greater than 0.";
    }

    if (form.date && form.deadline) {
      const eventDate = new Date(form.date);
      const deadlineDate = new Date(form.deadline);
      if (deadlineDate >= eventDate) {
        nextErrors.deadline = "Deadline must be before the event date.";
      }
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    setSuccess("");

    try {
      const resolvedEventType = form.eventType === "Other"
        ? form.customEventType.trim()
        : form.eventType.trim();

      const payload = new FormData();
      payload.append("title", form.title.trim());
      payload.append("description", form.description.trim());
      payload.append("date", form.date);
      payload.append("venue", form.venue.trim());
      payload.append("eventType", resolvedEventType);
      payload.append("department", form.department || defaultDepartment);
      payload.append("maxParticipants", String(form.maxParticipants));
      payload.append("deadline", form.deadline);
      if (form.poster) payload.append("poster", form.poster);

      const response = await fetch(apiUrl("/api/events/create"), {
        method: "POST",
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to create event");
      }

      setSuccess("Event created successfully.");
      setForm(buildInitialForm(defaultDepartment));
      if (onCreated) onCreated(data);

      setTimeout(() => {
        if (onClose) onClose();
        setSuccess("");
      }, 900);
    } catch (err) {
      setErrors({ submit: err.message || "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <style>{CREATE_EVENT_STYLES}</style>
      <div className="create-event-overlay" onClick={onClose}>
        <div className="create-event-modal" onClick={(e) => e.stopPropagation()}>
          <div className="create-event-head">
            <div>
              <div className="create-event-kicker">New Event</div>
              <h2 className="create-event-title">Create Event</h2>
              <p className="create-event-subtitle">Add a poster, set the deadline, and publish an event in minutes.</p>
            </div>
            <button type="button" className="create-event-close" onClick={onClose} aria-label="Close create event">
              ×
            </button>
          </div>

          <div className="create-event-body">
            {success && <div className="create-event-success">{success}</div>}
            <EventForm
              values={form}
              errors={errors}
              onChange={handleChange}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
              onCancel={onClose}
              submitting={submitting}
              defaultDepartment={defaultDepartment}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateEvent;