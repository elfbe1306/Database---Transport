import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/Login.module.css';
import supabase from '../supabase-client';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [branchID, setBranchID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Fetch employee's branch information
  const fetchEmployeeBranch = async (employeeID) => {
    const { data, error } = await supabase.from('warehouse').select('w_id').eq('supervisor_id', employeeID).single();
    if (error) {
      console.error('Error fetching Employee Branch:', error);
      setErrorMessage('Error fetching branch information.');
    } else {
      setBranchID(data?.w_id);
      console.log('Branch ID:', data?.w_id);
    }
  };

  const login = async (event) => {
    event.preventDefault();

    // Sign in with email and password
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (signInError) {
      setErrorMessage(signInError.message); // Display sign-in error message
      return;
    }

    // Fetch employee data
    const { data: employeeData, error: employeeError } = await supabase
      .from('employee')
      .select('e_id')
      .eq('e_email', email)
      .single();

    if (employeeError) {
      console.error('Error fetching employee data:', employeeError);
      setErrorMessage('Error fetching employee data.');
      return;
    }

    // Fetch branch information for the employee
    fetchEmployeeBranch(employeeData?.e_id);

    // Wait for branchID to be fetched before navigating
    if (employeeData?.e_id?.startsWith('MH')) {
      console.log('Login successful', employeeData);
      navigate('/dashboard');
    } else {
      if (branchID) {
        navigate(`/branch-product/${branchID}`);
      } else {
        setErrorMessage('Branch information not found.');
      }
    }
  };


  return (
    <div className={styles.LoginPageContainer}>
      <div className={styles.LoginContainer}>
        <div className={styles.LoginContainerForm}>
          <h1 className={styles.LoginContainerTitle}>Log In</h1>
          <p className={styles.LoginContainerText}>Fill in your email and password to continue</p>

          <form onSubmit={login}>
            <label className={styles.formLabelText} htmlFor="email">Email Address</label><br />
            <input
              className={styles.formInput}
              placeholder='abc@gmail.com'
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className={styles.formLabelText} htmlFor="password">Password</label><br />
            <input
              className={styles.formInput}
              placeholder='******'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className={styles.ForgotPasswordText}>Forgot Password?</p>

          </form>
          <button className={styles.ContinueButton} onClick={login}>Log In</button>

          {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};
