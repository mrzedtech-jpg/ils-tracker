'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { ILSTask, TaskFormData, RoleArea } from '@/lib/types';
import { calculateNextDue } from '@/lib/dateUtils';

export function useILSTracker() {
  const [tasks, setTasks] = useState<ILSTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('ils_tracker')
        .select('*')
        .eq('archived', false)
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTasks((data as ILSTask[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (form: TaskFormData) => {
    try {
      const { error: insertError } = await supabase.from('ils_tracker').insert({
        title: form.title,
        description: form.description || null,
        role_area: form.role_area,
        task_type: form.task_type,
        status: form.status,
        priority: form.priority,
        due_date: form.due_date || null,
        start_date: form.start_date || null,
        recurring: form.recurring,
        recurrence_pattern: form.recurrence_pattern || null,
        school_year: form.school_year,
        grading_period: form.grading_period || null,
        time_of_year: form.time_of_year || null,
        related_teacher: form.related_teacher || null,
        related_classroom: form.related_classroom || null,
        related_students: form.related_students || null,
        file_path: form.file_path || null,
        url: form.url || null,
        notes: form.notes || null,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        source: 'manual',
      });
      if (insertError) throw insertError;
      await fetchTasks();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
      return false;
    }
  }, [fetchTasks]);

  const updateTask = useCallback(async (id: string, updates: Partial<ILSTask>) => {
    try {
      const { error: updateError } = await supabase
        .from('ils_tracker')
        .update(updates)
        .eq('id', id);
      if (updateError) throw updateError;
      await fetchTasks();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      return false;
    }
  }, [fetchTasks]);

  const archiveTask = useCallback(async (id: string) => {
    return updateTask(id, { archived: true });
  }, [updateTask]);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('ils_tracker')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;
      await fetchTasks();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      return false;
    }
  }, [fetchTasks]);

  const completeTask = useCallback(async (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    return updateTask(id, { status: 'complete', completed_date: todayStr });
  }, [updateTask]);

  const completeRecurringOccurrence = useCallback(async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return false;

    const todayStr = new Date().toISOString().split('T')[0];
    const nextDue = calculateNextDue(task.recurrence_pattern, todayStr);

    return updateTask(id, {
      last_completed: todayStr,
      next_due: nextDue,
      status: 'not_started',
    });
  }, [tasks, updateTask]);

  const deferTask = useCallback(async (id: string, days: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return false;

    const currentDue = task.due_date || new Date().toISOString().split('T')[0];
    const newDate = new Date(currentDue + 'T00:00:00');
    newDate.setDate(newDate.getDate() + days);
    const newDueStr = newDate.toISOString().split('T')[0];

    return updateTask(id, { due_date: newDueStr });
  }, [tasks, updateTask]);

  const searchTasks = useCallback(async (query: string) => {
    try {
      const { data, error: searchError } = await supabase
        .rpc('search_ils_tracker', { search_query: query });
      if (searchError) throw searchError;
      return (data as ILSTask[]) || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      return [];
    }
  }, []);

  const getTasksByRoleArea = useCallback((): Record<RoleArea, ILSTask[]> => {
    const grouped: Record<string, ILSTask[]> = {};
    const roleAreas: RoleArea[] = [
      'library', 'sb13_compliance', 'tech_lessons', 'gt_instruction',
      'it_support', 'observations', 'conferences', 'professional_dev',
      'hr_admin', 'campus_duties', 'documentation', 'other',
    ];
    roleAreas.forEach((r) => { grouped[r] = []; });
    tasks.forEach((t) => {
      if (!grouped[t.role_area]) grouped[t.role_area] = [];
      grouped[t.role_area].push(t);
    });
    return grouped as Record<RoleArea, ILSTask[]>;
  }, [tasks]);

  const getRoleAreaCounts = useCallback((): Record<RoleArea, number> => {
    const byRole = getTasksByRoleArea();
    const counts: Record<string, number> = {};
    Object.entries(byRole).forEach(([role, roleTasks]) => {
      counts[role] = roleTasks.filter((t) => t.status !== 'complete' && t.status !== 'cancelled').length;
    });
    return counts as Record<RoleArea, number>;
  }, [getTasksByRoleArea]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    archiveTask,
    deleteTask,
    completeTask,
    completeRecurringOccurrence,
    deferTask,
    searchTasks,
    getTasksByRoleArea,
    getRoleAreaCounts,
  };
}
