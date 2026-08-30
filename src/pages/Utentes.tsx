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
      <nav className="bg-white shadow-sm px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
          <h1 className="text-xl font-bold text-gray-800 w-full text-center md:text-left md:w-auto">ASAD - Gestão</h1>
          <div className="flex gap-4 w-full justify-center md:w-auto md:justify-start border-b pb-2 md:border-b-0 md:pb-0 border-gray-100">
            <Link to="/" className="text-gray-500 hover:text-blue-600">Atividades</Link>
            <Link to="/utentes" className="text-blue-600 font-medium">Utentes</Link>
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full md:w-auto"
        >
          <PlusCircle size={20} />
          Novo Utente
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        
        {(isAdding || editingId) && (
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-blue-100 mb-8">
            <h2 className="text-lg font-bold mb-4">{isAdding ? 'Adicionar Utente' : 'Editar Utente'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apelido</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.apelido}
                  onChange={(e) => setFormData({ ...formData, apelido: e.target.value })}
                />
              </div>
              <div className="flex items-center md:mt-6">
                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 md:bg-transparent p-3 md:p-0 rounded border md:border-none w-full">
                  <input
                    type="checkbox"
                    className="w-5 h-5 md:w-4 md:h-4 text-blue-600 rounded focus:ring-blue-500"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-gray-700">Utente Ativo no sistema</span>
                </label>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <button
                onClick={handleSave}
                className="flex justify-center items-center gap-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full sm:w-auto"
              >
                <Save size={18} /> Guardar
              </button>
              <button
                onClick={handleCancel}
                className="flex justify-center items-center px-4 py-2 text-gray-600 hover:text-gray-900 border rounded transition w-full sm:w-auto"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 text-gray-500">Carregando...</div>
        ) : (
          <div className="bg-transparent md:bg-white md:rounded-lg md:shadow overflow-hidden">
            <div className="hidden md:grid md:grid-cols-12 gap-4 bg-gray-50 px-6 py-3 border-b text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-4">Nome</div>
              <div className="col-span-4">Apelido</div>
              <div className="col-span-2 text-center">Estado</div>
              <div className="col-span-2 text-right">Ações</div>
            </div>

            <div className="space-y-4 md:space-y-0 md:divide-y md:divide-gray-200">
              {utentes.map((utente) => (
                <div key={utente.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white rounded-lg md:rounded-none shadow-sm md:shadow-none p-4 md:px-6 md:py-4 hover:bg-gray-50 transition border border-gray-200 md:border-none">
                  {/* Nome */}
                  <div className="col-span-1 md:col-span-4 flex justify-between md:block items-center border-b border-gray-100 md:border-none pb-2 md:pb-0">
                    <span className="text-xs font-medium text-gray-500 md:hidden uppercase">Nome</span>
                    <span className="text-sm text-gray-900 font-medium md:font-normal">{utente.nome}</span>
                  </div>
                  
                  {/* Apelido */}
                  <div className="col-span-1 md:col-span-4 flex justify-between md:block items-center border-b border-gray-100 md:border-none py-2 md:py-0">
                    <span className="text-xs font-medium text-gray-500 md:hidden uppercase">Apelido</span>
                    <span className="text-sm text-gray-900">{utente.apelido}</span>
                  </div>

                  {/* Estado */}
                  <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center border-b border-gray-100 md:border-none py-2 md:py-0">
                    <span className="text-xs font-medium text-gray-500 md:hidden uppercase">Estado</span>
                    <div>
                      {utente.ativo ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check size={12} /> Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <X size={12} /> Inativo
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="col-span-1 md:col-span-2 flex justify-end md:block pt-2 md:pt-0">
                    <button
                      onClick={() => handleEdit(utente)}
                      className="text-blue-600 hover:text-blue-900 flex justify-center items-center gap-1 w-full md:w-auto md:ml-auto bg-blue-50 md:bg-transparent px-4 py-2 md:p-0 rounded-md text-sm font-medium"
                    >
                      <Edit2 size={16} /> <span className="md:hidden">Editar</span>
                    </button>
                  </div>
                </div>
              ))}
              {utentes.length === 0 && (
                <div className="px-6 py-10 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-gray-200">
                  Nenhum utente registado.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
