const Select = ({ 
  label, 
  error, 
  required = false, 
  options = [], 
  className = '', 
  placeholder = 'Select an option',
  ...props 
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
