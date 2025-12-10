'use client';

import { useState, useEffect } from 'react';

interface MathCaptchaProps {
  onVerify: (isValid: boolean) => void;
  resetTrigger?: number;
  onCaptchaData?: (data: { num1: number; num2: number; answer: number }) => void;
}

export default function MathCaptcha({ onVerify, resetTrigger = 0, onCaptchaData }: MathCaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');

  // Generar nueva suma
  const generateNewSum = () => {
    const n1 = Math.floor(Math.random() * 10) + 1; // 1-10
    const n2 = Math.floor(Math.random() * 10) + 1; // 1-10
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setIsValid(false);
    setError('');
    onVerify(false);
  };

  // Generar suma inicial
  useEffect(() => {
    generateNewSum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTrigger]);

  // Validar respuesta
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Solo permitir números
    if (value === '' || /^\d+$/.test(value)) {
      setUserAnswer(value);
      setError('');
      
      if (value !== '') {
        const answer = parseInt(value, 10);
        const correctAnswer = num1 + num2;
        const valid = answer === correctAnswer;
        setIsValid(valid);
        onVerify(valid);
        
        if (valid && onCaptchaData) {
          onCaptchaData({ num1, num2, answer });
        }
        
        if (!valid) {
          setError('La respuesta es incorrecta');
        }
      } else {
        setIsValid(false);
        onVerify(false);
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Verificación de seguridad *
      </label>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-md border border-gray-300">
          <span className="text-lg font-semibold text-gray-700">{num1}</span>
          <span className="text-lg text-gray-600">+</span>
          <span className="text-lg font-semibold text-gray-700">{num2}</span>
          <span className="text-lg text-gray-600">=</span>
          <input
            type="text"
            value={userAnswer}
            onChange={handleAnswerChange}
            placeholder="?"
            required
            className="w-16 px-2 py-1 text-center text-lg font-semibold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
            maxLength={3}
          />
        </div>
        <button
          type="button"
          onClick={generateNewSum}
          className="text-sm text-slate-600 hover:text-slate-800 underline"
          title="Generar nueva suma"
        >
          Cambiar
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {isValid && (
        <p className="text-sm text-green-600">✓ Verificación correcta</p>
      )}
    </div>
  );
}

