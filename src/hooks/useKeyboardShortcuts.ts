import { useEffect } from 'react';

type ShortcutOptions = {
  selectedCell: { row: number; column: number } | null;
  isSimulating: boolean;
  onRun: () => void;
  onDeselectGate: () => void;
  onDeleteCell: () => void;
};

export default function useKeyboardShortcuts({
  selectedCell,
  isSimulating,
  onRun,
  onDeselectGate,
  onDeleteCell,
}: ShortcutOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDeselectGate();
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'r') {
        event.preventDefault();
        if (!isSimulating) {
          onRun();
        }
      }

      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedCell) {
        event.preventDefault();
        onDeleteCell();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, isSimulating, onRun, onDeselectGate, onDeleteCell]);
}
