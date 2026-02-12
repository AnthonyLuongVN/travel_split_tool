import React, { useState } from 'react';
import { useGroup } from '../context/GroupContext';
import { generateRandomColor } from '../utils/formatters';

const GroupSetup: React.FC = () => {
  const { createGroup } = useGroup();
  const [groupName, setGroupName] = useState('');
  const [currency, setCurrency] = useState('VND');
  const [members, setMembers] = useState<{ name: string; color: string }[]>([
    { name: '', color: generateRandomColor() }
  ]);

  const addMemberField = () => {
    setMembers([...members, { name: '', color: generateRandomColor() }]);
  };

  const removeMemberField = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMemberName = (index: number, name: string) => {
    const updated = [...members];
    updated[index].name = name;
    setMembers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    const validMembers = members.filter(m => m.name.trim());
    if (validMembers.length < 2) {
      alert('Please add at least 2 members');
      return;
    }

    createGroup(groupName, currency, validMembers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Trip</h1>
        <p className="text-gray-600 mb-8">Set up your vacation expense tracker</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Name */}
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
              Trip Name
            </label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Bali Adventure 2024"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Currency */}
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="VND">VND - Vietnamese Dong</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="CHF">CHF - Swiss Franc</option>
              <option value="CNY">CNY - Chinese Yuan</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="MXN">MXN - Mexican Peso</option>
            </select>
          </div>

          {/* Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Members
            </label>
            <div className="space-y-3">
              {members.map((member, index) => (
                <div key={index} className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0"
                    style={{ backgroundColor: member.color }}
                  />
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateMemberName(index, e.target.value)}
                    placeholder={index === 0 ? 'Your name' : `Member ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMemberField(index)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addMemberField}
              className="mt-3 w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              + Add Member
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create Trip
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupSetup;
