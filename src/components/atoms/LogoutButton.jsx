import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
      type="submit"
      className="px-0 py-2 w-full text-left text-white hover:text-yellow-500 cursor-pointer"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
