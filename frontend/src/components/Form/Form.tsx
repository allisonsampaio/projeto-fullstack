import React from "react";
import { TextField, Button, Box, Snackbar, Alert } from "@mui/material";

interface FormProps {
  fields: { name: string; label: string; type: string; required?: boolean }[];
  onSubmit: () => void;
  error: string | null;
  success: string | null;
  onCloseSnackbar: () => void;
  initialValues: { [key: string]: string };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  error,
  success,
  onCloseSnackbar,
  initialValues,
  onInputChange,
}) => {
  return (
    <Box component="form" sx={{ mb: 4 }}>
      {fields.map((field, index) => (
        <TextField
          key={index}
          label={field.label}
          name={field.name}
          type={field.type}
          value={initialValues[field.name] || ""}
          onChange={onInputChange}
          fullWidth
          margin="normal"
          required={field.required}
        />
      ))}
      <Button variant="contained" color="primary" onClick={onSubmit}>
        Salvar
      </Button>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={onCloseSnackbar}>
        <Alert onClose={onCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={onCloseSnackbar}>
        <Alert onClose={onCloseSnackbar} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Form;