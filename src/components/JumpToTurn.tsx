'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface JumpToTurnProps {
  maxTurnId: number;
  onJump: (turnId: number) => void;
  disabled: boolean;
}

export function JumpToTurn({ maxTurnId, onJump, disabled }: JumpToTurnProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const turnId = parseInt(value, 10);
    if (!isNaN(turnId) && turnId >= 1 && turnId <= maxTurnId) {
      onJump(turnId);
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Turn ID"
          min={1}
          max={maxTurnId}
          disabled={disabled}
          className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm
            focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !value}
        className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Search size={16} />
        <span>Jump</span>
      </button>
    </form>
  );
}
