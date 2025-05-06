import { useState, useEffect } from "react";
import { submitFeedback } from "../api/api";
import FeedbackAnalysis from "./FeedbackAnalysis";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Draggable form field component
const DraggableFormField = ({ field, index, moveField, updateField, removeField }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'FORM_FIELD',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'FORM_FIELD',
    hover: (item) => {
      if (item.index !== index) {
        moveField(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div 
      ref={(node) => drag(drop(node))} 
      className={`p-4 border ${field.active ? 'border-indigo-300 dark:border-indigo-600' : 'border-gray-200 dark:border-gray-700'} 
                rounded-lg transition-all duration-300 ${isDragging ? 'opacity-50' : 'opacity-100'} 
                bg-white dark:bg-gray-800 shadow-sm hover:shadow-md`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 w-full">
          <div className="cursor-move text-gray-500 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
            className="font-medium text-gray-900 dark:text-white bg-transparent border-b border-gray-300 
                    dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none w-full"
            placeholder="Field Label"
          />
          <button
            onClick={() => removeField(field.id)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
            title="Remove field"
          >
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Field Name</label>
          <input
            type="text"
            value={field.name}
            onChange={(e) => updateField(field.id, { name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
            className="input-field text-sm"
            placeholder="field_name"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Used as the data key in responses
          </p>
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Field Type</label>
          <select
            value={field.type}
            onChange={(e) => updateField(field.id, { type: e.target.value })}
            className="input-field text-sm"
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="number">Number</option>
            <option value="textarea">Text Area</option>
            <option value="select">Dropdown</option>
            <option value="tel">Phone Number</option>
            <option value="date">Date</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {field.type === 'select' && (
        <div className="mt-3">
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Options (comma separated)</label>
          <input
            type="text"
            value={field.options || ''}
            onChange={(e) => updateField(field.id, { options: e.target.value })}
            className="input-field text-sm"
            placeholder="Option 1, Option 2, Option 3"
          />
        </div>
      )}

      {field.type === 'rating' && (
        <div className="mt-3">
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Max Rating</label>
          <select
            value={field.maxRating || 5}
            onChange={(e) => updateField(field.id, { maxRating: parseInt(e.target.value) })}
            className="input-field text-sm"
          >
            <option value="5">5 Stars</option>
            <option value="10">10 Scale</option>
          </select>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-3">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => updateField(field.id, { required: e.target.checked })}
            className="form-checkbox rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Required</span>
        </label>

        {(field.type === 'text' || field.type === 'textarea') && (
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={field.placeholder !== undefined}
              onChange={(e) => updateField(field.id, { placeholder: e.target.checked ? '' : undefined })}
              className="form-checkbox rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Add Placeholder</span>
          </label>
        )}
      </div>

      {field.placeholder !== undefined && (
        <div className="mt-3">
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Placeholder Text</label>
          <input
            type="text"
            value={field.placeholder}
            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
            className="input-field text-sm"
            placeholder="Enter placeholder text"
          />
        </div>
      )}

      {/* Field Preview */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Preview:</p>
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded p-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {field.label || "Field Label"}{field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === "textarea" ? (
            <textarea
              rows={2}
              disabled
              placeholder={field.placeholder}
              className="input-field text-sm bg-white dark:bg-gray-800 opacity-75"
            />
          ) : field.type === "select" ? (
            <select disabled className="input-field text-sm bg-white dark:bg-gray-800 opacity-75">
              <option>{field.placeholder || "Select an option"}</option>
              {field.options && field.options.split(',').map((opt, i) => (
                <option key={i}>{opt.trim()}</option>
              ))}
            </select>
          ) : field.type === "rating" ? (
            <div className="flex gap-1">
              {[...Array(parseInt(field.maxRating || 5))].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              ))}
            </div>
          ) : (
            <input
              type={field.type}
              disabled
              placeholder={field.placeholder}
              className="input-field text-sm bg-white dark:bg-gray-800 opacity-75"
            />
          )}
        </div>
      </div>
    </div>
  );
};

function CustomFormBuilder({ formId, onSubmitSuccess }) {
  const [formFields, setFormFields] = useState([
    { id: 1, name: "name", label: "Your Name", type: "text", required: true },
    { id: 2, name: "email", label: "Email Address", type: "email", required: false },
    { id: 3, name: "feedback", label: "Your Feedback", type: "textarea", required: true }
  ]);
  
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formTitle, setFormTitle] = useState("Feedback Form");
  const [formDescription, setFormDescription] = useState("We value your input! Please share your thoughts.");
  const [formTheme, setFormTheme] = useState("default");
  const [showSuccessConfetti, setShowSuccessConfetti] = useState(false);

  const themes = {
    default: {
      bgGradient: "from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900",
      cardBg: "bg-white dark:bg-gray-800",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white",
      accentColor: "text-indigo-600 dark:text-indigo-400"
    },
    blue: {
      bgGradient: "from-blue-50 to-white dark:from-blue-900/30 dark:to-gray-900",
      cardBg: "bg-white dark:bg-gray-800",
      buttonColor: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white",
      accentColor: "text-blue-600 dark:text-blue-400"
    },
    green: {
      bgGradient: "from-green-50 to-white dark:from-green-900/30 dark:to-gray-900",
      cardBg: "bg-white dark:bg-gray-800",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white",
      accentColor: "text-emerald-600 dark:text-emerald-400"
    },
    purple: {
      bgGradient: "from-purple-50 to-white dark:from-purple-900/30 dark:to-gray-900",
      cardBg: "bg-white dark:bg-gray-800",
      buttonColor: "bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white",
      accentColor: "text-purple-600 dark:text-purple-400"
    },
    orange: {
      bgGradient: "from-orange-50 to-white dark:from-orange-900/30 dark:to-gray-900",
      cardBg: "bg-white dark:bg-gray-800",
      buttonColor: "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white",
      accentColor: "text-orange-600 dark:text-orange-400"
    }
  };

  // Move field for drag and drop functionality
  const moveField = (fromIndex, toIndex) => {
    const updatedFields = [...formFields];
    const [movedField] = updatedFields.splice(fromIndex, 1);
    updatedFields.splice(toIndex, 0, movedField);
    setFormFields(updatedFields);
  };

  // Handle adding a new field
  const addField = (type = "text") => {
    const newId = formFields.length > 0 ? Math.max(...formFields.map(f => f.id)) + 1 : 1;
    const newField = { 
      id: newId, 
      name: `field_${newId}`, 
      label: getDefaultLabelForType(type), 
      type: type,
      required: false,
      active: true
    };
    
    // Initialize specific field type properties
    if (type === "select") {
      newField.options = "Option 1, Option 2, Option 3";
    } else if (type === "rating") {
      newField.maxRating = 5;
    }
    
    // Clear any active state from other fields
    const updatedFields = formFields.map(field => ({...field, active: false}));
    
    setFormFields([...updatedFields, newField]);
    
    // Scroll to the new field after a short delay to allow rendering
    setTimeout(() => {
      const formElement = document.querySelector('.form-builder-container');
      formElement.scrollTo({
        top: formElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const getDefaultLabelForType = (type) => {
    switch (type) {
      case "text": return "Text Field";
      case "email": return "Email Address";
      case "number": return "Number";
      case "textarea": return "Comments";
      case "select": return "Dropdown Menu";
      case "tel": return "Phone Number";
      case "date": return "Date";
      case "rating": return "Rating";
      default: return "New Field";
    }
  };

  // Handle removing a field
  const removeField = (id) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };

  // Handle editing field properties
  const updateField = (id, updates) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Clear any errors when user types
    setError("");
  };

  // Handle rating input
  const handleRatingChange = (name, value) => {
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const missingFields = formFields
      .filter(field => field.required && !formValues[field.name])
      .map(field => field.label);
    
    if (missingFields.length > 0) {
      setError(`Please complete the following required fields: ${missingFields.join(", ")}`);
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      // Submit the form data
      const response = await submitFeedback(formId, { responses: formValues });
      
      // Store analysis result
      setAnalysis(response);
      setFormSubmitted(true);
      setShowSuccessConfetti(true);
      
      if (onSubmitSuccess) onSubmitSuccess();

      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowSuccessConfetti(false);
      }, 5000);
      
    } catch (err) {
      setError(err.message || "Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle edit mode for the form builder
  const toggleFieldEditor = () => {
    setShowFieldEditor(!showFieldEditor);
  };

  const currentTheme = themes[formTheme] || themes.default;

  // Simple confetti effect
  const Confetti = () => {
    useEffect(() => {
      return () => {
        // Cleanup if needed
      };
    }, []);

    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() * 10 + 5;
          const left = Math.random() * 100;
          const animationDelay = Math.random() * 2;
          const animationDuration = Math.random() * 3 + 2;
          const color = [
            'bg-red-500', 'bg-blue-500', 'bg-green-500', 
            'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'
          ][Math.floor(Math.random() * 6)];
          
          return (
            <div
              key={i}
              className={`absolute ${color} rounded-full`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: '-20px',
                animation: `confetti ${animationDuration}s ease-in forwards ${animationDelay}s`
              }}
            ></div>
          );
        })}
        <style jsx>{`
          @keyframes confetti {
            0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
        `}</style>
      </div>
    );
  };

  // Render rating input
  const RatingInput = ({ field, value = 0, onChange }) => {
    const maxRating = parseInt(field.maxRating || 5);
    
    return (
      <div className="flex gap-1 items-center">
        {[...Array(maxRating)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <button
              key={index}
              type="button"
              onClick={() => onChange(field.name, ratingValue)}
              className="focus:outline-none transition-colors duration-200"
            >
              <svg 
                className={`w-6 h-6 ${ratingValue <= (value || 0) 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300 dark:text-gray-600'}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          );
        })}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          {value > 0 ? `${value}/${maxRating}` : ''}
        </span>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <section className={`section bg-gradient-to-b ${currentTheme.bgGradient} min-h-screen`}>
        <div className="container max-w-4xl">
          {showSuccessConfetti && <Confetti />}

          <div className={`card hover-lift ${currentTheme.cardBg}`}>
            {!formSubmitted ? (
              <>
                <div className="text-center mb-8">
                  {showFieldEditor ? (
                    <>
                      <div className="mb-6">
                        <input
                          type="text"
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          className="text-2xl font-bold mb-2 text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none text-center w-full"
                          placeholder="Form Title"
                        />
                        <textarea
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          className="text-gray-600 dark:text-gray-300 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none text-center w-full resize-none mt-2"
                          placeholder="Form description"
                          rows={2}
                        />
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                          Form Theme:
                        </label>
                        {Object.keys(themes).map(theme => (
                          <button
                            key={theme}
                            onClick={() => setFormTheme(theme)}
                            className={`w-8 h-8 rounded-full border-2 ${
                              theme === formTheme 
                                ? 'border-gray-800 dark:border-white scale-110' 
                                : 'border-transparent'
                            } transition-transform duration-200 focus:outline-none overflow-hidden`}
                            title={theme.charAt(0).toUpperCase() + theme.slice(1)}
                          >
                            <div className={`w-full h-full ${themes[theme].bgGradient}`}></div>
                          </button>
                        ))}
                      </div>
                      <div className="mb-4 flex justify-center">
                        <button
                          onClick={toggleFieldEditor}
                          className={`${currentTheme.buttonColor} px-4 py-2 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-200 mr-2`}
                        >
                          Preview Form
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                        {formTitle}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        {formDescription}
                      </p>
                      <button 
                        onClick={toggleFieldEditor}
                        className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center mx-auto"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                        Customize Form
                      </button>
                    </>
                  )}
                </div>

                {showFieldEditor ? (
                  <div className="form-builder-container max-h-[60vh] overflow-y-auto pr-1 mb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    <div className="space-y-4">
                      {formFields.map((field, index) => (
                        <DraggableFormField
                          key={field.id}
                          field={field}
                          index={index}
                          moveField={moveField}
                          updateField={updateField}
                          removeField={removeField}
                        />
                      ))}
                    </div>

                    {formFields.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400">No fields added yet. Add a field below to get started.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formFields.map((field) => (
                      <div key={field.id}>
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        {field.type === "textarea" ? (
                          <textarea
                            id={field.name}
                            name={field.name}
                            rows={5}
                            value={formValues[field.name] || ""}
                            onChange={handleInputChange}
                            required={field.required}
                            className="input-field"
                            placeholder={field.placeholder}
                          />
                        ) : field.type === "select" ? (
                          <select
                            id={field.name}
                            name={field.name}
                            value={formValues[field.name] || ""}
                            onChange={handleInputChange}
                            required={field.required}
                            className="input-field"
                          >
                            <option value="">{field.placeholder || "Select an option"}</option>
                            {field.options && field.options.split(',').map((opt, i) => (
                              <option key={i} value={opt.trim()}>{opt.trim()}</option>
                            ))}
                          </select>
                        ) : field.type === "rating" ? (
                          <RatingInput
                            field={field}
                            value={formValues[field.name]}
                            onChange={handleRatingChange}
                          />
                        ) : (
                          <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            value={formValues[field.name] || ""}
                            onChange={handleInputChange}
                            required={field.required}
                            className="input-field"
                            placeholder={field.placeholder}
                          />
                        )}
                      </div>
                    ))}

                    {error && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 fade-in">
                        {error}
                      </p>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`${currentTheme.buttonColor} px-5 py-2 rounded-lg shadow-md hover:shadow-lg relative transform transition-all duration-200 hover:scale-105 active:scale-95`}
                      >
                        {loading ? (
                          <>
                            <span className="opacity-0">Submit</span>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                            </div>
                          </>
                        ) : (
                          "Submit Form"
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {showFieldEditor && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Field</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button
                        onClick={() => addField("text")}
                        className="field-type-button"
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Text
                      </button>
                      <button
                        onClick={() => addField("textarea")}
                        className="field-type-button"
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                        Text Area
                      </button>
                      <button
                        onClick={() => addField("email")}
                        className="field-type-button"
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                      </button>
                      <button
                        onClick={() => addField("number")}
                        className="field-type-button"
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        Number
                      </button>
                      <button
                        onClick={() => addField("select")}
                        className="field-type-button"
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                        Dropdown
                      </button>
                      <button
                        onClick={() => addField("tel")}
                        className="field-type-button"
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Phone
                      </button>
                      <button
                        onClick={() => addField("date")}
                        className="field-type-button"
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Date
                      </button>
                      <button
                        onClick={() => addField("rating")}
                        className="field-type-button"
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Rating
                      </button>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to reset the form? This will remove all fields.')) {
                            setFormFields([]);
                          }
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Reset Form
                      </button>
                      <button
                        onClick={toggleFieldEditor}
                        className={`${currentTheme.buttonColor} px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200`}
                      >
                        Save Form
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 dark:border-green-400 text-green-700 dark:text-green-300 rounded-r-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p><strong>Thank you!</strong> Your form has been submitted and analyzed.</p>
                  </div>
                </div>
                
                {/* Feedback Analysis Result */}
                <FeedbackAnalysis analysis={analysis} />
                
                <div className="flex justify-center">
                  <button 
                    onClick={() => {
                      setFormValues({});
                      setFormSubmitted(false);
                      setAnalysis(null);
                    }}
                    className={`${currentTheme.buttonColor} px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200`}
                  >
                    Submit Another Response
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .field-type-button {
            @apply flex items-center justify-center px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200;
          }
          
          .scrollbar-thin {
            scrollbar-width: thin;
          }
          
          .scrollbar-thumb-gray-300 {
            scrollbar-color: #d1d5db transparent;
          }
          
          .dark .scrollbar-thumb-gray-600 {
            scrollbar-color: #4b5563 transparent;
          }
        `}</style>
      </section>
    </DndProvider>
  );
}

export default CustomFormBuilder;