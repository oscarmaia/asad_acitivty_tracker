import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { atividadesService } from '../services/atividades';
import { Link } from 'react-router-dom';
import { LogOut, PlusCircle, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { signOut, user } = useAuth();
  const [atividades, setAtividades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAtividades();
  }, []);

  const loadAtividades = async () => {
    try {
      const data = await atividadesService.getAtividades();
      setAtividades(data);
    } catch (error) {
      console.error('Erro ao carregar atividades', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAtividades = atividades.filter(
    (a) =>
      a.atividade_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.oficina.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.data.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-gray-800">ASAD - Gestão</h1>
          <div className="flex gap-4">
            <Link to="/" className="text-blue-600 font-medium">Atividades</Link>
            <Link to="/utentes" className="text-gray-500 hover:text-blue-600">Utentes</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button onClick={signOut} className="text-gray-500 hover:text-red-600" title="Sair">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Pesquisar por nome, oficina ou data..."
              className="pl-10 pr-4 py-2 border rounded-lg w-80 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            to="/atividade/nova"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} />
            Nova Atividade
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Carregando...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome da Atividade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oficina</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAtividades.map((atividade) => (
                  <tr key={atividade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(atividade.data), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {atividade.atividade_nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {atividade.oficina}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {atividade.local}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/atividade/${atividade.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        Ver / Editar
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredAtividades.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      Nenhuma atividade encontrada.
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
