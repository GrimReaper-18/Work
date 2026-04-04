import React, { useMemo, useState } from 'react';

const TOTAL_STEPS = 3;

const initialForm = {
  checklistName: '',
  category: '',
  location: '',
  department: '',
  lawStandard: '',
  frequency: '',
  customStartDate: '',
  customDueDate: '',
  assignedTo: '',
  reviewer: '',
  reminder: '',
};

export default function CreateChecklistDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const progress = useMemo(() => (step / TOTAL_STEPS) * 100, [step]);

  const openDrawer = () => setIsOpen(true);

  const closeDrawer = () => {
    setIsOpen(false);
    setStep(1);
    setErrors({});
  };

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validateStep = () => {
    const nextErrors = {};

    if (step === 1) {
      if (!formData.checklistName.trim()) nextErrors.checklistName = 'Checklist name is required.';
      if (!formData.category) nextErrors.category = 'Please select a category.';
      if (!formData.location) nextErrors.location = 'Please select a location.';
    }

    if (step === 2) {
      if (!formData.department) nextErrors.department = 'Department is required.';
      if (!formData.frequency) nextErrors.frequency = 'Frequency is required.';

      if (formData.frequency === 'Custom') {
        if (!formData.customStartDate) nextErrors.customStartDate = 'Start date is required for custom frequency.';

        const due = Number(formData.customDueDate);
        if (!formData.customDueDate) nextErrors.customDueDate = 'Due rule is required.';
        if (formData.customDueDate && (due < 1 || due > 31)) nextErrors.customDueDate = 'Due date must be between 1 and 31.';
      }
    }

    if (step === 3) {
      if (!formData.assignedTo.trim()) nextErrors.assignedTo = 'Assigned To is required.';
      if (!formData.reviewer.trim()) nextErrors.reviewer = 'Reviewer is required.';
      if (!formData.reminder) nextErrors.reminder = 'Reminder is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateStep()) return;

    // Replace with API call
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

          <aside className="absolute right-0 top-0 h-full w-full max-w-[460px] translate-x-0 overflow-hidden bg-slate-50 shadow-2xl transition-all duration-300 sm:w-[460px]">
            <form onSubmit={handleSubmit} className="flex h-full flex-col">
              <header className="border-b border-slate-200 bg-white px-6 py-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Create Checklist</h2>
                    <p className="text-sm text-slate-500">Step {step} of {TOTAL_STEPS}</p>
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

                <div className="h-2 w-full rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </header>

              <div className="relative flex-1 overflow-y-auto px-6 py-5">
                <div className="space-y-5 transition-all duration-300">
                  {step === 1 && (
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
                            {['Safety / EHS', 'Statutory', 'OEM', 'Internal', 'PPE'].map((item) => (
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

                  {step === 2 && (
                    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label className={labelClass}>Department</label>
                          <select
                            className={fieldClass}
                            value={formData.department}
                            onChange={(e) => updateField('department', e.target.value)}
                          >
                            <option value="">Select department</option>
                            {['Production', 'Maintenance', 'HR', 'Warehouse'].map((item) => (
                              <option key={item} value={item}>{item}</option>
                            ))}
                          </select>
                          {errors.department && <p className="mt-1 text-xs text-rose-600">{errors.department}</p>}
                        </div>

                        <div>
                          <label className={labelClass}>Applicable Law / Standard (Optional)</label>
                          <input
                            className={fieldClass}
                            value={formData.lawStandard}
                            onChange={(e) => updateField('lawStandard', e.target.value)}
                            placeholder="Factories Act, Fire NOC, MPCB, OEM audit..."
                          />
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
                              <label className={labelClass}>Due Rule (Fixed date)</label>
                              <input
                                type="number"
                                min={1}
                                max={31}
                                className={fieldClass}
                                value={formData.customDueDate}
                                onChange={(e) => updateField('customDueDate', e.target.value)}
                                placeholder="Enter day (1-31)"
                              />
                              {errors.customDueDate && <p className="mt-1 text-xs text-rose-600">{errors.customDueDate}</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {step === 3 && (
                    <section className="space-y-5">
                      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Responsibility</h3>
                        <div className="space-y-4">
                          <div>
                            <label className={labelClass}>Assigned To</label>
                            <input
                              className={fieldClass}
                              value={formData.assignedTo}
                              onChange={(e) => updateField('assignedTo', e.target.value)}
                              placeholder="Person / Role"
                            />
                            {errors.assignedTo && <p className="mt-1 text-xs text-rose-600">{errors.assignedTo}</p>}
                          </div>

                          <div>
                            <label className={labelClass}>Reviewer</label>
                            <input
                              className={fieldClass}
                              value={formData.reviewer}
                              onChange={(e) => updateField('reviewer', e.target.value)}
                              placeholder="Supervisor / CA / Auditor"
                            />
                            {errors.reviewer && <p className="mt-1 text-xs text-rose-600">{errors.reviewer}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Alerts & Escalation</h3>
                        <div className="space-y-4">
                          <div>
                            <label className={labelClass}>Reminder</label>
                            <select
                              className={fieldClass}
                              value={formData.reminder}
                              onChange={(e) => updateField('reminder', e.target.value)}
                            >
                              <option value="">Select reminder</option>
                              {['1 day before', '3 days before'].map((item) => (
                                <option key={item} value={item}>{item}</option>
                              ))}
                            </select>
                            {errors.reminder && <p className="mt-1 text-xs text-rose-600">{errors.reminder}</p>}
                          </div>

                          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs text-amber-800">
                            If checklist is not completed, manager will be notified automatically.
                          </div>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </div>

              <footer className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>

                {step < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
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
