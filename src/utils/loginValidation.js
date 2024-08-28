export function validateLoginForm(email, password) {
    const errors = {};
  
    if (!email.includes("@")) {
      errors.email = true;
    }
  
    if (password.length < 6) {
      errors.password = true;
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }