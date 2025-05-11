import { useState } from 'react';
import Button from '../components/ui/Button';
import StatusMessage from '../components/ui/StatusMessage';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6">Recuperar Contraseña</h2>
      <StatusMessage isLoading={loading} error={null} empty={false}>
        {!submitted ? (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full p-2 mb-4 border rounded"
            />
            <Button label="Enviar Instrucciones" onClick={handleResetPassword} fullWidth />
          </>
        ) : (
          <p className="text-center text-gray-600">
            Hemos enviado instrucciones a tu correo para restablecer la contraseña.
          </p>
        )}
      </StatusMessage>

      <div className="mt-4 text-sm text-gray-600 text-center">
        <button onClick={() => navigate('/')}>Volver al inicio de sesión</button>
      </div>
    </>
  );
};

export default ForgotPasswordPage;