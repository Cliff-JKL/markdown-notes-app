import { observer } from 'mobx-react-lite';
import { useStores } from 'app/root-store-context';
import { useNavigate } from 'react-router-dom';
import { loginData } from '../model/login-schema';
import { ZodError, ZodIssue } from 'zod';
import { useState, MouseEvent } from 'react';

const AuthFormInput = (props: {
  placeholder: string;
  name: string;
  type: string;
  value: string;
  error?: string;
  onChange: (field: string, value: string) => void;
}) => {
  return (
    <div className="auth-wrap-input">
      <input
        className="auth-input auth-input__shadow"
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(event) => props.onChange(props.name, event.target.value)}
      ></input>
      {props.error && <p>{props.error}</p>}
    </div>
  );
};

interface LoginData {
  email?: string;
  password?: string;
}

const validate = (data: LoginData): LoginData | ZodError => {
  try {
    return loginData.parse(data);
  } catch (err) {
    return err;
  }
};

export const LoginPage = observer(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Array<ZodIssue>>([]);

  const { auth } = useStores();
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    if (field === 'email') {
      setEmail(value);
      setErrors((prev) => prev.filter((err) => err.path[0] !== 'email'));
    } else if (field === 'password') {
      setPassword(value);
      setErrors((prev) => prev.filter((err) => err.path[0] !== 'password'));
    }
  };

  const signIn = (
    event: MouseEvent<unknown>,
    email: string,
    password: string,
  ) => {
    auth.clearSignInError();
    const validation = validate({ email: email, password: password });
    if (Object.keys(validation).indexOf('issues') >= 0) {
      setErrors((validation as ZodError).issues);
      return;
    }

    setErrors([]);
    auth.signInAction(email, password).then(() => {
      if (auth.isAuthorized()) navigate('/');
    });
  };

  return (
    <div className="limiter">
      <div className="container-auth">
        <div className="wrap-auth">
          <div className="auth-form">
            <span className="auth-form-title"> Login </span>
            <div className="auth-form-text">
              <span className="txt1"> Or </span>
              <a className="txt2" href="#">
                {' '}
                Register{' '}
              </a>
            </div>
            <AuthFormInput
              placeholder="Email"
              name="email"
              type="text"
              value={email}
              onChange={handleChange}
              error={errors.find((e) => e.path[0] === 'email')?.message}
            />
            <AuthFormInput
              placeholder="Password"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              error={errors.find((e) => e.path[0] === 'password')?.message}
            />
            <div className="container-auth-form-btn">
              {auth.signInError && <p>{auth.signInError}</p>}
              <button
                className="auth-form-btn auth-form-btn__shadows"
                onClick={(event) => signIn(event, email, password)}
              >
                {' '}
                Login{' '}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
