import { Contact } from "lucide-react"
import { useState } from "react"
import "../LoginPage/LoginPage.scss"
import { validateRegister } from "../../../utils/validateRegister"
import { useAuth } from "../../../context/AuthContext"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const RegisterPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    retryPassword: "",
    fullName: "",
    phone: "",
    address: ""
  });

  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({ ...prev, [name]: value }));

    const fieldErrors = validateRegister(name, value, {
      ...form,
      [name]: value
    });

    setErrors(prev => {
      const newErrors = { ...prev, ...fieldErrors }
      if (!fieldErrors[name])
        delete newErrors[name]
      return newErrors
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    Object.keys(form).forEach((key) => {
      Object.assign(
        newErrors,
        validateRegister(key, form[key], form)
      );
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0)
      return;

    try {
      const formData = { ...form };
      delete formData.retryPassword;
      await register(formData);
      toast.success("Register success!");
      navigate("/");
      setForm({
        email: "",
        password: "",
        retryPassword: "",
        fullName: "",
        phone: "",
        address: ""
      });
      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.error || "Register error!");
    }
  }

  return (
    <div className="login-container">
      <div className="logo-container">
        <Contact size={32}/>
      </div>

      <h2 className="login-title">Register SwissJewellery</h2>
      <p className="login-subtitle">Enter data for register</p>

      <form className="login-form" onSubmit={handleSubmit}>

        <div className="field">
          <label>Email</label>
          <input
            className={errors.email ? "input error" : "input"}
            name="email"
            placeholder="example@shop.ua"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            className={errors.password ? "input error" : "input"}
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <div className="field">
          <label>Repeat password</label>
          <input
            type="password"
            className={errors.retryPassword ? "input error" : "input"}
            name="retryPassword"
            value={form.retryPassword}
            onChange={handleChange}
          />
          {errors.retryPassword && (
            <p className="error-text">{errors.retryPassword}</p>
          )}
        </div>

        <div className="field">
          <label>Full name</label>
          <input
            className={errors.fullName ? "input error" : "input"}
            name="fullName"
            placeholder="John Doe"
            value={form.fullName}
            onChange={handleChange}
          />
          {errors.fullName && (
            <p className="error-text">{errors.fullName}</p>
          )}
        </div>

        <div className="field">
          <label>Phone</label>
          <input
            className={errors.phone ? "input error" : "input"}
            name="phone"
            placeholder="+380..."
            value={form.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>

        <div className="field">
          <label>Address</label>
          <input
            className={errors.address ? "input error" : "input"}
            name="address"
            placeholder="City, street, house"
            value={form.address}
            onChange={handleChange}
          />
          {errors.address && <p className="error-text">{errors.address}</p>}
        </div>

        <button className="login-btn" type="submit">
          Register
        </button>
      </form>
    </div>
  )
}

export default RegisterPage