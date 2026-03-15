'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import type { TaskFormData, RoleArea } from '@/lib/types';
import { EMPTY_TASK_FORM } from '@/lib/types';
import { ROLE_AREAS, ROLE_AREA_ORDER, TASK_TYPES, PRIORITIES } from '@/lib/constants';

interface QuickAddFormProps {
  onSubmit: (form: TaskFormData) => Promise<boolean>;
  onClose: () => void;
}

export default function QuickAddForm({ onSubmit, onClose }: QuickAddFormProps) {
  const [form, setForm] = useState<TaskFormData>(EMPTY_TASK_FORM);
  const [showMore, setShowMore] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (field: keyof TaskFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    const success = await onSubmit(form);
    setSaving(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white dark:bg-gray-800 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Add Task</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Role Area */}
          <div>
            <label className="block text-sm font-medium mb-1">Role Area *</label>
            <select
              value={form.role_area}
              onChange={(e) => update('role_area', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ROLE_AREA_ORDER.map((r) => (
                <option key={r} value={r}>{ROLE_AREAS[r].label}</option>
              ))}
            </select>
          </div>

          {/* Priority + Due Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => update('priority', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(PRIORITIES).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => update('due_date', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Optional details..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Related Teacher */}
          <div>
            <label className="block text-sm font-medium mb-1">Related Teacher</label>
            <input
              type="text"
              value={form.related_teacher}
              onChange={(e) => update('related_teacher', e.target.value)}
              placeholder="Teacher name (optional)"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* More Details */}
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            {showMore ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            More Details
          </button>

          {showMore && (
            <div className="space-y-4 pl-2 border-l-2 border-blue-200 dark:border-blue-800">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Task Type</label>
                  <select
                    value={form.task_type}
                    onChange={(e) => update('task_type', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                  >
                    {Object.entries(TASK_TYPES).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => update('start_date', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.recurring}
                    onChange={(e) => update('recurring', e.target.checked)}
                    className="rounded"
                  />
                  Recurring
                </label>
                {form.recurring && (
                  <input
                    type="text"
                    value={form.recurrence_pattern}
                    onChange={(e) => update('recurrence_pattern', e.target.value)}
                    placeholder="e.g. weekly, monthly"
                    className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Grading Period</label>
                  <input
                    type="text"
                    value={form.grading_period}
                    onChange={(e) => update('grading_period', e.target.value)}
                    placeholder="e.g. Q3"
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Related Students</label>
                  <input
                    type="text"
                    value={form.related_students}
                    onChange={(e) => update('related_students', e.target.value)}
                    placeholder="e.g. 3rd grade GT"
                    className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">URL</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => update('url', e.target.value)}
                  placeholder="Link to resource"
                  className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => update('tags', e.target.value)}
                  placeholder="sb13, isbn, destiny"
                  className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  rows={2}
                  className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs resize-none"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!form.title.trim() || saving}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:dark:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  );
}
