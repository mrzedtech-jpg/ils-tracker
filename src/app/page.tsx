'use client';

import { useState, useCallback } from 'react';
import { useILSTracker } from '@/hooks/useILSTracker';
import { useDarkMode } from '@/hooks/useDarkMode';
import type { ViewType, ILSTask } from '@/lib/types';
import Header from '@/components/Header';
import AlertBanner from '@/components/AlertBanner';
import AnnouncementsBanner from '@/components/AnnouncementsBanner';
import ViewSwitcher from '@/components/ViewSwitcher';
import BottomTabBar from '@/components/BottomTabBar';
import MyWeekView from '@/components/MyWeekView';
import ByRoleView from '@/components/ByRoleView';
import AllTasksView from '@/components/AllTasksView';
import TaskDetailModal from '@/components/TaskDetailModal';
import QuickAddFAB from '@/components/QuickAddFAB';
import QuickAddForm from '@/components/QuickAddForm';
import Toast from '@/components/Toast';

export default function Home() {
  const {
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
  } = useILSTracker();

  const { isDark, toggle: toggleDark } = useDarkMode();

  const [activeView, setActiveView] = useState<ViewType>('my_week');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedTask = selectedTaskId ? tasks.find((t) => t.id === selectedTaskId) : null;

  const handleTaskSelect = useCallback((id: string) => {
    setSelectedTaskId(id);
  }, []);

  const handleComplete = useCallback(async (id: string) => {
    const success = await completeTask(id);
    if (success) setToastMessage('Task completed!');
  }, [completeTask]);

  const handleCompleteRecurring = useCallback(async (id: string) => {
    const success = await completeRecurringOccurrence(id);
    if (success) setToastMessage('Occurrence complete — next scheduled!');
  }, [completeRecurringOccurrence]);

  const handleDefer = useCallback(async (id: string, days: number) => {
    const success = await deferTask(id, days);
    if (success) setToastMessage(`Deferred by ${days} day${days > 1 ? 's' : ''}`);
  }, [deferTask]);

  const handleAddTask = useCallback(async (form: Parameters<typeof addTask>[0]) => {
    const success = await addTask(form);
    if (success) setToastMessage('Task added!');
    return success;
  }, [addTask]);

  const handleUpdate = useCallback(async (id: string, updates: Partial<ILSTask>) => {
    return updateTask(id, updates);
  }, [updateTask]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md text-center">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Connection Error</h2>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchTasks}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-4">
      <Header
        tasks={tasks}
        isDark={isDark}
        toggleDark={toggleDark}
        onRefresh={fetchTasks}
        loading={loading}
      />

      <AlertBanner tasks={tasks} onTaskClick={handleTaskSelect} />

      <AnnouncementsBanner
        tasks={tasks}
        onTaskClick={handleTaskSelect}
        onCopySuccess={() => setToastMessage('Announcements copied to clipboard!')}
      />

      <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />

      <main className="max-w-5xl mx-auto px-4 py-4">
        {loading && tasks.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">Loading tasks...</p>
            </div>
          </div>
        ) : (
          <>
            {activeView === 'my_week' && (
              <MyWeekView
                tasks={tasks}
                onSelect={handleTaskSelect}
                onComplete={handleComplete}
                onCompleteRecurring={handleCompleteRecurring}
                onDefer={handleDefer}
              />
            )}
            {activeView === 'by_role' && (
              <ByRoleView
                tasks={tasks}
                onSelect={handleTaskSelect}
                onComplete={handleComplete}
                onCompleteRecurring={handleCompleteRecurring}
                onDefer={handleDefer}
              />
            )}
            {activeView === 'all_tasks' && (
              <AllTasksView
                tasks={tasks}
                onSelect={handleTaskSelect}
                onComplete={handleComplete}
                onCompleteRecurring={handleCompleteRecurring}
                onDefer={handleDefer}
              />
            )}
          </>
        )}
      </main>

      <QuickAddFAB onClick={() => setShowQuickAdd(true)} />

      <BottomTabBar activeView={activeView} onViewChange={setActiveView} />

      {showQuickAdd && (
        <QuickAddForm
          onSubmit={handleAddTask}
          onClose={() => setShowQuickAdd(false)}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onUpdate={handleUpdate}
          onArchive={archiveTask}
          onDelete={deleteTask}
          onClose={() => setSelectedTaskId(null)}
        />
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
