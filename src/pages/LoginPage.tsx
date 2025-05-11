import { useState } from 'react';
import Button from '../components/ui/Button';
import StatusMessage from '../components/ui/StatusMessage';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginService } from '../services/authService';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }
    
    setLoading(true);
    try {
      const data = await loginService(email, password);
      login({ name: data.user.name, email: data.user.email });
      navigate('/gestion-archivos');
    } catch (err) {
      setError('Credenciales incorrectas. Por favor intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e:any) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Bienvenido de nuevo</h2>
        <p className="text-gray-600 mt-2">Ingresa tus credenciales para continuar</p>
      </div>
      
      <StatusMessage isLoading={loading} error={error} empty={false}>
        <div className="space-y-5">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-gray-400"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="nombre@ejemplo.com"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-gray-400"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-gray-700">
                Recordarme
              </label>
            </div>
            <button 
              onClick={() => navigate('/forgot-password')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Login Button */}
          <div className="pt-2">
            <Button 
              label="Iniciar Sesión" 
              onClick={handleLogin} 
              fullWidth 
              loading={loading}
              iconRight={
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              }
            />
          </div>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Regístrate ahora
              </button>
            </p>
          </div>
        </div>
      </StatusMessage>
    </AuthLayout>
  );
};

export default LoginPage;