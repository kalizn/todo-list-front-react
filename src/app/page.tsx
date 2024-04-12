'use client'
import GoogleComponent from "src/utils/GoogleComponent";

const LoginPage = () => {

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <h1 className="font-bold text-[2rem]">Seja bem vindo!</h1>
      <div>
        <GoogleComponent />
      </div>
    </div>
  );
};

export default LoginPage;
