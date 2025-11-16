'use client';

import React, { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertCircle, Upload, CheckCircle } from 'lucide-react';
import Papa from 'papaparse';
import { Owner, Task } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { TASK_LABEL, TASK_PRIORITY, TASK_STATUS } from '@/constants';

interface ImportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportCSVModal({ isOpen, onClose }: ImportCSVModalProps) {
  const { sprints } = useTaskStore();
  const [selectedSprintId, setSelectedSprintId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'text/csv') {
      setFile(selected);
      setError('');
      setSuccess('');
    } else {
      setError('Please upload a valid CSV file');
    }
  };

  const parseAndImport = async () => {
    if (!file || !selectedSprintId) {
      setError('Please select a sprint and upload a CSV file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error('User not authenticated');

          const rows = results.data as any[];
          const tasksToInsert: any[] = [];

          // Parse all tasks first
          for (const row of rows) {
            // Extract owners (up to 6)
            const owners: Owner[] = [];
            for (let i = 1; i <= 6; i++) {
              const name = row[`Owner ${i}`]?.trim();
              const pointStr = row[`Point ${i}`]?.trim();
              if (name && pointStr) {
                const point = parseFloat(pointStr);
                if (!isNaN(point)) {
                  owners.push({ name, point });
                }
              }
            }

            if (owners.length === 0) continue; // Skip if no owners

            const totalPoint = owners.reduce((sum, o) => sum + o.point, 0);

            tasksToInsert.push({
              user_id: user.id,
              sprint_id: selectedSprintId,
              task: row.Task?.trim() || 'Untitled Task',
              link: row.Link?.trim() || '',
              total_point: totalPoint,
              label: row.Label?.trim() || TASK_LABEL.COULD_HAVE,
              priority: row.Priority?.trim() || TASK_PRIORITY.MEDIUM,
              status: row.Status?.trim() || TASK_STATUS.TODO,
              percent: row.Percent?.trim() || '0%',
              notes: row.Notes?.trim() || '',
              owners: owners,
            });
          }

          if (tasksToInsert.length === 0) {
            throw new Error('No valid tasks found in CSV');
          }

          // Batch insert all tasks at once
          const { data, error: insertError } = await supabase
            .from('tasks')
            .insert(tasksToInsert)
            .select();

          if (insertError) throw insertError;

          // Update the store immediately
          const {
            data: { user: currentUser },
          } = await supabase.auth.getUser();
          if (currentUser) {
            const { data: updatedTasks } = await supabase
              .from('tasks')
              .select('*')
              .eq('user_id', currentUser.id);

            if (updatedTasks) {
              const transformedTasks = updatedTasks.map((t) => ({
                id: t.id,
                sprintId: t.sprint_id,
                task: t.task,
                link: t.link,
                totalPoint: t.total_point,
                label: t.label as Task['label'],
                priority: t.priority as Task['priority'],
                status: t.status as Task['status'],
                percent: t.percent,
                notes: t.notes,
                owners: t.owners,
                user_id: t.user_id,
                sprint_id: t.sprint_id,
                total_point: t.total_point,
                created_at: t.created_at,
                updated_at: t.updated_at,
              }));

              useTaskStore.setState({ tasks: transformedTasks });
            }
          }

          setSuccess(`Successfully imported ${data.length} task(s)`);
          toast.success(`Imported ${data.length} tasks successfully!`);

          setTimeout(() => {
            onClose();
            setFile(null);
            setSelectedSprintId('');
            setSuccess('');
          }, 1500);
        } catch (err: any) {
          console.error('Import error:', err);
          setError('Import failed: ' + err.message);
          toast.error('Import failed: ' + err.message);
        } finally {
          setLoading(false);
        }
      },
      error: (err) => {
        console.error('CSV parsing error:', err);
        setError('CSV parsing failed: ' + err.message);
        toast.error('CSV parsing failed: ' + err.message);
        setLoading(false);
      },
    });
  };

  const handleClose = () => {
    if (!loading) {
      setFile(null);
      setSelectedSprintId('');
      setError('');
      setSuccess('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Tasks from CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Sprint Selector */}
          <div>
            <Label htmlFor="sprint">Select Sprint</Label>
            <Select value={selectedSprintId} onValueChange={setSelectedSprintId} disabled={loading}>
              <SelectTrigger id="sprint">
                <SelectValue placeholder="Choose a sprint" />
              </SelectTrigger>
              <SelectContent>
                {sprints.map((sprint) => (
                  <SelectItem key={sprint.id} value={sprint.id}>
                    {sprint.name} ({sprint.start_date} → {sprint.end_date})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="csv">CSV File</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-border">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="flex text-sm text-muted-foreground">
                  <label
                    htmlFor="csv-file"
                    className={`relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 ${
                      loading ? 'pointer-events-none opacity-50' : ''
                    }`}
                  >
                    <span>Upload a file</span>
                    <input
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      className="sr-only"
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {file ? file.name : 'CSV up to 10MB'}
                </p>
              </div>
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}
          {loading && (
            <div className="flex items-center gap-2 text-blue-600 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
              <span>Processing... Please wait</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={parseAndImport} disabled={loading || !file || !selectedSprintId}>
            {loading ? 'Importing...' : 'Import Tasks'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
