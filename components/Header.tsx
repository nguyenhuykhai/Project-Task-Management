'use client';

import React, { useMemo } from 'react';
import { Sun, Moon, Download, Upload } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import type { FilterValue } from '../types';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectGroup, SelectLabel } from './ui/select';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  const { tasks, sprints, filterValue, setFilterValue, importData } = useTaskStore();

  const handleFilterChange = (value: string) => {
    setFilterValue(value as FilterValue);
  };

  const handleExport = () => {
    const dataToExport = { tasks, sprints };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2),
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'sprint-dashboard-data.json';
    link.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], 'UTF-8');
      fileReader.onload = (e) => {
        if (e.target?.result) {
          try {
            const imported = JSON.parse(e.target.result as string);
            if (Array.isArray(imported.tasks) && Array.isArray(imported.sprints)) {
              importData(imported);
              alert('Data imported successfully!');
            } else {
              alert('Invalid JSON format. Expected { tasks: [], sprints: [] }');
            }
          } catch (error) {
            alert('Error parsing JSON file.');
          }
        }
      };
    }
  };

  const monthOptions = useMemo(() => {
    const months = new Set<string>();
    sprints.forEach((s) => {
      months.add(s?.start_date?.substring(0, 7));
      months.add(s?.end_date?.substring(0, 7));
    });
    return Array.from(months).sort().reverse();
  }, [sprints]);

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6 border-b border-border">
      <div className="flex-1">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary text-balance">
          Sprint Task Dashboard
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm mt-2">
          Manage your team's sprints and track progress
        </p>
      </div>

      <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
        <Select value={filterValue} onValueChange={handleFilterChange}>
          <select
            value={filterValue}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="flex-1 md:flex-initial px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="current_sprint">Current Sprint</option>
            <option value="all_time">All Time</option>
            {sprints.length > 0 && (
              <>
                <optgroup label="By Sprint">
                  {sprints.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="By Month">
                  {monthOptions.map((m) => (
                    <option key={m} value={m}>
                      {new Date(m + '-02').toLocaleString('default', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </option>
                  ))}
                </optgroup>
              </>
            )}
          </select>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleExport}
          title="Export Data"
          className="h-10 w-10"
        >
          <Download size={20} />
        </Button>

        <label
          htmlFor="import-file"
          className="inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
        >
          <Upload size={20} />
          <input
            type="file"
            id="import-file"
            className="hidden"
            accept=".json"
            onChange={handleImport}
          />
        </label>

        <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="h-10 w-10">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div>
    </header>
  );
};

export default Header;
