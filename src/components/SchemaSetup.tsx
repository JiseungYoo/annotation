'use client';

import { useState, useEffect } from 'react';
import { AnnotationSchema, SchemaColumn, MAX_SCHEMA_COLUMNS, MIN_SCHEMA_COLUMNS } from '@/types';
import { X, Plus, Trash2 } from 'lucide-react';

interface SchemaSetupProps {
  isOpen: boolean;
  schema: AnnotationSchema;
  onSave: (schema: AnnotationSchema) => void;
  onClose: () => void;
}

export function SchemaSetup({ isOpen, schema, onSave, onClose }: SchemaSetupProps) {
  const [localSchema, setLocalSchema] = useState<AnnotationSchema>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      // Deep copy schema when dialog opens
      setLocalSchema(schema.map(col => ({ ...col })));
      setErrors({});
    }
  }, [isOpen, schema]);

  if (!isOpen) return null;

  const generateId = () => `col_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleNameChange = (id: string, name: string) => {
    setLocalSchema(prev =>
      prev.map(col => (col.id === id ? { ...col, name } : col))
    );
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const handleAddColumn = () => {
    if (localSchema.length >= MAX_SCHEMA_COLUMNS) return;
    setLocalSchema(prev => [
      ...prev,
      { id: generateId(), name: '' },
    ]);
  };

  const handleRemoveColumn = (id: string) => {
    if (localSchema.length <= MIN_SCHEMA_COLUMNS) return;
    setLocalSchema(prev => prev.filter(col => col.id !== id));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const names = new Set<string>();

    for (const col of localSchema) {
      const trimmedName = col.name.trim();

      if (!trimmedName) {
        newErrors[col.id] = 'Column name cannot be empty';
      } else if (names.has(trimmedName.toLowerCase())) {
        newErrors[col.id] = 'Duplicate column name';
      } else {
        names.add(trimmedName.toLowerCase());
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      // Trim all names before saving
      const cleanedSchema = localSchema.map(col => ({
        ...col,
        name: col.name.trim(),
      }));
      onSave(cleanedSchema);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Set Up Annotation Schema</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          Define the annotation columns you want to use. If these columns exist in your CSV,
          their values will be loaded automatically.
        </p>

        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {localSchema.map((col, index) => (
            <div key={col.id} className="flex items-center gap-2">
              <span className="text-sm text-gray-500 w-20">Column {index + 1}:</span>
              <div className="flex-1">
                <input
                  type="text"
                  value={col.name}
                  onChange={(e) => handleNameChange(col.id, e.target.value)}
                  placeholder="e.g., general praise"
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-blue-500 ${
                    errors[col.id] ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors[col.id] && (
                  <p className="text-xs text-red-400 mt-1">{errors[col.id]}</p>
                )}
              </div>
              <button
                onClick={() => handleRemoveColumn(col.id)}
                disabled={localSchema.length <= MIN_SCHEMA_COLUMNS}
                className="p-2 hover:bg-gray-700 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Remove column"
              >
                <Trash2 size={18} className="text-gray-400" />
              </button>
            </div>
          ))}
        </div>

        {localSchema.length < MAX_SCHEMA_COLUMNS && (
          <button
            onClick={handleAddColumn}
            className="flex items-center gap-2 mt-4 px-3 py-2 text-sm text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Plus size={18} />
            <span>Add Column</span>
          </button>
        )}

        <p className="text-xs text-gray-500 mt-4">
          {localSchema.length} of {MAX_SCHEMA_COLUMNS} columns used
        </p>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
          >
            Save Schema
          </button>
        </div>
      </div>
    </div>
  );
}
