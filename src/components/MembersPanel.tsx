import React, { useState } from 'react';
import { useGroup } from '../context/GroupContext';
import { generateRandomColor } from '../utils/formatters';

const PRESET_COLORS = [
  '#EF4444',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
];

const MembersPanel: React.FC = () => {
  const { group, addMember } = useGroup();
  const [name, setName] = useState('');
  const [color, setColor] = useState(() => generateRandomColor());
  const [error, setError] = useState<string | null>(null);

  if (!group) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Name is required.');
      return;
    }
    const isDuplicate = group.members.some(
      m => m.name.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setError(`"${trimmed}" is already in this trip.`);
      return;
    }

    addMember({ name: trimmed, color });
    setName('');
    setColor(generateRandomColor());
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Existing Members */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Members ({group.members.length})
        </h3>
        <div className="space-y-3">
          {group.members.map(member => (
            <div key={member.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <div
                className="w-10 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: member.color }}
              />
              <span className="font-medium text-gray-900">{member.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a Member</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-9 h-9 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="memberName" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <div className="flex gap-3 items-center">
              <div
                className="w-10 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <input
                id="memberName"
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setError(null); }}
                placeholder="e.g., Jordan"
                maxLength={50}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="off"
              />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Add Member
          </button>
        </form>
      </div>
    </div>
  );
};

export default MembersPanel;
