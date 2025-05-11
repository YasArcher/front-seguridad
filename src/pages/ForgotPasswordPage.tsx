import { useState } from 'react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email) {
      toast.warn('Por favor, ingresa tu correo electrónico.');
      return;
    }

    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1000)); // Simula la petición de backend
      setSubmitted(true);
      toast.success('Instrucciones enviadas a tu correo.');
    } catch (error) {
      toast.error('Ocurrió un error al enviar las instrucciones.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6">Recuperar Contraseña</h2>

      {!submitted ? (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full p-2 mb-4 border rounded"
          />
          <Button 
            label={loading ? "Enviando..." : "Enviar Instrucciones"} 
            onClick={handleResetPassword} 
            fullWidth 
            disabled={loading} 
          />
        </>
      ) : (
        <p className="text-center text-gray-600">
          Hemos enviado instrucciones a tu correo para restablecer la contraseña.
        </p>
      )}

      <div className="mt-4 text-sm text-gray-600 text-center">
        <button onClick={() => navigate('/')}>Volver al inicio de sesión</button>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
