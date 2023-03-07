import { useState } from 'react';

export function useForm<T>(initialValues: T) {
  const [values, setValues] = useState(initialValues);

  return {
    values,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
    },
    reset: () => setValues(initialValues),
  };
}
