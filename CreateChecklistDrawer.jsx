import React, { useMemo, useState } from 'react';

const STEP_COUNT = 3;

const initialFormData = {
  checklistName: '',
  category: '',
  location: '',
  department: '',
  applicableLaw: '',
  frequency: '',
  customStartDate: '',
  customDueRule: '',
  assignedTo: '',
  reviewer: '',
  reminder: '',
};

function Drawer({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.backdrop} onClick={onClose} />
      <aside style={styles.drawer} role="dialog" aria-modal="true" aria-label="Create Checklist">
        {children}
      </aside>
    </div>
  );
}

function StepIndicator({ step }) {
  return (
    <div style={styles.stepIndicatorWrap}>
      <div style={styles.stepLabel}>Step {step} / {STEP_COUNT}</div>
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${(step / STEP_COUNT) * 100}%` }} />
      </div>
    </div>
  );
}

function Step1({ data, onChange }) {
  return (
    <div style={styles.stepBody}>
      <h3 style={styles.sectionHeading}>Basic Info</h3>
      <label style={styles.label}>
        Checklist Name
        <input
          style={styles.input}
          value={data.checklistName}
          onChange={(e) => onChange('checklistName', e.target.value)}
          placeholder="Enter checklist name"
        />
      </label>

      <label style={styles.label}>
        Category
        <select style={styles.input} value={data.category} onChange={(e) => onChange('category', e.target.value)}>
          <option value="">Select category</option>
          <option>Safety / EHS</option>
          <option>Statutory</option>
          <option>OEM</option>
          <option>Internal</option>
          <option>PPE</option>
        </select>
      </label>

      <label style={styles.label}>
        Location / Plant
        <select style={styles.input} value={data.location} onChange={(e) => onChange('location', e.target.value)}>
          <option value="">Select location</option>
          <option>Plant 1</option>
          <option>Plant 2</option>
        </select>
      </label>
    </div>
  );
}

function Step2({ data, onChange }) {
  const showCustom = data.frequency === 'Custom';

  return (
    <div style={styles.stepBody}>
      <h3 style={styles.sectionHeading}>Configuration</h3>

      <label style={styles.label}>
        Department
        <select style={styles.input} value={data.department} onChange={(e) => onChange('department', e.target.value)}>
          <option value="">Select department</option>
          <option>Production</option>
          <option>Maintenance</option>
          <option>HR</option>
          <option>Warehouse</option>
        </select>
      </label>

      <label style={styles.label}>
        Applicable Law / Standard (Optional)
        <input
          style={styles.input}
          value={data.applicableLaw}
          onChange={(e) => onChange('applicableLaw', e.target.value)}
          placeholder="e.g. Factories Act, Fire NOC"
        />
      </label>

      <label style={styles.label}>
        Frequency
        <select style={styles.input} value={data.frequency} onChange={(e) => onChange('frequency', e.target.value)}>
          <option value="">Select frequency</option>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Quarterly</option>
          <option>Custom</option>
        </select>
      </label>

      {showCustom && (
        <div style={styles.subSection}>
          <h4 style={styles.subHeading}>Custom Schedule</h4>
          <label style={styles.label}>
            Start Date
            <input
              style={styles.input}
              type="date"
              value={data.customStartDate}
              onChange={(e) => onChange('customStartDate', e.target.value)}
            />
          </label>

          <label style={styles.label}>
            Due Rule
            <select style={styles.input} value={data.customDueRule} onChange={(e) => onChange('customDueRule', e.target.value)}>
              <option value="">Select due rule</option>
              <option>Fixed date (e.g., 31st)</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}

function Step3({ data, onChange }) {
  return (
    <div style={styles.stepBody}>
      <h3 style={styles.sectionHeading}>Responsibility + Alerts</h3>

      <div style={styles.subSection}>
        <h4 style={styles.subHeading}>Responsibility</h4>
        <label style={styles.label}>
          Assigned To
          <select style={styles.input} value={data.assignedTo} onChange={(e) => onChange('assignedTo', e.target.value)}>
            <option value="">Select person / role</option>
            <option>Production Supervisor</option>
            <option>Safety Officer</option>
            <option>Maintenance Lead</option>
          </select>
        </label>

        <label style={styles.label}>
          Reviewer
          <select style={styles.input} value={data.reviewer} onChange={(e) => onChange('reviewer', e.target.value)}>
            <option value="">Select reviewer</option>
            <option>Supervisor</option>
            <option>CA</option>
            <option>Auditor</option>
          </select>
        </label>
      </div>

      <div style={styles.subSection}>
        <h4 style={styles.subHeading}>Alerts</h4>
        <label style={styles.label}>
          Reminder
          <select style={styles.input} value={data.reminder} onChange={(e) => onChange('reminder', e.target.value)}>
            <option value="">Select reminder</option>
            <option>1 day before</option>
            <option>3 days before</option>
          </select>
        </label>
      </div>

      <div style={styles.infoBox}>
        If checklist is not completed, manager will be notified automatically.
      </div>
    </div>
  );
}

export default function CreateChecklistDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);

  const updateFormData = (key, value) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'frequency' && value !== 'Custom') {
        next.customStartDate = '';
        next.customDueRule = '';
      }
      return next;
    });
  };

  const isStepValid = useMemo(() => {
    if (step === 1) {
      return Boolean(formData.checklistName && formData.category && formData.location);
    }

    if (step === 2) {
      if (!formData.department || !formData.frequency) return false;
      if (formData.frequency === 'Custom') {
        return Boolean(formData.customStartDate && formData.customDueRule);
      }
      return true;
    }

    return Boolean(formData.assignedTo && formData.reviewer && formData.reminder);
  }, [formData, step]);

  const openDrawer = () => {
    setIsOpen(true);
    setStep(1);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    if (!isStepValid) return;
    setStep((prev) => Math.min(STEP_COUNT, prev + 1));
  };

  const handleCreateChecklist = (e) => {
    e.preventDefault();
    if (!isStepValid) return;
    console.log('Checklist created:', formData);
    closeDrawer();
  };

  return (
    <>
      <button style={styles.openButton} onClick={openDrawer}>
        Create Checklist
      </button>

      <Drawer isOpen={isOpen} onClose={closeDrawer}>
        <form style={styles.content} onSubmit={handleCreateChecklist}>
          <div style={styles.header}>
            <div>
              <h2 style={styles.title}>Create Checklist</h2>
              <p style={styles.subtitle}>Set up checklist details in guided steps.</p>
            </div>
            <button type="button" style={styles.closeBtn} onClick={closeDrawer} aria-label="Close">
              ×
            </button>
          </div>

          <StepIndicator step={step} />

          <div style={styles.stepContainer}>
            {step === 1 && <Step1 data={formData} onChange={updateFormData} />}
            {step === 2 && <Step2 data={formData} onChange={updateFormData} />}
            {step === 3 && <Step3 data={formData} onChange={updateFormData} />}
          </div>

          <div style={styles.footer}>
            {step > 1 ? (
              <button type="button" style={styles.secondaryBtn} onClick={handleBack}>
                Back
              </button>
            ) : (
              <span />
            )}

            {step < STEP_COUNT ? (
              <button type="button" style={styles.primaryBtn} disabled={!isStepValid} onClick={handleNext}>
                Next
              </button>
            ) : (
              <button type="submit" style={styles.primaryBtn} disabled={!isStepValid}>
                Create Checklist
              </button>
            )}
          </div>
        </form>
      </Drawer>
    </>
  );
}

const styles = {
  openButton: {
    height: 40,
    padding: '0 16px',
    borderRadius: 10,
    border: 'none',
    background: '#1f6feb',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.35)',
  },
  drawer: {
    position: 'relative',
    width: 'min(92vw, 460px)',
    height: '100%',
    background: '#fff',
    boxShadow: '-12px 0 30px rgba(15, 23, 42, 0.15)',
    animation: 'slideInRight 260ms ease-out',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '20px 20px 14px',
    borderBottom: '1px solid #eef1f6',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: '#111827',
  },
  subtitle: {
    margin: '4px 0 0',
    color: '#6b7280',
    fontSize: 13,
  },
  closeBtn: {
    border: 'none',
    background: 'transparent',
    fontSize: 24,
    lineHeight: 1,
    cursor: 'pointer',
    color: '#6b7280',
  },
  stepIndicatorWrap: {
    padding: '14px 20px 10px',
    borderBottom: '1px solid #eef1f6',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#4b5563',
    marginBottom: 8,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 999,
    background: '#e5e7eb',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    background: '#1f6feb',
    transition: 'width 220ms ease',
  },
  stepContainer: {
    padding: 20,
    flex: 1,
    overflowY: 'auto',
  },
  stepBody: {
    display: 'grid',
    gap: 14,
    animation: 'fadeInStep 200ms ease',
  },
  sectionHeading: {
    margin: 0,
    fontSize: 15,
    fontWeight: 700,
    color: '#111827',
  },
  subSection: {
    display: 'grid',
    gap: 12,
    paddingTop: 4,
  },
  subHeading: {
    margin: 0,
    fontSize: 13,
    fontWeight: 700,
    color: '#374151',
  },
  label: {
    display: 'grid',
    gap: 6,
    color: '#374151',
    fontSize: 13,
    fontWeight: 500,
  },
  input: {
    height: 38,
    border: '1px solid #d1d5db',
    borderRadius: 9,
    padding: '0 12px',
    fontSize: 14,
    outline: 'none',
    color: '#111827',
    background: '#fff',
  },
  infoBox: {
    marginTop: 8,
    padding: '10px 12px',
    borderRadius: 10,
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    fontSize: 12,
    color: '#475569',
  },
  footer: {
    padding: 20,
    borderTop: '1px solid #eef1f6',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryBtn: {
    minWidth: 88,
    height: 38,
    borderRadius: 9,
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#111827',
    fontWeight: 600,
    cursor: 'pointer',
  },
  primaryBtn: {
    minWidth: 130,
    height: 38,
    borderRadius: 9,
    border: 'none',
    background: '#1f6feb',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

if (typeof document !== 'undefined' && !document.getElementById('create-checklist-drawer-animations')) {
  const styleTag = document.createElement('style');
  styleTag.id = 'create-checklist-drawer-animations';
  styleTag.innerHTML = `
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes fadeInStep {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    button:disabled {
      opacity: .55;
      cursor: not-allowed !important;
    }
    input:focus, select:focus {
      border-color: #1f6feb !important;
      box-shadow: 0 0 0 3px rgba(31, 111, 235, .15);
    }
  `;
  document.head.appendChild(styleTag);
}
