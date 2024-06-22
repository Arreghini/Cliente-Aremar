import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const logoutButton = () => {
    const { logout } = useAuth0();

return (
    <div className="flex justif y-center justify-center mt-4">
    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
    type="submit"
    className="w-1/3 justify-center bg-yellow-500 text-white font-semibold text-xl py-2 px-4 rounded hover:bg-yellow-600"
    >
    LOGOUT
    </button>
    </div>
    )
}

export default logoutButton;


