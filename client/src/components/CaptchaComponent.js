import React, { useState, useEffect, useRef } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { loadCaptchaEnginge, validateCaptcha, LoadCanvasTemplate } from 'react-simple-captcha';

const CaptchaComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const validator = useRef(new SimpleReactValidator());

  useEffect(() => {
    loadCaptchaEnginge(6); // Load CAPTCHA with 6 characters
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    if (validator.current.allValid() && validateCaptcha(inputValue)) {
      alert('CAPTCHA verified successfully!');
    } else {
      alert('CAPTCHA verification failed. Please try again.');
      loadCaptchaEnginge(6); // Regenerate CAPTCHA on failure
    }
  };

  return (
    <div>
        <div className="relative mb-4">
          <label
            htmlFor="captcha"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Enter CAPTCHA
          </label>
          <div className="flex items-center">
            <LoadCanvasTemplate reloadText='<i class="fi fi-br-rotate-right"></i>'/>
          </div>
          <input
            type="text"
            id="captcha"
            value={inputValue}
            onChange={handleInputChange}
            placeholder='captcha'
            className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleSubmit}
        >
          Submit
        </button>
    </div>
  );
};

export default CaptchaComponent;