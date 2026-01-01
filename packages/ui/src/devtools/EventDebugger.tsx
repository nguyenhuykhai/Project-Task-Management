import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useEventSpy } from "@repo/core";
import { EventDebuggerHeader } from "./components/EventDebuggerHeader";
import { SearchBar } from "./components/SearchBar";
import { FilterBar } from "./components/FilterBar";
import { EventList } from "./components/EventList";
import { EventDebuggerToggle } from "./components/EventDebuggerToggle";
import { useEventFilters } from "./hooks/useEventFilters";
import { MAX_LOGS } from "./constants";

export const EventDebugger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { logs, clearLogs } = useEventSpy({ maxLogs: MAX_LOGS });

  const {
    searchTerm,
    setSearchTerm,
    activeFilters,
    toggleFilter,
    clearSearch,
    clearFilters,
    filteredLogs,
  } = useEventFilters(logs);

  const handleClearSearch = () => {
    clearSearch();
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-sans">
      {/* CSS for animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="panel"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            style={{ transformOrigin: "bottom right" }}
          >
            <div className="bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 w-[520px] max-h-[560px] flex flex-col overflow-hidden">
              <EventDebuggerHeader
                filteredCount={filteredLogs.length}
                totalCount={logs.length}
                showSearch={showSearch}
                showFilters={showFilters}
                activeFiltersCount={activeFilters.size}
                onToggleSearch={() => setShowSearch(!showSearch)}
                onToggleFilters={() => setShowFilters(!showFilters)}
                onClearLogs={clearLogs}
                onMinimize={() => setIsOpen(false)}
              />

              <div className="px-4">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onClear={handleClearSearch}
                  show={showSearch}
                />

                <FilterBar
                  activeFilters={activeFilters}
                  onToggleFilter={toggleFilter}
                  onClearFilters={clearFilters}
                  show={showFilters}
                />
              </div>

              <EventList
                logs={filteredLogs}
                searchTerm={searchTerm}
                hasFilters={
                  searchTerm.trim().length > 0 || activeFilters.size > 0
                }
              />

              {/* Footer Status */}
              <footer className="bg-white/[0.02] border-t border-white/5 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Listening...
                  </span>
                </div>
                <span className="text-[10px] text-slate-600">
                  Max: {MAX_LOGS} events
                </span>
              </footer>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="toggle"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            style={{ transformOrigin: "bottom right" }}
          >
            <EventDebuggerToggle
              eventCount={logs.length}
              onExpand={() => setIsOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
