'use client';

import React, { useState, useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import type { Sprint } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';

interface SprintFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprint: Sprint | null;
}

const SprintFormModal: React.FC<SprintFormModalProps> = ({ isOpen, onClose, sprint }) => {
  const addSprint = useTaskStore((state) => state.addSprint);
  const updateSprint = useTaskStore((state) => state.updateSprint);

  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    start_date: '',
    end_date: '',
    created_at: '',
    updated_at: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (sprint) {
      setFormData({
        user_id: sprint.user_id,
        name: sprint.name,
        start_date: sprint.start_date,
        end_date: sprint.end_date,
        created_at: sprint.created_at,
        updated_at: sprint.updated_at,
      });
    } else {
      setFormData({
        user_id: '',
        name: '',
        start_date: '',
        end_date: '',
        created_at: '',
        updated_at: '',
      });
    }
  }, [sprint, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.end_date < formData.start_date) {
      setError('End date cannot be before start date.');
      return;
    }

    if (sprint) {
      updateSprint({ ...formData, id: sprint.id });
    } else {
      addSprint(formData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{sprint ? 'Edit Sprint' : 'Add New Sprint'}</DialogTitle>
          <DialogDescription>
            {sprint ? 'Update the sprint details.' : 'Create a new sprint for your team.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sprint-name">
              Sprint Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="sprint-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Sprint 1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="start-date"
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">
                End Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="end-date"
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{sprint ? 'Update Sprint' : 'Create Sprint'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SprintFormModal;
