import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

return (
    <div className="flex justify-center mt-4">
<button onClick={() => loginWithRedirect()}
  className=" justify-center bg-yellow-400 text-white font-semibold text-xl py-2 px-4 rounded hover:bg-yellow-600"
>
  LOGIN
</button>
    </div>
    )
}

export default LoginButton;
