import { useEffect, useState } from 'react';
import { utentesService } from '../services/utentes';
import type { UtenteData } from '../services/utentes';
import { Link } from 'react-router-dom';
import { Edit2, PlusCircle, Check, X, Save } from 'lucide-react';

export default function Utentes() {
  const [utentes, setUtentes] = useState<UtenteData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para o formulário / edição inline ou modal
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UtenteData>({ nome: '', apelido: '', ativo: true });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadUtentes();
  }, []);

  const loadUtentes = async () => {
    try {
      const data = await utentesService.getUtentes();
      setUtentes(data);
    } catch (error) {
      console.error('Erro ao carregar utentes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (u: UtenteData) => {
    setIsAdding(false);
    setEditingId(u.id!);
    setFormData(u);
  };

  const handleAdd = () => {
    setEditingId(null);
    setIsAdding(true);
    setFormData({ nome: '', apelido: '', ativo: true });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.apelido) {
      alert('Preencha o nome e o apelido.');
      return;
    }
    
    try {
      await utentesService.saveUtente(formData);
      await loadUtentes();
      handleCancel();
    } catch (error) {
      console.error(error);
      alert('Erro ao guardar utente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-gray-800">ASAD - Gestão</h1>
          <div className="flex gap-4">
            <Link to="/" className="text-gray-500 hover:text-blue-600">Atividades</Link>
            <Link to="/utentes" className="text-blue-600 font-medium">Utentes</Link>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} />
          Novo Utente
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        
        {(isAdding || editingId) && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 mb-8">
            <h2 className="text-lg font-bold mb-4">{isAdding ? 'Adicionar Utente' : 'Editar Utente'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apelido</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={formData.apelido}
                  onChange={(e) => setFormData({ ...formData, apelido: e.target.value })}
                />
              </div>
              <div className="flex items-center mt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-gray-700">Ativo</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                <Save size={18} /> Guardar
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 border rounded transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 text-gray-500">Carregando...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apelido</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {utentes.map((utente) => (
                  <tr key={utente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {utente.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {utente.apelido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {utente.ativo ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check size={12} /> Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <X size={12} /> Inativo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(utente)}
                        className="text-blue-600 hover:text-blue-900 flex items-center justify-end gap-1 ml-auto"
                      >
                        <Edit2 size={16} /> Editar
                      </button>
                    </td>
                  </tr>
                ))}
                {utentes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                      Nenhum utente registado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
