import { useEffect, useState } from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import ContentContainer from "../components/ui/ContentContainer";
import PageHeader from "../components/ui/PageHeader";
import InfoBlock from "../components/ui/InfoBlock";
import { Shield, Upload, CheckCircle, Edit3, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import { useUpdateUserProfile } from "../hooks/useUpdateUserProfile.ts";

const UserProfilePage = () => {
  const { profile, loading, error, refetch } = useUserProfile();
  const { updateProfile, loading: updating } = useUpdateUserProfile();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const success = await updateProfile(formData);
    if (success) {
      toast.success("Perfil actualizado correctamente.");
      refetch();
      setEditMode(false);
    } else {
      toast.error("No se pudo actualizar el perfil.");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <PageHeader title="Perfil de Usuario">
        {!loading && !error && (
          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button label="Guardar" onClick={handleSave} iconLeft={<Save size={16} />} />
                <Button label="Cancelar" onClick={() => setEditMode(false)} iconLeft={<X size={16} />} variant="secondary" />
              </>
            ) : (
              <Button label="Editar" onClick={() => setEditMode(true)} iconLeft={<Edit3 size={16} />} />
            )}
          </div>
        )}
      </PageHeader>

      <ContentContainer>
        {loading ? (
          <p className="text-gray-500">Cargando perfil...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-400">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={!editMode}
                className={`w-full p-2 rounded ${!editMode ? "bg-gray-800 text-gray-400" : "bg-white text-black"}`}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Nombre</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                readOnly={!editMode}
                className={`w-full p-2 rounded ${!editMode ? "bg-gray-800 text-gray-400" : "bg-white text-black"}`}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Apellido</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                readOnly={!editMode}
                className={`w-full p-2 rounded ${!editMode ? "bg-gray-800 text-gray-400" : "bg-white text-black"}`}
              />
            </div>

            <InfoBlock
              title="Rol"
              value={profile?.role === "admin" ? "Administrador" : "Usuario"}
              icon={<Shield size={16} className="text-yellow-500 mr-2" />}
            />
            <InfoBlock
              title="Activo"
              value={profile?.is_active ? "Sí" : "No"}
              icon={<CheckCircle size={16} className="text-blue-500 mr-2" />}
            />
            <InfoBlock
              title="Puede subir archivos"
              value={profile?.can_upload ? "Sí" : "No"}
              icon={<Upload size={16} className="text-purple-500 mr-2" />}
            />
          </div>
        )}
      </ContentContainer>
    </div>
  );
};

export default UserProfilePage;
