'use client';

import { useState } from 'react';
import { X, ExternalLink, Archive, Trash2 } from 'lucide-react';
import type { ILSTask, RoleArea, TaskType, TaskStatus, Priority } from '@/lib/types';
import { ROLE_AREAS, STATUSES, PRIORITIES, TASK_TYPES, ROLE_AREA_ORDER } from '@/lib/constants';
import ConfirmDialog from './ConfirmDialog';

interface TaskDetailModalProps {
  task: ILSTask;
  onUpdate: (id: string, updates: Partial<ILSTask>) => Promise<boolean>;
  onArchive: (id: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onClose: () => void;
}

export default function TaskDetailModal({ task, onUpdate, onArchive, onDelete, onClose }: TaskDetailModalProps) {
  const [confirmAction, setConfirmAction] = useState<'archive' | 'delete' | null>(null);

  const handleFieldChange = (field: keyof ILSTask, value: string | boolean | string[] | null) => {
    onUpdate(task.id, { [field]: value });
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map((t) => t.trim()).filter(Boolean);
    handleFieldChange('tags', tags);
  };

  const handleConfirmAction = async () => {
    if (confirmAction === 'archive') {
      await onArchive(task.id);
    } else if (confirmAction === 'delete') {
      await onDelete(task.id);
    }
    setConfirmAction(null);
    onClose();
  };

  const roleConfig = ROLE_AREAS[task.role_area];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end" onClick={onClose}>
        <div className="absolute inset-0 bg-black/50" />
        <div
          className="relative bg-white dark:bg-gray-800 w-full sm:max-w-lg h-full overflow-y-auto shadow-xl rounded-t-2xl sm:rounded-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: roleConfig.color }} />
              <span className="text-sm font-medium text-gray-500">{roleConfig.label}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <X size={20} />
            </button>
          </div>

          <div className="p-5 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Title</label>
              <input
                type="text"
                defaultValue={task.title}
                onBlur={(e) => { if (e.target.value !== task.title) handleFieldChange('title', e.target.value); }}
                className="w-full text-lg font-semibold bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-blue-500 focus:outline-none pb-1 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
              <textarea
                defaultValue={task.description || ''}
                onBlur={(e) => handleFieldChange('description', e.target.value || null)}
                rows={3}
                className="w-full text-sm bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Add description..."
              />
            </div>

            {/* Status / Priority / Type row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
                <select
                  value={task.status}
                  onChange={(e) => handleFieldChange('status', e.target.value as TaskStatus)}
                  className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                >
                  {Object.entries(STATUSES).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Priority</label>
                <select
                  value={task.priority}
                  onChange={(e) => handleFieldChange('priority', e.target.value as Priority)}
                  className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                >
                  {Object.entries(PRIORITIES).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Type</label>
                <select
                  value={task.task_type}
                  onChange={(e) => handleFieldChange('task_type', e.target.value as TaskType)}
                  className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                >
                  {Object.entries(TASK_TYPES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role Area */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Role Area</label>
              <select
                value={task.role_area}
                onChange={(e) => handleFieldChange('role_area', e.target.value as RoleArea)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                {ROLE_AREA_ORDER.map((r) => (
                  <option key={r} value={r}>{ROLE_AREAS[r].label}</option>
                ))}
              </select>
            </div>

            {/* Timing */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Timing</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={task.due_date || ''}
                    onChange={(e) => handleFieldChange('due_date', e.target.value || null)}
                    className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={task.start_date || ''}
                    onChange={(e) => handleFieldChange('start_date', e.target.value || null)}
                    className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Completed Date</label>
                  <input
                    type="date"
                    value={task.completed_date || ''}
                    onChange={(e) => handleFieldChange('completed_date', e.target.value || null)}
                    className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  />
                </div>
              </div>

              {/* Recurring fields */}
              <div className="mt-3 flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={task.recurring}
                    onChange={(e) => handleFieldChange('recurring', e.target.checked)}
                    className="rounded"
                  />
                  Recurring
                </label>
                {task.recurring && (
                  <input
                    type="text"
                    defaultValue={task.recurrence_pattern || ''}
                    onBlur={(e) => handleFieldChange('recurrence_pattern', e.target.value || null)}
                    placeholder="e.g. weekly"
                    className="flex-1 px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  />
                )}
              </div>
            </div>

            {/* Context */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Context</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">School Year</label>
                  <input
                    type="text"
                    defaultValue={task.school_year}
                    onBlur={(e) => handleFieldChange('school_year', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Grading Period</label>
                  <input
                    type="text"
                    defaultValue={task.grading_period || ''}
                    onBlur={(e) => handleFieldChange('grading_period', e.target.value || null)}
                    placeholder="e.g. Q3"
                    className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Teacher</label>
                  <input
                    type="text"
                    defaultValue={task.related_teacher || ''}
                    onBlur={(e) => handleFieldChange('related_teacher', e.target.value || null)}
                    className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Classroom</label>
                  <input
                    type="text"
                    defaultValue={task.related_classroom || ''}
                    onBlur={(e) => handleFieldChange('related_classroom', e.target.value || null)}
                    className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Students</label>
                  <input
                    type="text"
                    defaultValue={task.related_students || ''}
                    onBlur={(e) => handleFieldChange('related_students', e.target.value || null)}
                    className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Links */}
            {(task.url || task.file_path) && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Links & Files</h3>
                {task.url && (
                  <a
                    href={task.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <ExternalLink size={14} />
                    {task.url}
                  </a>
                )}
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</label>
              <textarea
                defaultValue={task.notes || ''}
                onBlur={(e) => handleFieldChange('notes', e.target.value || null)}
                rows={3}
                className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Add notes..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                defaultValue={task.tags?.join(', ') || ''}
                onBlur={(e) => handleTagsChange(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                placeholder="tag1, tag2, tag3"
              />
            </div>

            {/* Meta */}
            <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
              <p>Source: {task.source}{task.source_detail ? ` (${task.source_detail})` : ''}</p>
              <p>Created: {new Date(task.created_at).toLocaleString()}</p>
              <p>Updated: {new Date(task.updated_at).toLocaleString()}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setConfirmAction('archive')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors"
              >
                <Archive size={16} />
                Archive
              </button>
              <button
                onClick={() => setConfirmAction('delete')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {confirmAction && (
        <ConfirmDialog
          title={confirmAction === 'archive' ? 'Archive Task' : 'Delete Task'}
          message={
            confirmAction === 'archive'
              ? 'This task will be hidden from all views. You can restore it later.'
              : 'This cannot be undone. The task will be permanently removed.'
          }
          confirmLabel={confirmAction === 'archive' ? 'Archive' : 'Delete Forever'}
          confirmColor={confirmAction === 'archive' ? 'amber' : 'red'}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </>
  );
}
