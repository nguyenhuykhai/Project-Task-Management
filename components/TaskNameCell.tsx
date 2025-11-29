import { Task } from '@/types';
import { useState } from 'react';
import { TableCell } from './ui/table';
import { Check, Copy, ExternalLink, Link2 } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// Inside your TaskTable component (or extract to a sub-component)
const TaskNameCell: React.FC<{ task: Task }> = ({ task }) => {
  const [copiedName, setCopiedName] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const copyName = async () => {
    await navigator.clipboard.writeText(task.task);
    setCopiedName(true);
    setTimeout(() => setCopiedName(false), 2000);
  };

  const copyLink = async () => {
    if (!task.link) return;
    await navigator.clipboard.writeText(task.link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <TableCell className="font-medium align-top">
      <div className="py-2 pr-4">
        <div className="flex items-center gap-3 group">
          {/* Copy Buttons with Tooltip + Animation */}
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 md:opacity-100">
            <TooltipProvider>
              {/* Copy Task Name */}
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/10"
                    onClick={copyName}
                  >
                    <div className="relative">
                      <Copy
                        className={`h-4 w-4 transition-all duration-300 ${
                          copiedName
                            ? 'scale-0 rotate-90 opacity-0'
                            : 'scale-100 rotate-0 opacity-100'
                        }`}
                      />
                      <Check
                        className={`absolute inset-0 h-4 w-4 text-green-600 transition-all duration-300 ${
                          copiedName
                            ? 'scale-100 rotate-0 opacity-100'
                            : 'scale-0 -rotate-90 opacity-0'
                        }`}
                      />
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {copiedName ? 'Copied!' : 'Copy task name'}
                </TooltipContent>
              </Tooltip>

              {/* Copy Link */}
              {task.link && (
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-primary/10"
                      onClick={copyLink}
                    >
                      <div className="relative">
                        <Link2
                          className={`h-4 w-4 transition-all duration-300 ${
                            copiedLink
                              ? 'scale-0 rotate-90 opacity-0'
                              : 'scale-100 rotate-0 opacity-100'
                          }`}
                        />
                        <Check
                          className={`absolute inset-0 h-4 w-4 text-green-600 transition-all duration-300 ${
                            copiedLink
                              ? 'scale-100 rotate-0 opacity-100'
                              : 'scale-0 -rotate-90 opacity-0'
                          }`}
                        />
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {copiedLink ? 'Link copied!' : 'Copy link'}
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>

          {/* Task Name + External Link */}
          <a
            href={task.link || undefined}
            target={task.link ? '_blank' : undefined}
            rel={task.link ? 'noopener noreferrer' : undefined}
            className={`flex-1 min-w-0 ${
              task.link ? 'text-primary hover:underline' : 'text-foreground'
            }`}
          >
            <span
              className="break-words overflow-wrap-anywhere hyphens-auto leading-relaxed"
              style={{ wordBreak: 'break-word' }}
            >
              {task.task}
            </span>
            {task.link && (
              <ExternalLink
                size={15}
                className="inline-block ml-1.5 shrink-0 text-muted-foreground/70 group-hover:text-primary transition-all duration-200"
              />
            )}
          </a>
        </div>
      </div>
    </TableCell>
  );
};

export default TaskNameCell;
