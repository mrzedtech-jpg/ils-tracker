'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { OpenBrainThought } from '@/lib/types';

const SCHOOL_TOPICS = [
  'announcement', 'campus duty', 'attendance', 'book fair',
  'school event', 'library', 'assembly', 'school', 'spring break',
  'incentive', 'scholastic', 'morning',
];

export function useOpenBrainThoughts() {
  const [thoughts, setThoughts] = useState<OpenBrainThought[]>([]);

  useEffect(() => {
    async function fetchThoughts() {
      // Fetch recent thoughts that are tasks or have school-related topics
      // We fetch broadly and let announcementUtils filter further
      const { data, error } = await supabase
        .from('thoughts')
        .select('id, content, metadata, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error || !data) return;

      // Filter client-side for school-relevant thoughts
      const relevant = data.filter((thought: OpenBrainThought) => {
        const meta = thought.metadata;
        if (!meta) return false;

        // Include tasks and ideas (actionable items)
        const isActionable = meta.type === 'task' || meta.type === 'idea';

        // Include if any topic matches school keywords
        const hasSchoolTopic = meta.topics?.some((topic: string) =>
          SCHOOL_TOPICS.some((keyword) => topic.toLowerCase().includes(keyword))
        );

        // Include if it has action items mentioning school-related things
        const hasSchoolAction = meta.action_items?.some((action: string) =>
          SCHOOL_TOPICS.some((keyword) => action.toLowerCase().includes(keyword))
        );

        return isActionable || hasSchoolTopic || hasSchoolAction;
      });

      setThoughts(relevant);
    }

    fetchThoughts();
  }, []);

  return thoughts;
}
