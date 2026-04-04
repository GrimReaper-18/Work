import React, { useMemo, useState } from 'react';

const TOTAL_STEPS = 3;

const initialForm = {
  checklistName: '',
  category: '',
  location: '',
  department: '',
  frequency: '',
  customStartDate: '',
  customDueDate: '',
  responsibility: '',
  alerts: '',
  escalation: '',
};

const STEP_TITLES = ['Step 1: Basic Info', 'Step 2: Schedule', 'Step 3: Ownership'];

export default function CreateChecklistDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const progress = useMemo(() => (currentStep / TOTAL_STEPS) * 100, [currentStep]);

  const canMoveNext = useMemo(() => {
    if (currentStep === 1) {
      return Boolean(formData.checklistName.trim() && formData.category && formData.location);
    }

    if (currentStep === 2) {
      const hasBaseFields = Boolean(formData.department && formData.frequency);
      if (!hasBaseFields) return false;

      if (formData.frequency === 'Custom') {
        return Boolean(formData.customStartDate && formData.customDueDate);
      }

      return true;
    }

    return false;
  }, [currentStep, formData]);

  const openDrawer = () => setIsOpen(true);

  const closeDrawer = () => {
    setIsOpen(false);
    setCurrentStep(1);
    setErrors({});
  };

  const updateField = (key, value) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'frequency' && value !== 'Custom') {
        next.customStartDate = '';
        next.customDueDate = '';
      }
      return next;
    });

    setErrors((prev) => {
      const next = { ...prev, [key]: '' };
      if (key === 'frequency' && value !== 'Custom') {
        next.customStartDate = '';
        next.customDueDate = '';
      }
      return next;
    });
  };

  const validateStep = () => {
    const nextErrors = {};

    if (currentStep === 1) {
      if (!formData.checklistName.trim()) nextErrors.checklistName = 'Checklist name is required.';
      if (!formData.category) nextErrors.category = 'Please select a category.';
      if (!formData.location) nextErrors.location = 'Please select a location.';
    }

    if (currentStep === 2) {
      if (!formData.department) nextErrors.department = 'Department is required.';
      if (!formData.frequency) nextErrors.frequency = 'Frequency is required.';

      if (formData.frequency === 'Custom') {
        if (!formData.customStartDate) nextErrors.customStartDate = 'Start date is required for custom frequency.';
        if (!formData.customDueDate) nextErrors.customDueDate = 'Due date is required for custom frequency.';
        if (
          formData.customStartDate &&
          formData.customDueDate &&
          formData.customDueDate < formData.customStartDate
        ) {
          nextErrors.customDueDate = 'Due date must be on or after start date.';
        }
      }
    }

    if (currentStep === 3) {
      if (!formData.responsibility.trim()) nextErrors.responsibility = 'Responsibility is required.';
      if (!formData.alerts) nextErrors.alerts = 'Please select alert preference.';
      if (!formData.escalation) nextErrors.escalation = 'Please select escalation rule.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateStep()) return;

    console.log('Checklist payload', formData);

    closeDrawer();
    setFormData(initialForm);
  };

  const fieldClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';
  const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openDrawer}
        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
      >
        Create Checklist
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" onClick={closeDrawer} />

          <aside className="absolute right-0 top-0 h-full w-full max-w-[460px] overflow-hidden bg-slate-50 shadow-2xl sm:w-[460px]">
            <form onSubmit={handleSubmit} className="flex h-full flex-col">
              <header className="border-b border-slate-200 bg-white px-6 py-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Create Checklist</h2>
                    <p className="text-sm text-slate-500">Step {currentStep} of {TOTAL_STEPS}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={closeDrawer}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-3 h-2 w-full rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between gap-2 text-xs">
                  {STEP_TITLES.map((title, index) => {
                    const stepNumber = index + 1;
                    const isActive = currentStep === stepNumber;
                    const isDone = currentStep > stepNumber;

                    return (
                      <div
                        key={title}
                        className={`flex-1 rounded-lg px-2 py-1 text-center transition ${
                          isActive
                            ? 'bg-indigo-100 font-semibold text-indigo-700'
                            : isDone
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {title}
                      </div>
                    );
                  })}
                </div>
              </header>

              <div className="relative flex-1 overflow-y-auto px-6 py-5">
                <div key={currentStep} className="space-y-5 animate-[fadeIn_.2s_ease]">
                  {currentStep === 1 && (
                    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Basic Info</h3>
                      <div className="space-y-4">
                        <div>
                          <label className={labelClass}>Checklist Name</label>
                          <input
                            className={fieldClass}
                            value={formData.checklistName}
                            onChange={(e) => updateField('checklistName', e.target.value)}
                            placeholder="Enter checklist name"
                          />
                          {errors.checklistName && <p className="mt-1 text-xs text-rose-600">{errors.checklistName}</p>}
                        </div>

                        <div>
                          <label className={labelClass}>Category</label>
                          <select
                            className={fieldClass}
                            value={formData.category}
                            onChange={(e) => updateField('category', e.target.value)}
                          >
                            <option value="">Select category</option>
                            {['Safety/EHS', 'Statutory', 'OEM', 'Internal', 'PPE'].map((item) => (
                              <option key={item} value={item}>{item}</option>
                            ))}
                          </select>
                          {errors.category && <p className="mt-1 text-xs text-rose-600">{errors.category}</p>}
                        </div>

                        <div>
                          <label className={labelClass}>Location / Plant</label>
                          <select
                            className={fieldClass}
                            value={formData.location}
                            onChange={(e) => updateField('location', e.target.value)}
                          >
                            <option value="">Select location</option>
                            {['Plant 1', 'Plant 2', 'Plant 3'].map((item) => (
                              <option key={item} value={item}>{item}</option>
                            ))}
                          </select>
                          {errors.location && <p className="mt-1 text-xs text-rose-600">{errors.location}</p>}
                        </div>
                      </div>
                    </section>
                  )}

                  {currentStep === 2 && (
                    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Schedule</h3>
                      <div className="space-y-4">
                        <div>
                          <label className={labelClass}>Department</label>
                          <select
                            className={fieldClass}
                            value={formData.department}
                            onChange={(e) => updateField('department', e.target.value)}
                          >
                            <option value="">Select department</option>
                            {['Production', 'Maintenance', 'Quality', 'EHS', 'HR', 'Warehouse'].map((item) => (
                              <option key={item} value={item}>{item}</option>
                            ))}
                          </select>
                          {errors.department && <p className="mt-1 text-xs text-rose-600">{errors.department}</p>}
                        </div>

                        <div>
                          <label className={labelClass}>Frequency</label>
                          <select
                            className={fieldClass}
                            value={formData.frequency}
                            onChange={(e) => updateField('frequency', e.target.value)}
                          >
                            <option value="">Select frequency</option>
                            {['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Custom'].map((item) => (
                              <option key={item} value={item}>{item}</option>
                            ))}
                          </select>
                          {errors.frequency && <p className="mt-1 text-xs text-rose-600">{errors.frequency}</p>}
                        </div>

                        {formData.frequency === 'Custom' && (
                          <div className="grid grid-cols-1 gap-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
                            <div>
                              <label className={labelClass}>Start Date</label>
                              <input
                                type="date"
                                className={fieldClass}
                                value={formData.customStartDate}
                                onChange={(e) => updateField('customStartDate', e.target.value)}
                              />
                              {errors.customStartDate && <p className="mt-1 text-xs text-rose-600">{errors.customStartDate}</p>}
                            </div>

                            <div>
                              <label className={labelClass}>Due Date</label>
                              <input
                                type="date"
                                className={fieldClass}
                                value={formData.customDueDate}
                                min={formData.customStartDate || undefined}
                                onChange={(e) => updateField('customDueDate', e.target.value)}
                              />
                              {errors.customDueDate && <p className="mt-1 text-xs text-rose-600">{errors.customDueDate}</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {currentStep === 3 && (
                    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Ownership & Alerts</h3>
                      <div className="space-y-4">
                        <div>
                          <label className={labelClass}>Responsibility</label>
                          <select
                            className={fieldClass}
                            value={formData.responsibility}
                            onChange={(e) => updateField('responsibility', e.target.value)}
                          >
                            <option value="">Select responsibility</option>
                            {['Operator', 'Supervisor', 'Department Head', 'EHS Officer'].map((item) => (
                              <option key={item} value={item}>{item}</option>
                            ))}
                          </select>
                          {errors.responsibility && <p className="mt-1 text-xs text-rose-600">{errors.responsibility}</p>}
                        </div>

                        <div>
                          <label className={labelClass}>Alerts</label>
                          <select
                            className={fieldClass}
                            value={formData.alerts}
                            onChange={(e) => updateField('alerts', e.target.value)}
                          >
                            <option value="">Select alert preference</option>
                            {['None', 'On due date', '1 day before', '3 days before'].map((item) => (
                              <option key={item} value={item}>{item}</option>
                            ))}
                          </select>
                          {errors.alerts && <p className="mt-1 text-xs text-rose-600">{errors.alerts}</p>}
                        </div>

                        <div>
                          <label className={labelClass}>Escalation</label>
                          <select
                            className={fieldClass}
                            value={formData.escalation}
                            onChange={(e) => updateField('escalation', e.target.value)}
                          >
                            <option value="">Select escalation</option>
                            {['No escalation', 'Escalate to Supervisor', 'Escalate to Manager', 'Escalate to Admin'].map((item) => (
                              <option key={item} value={item}>{item}</option>
                            ))}
                          </select>
                          {errors.escalation && <p className="mt-1 text-xs text-rose-600">{errors.escalation}</p>}
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </div>

              <footer className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Back
                  </button>
                ) : (
                  <span />
                )}

                {currentStep < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canMoveNext}
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700"
                  >
                    Create Checklist
                  </button>
                )}
              </footer>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
