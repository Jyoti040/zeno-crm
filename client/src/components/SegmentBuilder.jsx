// src/components/SegmentBuilder.jsx
import React, { useState } from 'react';
import { campaignApi } from '../services/api.js'; // Import campaign API service

/**
 * SegmentBuilder Component
 * Allows users to define audience segments using flexible rule logic.
 */
const SegmentBuilder = () => {
    // State for the segment name
    const [segmentName, setSegmentName] = useState('');
    // State for the rules, structured as an array of rule groups.
    // Each rule group can have its own logic (AND/OR) and an array of conditions.
    const [rules, setRules] = useState([
        { logic: 'AND', conditions: [{ field: 'totalSpend', operator: '>', value: 1000 }] }
    ]);
    // State to store the audience size preview
    const [audienceSize, setAudienceSize] = useState(0);
    // State for displaying messages (success/error)
    const [message, setMessage] = useState('');

    /**
     * Handles changes to a specific condition within a rule group.
     * @param {number} groupIndex - The index of the rule group.
     * @param {number} conditionIndex - The index of the condition within the group.
     * @param {Object} e - The event object from the input change.
     */
    const handleRuleChange = (groupIndex, conditionIndex, e) => {
        const newRules = [...rules];
        newRules[groupIndex].conditions[conditionIndex][e.target.name] = e.target.value;
        setRules(newRules);
    };

    /**
     * Adds a new empty condition to a specified rule group.
     * @param {number} groupIndex - The index of the rule group to add the condition to.
     */
    const addCondition = (groupIndex) => {
        const newRules = [...rules];
        newRules[groupIndex].conditions.push({ field: '', operator: '', value: '' });
        setRules(newRules);
    };

    /**
     * Removes a condition from a specified rule group.
     * @param {number} groupIndex - The index of the rule group.
     * @param {number} conditionIndex - The index of the condition to remove.
     */
    const removeCondition = (groupIndex, conditionIndex) => {
        const newRules = [...rules];
        newRules[groupIndex].conditions.splice(conditionIndex, 1);
        setRules(newRules);
    };

    /**
     * Adds a new empty rule group (with a default condition) to the rules array.
     */
    const addRuleGroup = () => {
        setRules([...rules, { logic: 'AND', conditions: [{ field: '', operator: '', value: '' }] }]);
    };

    /**
     * Removes a rule group from the rules array.
     * @param {number} groupIndex - The index of the rule group to remove.
     */
    const removeRuleGroup = (groupIndex) => {
        const newRules = [...rules];
        newRules.splice(groupIndex, 1);
        setRules(newRules);
    };

    /**
     * Handles changes to the logic (AND/OR) for a specific rule group.
     * @param {number} groupIndex - The index of the rule group.
     * @param {Object} e - The event object.
     */
    const handleLogicChange = (groupIndex, e) => {
        const newRules = [...rules];
        newRules[groupIndex].logic = e.target.value;
        setRules(newRules);
    };

    /**
     * Calls the backend API to preview the audience size based on the current rules.
     */
    const previewAudience = async () => {
        setMessage(''); // Clear previous messages
        try {
            const res = await campaignApi.previewAudience(rules);
            setAudienceSize(res.data.audienceSize); // Update audience size
        } catch (err) {
            setMessage(`Error previewing audience: ${err.response?.data?.msg || 'Failed to preview'}`);
            console.error('Error previewing audience:', err);
        }
    };

    /**
     * Calls the backend API to save the defined segment.
     */
    const saveSegment = async () => {
        setMessage(''); // Clear previous messages
        if (!segmentName.trim()) {
            setMessage('Error: Segment name cannot be empty.');
            return;
        }
        if (rules.some(group => group.conditions.length === 0 || group.conditions.some(c => !c.field || !c.operator || c.value === ''))) {
            setMessage('Error: All rule conditions must be fully defined.');
            return;
        }

        try {
            const res = await campaignApi.createSegment({ name: segmentName, rules });
            setMessage(`Segment "${res.data.name}" saved successfully! Audience size: ${res.data.audienceSize}`);
            // Reset form after saving
            setSegmentName('');
            setRules([{ logic: 'AND', conditions: [{ field: 'totalSpend', operator: '>', value: 1000 }] }]);
            setAudienceSize(0);
        } catch (err) {
            setMessage(`Error saving segment: ${err.response?.data?.msg || 'Failed to save segment'}`);
            console.error('Error saving segment:', err);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-xl max-w-3xl mx-auto my-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Define Audience Segment</h2>
            {/* Segment Name Input */}
            <div className="mb-4">
                <label htmlFor="segmentName" className="block text-sm font-medium text-gray-700">Segment Name</label>
                <input
                    type="text"
                    id="segmentName"
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
            </div>

            {/* Rule Groups */}
            {rules.map((ruleGroup, groupIndex) => (
                <div key={groupIndex} className="border border-blue-200 p-4 rounded-lg mb-4 bg-blue-50 relative">
                    {/* Remove Rule Group Button */}
                    {rules.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeRuleGroup(groupIndex)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-medium"
                            title="Remove Rule Group"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                    )}
                    {/* Logic Selector (AND/OR) */}
                    <div className="flex items-center mb-3">
                        <label className="text-sm font-medium text-gray-700 mr-2">Logic for this group:</label>
                        <select
                            value={ruleGroup.logic}
                            onChange={(e) => handleLogicChange(groupIndex, e)}
                            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="AND">AND</option>
                            <option value="OR">OR</option>
                        </select>
                    </div>
                    {/* Conditions within the rule group */}
                    {ruleGroup.conditions.map((condition, conditionIndex) => (
                        <div key={conditionIndex} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2 p-2 bg-white rounded-md border border-gray-100">
                            {/* Field Selector */}
                            <select
                                name="field"
                                value={condition.field}
                                onChange={(e) => handleRuleChange(groupIndex, conditionIndex, e)}
                                className="w-full sm:w-auto px-2 py-1 border border-gray-300 rounded-md text-sm"
                            >
                                <option value="">Select Field</option>
                                <option value="totalSpend">Total Spend</option>
                                <option value="visits">Visits</option>
                                <option value="lastActivity">Last Activity</option>
                                {/* Add more fields as per your Customer model */}
                            </select>
                            {/* Operator Selector */}
                            <select
                                name="operator"
                                value={condition.operator}
                                onChange={(e) => handleRuleChange(groupIndex, conditionIndex, e)}
                                className="w-full sm:w-auto px-2 py-1 border border-gray-300 rounded-md text-sm"
                            >
                                <option value="">Select Operator</option>
                                <option value=">">{'>'}</option>
                                <option value="<">{'<'}</option>
                                <option value="=">{'='}</option>
                                <option value="inactive_for_days">Inactive for (days)</option>
                            </select>
                            <input
                                type="text"
                                name="value"
                                value={condition.value}
                                onChange={(e) => handleRuleChange(groupIndex, conditionIndex, e)}
                                placeholder="Value"
                                className="w-full sm:w-24 px-2 py-1 border border-gray-300 rounded-md text-sm"
                            />
                            {/* Remove Condition Button */}
                            {ruleGroup.conditions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeCondition(groupIndex, conditionIndex)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                    title="Remove Condition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            )}
                        </div>
                    ))}
                    {/* Add Condition Button */}
                    <button
                        type="button"
                        onClick={() => addCondition(groupIndex)}
                        className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Add Condition
                    </button>
                </div>
            ))}
            {/* Add Rule Group Button */}
            <button
                type="button"
                onClick={addRuleGroup}
                className="mb-4 text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
            >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Add Rule Group (AND/OR)
            </button>

            {/* Preview Audience Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-4 bg-gray-100 rounded-lg shadow-sm">
                <button
                    type="button"
                    onClick={previewAudience}
                    className="w-full sm:w-auto flex-1 sm:mr-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-2 sm:mb-0"
                >
                    Preview Audience
                </button>
                <span className="text-lg font-semibold text-gray-800">Estimated Audience Size: {audienceSize}</span>
            </div>
            {/* Save Segment Button */}
            <button
                type="button"
                onClick={saveSegment}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Save Segment
            </button>
            {/* Display messages */}
            {message && (
                <p className={`mt-4 text-center text-sm font-medium ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default SegmentBuilder;
