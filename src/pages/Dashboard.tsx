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
      <nav className="bg-white shadow-sm px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
          <h1 className="text-xl font-bold text-gray-800 w-full text-center md:text-left md:w-auto">ASAD - Gestão</h1>
          <div className="flex gap-4 w-full justify-center md:w-auto md:justify-start border-b pb-2 md:border-b-0 md:pb-0 border-gray-100">
            <Link to="/" className="text-blue-600 font-medium">Atividades</Link>
            <Link to="/utentes" className="text-gray-500 hover:text-blue-600">Utentes</Link>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full justify-between md:w-auto md:justify-end">
          <span className="text-sm text-gray-600 truncate max-w-[200px] md:max-w-none">{user?.email}</span>
          <button onClick={signOut} className="text-gray-500 hover:text-red-600 flex items-center gap-1" title="Sair">
            <LogOut size={20} /> <span className="text-sm md:hidden">Sair</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6 md:mb-8">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            to="/atividade/nova"
            className="flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
          >
            <PlusCircle size={20} />
            Nova Atividade
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Carregando...</div>
        ) : (
          <div className="bg-transparent md:bg-white md:rounded-lg md:shadow overflow-hidden">
            <div className="hidden md:grid md:grid-cols-12 gap-4 bg-gray-50 px-6 py-3 border-b text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-2">Data</div>
              <div className="col-span-4">Nome da Atividade</div>
              <div className="col-span-3">Oficina</div>
              <div className="col-span-2">Local</div>
              <div className="col-span-1 text-right">Ações</div>
            </div>

            <div className="space-y-4 md:space-y-0 md:divide-y md:divide-gray-200">
              {filteredAtividades.map((atividade) => (
                <div key={atividade.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white rounded-lg md:rounded-none shadow-sm md:shadow-none p-4 md:px-6 md:py-4 hover:bg-gray-50 transition border border-gray-200 md:border-none">
                  {/* Data */}
                  <div className="col-span-1 md:col-span-2 flex justify-between md:block items-center border-b border-gray-100 md:border-none pb-2 md:pb-0">
                    <span className="text-xs font-medium text-gray-500 md:hidden uppercase">Data</span>
                    <span className="text-sm text-gray-900">{format(new Date(atividade.data), 'dd/MM/yyyy')}</span>
                  </div>
                  
                  {/* Nome da Atividade */}
                  <div className="col-span-1 md:col-span-4 flex justify-between md:block items-center border-b border-gray-100 md:border-none py-2 md:py-0">
                    <span className="text-xs font-medium text-gray-500 md:hidden uppercase">Nome da Atividade</span>
                    <span className="text-sm font-bold md:font-medium text-gray-900 text-right md:text-left line-clamp-2 md:line-clamp-none">{atividade.atividade_nome}</span>
                  </div>

                  {/* Oficina */}
                  <div className="col-span-1 md:col-span-3 flex justify-between md:block items-center border-b border-gray-100 md:border-none py-2 md:py-0">
                    <span className="text-xs font-medium text-gray-500 md:hidden uppercase">Oficina</span>
                    <span className="text-sm text-gray-500">{atividade.oficina}</span>
                  </div>

                  {/* Local */}
                  <div className="col-span-1 md:col-span-2 flex justify-between md:block items-center border-b border-gray-100 md:border-none py-2 md:py-0">
                    <span className="text-xs font-medium text-gray-500 md:hidden uppercase">Local</span>
                    <span className="text-sm text-gray-500">{atividade.local}</span>
                  </div>

                  {/* Ações */}
                  <div className="col-span-1 md:col-span-1 flex justify-end md:block pt-2 md:pt-0">
                    <Link to={`/atividade/${atividade.id}`} className="text-blue-600 hover:text-blue-900 text-sm font-medium w-full md:w-auto text-center md:text-right block">
                      <span className="bg-blue-50 md:bg-transparent px-4 py-2 md:p-0 rounded-md block">Ver / Editar</span>
                    </Link>
                  </div>
                </div>
              ))}
              {filteredAtividades.length === 0 && (
                <div className="px-6 py-10 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-gray-200">
                  Nenhuma atividade encontrada.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
