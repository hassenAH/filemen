import { useRef, useEffect } from 'react';
import { Link, useLocation ,useNavigate} from 'react-router-dom';

import { useAuth } from 'hooks/useAuth';
import { useToast } from 'hooks/useToast';

import { Loader } from 'components/common';

import styles from './index.module.scss';

const SignUpPage = () => {
  const { state: routerState } = useLocation();

  const { register, isLoading, error,success, defaultValue } = useAuth();
  const { sendToast } = useToast();
  const navigate = useNavigate(); 
  const nameInput = useRef();
  const lastNameInput = useRef();
  const emailInput = useRef();
  const passwordInput = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await register({
      name: nameInput.current.value,
      lastname: lastNameInput.current.value,
      email: emailInput.current.value,
      password: passwordInput.current.value,
    });
    const redirectTo = '/account/login';
    navigate(redirectTo, { replace: true });
  
   
  };

  useEffect(() => {
    if (success) {
      sendToast({ success: true, content: { message: success } });
    }
    
    if (error) {
      sendToast({ error: true, content: { message: error.message } });
    }
  }, [error,sendToast]);

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <>
          <section className={styles.nav_section}></section>
          <section className={styles.section}>
            <div className={styles.container}>
              <div className={`${styles.wrapper} main-container`}>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <h2 className={styles.title}>Create Account</h2>
                  <label className={styles.label}>
                    <span>Name:</span>
                    <input
                      defaultValue={defaultValue?.name || ''}
                      className={styles.input}
                      type="text"
                      placeholder="Name"
                      required
                      ref={nameInput}
                    />
                  </label>
                  <label className={styles.label}>
                    <span>Last Name:</span>
                    <input
                      defaultValue={defaultValue?.lastName || ''}
                      className={styles.input}
                      type="text"
                      placeholder="Last Name"
                      required
                      ref={lastNameInput}
                    />
                  </label>
                  <label className={styles.label}>
                    <span>Email:</span>
                    <input
                      defaultValue={defaultValue?.email || ''}
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
                    Create Account
                  </button>
                </form>
                <p className={styles.login}>
                  Already have an account?{' '}
                  <Link to="/account/login" state={routerState}>
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default SignUpPage;
