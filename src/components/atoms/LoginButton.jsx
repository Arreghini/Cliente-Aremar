import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect({ prompt: 'select_account' })}
      type="submit"
      className="px-0 py-2 w-full text-left text-yellow-200 hover:text-yellow-500 cursor-pointer"
    >
      Login
    </button>
  );
};

export default LoginButton;
