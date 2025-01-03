import { useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useAuth } from 'hooks/useAuth';
import { useToast } from 'hooks/useToast';
import { Loader } from 'components/common';
import styles from './index.module.scss';

const LoginPage = () => {
  const { state: routerState } = useLocation();
  const navigate = useNavigate(); // Initialize navigate hook
  const { login, isLoading, error, success } = useAuth();
  const { sendToast } = useToast();
  const emailInput = useRef();
  const passwordInput = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({
      email: emailInput.current.value,
      password: passwordInput.current.value,
    });
  };

  useEffect(() => {
    if (success) {
      sendToast({ success: true, content: { message: success } });
      setTimeout(() => {
        window.location.reload(); // Force refresh
      }, 1); 
      const redirectTo = routerState?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });

      // Refresh the page after redirection
      
    }
    if (error) {
      sendToast({ type: 'error', message: error });
    }
  }, [success, error, sendToast, navigate, routerState]);

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={`${styles.wrapper} main-container`}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.title}>Log into your account</h2>
                <label className={styles.label}>
                  <span>Email:</span>
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="yourname@email.com"
                    required
                    ref={emailInput}
                  />
                </label>
                <label className={styles.label}>
                  <span>Password:</span>
                  <input
                    className={styles.input}
                    type="password"
                    required
                    ref={passwordInput}
                  />
                </label>
                <button className={styles.button} type="submit">
                  Login
                </button>
              </form>
              <p className={styles.no_account}>
                New to Filamen ?{' '}
                <Link to="/account/signup" state={routerState}>
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default LoginPage;
