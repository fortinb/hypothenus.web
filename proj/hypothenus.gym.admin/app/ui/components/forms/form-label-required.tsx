import { Form } from 'react-bootstrap';

export default function FormLabelRequired({ label, className, required = true, ...props } : 
    { 
        label: string; 
        className?: string; 
        required?: boolean;
        [key: string]: any }) {
  return (
    <Form.Label className={className} {...props}>
      {label}
      {required && <span className="form-label-required" > *</span>}
    </Form.Label>
  );
};
