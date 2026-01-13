import { useState } from "react"
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import {validateLogin} from "../../../utils/validateLogin"
import toast from 'react-hot-toast';
import { LogIn } from "lucide-react"
import "./LoginPage.scss"

const LoginPage = ({onLogin}) => {

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({ ...prev, [name]: value }));

    const fieldErrors = validateLogin(name, value);

    setErrors(prev => {
      const newErrors = { ...prev, ...fieldErrors };
      if (!fieldErrors[name]) {
        delete newErrors[name];
      }
      return newErrors;
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
        
    Object.keys(form).forEach((key) => {
      const fieldErrors = validateLogin(key, form[key]);
      Object.assign(newErrors, fieldErrors);
    });
        
    setErrors(newErrors);
        
    if (Object.keys(newErrors).length > 0) {
      toast.error("Form is not valid");
      return;
    }
    try {
      await login({...form});
      toast.success('Success login!');
      navigate('/');
      setForm({
        email: "",
        password: ""
      });
      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login error');
    }
  }

  return (
    <div className="login-container">
      <div className="logo-container">
        <LogIn size={32}/>
      </div>
      <h2 className="login-title">Login SwissJewellery</h2>
      <p className="login-subtitle">Enter data for auth</p>

      <form className="login-form" onSubmit={handleSubmit}>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="example@shop.ua"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "input error" : "input"}
            required
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "input error" : "input"}
            required
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>
        
        <button className="login-btn" type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginPage