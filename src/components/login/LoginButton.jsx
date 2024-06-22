import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const loginButton = () => {
    const { loginWithRedirect } = useAuth0();

return (
    <div className="flex justif y-center justify-center mt-4">
<button onClick={() => {loginWithRedirect}}
  type="submit"
  className="w-1/3 justify-center bg-yellow-400 text-white font-semibold text-xl py-2 px-4 rounded hover:bg-yellow-600"
>
  LOGIN
</button>
    </div>
    )
}

export default loginButton;


